import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Valid years for reservation (2027-2037)
const VALID_YEARS = [2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037];
const VALID_MODES = ['wealth', 'power', 'love', 'shield'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, zodiacYear, preferredMode } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate year
    const year = parseInt(zodiacYear);
    if (!VALID_YEARS.includes(year)) {
      return NextResponse.json(
        { error: 'Invalid zodiac year. Must be between 2027-2037.' },
        { status: 400 }
      );
    }

    // Validate mode (optional)
    const mode = preferredMode && VALID_MODES.includes(preferredMode.toLowerCase())
      ? preferredMode.toLowerCase()
      : null;

    // Check if already reserved
    const { data: existing } = await supabase
      .from('future_reservations')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .eq('zodiac_year', year)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reserved a spot for this year!', alreadyReserved: true },
        { status: 409 }
      );
    }

    // Create reservation
    const { data, error } = await supabase
      .from('future_reservations')
      .insert({
        email: email.toLowerCase().trim(),
        zodiac_year: year,
        preferred_mode: mode,
        status: 'reserved',
      })
      .select()
      .single();

    if (error) {
      console.error('Reservation error:', error);
      return NextResponse.json(
        { error: 'Failed to create reservation. Please try again.' },
        { status: 500 }
      );
    }

    // Get total reservations for this year (for social proof)
    const { count } = await supabase
      .from('future_reservations')
      .select('*', { count: 'exact', head: true })
      .eq('zodiac_year', year);

    return NextResponse.json({
      success: true,
      message: `You're reserved for ${year}! We'll notify you when it opens.`,
      reservationId: data.id,
      totalReservations: count || 1,
    });

  } catch (error) {
    console.error('Reserve API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch reservation counts (public, no auth needed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    if (year) {
      // Get count for specific year
      const { count } = await supabase
        .from('future_reservations')
        .select('*', { count: 'exact', head: true })
        .eq('zodiac_year', parseInt(year))
        .eq('status', 'reserved');

      return NextResponse.json({
        year: parseInt(year),
        reservations: count || 0,
      });
    }

    // Get counts for all years
    const { data, error } = await supabase
      .from('future_reservations')
      .select('zodiac_year')
      .eq('status', 'reserved');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
    }

    // Count by year
    const counts: Record<number, number> = {};
    VALID_YEARS.forEach(y => counts[y] = 0);
    data?.forEach(r => {
      if (counts[r.zodiac_year] !== undefined) {
        counts[r.zodiac_year]++;
      }
    });

    return NextResponse.json({ counts });

  } catch (error) {
    console.error('Reserve GET error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
