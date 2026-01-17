import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyWebhookSignature, extractCustomFields } from '@/lib/stripe/webhooks';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateProphecy } from '@/lib/gemini/generate';
import { generateBrandedImage } from '@/lib/image/branded-generator';
import { getChineseZodiac, getFireHorseReading } from '@/lib/zodiac/calculator';
import { validateFocusMode } from '@/lib/utils/validation';
import { withRetry } from '@/lib/utils/retry';
import { FocusMode } from '@/constants/modes';
import { EDITION_CONFIG } from '@/constants/editions';
import { ZodiacAnimal } from '@/constants/zodiac-data';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature in request');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  // Verify webhook signature
  let event;
  try {
    event = await verifyWebhookSignature(body, signature);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Only handle checkout.session.completed events
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const supabase = createAdminClient();

  // Extract data from session
  const email = session.customer_details?.email || 'unknown@example.com';
  const { birthDate, focusMode: rawFocusMode } = extractCustomFields(session);
  const focusMode = validateFocusMode(rawFocusMode) as FocusMode;

  console.log(`Processing prophecy for ${email}, DOB: ${birthDate}, Focus: ${focusMode}`);

  try {
    // IDEMPOTENCY CHECK: Check if prophecy already exists for this session
    const { data: existingProphecy } = await supabase
      .from('prophecies')
      .select('id, status')
      .eq('stripe_session_id', session.id)
      .single();

    if (existingProphecy) {
      if (existingProphecy.status === 'completed') {
        console.log(`Prophecy already completed for session ${session.id}, skipping`);
        return NextResponse.json({ received: true, skipped: true, reason: 'already_completed' });
      }

      if (existingProphecy.status === 'processing') {
        // Another webhook is already processing this - avoid race condition
        console.log(`Prophecy already processing for session ${session.id}, skipping`);
        return NextResponse.json({ received: true, skipped: true, reason: 'already_processing' });
      }

      // Status is 'failed' - we could retry, but for now just log and skip
      // to avoid double-charging complexity
      console.log(`Prophecy previously failed for session ${session.id}, skipping duplicate`);
      return NextResponse.json({ received: true, skipped: true, reason: 'previously_failed' });
    }

    // Calculate zodiac
    const zodiac = getChineseZodiac(birthDate);
    const fireHorseReading = getFireHorseReading(zodiac.animal, zodiac.element);

    // Get edition number for this zodiac sign + mode combination (count existing + 1)
    // Each zodiac + mode combo has 888 editions (e.g., 888 Metal Rat Wealth, 888 Metal Rat Power, etc.)
    const { count: existingCount } = await supabase
      .from('prophecies')
      .select('*', { count: 'exact', head: true })
      .eq('zodiac_sign', zodiac.animal)
      .eq('focus_mode', focusMode)
      .eq('status', 'completed');

    const editionNumber = (existingCount || 0) + 1;
    const editionConfig = EDITION_CONFIG[zodiac.animal as ZodiacAnimal];
    const totalEditions = editionConfig?.totalSlots || 888;

    console.log(`Assigning edition #${editionNumber} of ${totalEditions} for ${zodiac.animal} ${focusMode}`);

    // Create pending record with session_id and edition number
    const { data: prophecy, error: insertError } = await supabase
      .from('prophecies')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        email,
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
      // Check if it's a duplicate key error (race condition with another webhook)
      if (insertError.code === '23505') {
        console.log(`Duplicate session_id detected (race condition), skipping: ${session.id}`);
        return NextResponse.json({ received: true, skipped: true, reason: 'duplicate_key' });
      }
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log(`Created prophecy record: ${prophecy.id}`);

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
          console.log(`Generation retry ${attempt}: ${error.message}`);
        },
      }
    );

    console.log('AI generation complete, uploading images...');

    // Convert base64 to buffer
    const rawImageBuffer = Buffer.from(result.imageData, 'base64');
    const rawImagePath = `${prophecy.id}.png`;
    const brandedImagePath = `${prophecy.id}-branded.png`;
    const certificateId = prophecy.id.slice(0, 8).toUpperCase();

    // Metadata to attach to storage objects for querying
    const imageMetadata = {
      prophecy_id: prophecy.id,
      edition_number: String(editionNumber),
      total_editions: String(totalEditions),
      zodiac_sign: zodiac.animal,
      zodiac_element: zodiac.element,
      focus_mode: focusMode,
      certificate_id: certificateId,
      created_at: new Date().toISOString(),
    };

    // Upload raw image with metadata
    const { error: rawUploadError } = await supabase.storage
      .from('talismans')
      .upload(rawImagePath, rawImageBuffer, {
        contentType: 'image/png',
        upsert: true,
        metadata: imageMetadata,
      });

    if (rawUploadError) {
      console.error('Raw image upload error:', rawUploadError);
    }

    // Generate branded image with edition/certificate baked in
    console.log('Generating branded image with edition info...');
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

      // Upload branded image with metadata
      const { error: brandedUploadError } = await supabase.storage
        .from('talismans')
        .upload(brandedImagePath, brandedImageBuffer, {
          contentType: 'image/png',
          upsert: true,
          metadata: {
            ...imageMetadata,
            image_type: 'branded',
          },
        });

      if (brandedUploadError) {
        console.error('Branded image upload error:', brandedUploadError);
      } else {
        const { data: brandedUrlData } = supabase.storage
          .from('talismans')
          .getPublicUrl(brandedImagePath);
        brandedImageUrl = brandedUrlData.publicUrl;
        console.log('Branded image uploaded successfully');
      }
    } catch (brandedError) {
      console.error('Failed to generate branded image:', brandedError);
      // Continue without branded image - raw image still works
    }

    // Get public URL for raw image
    const { data: publicUrlData } = supabase.storage
      .from('talismans')
      .getPublicUrl(rawImagePath);

    // Update record with generated content and both image URLs
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
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', prophecy.id);

    if (updateError) {
      console.error('Database update error:', updateError);
    }

    console.log(`Prophecy completed successfully: ${prophecy.id}`);

    // Track paid oracle generation for analytics (non-blocking)
    try {
      const analyticsKey = `${zodiac.animal}-${zodiac.element}-paid`;
      const { data: existingAnalytics } = await supabase
        .from('oracle_analytics')
        .select('id, count')
        .eq('composite_key', analyticsKey)
        .single();

      if (existingAnalytics) {
        await supabase
          .from('oracle_analytics')
          .update({
            count: existingAnalytics.count + 1,
            last_generated_at: new Date().toISOString()
          })
          .eq('id', existingAnalytics.id);
      } else {
        await supabase
          .from('oracle_analytics')
          .insert({
            composite_key: analyticsKey,
            zodiac_sign: zodiac.animal,
            zodiac_element: zodiac.element,
            oracle_type: 'paid',
            count: 1,
            last_generated_at: new Date().toISOString()
          });
      }
    } catch (analyticsErr) {
      // Don't fail the webhook for analytics errors
      console.error('Analytics tracking error (non-fatal):', analyticsErr);
    }

  } catch (error) {
    console.error('Prophecy generation failed:', error);

    // Try to update status to failed
    try {
      await supabase
        .from('prophecies')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('stripe_session_id', session.id);
    } catch (updateErr) {
      console.error('Failed to update error status:', updateErr);
    }
  }

  // Always return 200 to Stripe to acknowledge receipt
  return NextResponse.json({ received: true });
}
