import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

// Admin PIN for accessing stats
const ADMIN_PIN = '142857';

// Valid birth year range
const MIN_YEAR = 1910;
const MAX_YEAR = 2027;

interface YearStats {
  year: number;
  sign: string;
  element: string;
  count: number;
  mode?: string;
}

/**
 * Get oracle generation statistics
 * Requires admin PIN for access
 *
 * Query params:
 * - pin: Admin PIN (required)
 * - type: 'free' | 'paid' | 'all' (default: 'all')
 * - showZeroRows: 'true' | 'false' (default: 'false')
 * - format: 'json' | 'csv' (default: 'json')
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');
  const typeFilter = searchParams.get('type') || 'all';
  const showZeroRows = searchParams.get('showZeroRows') === 'true';
  const format = searchParams.get('format') || 'json';

  // Validate admin PIN
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // =====================
    // FREE ORACLE ANALYTICS
    // =====================
    // Get from oracle_analytics table
    const { data: freeAnalytics, error: freeError } = await supabase
      .from('oracle_analytics')
      .select('*')
      .eq('oracle_type', 'free')
      .order('birth_year', { ascending: true });

    // Aggregate FREE stats by year
    const freeByYear: YearStats[] = [];
    const freeByYearMap = new Map<string, YearStats>();

    for (const record of freeAnalytics || []) {
      const year = record.birth_year || 0;
      const key = `${year}-${record.zodiac_sign}-${record.zodiac_element}`;

      if (freeByYearMap.has(key)) {
        const existing = freeByYearMap.get(key)!;
        existing.count += record.count;
      } else {
        freeByYearMap.set(key, {
          year,
          sign: record.zodiac_sign,
          element: record.zodiac_element,
          count: record.count
        });
      }
    }

    freeByYear.push(...Array.from(freeByYearMap.values()));
    freeByYear.sort((a, b) => a.year - b.year);

    // =====================
    // PAID ORACLE ANALYTICS
    // =====================
    // Get from prophecies table (authoritative source for paid oracles)
    // IMPORTANT: Only count REAL paid transactions (cs_live_ prefix)
    // This excludes:
    //   - Admin test console (admin-test-*)
    //   - Stripe test mode (cs_test_*)
    const { data: prophecies, error: propheciesError } = await supabase
      .from('prophecies')
      .select('zodiac_sign, zodiac_element, focus_mode, birth_date, created_at, stripe_session_id')
      .eq('status', 'completed')
      .like('stripe_session_id', 'cs_live_%')
      .order('created_at', { ascending: true });

    // Aggregate PAID stats by year + mode
    const paidByYear: YearStats[] = [];
    const paidByYearMap = new Map<string, YearStats>();

    for (const p of prophecies || []) {
      // Extract year from birth_date (format: MM/DD/YYYY or YYYY-MM-DD)
      let year = 0;
      if (p.birth_date) {
        const parts = p.birth_date.split(/[/-]/);
        if (parts.length >= 3) {
          // Check if first part is year (YYYY-MM-DD) or month (MM/DD/YYYY)
          const firstPart = parseInt(parts[0], 10);
          if (firstPart > 1000) {
            year = firstPart; // YYYY-MM-DD format
          } else {
            year = parseInt(parts[2], 10); // MM/DD/YYYY format
          }
        }
      }

      const mode = p.focus_mode?.toLowerCase() || 'unknown';
      const key = `${year}-${p.zodiac_sign}-${p.zodiac_element}-${mode}`;

      if (paidByYearMap.has(key)) {
        const existing = paidByYearMap.get(key)!;
        existing.count += 1;
      } else {
        paidByYearMap.set(key, {
          year,
          sign: p.zodiac_sign || 'unknown',
          element: p.zodiac_element || 'unknown',
          mode,
          count: 1
        });
      }
    }

    paidByYear.push(...Array.from(paidByYearMap.values()));
    paidByYear.sort((a, b) => a.year - b.year);

    // Calculate totals
    const freeTotal = freeByYear.reduce((sum, r) => sum + r.count, 0);
    const paidTotal = paidByYear.reduce((sum, r) => sum + r.count, 0);

    // Aggregate by sign (for summary)
    const freeBySign: Record<string, number> = {};
    const paidBySign: Record<string, number> = {};
    const paidByMode: Record<string, number> = {};

    for (const r of freeByYear) {
      const signKey = `${r.element} ${r.sign}`;
      freeBySign[signKey] = (freeBySign[signKey] || 0) + r.count;
    }

    for (const r of paidByYear) {
      const signKey = `${r.element} ${r.sign}`;
      paidBySign[signKey] = (paidBySign[signKey] || 0) + r.count;
      if (r.mode) {
        paidByMode[r.mode] = (paidByMode[r.mode] || 0) + r.count;
      }
    }

    // If showZeroRows, generate rows for all years from MIN_YEAR to MAX_YEAR
    // (This would create a large dataset - typically only used for CSV export)

    // CSV Export
    if (format === 'csv') {
      const csvType = searchParams.get('csvType') || 'free';

      if (csvType === 'free') {
        // FREE CSV: Year, Sign, Element, Count
        let csv = 'Year,Sign,Element,Count\n';
        for (const r of freeByYear) {
          if (showZeroRows || r.count > 0) {
            csv += `${r.year},${r.sign},${r.element},${r.count}\n`;
          }
        }
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=free-oracle-analytics.csv'
          }
        });
      } else if (csvType === 'paid') {
        // PAID CSV: Year, Sign, Element, Mode, Count
        let csv = 'Year,Sign,Element,Mode,Count\n';
        for (const r of paidByYear) {
          if (showZeroRows || r.count > 0) {
            csv += `${r.year},${r.sign},${r.element},${r.mode || 'unknown'},${r.count}\n`;
          }
        }
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=paid-oracle-analytics.csv'
          }
        });
      }
    }

    // JSON Response
    return NextResponse.json({
      free: {
        total: freeTotal,
        byYear: typeFilter === 'paid' ? [] : freeByYear.filter(r => showZeroRows || r.count > 0),
        bySign: freeBySign
      },
      paid: {
        total: paidTotal,
        byYear: typeFilter === 'free' ? [] : paidByYear.filter(r => showZeroRows || r.count > 0),
        bySign: paidBySign,
        byMode: paidByMode
      },
      combined: {
        total: freeTotal + paidTotal
      },
      validYearRange: { min: MIN_YEAR, max: MAX_YEAR },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
