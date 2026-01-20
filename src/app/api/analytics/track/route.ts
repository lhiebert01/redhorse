import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * Track oracle generation events (free and paid)
 * No PII is collected - only zodiac sign, element, birth year, and type counters
 *
 * Privacy by Design: Birth year is NOT PII - it only indicates zodiac calculation
 * The actual birth date is never stored - only the year for analytics
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zodiacSign, zodiacElement, birthYear, type, focusMode } = body;

    // Validate required fields
    if (!zodiacSign || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate type
    if (!['free', 'paid'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // For detailed analytics, include birth_year and mode in composite key
    // This allows us to track: Year, Sign, Element, Type, Mode combinations
    const yearPart = birthYear ? String(birthYear) : 'unknown';
    const modePart = focusMode ? focusMode.toLowerCase() : 'none';

    // Composite key format: YYYY-Sign-Element-Type-Mode
    const compositeKey = `${yearPart}-${zodiacSign}-${zodiacElement || 'unknown'}-${type}-${modePart}`;

    // First try to increment existing record
    const { data: existing } = await supabase
      .from('oracle_analytics')
      .select('id, count')
      .eq('composite_key', compositeKey)
      .single();

    if (existing) {
      // Increment existing counter
      await supabase
        .from('oracle_analytics')
        .update({
          count: existing.count + 1,
          last_generated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      // Insert new record with all fields
      await supabase
        .from('oracle_analytics')
        .insert({
          composite_key: compositeKey,
          zodiac_sign: zodiacSign,
          zodiac_element: zodiacElement || 'unknown',
          birth_year: birthYear || null,
          oracle_type: type,
          focus_mode: modePart !== 'none' ? modePart : null,
          count: 1,
          last_generated_at: new Date().toISOString()
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request - analytics should be non-blocking
    return NextResponse.json({ success: true, warning: 'Analytics may not have been recorded' });
  }
}
