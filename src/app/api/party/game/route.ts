import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      party_pass_id,
      party_code,
      timer_seconds = 30,
      game_number,
      action = 'create' // 'create' for new game, 'restart' for same game slot
    } = body;

    if (!party_pass_id || !party_code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the party pass exists and is valid
    const { data: pass, error: passError } = await supabase
      .from('party_passes')
      .select('*')
      .eq('id', party_pass_id)
      .eq('party_code', party_code)
      .single();

    if (passError || !pass) {
      return NextResponse.json(
        { error: 'Invalid party pass' },
        { status: 404 }
      );
    }

    // Check if pass is expired
    if (new Date(pass.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Party pass has expired' },
        { status: 403 }
      );
    }

    // Check games remaining for new games (not restarts)
    if (action === 'create') {
      const gamesRemaining = pass.games_remaining || 0;
      if (gamesRemaining <= 0) {
        return NextResponse.json(
          { error: 'No games remaining on this pass' },
          { status: 403 }
        );
      }
    }

    // Determine the game number and question set
    const gamesPlayed = pass.games_played || 0;
    let actualGameNumber: number;
    let setIndex: number;

    if (action === 'restart' && game_number) {
      // Restart uses same game number and set
      actualGameNumber = game_number;
      setIndex = Math.max(0, game_number - 1);
    } else {
      // New game uses next available slot
      actualGameNumber = gamesPlayed + 1;
      setIndex = gamesPlayed;
    }

    // Get question IDs from pre-generated sets (created at purchase time)
    const questionSets = pass.question_sets;
    let questionIds: number[];

    if (questionSets && Array.isArray(questionSets) && questionSets.length > setIndex) {
      // Use pre-generated question set
      questionIds = questionSets[setIndex];
      console.log(`[GAME API] Using pre-generated set #${setIndex}: [${questionIds.slice(0, 5).join(', ')}...]`);
    } else {
      // LEGACY: Generate fresh unique questions for old passes without pre-generated sets
      console.log(`[GAME API] Legacy pass - generating fresh unique questions for set #${setIndex}`);
      const totalQuestions = 400;
      const questionsPerGame = 20;
      const ids: number[] = [];
      const used = new Set<number>();

      // Use Fisher-Yates shuffle for randomness
      const available = Array.from({ length: totalQuestions }, (_, i) => i + 1);
      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }

      questionIds = available.slice(0, questionsPerGame);
      console.log(`[GAME API] Generated ${questionIds.length} unique questions: [${questionIds.slice(0, 5).join(', ')}...]`);
    }

    // If restarting, mark the old game as abandoned
    if (action === 'restart') {
      const { error: abandonError } = await supabase
        .from('party_games')
        .update({ status: 'abandoned' })
        .eq('party_pass_id', party_pass_id)
        .eq('game_number', actualGameNumber)
        .neq('status', 'abandoned');

      if (abandonError) {
        console.error('[GAME API] Failed to mark old game as abandoned:', abandonError);
      }
    }

    // Create new game
    const { data: newGame, error: createError } = await supabase
      .from('party_games')
      .insert({
        party_pass_id: party_pass_id,
        timer_seconds: timer_seconds,
        questions_per_game: questionIds.length,
        question_ids: questionIds,
        game_number: actualGameNumber,
        current_question_index: 0,
        status: 'lobby',
      })
      .select()
      .single();

    if (createError || !newGame) {
      console.error('[GAME API] Failed to create game:', createError);
      return NextResponse.json(
        { error: 'Failed to create game: ' + (createError?.message || 'Unknown error') },
        { status: 500 }
      );
    }

    // NOTE: We do NOT update games_played or games_remaining here.
    // Those counters should only be updated when a game is COMPLETED (in endGame on host).
    // This allows games to be started but not "consumed" until they're actually played.
    console.log('[GAME API] Game created. Counters will update when game completes.');

    console.log(`[GAME API] Game #${actualGameNumber} created:`, newGame.id);

    return NextResponse.json({
      success: true,
      game: newGame,
      game_number: actualGameNumber,
      action: action,
    });
  } catch (error) {
    console.error('[GAME API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
