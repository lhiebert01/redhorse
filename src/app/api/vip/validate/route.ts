import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VIPPass, getVIPUsage } from '@/types/vip';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find the pass
    const { data: pass, error } = await supabase
      .from('vip_passes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (error || !pass) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid VIP code',
        pass: null,
        usage: null,
      });
    }

    const vipPass = pass as VIPPass;

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(vipPass.expires_at);

    if (expiresAt < now) {
      // Update status if not already expired
      if (vipPass.status === 'active') {
        await supabase
          .from('vip_passes')
          .update({ status: 'expired' })
          .eq('id', vipPass.id);
      }

      return NextResponse.json({
        valid: false,
        error: 'VIP code has expired',
        pass: { ...vipPass, status: 'expired' },
        usage: getVIPUsage(vipPass),
      });
    }

    // Check if revoked
    if (vipPass.status === 'revoked') {
      return NextResponse.json({
        valid: false,
        error: 'VIP code has been revoked',
        pass: vipPass,
        usage: getVIPUsage(vipPass),
      });
    }

    // Valid pass
    const usage = getVIPUsage(vipPass);

    return NextResponse.json({
      valid: true,
      pass: vipPass,
      usage,
      error: null,
    });
  } catch (error) {
    console.error('VIP validate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
