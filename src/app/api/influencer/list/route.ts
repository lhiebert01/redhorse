import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PIN = '142857';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    // Validate admin PIN
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all applications ordered by creation date
    const { data: applications, error } = await supabase
      .from('influencer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching influencer applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json({
      applications: applications || [],
    });
  } catch (error) {
    console.error('Influencer list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
