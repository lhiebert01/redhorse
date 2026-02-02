import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_PIN = '142857';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    // Verify PIN
    if (pin !== SUPERADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all passes
    const { data: passes, error: passesError } = await supabase
      .from('party_passes')
      .select('*')
      .order('created_at', { ascending: false });

    if (passesError) {
      console.error('Error fetching passes:', passesError);
      return NextResponse.json({ error: 'Failed to fetch passes' }, { status: 500 });
    }

    // Fetch all games
    const { data: games, error: gamesError } = await supabase
      .from('party_games')
      .select('*');

    if (gamesError) {
      console.error('Error fetching games:', gamesError);
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }

    // Fetch all players
    const { data: players, error: playersError } = await supabase
      .from('party_players')
      .select('*');

    if (playersError) {
      console.error('Error fetching players:', playersError);
      return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
    }

    // Calculate stats
    const now = new Date();

    // Pass type breakdown
    const byType: Record<string, number> = {};
    let totalGamesAllowed = 0;
    let totalGamesPlayed = 0;
    let totalGamesRemaining = 0;

    for (const pass of passes || []) {
      const type = pass.pass_type || 'unknown';
      byType[type] = (byType[type] || 0) + 1;

      // Calculate games allowed based on pass type
      const gamesAllowed = pass.games_allowed ||
        (type === 'day' ? 5 : type === 'weekend' ? 10 : type === 'festival' ? 15 : type === 'solo' ? 5 : 0);

      totalGamesAllowed += gamesAllowed;
      totalGamesPlayed += pass.games_played || 0;
      totalGamesRemaining += pass.games_remaining || 0;
    }

    // Game stats
    const completedGames = (games || []).filter(g => g.status === 'finished').length;
    const inProgressGames = (games || []).filter(g => g.status === 'playing').length;

    // Players per game
    const playersArray = players || [];
    const gamePlayerCounts: Record<string, number> = {};
    for (const player of playersArray) {
      const gameId = player.party_game_id;
      gamePlayerCounts[gameId] = (gamePlayerCounts[gameId] || 0) + 1;
    }

    // Build pass list with player counts
    const passList = (passes || []).map(pass => {
      // Count players for this pass's games
      const passGames = (games || []).filter(g => g.party_pass_id === pass.id);
      let passPlayerCount = 0;
      for (const game of passGames) {
        passPlayerCount += gamePlayerCounts[game.id] || 0;
      }

      // Check if expired
      const expiresAt = pass.expires_at ? new Date(pass.expires_at) : null;
      const isExpired = expiresAt ? now > expiresAt : false;

      // Calculate games allowed
      const type = pass.pass_type || 'unknown';
      const gamesAllowed = pass.games_allowed ||
        (type === 'day' ? 5 : type === 'weekend' ? 10 : type === 'festival' ? 15 : type === 'solo' ? 5 : 0);

      return {
        party_code: pass.party_code,
        pass_type: pass.pass_type,
        games_allowed: gamesAllowed,
        games_played: pass.games_played || 0,
        games_remaining: pass.games_remaining || 0,
        total_players: passPlayerCount,
        created_at: pass.created_at,
        expires_at: pass.expires_at,
        is_expired: isExpired,
      };
    });

    const response = {
      passes: {
        total: (passes || []).length,
        byType,
        totalGamesAllowed,
        totalGamesPlayed,
        totalGamesRemaining,
      },
      games: {
        total: (games || []).length,
        completed: completedGames,
        inProgress: inProgressGames,
      },
      players: {
        total: playersArray.length,
        avgPerGame: (games || []).length > 0
          ? Math.round(playersArray.length / (games || []).length * 10) / 10
          : 0,
      },
      passList,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Party stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
