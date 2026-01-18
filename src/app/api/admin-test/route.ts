import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateProphecy } from '@/lib/gemini/generate';
import { getChineseZodiac, getFireHorseReading } from '@/lib/zodiac/calculator';
import { validateFocusMode } from '@/lib/utils/validation';
import { withRetry } from '@/lib/utils/retry';
import { FocusMode } from '@/constants/modes';
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

    // Generate a unique test session ID
    const testSessionId = `admin_test_${randomUUID()}`;

    // Create pending record
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

    console.log('[ADMIN TEST] AI generation complete, uploading image...');

    // Convert base64 to blob and upload to Supabase Storage
    const imageBuffer = Buffer.from(result.imageData, 'base64');
    const imagePath = `${prophecy.id}.png`;

    const { error: uploadError } = await supabase.storage
      .from('talismans')
      .upload(imagePath, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('[ADMIN TEST] Image upload error:', uploadError);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('talismans')
      .getPublicUrl(imagePath);

    // Update record with generated content
    const { error: updateError } = await supabase
      .from('prophecies')
      .update({
        main_text: result.mainText,
        sub_text: result.subText,
        full_reading: result.fullReading,
        image_url: publicUrlData.publicUrl,
        image_storage_path: imagePath,
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
