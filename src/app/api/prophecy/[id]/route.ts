import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing prophecy ID' }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('prophecies')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Prophecy not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
