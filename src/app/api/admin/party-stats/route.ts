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

    // Separate party passes from solo passes
    const partyPasses = (passes || []).filter(p => !p.is_solo);
    const soloPasses = (passes || []).filter(p => p.is_solo);

    // Pass type breakdown (party only - excludes solo)
    const byType: Record<string, number> = {};
    let partyGamesAllowed = 0;
    let partyGamesPlayed = 0;
    let partyGamesRemaining = 0;

    for (const pass of partyPasses) {
      const type = pass.pass_type || 'unknown';
      byType[type] = (byType[type] || 0) + 1;

      const gamesAllowed = pass.games_total || pass.games_allowed ||
        (type === 'day' ? 5 : type === 'weekend' ? 10 : type === 'festival' ? 15 : 5);

      partyGamesAllowed += gamesAllowed;
      partyGamesPlayed += pass.games_played || 0;
      partyGamesRemaining += pass.games_remaining || 0;
    }

    // Solo pass stats
    let soloGamesAllowed = 0;
    let soloGamesPlayed = 0;
    let soloGamesRemaining = 0;
    let soloExpired = 0;
    let soloActive = 0;

    for (const pass of soloPasses) {
      const gamesAllowed = pass.games_total || pass.games_allowed || 5;
      soloGamesAllowed += gamesAllowed;
      soloGamesPlayed += pass.games_played || 0;
      soloGamesRemaining += pass.games_remaining || 0;

      const expiresAt = pass.expires_at ? new Date(pass.expires_at) : null;
      const isExpired = expiresAt ? now > expiresAt : false;
      if (isExpired) {
        soloExpired++;
      } else {
        soloActive++;
      }
    }

    // Game stats - separate party vs solo
    const partyPassIds = new Set(partyPasses.map(p => p.id));
    const soloPassIds = new Set(soloPasses.map(p => p.id));

    const partyGames = (games || []).filter(g => partyPassIds.has(g.party_pass_id));
    const soloGames = (games || []).filter(g => soloPassIds.has(g.party_pass_id));

    const partyCompletedGames = partyGames.filter(g => g.status === 'finished').length;
    const partyInProgressGames = partyGames.filter(g => g.status === 'playing').length;

    const soloCompletedGames = soloGames.filter(g => g.status === 'finished').length;
    const soloInProgressGames = soloGames.filter(g => g.status === 'playing').length;

    // Players per game (party games only - solo has 1 player implicit)
    const playersArray = players || [];
    const gamePlayerCounts: Record<string, number> = {};
    for (const player of playersArray) {
      const gameId = player.party_game_id;
      gamePlayerCounts[gameId] = (gamePlayerCounts[gameId] || 0) + 1;
    }

    // Build pass list with player counts - party passes
    const partyPassList = partyPasses.map(pass => {
      const passGames = partyGames.filter(g => g.party_pass_id === pass.id);
      let passPlayerCount = 0;
      for (const game of passGames) {
        passPlayerCount += gamePlayerCounts[game.id] || 0;
      }

      const expiresAt = pass.expires_at ? new Date(pass.expires_at) : null;
      const isExpired = expiresAt ? now > expiresAt : false;

      const type = pass.pass_type || 'unknown';
      const gamesAllowed = pass.games_total || pass.games_allowed ||
        (type === 'day' ? 5 : type === 'weekend' ? 10 : type === 'festival' ? 15 : 5);

      return {
        party_code: pass.party_code,
        pass_type: pass.pass_type,
        is_solo: false,
        games_allowed: gamesAllowed,
        games_played: pass.games_played || 0,
        games_remaining: pass.games_remaining || 0,
        total_players: passPlayerCount,
        created_at: pass.created_at,
        expires_at: pass.expires_at,
        is_expired: isExpired,
      };
    });

    // Build pass list - solo passes
    const soloPassList = soloPasses.map(pass => {
      const expiresAt = pass.expires_at ? new Date(pass.expires_at) : null;
      const isExpired = expiresAt ? now > expiresAt : false;

      const gamesAllowed = pass.games_total || pass.games_allowed || 5;

      return {
        party_code: pass.party_code,
        pass_type: pass.pass_type,
        is_solo: true,
        games_allowed: gamesAllowed,
        games_played: pass.games_played || 0,
        games_remaining: pass.games_remaining || 0,
        total_players: 1, // Solo always has 1 player
        created_at: pass.created_at,
        expires_at: pass.expires_at,
        is_expired: isExpired,
      };
    });

    const response = {
      // Party passes stats
      partyPasses: {
        total: partyPasses.length,
        byType,
        gamesAllowed: partyGamesAllowed,
        gamesPlayed: partyGamesPlayed,
        gamesRemaining: partyGamesRemaining,
      },
      partyGames: {
        total: partyGames.length,
        completed: partyCompletedGames,
        inProgress: partyInProgressGames,
      },
      partyPlayers: {
        total: playersArray.length,
        avgPerGame: partyGames.length > 0
          ? Math.round(playersArray.length / partyGames.length * 10) / 10
          : 0,
      },
      partyPassList,

      // Solo passes stats
      soloPasses: {
        total: soloPasses.length,
        active: soloActive,
        expired: soloExpired,
        gamesAllowed: soloGamesAllowed,
        gamesPlayed: soloGamesPlayed,
        gamesRemaining: soloGamesRemaining,
      },
      soloGames: {
        total: soloGames.length,
        completed: soloCompletedGames,
        inProgress: soloInProgressGames,
      },
      soloPassList,

      // Legacy fields for backwards compatibility
      passes: {
        total: (passes || []).length,
        byType,
        totalGamesAllowed: partyGamesAllowed + soloGamesAllowed,
        totalGamesPlayed: partyGamesPlayed + soloGamesPlayed,
        totalGamesRemaining: partyGamesRemaining + soloGamesRemaining,
      },
      games: {
        total: (games || []).length,
        completed: partyCompletedGames + soloCompletedGames,
        inProgress: partyInProgressGames + soloInProgressGames,
      },
      players: {
        total: playersArray.length,
        avgPerGame: (games || []).length > 0
          ? Math.round(playersArray.length / (games || []).length * 10) / 10
          : 0,
      },
      passList: [...partyPassList, ...soloPassList],
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
