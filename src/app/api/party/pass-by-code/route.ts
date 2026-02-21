import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const { data: pass, error } = await supabase
      .from('party_passes')
      .select('*')
      .eq('party_code', code.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
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
