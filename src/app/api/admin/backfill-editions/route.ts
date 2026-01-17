import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const ADMIN_PIN = '142857';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    // Verify PIN
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Get all completed prophecies that need edition numbers, ordered by created_at
    const { data: prophecies, error: fetchError } = await supabase
      .from('prophecies')
      .select('id, zodiac_sign, zodiac_element, focus_mode, edition_number, created_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching prophecies:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch prophecies' }, { status: 500 });
    }

    if (!prophecies || prophecies.length === 0) {
      return NextResponse.json({ message: 'No prophecies found', updated: 0 });
    }

    // Group prophecies by zodiac_sign + focus_mode and assign sequential numbers
    const counters: Record<string, number> = {};
    const updates: Array<{ id: string; edition_number: number; key: string }> = [];

    for (const prophecy of prophecies) {
      // Create a unique key for each zodiac + mode combination
      const key = `${prophecy.zodiac_sign}-${prophecy.focus_mode}`;

      // Initialize counter if not exists
      if (!counters[key]) {
        counters[key] = 0;
      }

      // Increment counter
      counters[key]++;

      // Only update if edition_number is null or different
      if (prophecy.edition_number !== counters[key]) {
        updates.push({
          id: prophecy.id,
          edition_number: counters[key],
          key,
        });
      }
    }

    // Perform updates
    let updatedCount = 0;
    const errors: string[] = [];

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('prophecies')
        .update({
          edition_number: update.edition_number,
          total_editions: 888,
        })
        .eq('id', update.id);

      if (updateError) {
        errors.push(`Failed to update ${update.id}: ${updateError.message}`);
      } else {
        updatedCount++;
        console.log(`Updated ${update.id}: ${update.key} → #${update.edition_number}`);
      }
    }

    // Build summary of edition counts per zodiac+mode
    const summary = Object.entries(counters)
      .map(([key, count]) => `${key}: ${count} editions`)
      .sort();

    return NextResponse.json({
      message: 'Backfill complete',
      totalProphecies: prophecies.length,
      updated: updatedCount,
      alreadyCorrect: prophecies.length - updates.length,
      errors: errors.length > 0 ? errors : undefined,
      summary,
    });
  } catch (error) {
    console.error('Backfill error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
