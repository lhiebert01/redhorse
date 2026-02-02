import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/party/sync-game
 * Updates a player's game_id when the host restarts a game
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_id, old_game_id, new_game_id } = body;

    if (!player_id || !new_game_id) {
      return NextResponse.json(
        { error: 'Missing player_id or new_game_id' },
        { status: 400 }
      );
    }

    console.log('[SYNC-GAME] Updating player:', player_id, 'from game:', old_game_id, 'to:', new_game_id);

    // Check if player already exists in new game
    const { data: existingInNew } = await supabase
      .from('party_players')
      .select('id')
      .eq('party_game_id', new_game_id)
      .eq('id', player_id)
      .single();

    if (existingInNew) {
      console.log('[SYNC-GAME] Player already in new game');
      return NextResponse.json({ success: true, already_synced: true });
    }

    // Update player's game_id
    const { error: updateError } = await supabase
      .from('party_players')
      .update({
        party_game_id: new_game_id,
        is_connected: true,
        last_seen_at: new Date().toISOString()
      })
      .eq('id', player_id);

    if (updateError) {
      console.error('[SYNC-GAME] Failed to update player:', updateError);
      return NextResponse.json(
        { error: 'Failed to sync game' },
        { status: 500 }
      );
    }

    console.log('[SYNC-GAME] Player synced successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SYNC-GAME] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
