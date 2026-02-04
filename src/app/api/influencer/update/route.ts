import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PIN = '142857';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, id, status, admin_notes } = body;

    // Validate admin PIN
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const validStatuses = ['new', 'contacted', 'approved', 'declined', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      if (status !== 'new') {
        updateData.responded_at = new Date().toISOString();
      }
    }

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { error } = await supabase
      .from('influencer_applications')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating influencer application:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
    });
  } catch (error) {
    console.error('Influencer update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
