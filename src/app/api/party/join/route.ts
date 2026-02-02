import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getZodiacFromYear, MAX_PLAYERS } from '@/types/party';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { party_code, nickname, birth_year } = body;

    // Validate inputs
    if (!party_code || party_code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid party code' },
        { status: 400 }
      );
    }

    if (!nickname || nickname.length < 2 || nickname.length > 16) {
      return NextResponse.json(
        { error: 'Nickname must be 2-16 characters' },
        { status: 400 }
      );
    }

    // Find the party pass
    const { data: pass, error: passError } = await supabase
      .from('party_passes')
      .select('*')
      .eq('party_code', party_code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (passError || !pass) {
      return NextResponse.json(
        { error: 'Party not found. Check the code and try again.' },
        { status: 404 }
      );
    }

    // Check if pass is expired
    if (new Date(pass.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This party has expired.' },
        { status: 400 }
      );
    }

    // Find an active game for this party (host creates the game, players just join)
    // Include 'showing_answer' so players can join even when host is revealing answers
    const { data: game, error: gameError } = await supabase
      .from('party_games')
      .select('*')
      .eq('party_pass_id', pass.id)
      .in('status', ['lobby', 'playing', 'showing_answer'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If no active game, tell player to wait for host
    if (gameError || !game) {
      return NextResponse.json(
        { error: 'No active game found. Please wait for the host to start a game.' },
        { status: 400 }
      );
    }

    // Check player count
    const { count: playerCount } = await supabase
      .from('party_players')
      .select('*', { count: 'exact', head: true })
      .eq('party_game_id', game.id)
      .eq('is_connected', true);

    if ((playerCount || 0) >= MAX_PLAYERS) {
      return NextResponse.json(
        { error: `Party is full (${MAX_PLAYERS} players max)` },
        { status: 400 }
      );
    }

    // Check for duplicate nickname in this game
    const { data: existingPlayer } = await supabase
      .from('party_players')
      .select('*')
      .eq('party_game_id', game.id)
      .eq('nickname', nickname.trim())
      .single();

    if (existingPlayer) {
      // If player exists but disconnected, reconnect them
      if (!existingPlayer.is_connected) {
        const { error: reconnectError } = await supabase
          .from('party_players')
          .update({
            is_connected: true,
            last_seen_at: new Date().toISOString(),
          })
          .eq('id', existingPlayer.id);

        if (reconnectError) {
          console.error('Failed to reconnect player:', reconnectError);
        }

        return NextResponse.json({
          success: true,
          player_id: existingPlayer.id,
          game_id: game.id,
          game_status: game.status,
          reconnected: true,
        });
      }

      return NextResponse.json(
        { error: 'Nickname already taken in this party' },
        { status: 400 }
      );
    }

    // Calculate zodiac if birth year provided
    let zodiacSign = null;
    let zodiacElement = null;
    if (birth_year && birth_year >= 1920 && birth_year <= 2020) {
      const zodiac = getZodiacFromYear(birth_year);
      zodiacSign = zodiac.sign;
      zodiacElement = zodiac.element;
    }

    // Create new player
    const { data: player, error: playerError } = await supabase
      .from('party_players')
      .insert({
        party_game_id: game.id,
        nickname: nickname.trim(),
        birth_year: birth_year || null,
        zodiac_sign: zodiacSign,
        zodiac_element: zodiacElement,
        is_connected: true,
      })
      .select()
      .single();

    if (playerError) {
      console.error('Failed to create player:', playerError);
      return NextResponse.json(
        { error: 'Failed to join party. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      player_id: player.id,
      game_id: game.id,
      game_status: game.status,
      party_code: party_code.toUpperCase(),
    });
  } catch (error) {
    console.error('Join party error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

