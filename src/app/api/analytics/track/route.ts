import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * Track oracle generation events (free and paid)
 * No PII is collected - only zodiac sign, element, and type counters
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zodiacSign, zodiacElement, type } = body;

    // Validate required fields
    if (!zodiacSign || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate type
    if (!['free', 'paid'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Upsert analytics record - increment counter for this zodiac + element + type
    const compositeKey = `${zodiacSign}-${zodiacElement || 'unknown'}-${type}`;

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
      // Insert new record
      await supabase
        .from('oracle_analytics')
        .insert({
          composite_key: compositeKey,
          zodiac_sign: zodiacSign,
          zodiac_element: zodiacElement || 'unknown',
          oracle_type: type,
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
