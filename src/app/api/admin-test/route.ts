import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateProphecy } from '@/lib/gemini/generate';
import { generateBrandedImage, generateShareableImage } from '@/lib/image/branded-generator';
import { getChineseZodiac, getFireHorseReading } from '@/lib/zodiac/calculator';
import { validateFocusMode } from '@/lib/utils/validation';
import { withRetry } from '@/lib/utils/retry';
import { FocusMode } from '@/constants/modes';
import { EDITION_CONFIG } from '@/constants/editions';
import { ZodiacAnimal } from '@/constants/zodiac-data';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for AI generation

// Super Admin PIN - in production, move to env var
const ADMIN_PIN = '142857';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, birthDate, focusMode: rawFocusMode } = body;

    // Validate PIN
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    // Validate inputs
    if (!birthDate || !rawFocusMode) {
      return NextResponse.json(
        { error: 'Birth date and focus mode are required' },
        { status: 400 }
      );
    }

    const focusMode = validateFocusMode(rawFocusMode) as FocusMode;
    const supabase = createAdminClient();

    console.log(`[ADMIN TEST] Generating prophecy: DOB: ${birthDate}, Focus: ${focusMode}`);

    // Calculate zodiac
    const zodiac = getChineseZodiac(birthDate);
    const fireHorseReading = getFireHorseReading(zodiac.animal, zodiac.element);

    // Get edition number for this zodiac sign + mode combination (count existing + 1)
    const { count: existingCount } = await supabase
      .from('prophecies')
      .select('*', { count: 'exact', head: true })
      .eq('zodiac_sign', zodiac.animal)
      .eq('focus_mode', focusMode)
      .eq('status', 'completed');

    const editionNumber = (existingCount || 0) + 1;
    const editionConfig = EDITION_CONFIG[zodiac.animal as ZodiacAnimal];
    const totalEditions = editionConfig?.totalSlots || 888;

    console.log(`[ADMIN TEST] Assigning edition #${editionNumber} of ${totalEditions} for ${zodiac.animal} ${focusMode}`);

    // Generate a unique test session ID
    const testSessionId = `admin_test_${randomUUID()}`;

    // Create pending record with edition info
    const { data: prophecy, error: insertError } = await supabase
      .from('prophecies')
      .insert({
        stripe_session_id: testSessionId,
        stripe_payment_intent: `admin_test_${Date.now()}`,
        email: 'admin@test.local',
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

    if (insertError) {
      console.error('[ADMIN TEST] Database insert error:', insertError);
      throw insertError;
    }

    console.log(`[ADMIN TEST] Created prophecy record: ${prophecy.id}`);

    // Generate prophecy content with retry logic
    const result = await withRetry(
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
          console.log(`[ADMIN TEST] Generation retry ${attempt}: ${error.message}`);
        },
      }
    );

    console.log('[ADMIN TEST] AI generation complete, uploading images...');

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
      console.error('[ADMIN TEST] Raw image upload error:', rawUploadError);
    }

    // Generate branded image with edition/certificate baked in (OWNER DOWNLOAD)
    console.log('[ADMIN TEST] Generating branded image with certificate for owner download...');
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

      // Upload branded image
      const { error: brandedUploadError } = await supabase.storage
        .from('talismans')
        .upload(brandedImagePath, brandedImageBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (brandedUploadError) {
        console.error('[ADMIN TEST] Branded image upload error:', brandedUploadError);
      } else {
        const { data: brandedUrlData } = supabase.storage
          .from('talismans')
          .getPublicUrl(brandedImagePath);
        brandedImageUrl = brandedUrlData.publicUrl;
        console.log('[ADMIN TEST] Branded image (owner) uploaded successfully');
      }
    } catch (brandedError) {
      console.error('[ADMIN TEST] Failed to generate branded image:', brandedError);
    }

    // Generate shareable image with WATERMARK but NO certificate (SOCIAL SHARING)
    console.log('[ADMIN TEST] Generating watermarked shareable image for social sharing...');
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

      // Upload shareable image
      const { error: shareableUploadError } = await supabase.storage
        .from('talismans')
        .upload(shareableImagePath, shareableImageBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (shareableUploadError) {
        console.error('[ADMIN TEST] Shareable image upload error:', shareableUploadError);
      } else {
        const { data: shareableUrlData } = supabase.storage
          .from('talismans')
          .getPublicUrl(shareableImagePath);
        shareableImageUrl = shareableUrlData.publicUrl;
        console.log('[ADMIN TEST] Shareable image (watermarked) uploaded successfully');
      }
    } catch (shareableError) {
      console.error('[ADMIN TEST] Failed to generate shareable image:', shareableError);
    }

    // Get public URL for raw image
    const { data: publicUrlData } = supabase.storage
      .from('talismans')
      .getPublicUrl(rawImagePath);

    // Update record with generated content and all image URLs
    const { error: updateError } = await supabase
      .from('prophecies')
      .update({
        main_text: result.mainText,
        sub_text: result.subText,
        full_reading: result.fullReading,
        image_url: publicUrlData.publicUrl,
        image_storage_path: rawImagePath,
        branded_image_url: brandedImageUrl,
        branded_image_storage_path: brandedImageUrl ? brandedImagePath : null,
        shareable_image_url: shareableImageUrl,
        shareable_image_storage_path: shareableImageUrl ? shareableImagePath : null,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', prophecy.id);

    if (updateError) {
      console.error('[ADMIN TEST] Database update error:', updateError);
    }

    console.log(`[ADMIN TEST] Prophecy completed successfully: ${prophecy.id}`);

    // Return the session ID so frontend can redirect to reveal page
    return NextResponse.json({
      success: true,
      sessionId: testSessionId,
      prophecyId: prophecy.id,
    });

  } catch (error) {
    console.error('[ADMIN TEST] Prophecy generation failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
