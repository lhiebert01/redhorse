import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

// Admin PIN for accessing stats
const ADMIN_PIN = '142857';

/**
 * Get oracle generation statistics
 * Requires admin PIN for access
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');

  // Validate admin PIN
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Get all analytics records
    const { data: analytics, error: analyticsError } = await supabase
      .from('oracle_analytics')
      .select('*')
      .order('count', { ascending: false });

    if (analyticsError) {
      console.error('Analytics fetch error:', analyticsError);
      // If table doesn't exist yet, return empty stats
      return NextResponse.json({
        free: { total: 0, bySign: {} },
        paid: { total: 0, bySign: {} },
        message: 'Analytics table may not exist yet. Run the SQL migration.'
      });
    }

    // Also get paid count from prophecies table (already exists)
    const { count: paidFromProphecies } = await supabase
      .from('prophecies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Aggregate stats
    const freeBySign: Record<string, number> = {};
    const paidBySign: Record<string, number> = {};
    let freeTotal = 0;
    let paidTotal = 0;

    for (const record of analytics || []) {
      const signKey = `${record.zodiac_element} ${record.zodiac_sign}`;

      if (record.oracle_type === 'free') {
        freeBySign[signKey] = (freeBySign[signKey] || 0) + record.count;
        freeTotal += record.count;
      } else if (record.oracle_type === 'paid') {
        paidBySign[signKey] = (paidBySign[signKey] || 0) + record.count;
        paidTotal += record.count;
      }
    }

    // Get paid by zodiac sign from prophecies table (more accurate)
    const { data: paidByZodiac } = await supabase
      .from('prophecies')
      .select('zodiac_sign, zodiac_element')
      .eq('status', 'completed');

    const paidBySignFromDb: Record<string, number> = {};
    for (const p of paidByZodiac || []) {
      const key = `${p.zodiac_element} ${p.zodiac_sign}`;
      paidBySignFromDb[key] = (paidBySignFromDb[key] || 0) + 1;
    }

    return NextResponse.json({
      free: {
        total: freeTotal,
        bySign: freeBySign
      },
      paid: {
        total: paidFromProphecies || 0,
        bySign: paidBySignFromDb
      },
      combined: {
        total: freeTotal + (paidFromProphecies || 0)
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
