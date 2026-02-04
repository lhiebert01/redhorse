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

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all VIP passes ordered by creation date
    const { data: passes, error } = await supabase
      .from('vip_passes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching VIP passes:', error);
      return NextResponse.json({ error: 'Failed to fetch VIP passes' }, { status: 500 });
    }

    // Calculate stats
    const stats = {
      total: passes?.length || 0,
      active: passes?.filter(p => p.status === 'active' && new Date(p.expires_at) > new Date()).length || 0,
      expired: passes?.filter(p => p.status === 'expired' || new Date(p.expires_at) <= new Date()).length || 0,
      revoked: passes?.filter(p => p.status === 'revoked').length || 0,
      oracle_used: passes?.filter(p => p.oracle_used).length || 0,
      solo_used: passes?.filter(p => p.solo_used).length || 0,
      hosted_used: passes?.filter(p => p.hosted_used).length || 0,
      fully_used: passes?.filter(p => p.oracle_used && p.solo_used && p.hosted_used).length || 0,
    };

    return NextResponse.json({
      passes: passes || [],
      stats,
    });
  } catch (error) {
    console.error('VIP list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
