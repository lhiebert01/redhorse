import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, zodiac_sign, zodiac_element } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Insert into email_captures table (create if doesn't exist via Supabase dashboard)
    const { error } = await supabase
      .from('email_captures')
      .insert({
        email,
        zodiac_sign,
        zodiac_element,
        source: 'free_reading',
        created_at: new Date().toISOString(),
      });

    if (error) {
      // If table doesn't exist, just log and return success
      // (we don't want to fail the user experience)
      console.error('Email capture error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json({ success: true }); // Still return success to not break UX
  }
}
