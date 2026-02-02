import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS - this is the key difference from client-side code
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_pass_id, game_id } = body;

    console.log('[END-GAME API] Request received:', { party_pass_id, game_id });

    if (!party_pass_id || !game_id) {
      return NextResponse.json(
        { error: 'Missing required fields: party_pass_id and game_id' },
        { status: 400 }
      );
    }

    // Get current pass data
    const { data: pass, error: passError } = await supabase
      .from('party_passes')
      .select('*')
      .eq('id', party_pass_id)
      .single();

    if (passError || !pass) {
      console.error('[END-GAME API] Pass not found:', passError);
      return NextResponse.json(
        { error: 'Party pass not found' },
        { status: 404 }
      );
    }

    console.log('[END-GAME API] Current pass state:', {
      games_played: pass.games_played,
      games_remaining: pass.games_remaining,
    });

    // Calculate new values
    const currentGamesPlayed = pass.games_played || 0;
    const currentGamesRemaining = pass.games_remaining || 0;
    const newGamesPlayed = currentGamesPlayed + 1;
    const newGamesRemaining = Math.max(0, currentGamesRemaining - 1);

    console.log('[END-GAME API] Updating to:', {
      newGamesPlayed,
      newGamesRemaining,
    });

    // Update the pass with new values - using service role key so RLS is bypassed
    const { data: updatedPass, error: updateError } = await supabase
      .from('party_passes')
      .update({
        games_played: newGamesPlayed,
        games_remaining: newGamesRemaining,
      })
      .eq('id', party_pass_id)
      .select()
      .single();

    if (updateError) {
      console.error('[END-GAME API] Failed to update pass:', updateError);
      return NextResponse.json(
        { error: 'Failed to update pass: ' + updateError.message },
        { status: 500 }
      );
    }

    console.log('[END-GAME API] Pass updated successfully:', {
      games_played: updatedPass.games_played,
      games_remaining: updatedPass.games_remaining,
    });

    // Also update the game status to 'finished'
    const { error: gameUpdateError } = await supabase
      .from('party_games')
      .update({ status: 'finished' })
      .eq('id', game_id);

    if (gameUpdateError) {
      console.error('[END-GAME API] Failed to update game status:', gameUpdateError);
      // Don't fail the whole request, pass update is more important
    }

    return NextResponse.json({
      success: true,
      games_played: updatedPass.games_played,
      games_remaining: updatedPass.games_remaining,
      pass: updatedPass,
    });
  } catch (error) {
    console.error('[END-GAME API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
