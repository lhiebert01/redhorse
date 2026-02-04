import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PIN = '142857';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, code, recipient_name, recipient_platform, notes, expires_in_days = 30 } = body;

    // Validate admin PIN
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    // Validate code
    if (!code || code.length < 3 || code.length > 20) {
      return NextResponse.json({ error: 'Code must be 3-20 characters' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if code already exists
    const { data: existing } = await supabase
      .from('vip_passes')
      .select('id')
      .eq('code', cleanCode)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
    }

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    // Create VIP pass
    const { data: pass, error } = await supabase
      .from('vip_passes')
      .insert({
        code: cleanCode,
        recipient_name: recipient_name || null,
        recipient_platform: recipient_platform || null,
        notes: notes || null,
        expires_at: expiresAt.toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating VIP pass:', error);
      return NextResponse.json({ error: 'Failed to create VIP pass' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pass,
      message: `VIP pass ${cleanCode} created successfully`,
    });
  } catch (error) {
    console.error('VIP generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
