import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getChineseZodiac, getFireHorseReading } from '@/lib/zodiac/calculator';
import { generateProphecy } from '@/lib/gemini/generate';
import { generateBrandedImage, generateShareableImage } from '@/lib/image/branded-generator';
import { validateFocusMode } from '@/lib/utils/validation';
import { withRetry } from '@/lib/utils/retry';
import { FocusMode } from '@/constants/modes';
import { EDITION_CONFIG } from '@/constants/editions';
import { ZodiacAnimal } from '@/constants/zodiac-data';
import { VIPPass } from '@/types/vip';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, birthDate, focusMode: rawFocusMode } = body;

    // Validate inputs
    if (!code || !birthDate || !rawFocusMode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const focusMode = validateFocusMode(rawFocusMode) as FocusMode;
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validate VIP pass
    const { data: pass, error: passError } = await supabase
      .from('vip_passes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (passError || !pass) {
      return NextResponse.json({ error: 'Invalid VIP code' }, { status: 400 });
    }

    const vipPass = pass as VIPPass;

    // Check expiration
    if (new Date(vipPass.expires_at) < new Date()) {
      return NextResponse.json({ error: 'VIP code has expired' }, { status: 400 });
    }

    // Check if oracle already used
    if (vipPass.oracle_used) {
      return NextResponse.json({ error: 'Oracle already used on this VIP pass' }, { status: 400 });
    }

    // Check status
    if (vipPass.status !== 'active') {
      return NextResponse.json({ error: 'VIP code is not active' }, { status: 400 });
    }

    console.log(`[VIP ORACLE] Generating prophecy: VIP: ${cleanCode}, DOB: ${birthDate}, Focus: ${focusMode}`);

    // Calculate zodiac
    const zodiac = getChineseZodiac(birthDate);
    if (!zodiac || !zodiac.animal) {
      return NextResponse.json({ error: 'Invalid birth date' }, { status: 400 });
    }

    const fireHorseReading = getFireHorseReading(zodiac.animal, zodiac.element);

    // Get edition number for this zodiac sign + mode combination
    const { count: existingCount } = await supabase
      .from('prophecies')
      .select('*', { count: 'exact', head: true })
      .eq('zodiac_sign', zodiac.animal)
      .eq('focus_mode', focusMode)
      .eq('status', 'completed');

    const editionNumber = (existingCount || 0) + 1;
    const editionConfig = EDITION_CONFIG[zodiac.animal as ZodiacAnimal];
    const totalEditions = editionConfig?.totalSlots || 888;

    console.log(`[VIP ORACLE] Assigning edition #${editionNumber} of ${totalEditions} for ${zodiac.animal} ${focusMode}`);

    // Generate a unique VIP session ID
    const vipSessionId = `vip_${vipPass.id}_oracle_${randomUUID()}`;

    // Create prophecy record
    const { data: prophecy, error: insertError } = await supabase
      .from('prophecies')
      .insert({
        stripe_session_id: vipSessionId,
        stripe_payment_intent: `vip_${cleanCode}`,
        email: `vip_${cleanCode}@redhorseoracle.com`,
        birth_date: birthDate,
        focus_mode: focusMode,
        zodiac_sign: zodiac.animal,
        zodiac_element: zodiac.element,
        fire_horse_relation: fireHorseReading.relation,
        edition_number: editionNumber,
        total_editions: totalEditions,
        status: 'processing',
      })
      .select()
      .single();

    if (insertError || !prophecy) {
      console.error('[VIP ORACLE] Database insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create prophecy record' }, { status: 500 });
    }

    console.log(`[VIP ORACLE] Created prophecy record: ${prophecy.id}`);

    // Mark VIP oracle as used (before generation, to prevent double-use)
    await supabase
      .from('vip_passes')
      .update({
        oracle_used: true,
        oracle_used_at: new Date().toISOString(),
        oracle_prophecy_id: prophecy.id,
      })
      .eq('id', vipPass.id);

    // Generate prophecy content with retry logic
    let result;
    try {
      result = await withRetry(
        () =>
          generateProphecy({
            birthDate,
            focusMode,
            zodiacSign: zodiac.animal,
            zodiacElement: zodiac.element,
            fireHorseAdvice: fireHorseReading.advice,
          }),
        {
          maxRetries: 2,
          baseDelayMs: 2000,
          onRetry: (attempt, error) => {
            console.log(`[VIP ORACLE] Generation retry ${attempt}: ${error.message}`);
          },
        }
      );
    } catch (genError) {
      console.error('[VIP ORACLE] Generation failed:', genError);
      await supabase
        .from('prophecies')
        .update({ status: 'failed', error_message: String(genError) })
        .eq('id', prophecy.id);
      return NextResponse.json({ error: 'Failed to generate prophecy' }, { status: 500 });
    }

    console.log('[VIP ORACLE] AI generation complete, uploading images...');

    // Convert base64 to buffer
    const rawImageBuffer = Buffer.from(result.imageData, 'base64');
    const rawImagePath = `${prophecy.id}.png`;
    const brandedImagePath = `${prophecy.id}-branded.png`;
    const shareableImagePath = `${prophecy.id}-shareable.png`;
    const certificateId = prophecy.id.slice(0, 8).toUpperCase();

    // Upload raw image
    const { error: rawUploadError } = await supabase.storage
      .from('talismans')
      .upload(rawImagePath, rawImageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (rawUploadError) {
      console.error('[VIP ORACLE] Raw image upload error:', rawUploadError);
    }

    // Get raw image URL
    const { data: rawUrlData } = supabase.storage
      .from('talismans')
      .getPublicUrl(rawImagePath);

    // Generate branded image (owner download)
    let brandedImageUrl: string | null = null;
    try {
      const brandedImageBuffer = await generateBrandedImage({
        rawImageBuffer,
        editionNumber,
        totalEditions,
        certificateId,
        zodiacSign: zodiac.animal,
        zodiacElement: zodiac.element,
        focusMode,
        mainText: result.mainText,
      });

      const { error: brandedUploadError } = await supabase.storage
        .from('talismans')
        .upload(brandedImagePath, brandedImageBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (!brandedUploadError) {
        const { data: brandedUrlData } = supabase.storage
          .from('talismans')
          .getPublicUrl(brandedImagePath);
        brandedImageUrl = brandedUrlData.publicUrl;
      }
    } catch (brandedError) {
      console.error('[VIP ORACLE] Failed to generate branded image:', brandedError);
    }

    // Generate shareable image (watermarked)
    let shareableImageUrl: string | null = null;
    try {
      const shareableImageBuffer = await generateShareableImage({
        rawImageBuffer,
        editionNumber,
        totalEditions,
        zodiacSign: zodiac.animal,
        zodiacElement: zodiac.element,
        focusMode,
        mainText: result.mainText,
      });

      const { error: shareableUploadError } = await supabase.storage
        .from('talismans')
        .upload(shareableImagePath, shareableImageBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (!shareableUploadError) {
        const { data: shareableUrlData } = supabase.storage
          .from('talismans')
          .getPublicUrl(shareableImagePath);
        shareableImageUrl = shareableUrlData.publicUrl;
      }
    } catch (shareableError) {
      console.error('[VIP ORACLE] Failed to generate shareable image:', shareableError);
    }

    // Update prophecy record with results
    const { error: updateError } = await supabase
      .from('prophecies')
      .update({
        main_text: result.mainText,
        sub_text: result.subText,
        full_reading: result.fullReading,
        image_url: rawUrlData.publicUrl,
        image_storage_path: rawImagePath,
        branded_image_url: brandedImageUrl,
        branded_image_storage_path: brandedImagePath,
        shareable_image_url: shareableImageUrl,
        shareable_image_storage_path: shareableImagePath,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', prophecy.id);

    if (updateError) {
      console.error('[VIP ORACLE] Update error:', updateError);
    }

    console.log(`[VIP ORACLE] Prophecy completed: ${prophecy.id}`);

    return NextResponse.json({
      success: true,
      prophecy_id: prophecy.id,
      redirect: `/reveal?id=${prophecy.id}&vip=true`,
    });
  } catch (error) {
    console.error('[VIP ORACLE] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
