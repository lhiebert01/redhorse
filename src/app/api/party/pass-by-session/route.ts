import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const { data: pass, error } = await supabase
      .from('party_passes')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - pass not created yet
        return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
      }
      console.error('Error fetching pass:', error);
      return NextResponse.json({ error: 'Failed to fetch pass' }, { status: 500 });
    }

    return NextResponse.json(pass);
  } catch (error) {
    console.error('Pass fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
