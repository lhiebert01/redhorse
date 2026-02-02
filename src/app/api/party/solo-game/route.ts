import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pass_id, timer_seconds, questions_per_game } = body;

    if (!pass_id) {
      return NextResponse.json({ error: 'Missing pass_id' }, { status: 400 });
    }

    // Fetch fresh pass data
    const { data: pass, error: passError } = await supabase
      .from('party_passes')
      .select('*')
      .eq('id', pass_id)
      .single();

    if (passError || !pass) {
      console.error('Error fetching pass:', passError);
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    // Verify this is a solo pass
    if (!pass.is_solo) {
      return NextResponse.json({ error: 'Not a solo pass' }, { status: 400 });
    }

    // Check games remaining
    if (pass.games_remaining <= 0) {
      return NextResponse.json({ error: 'No games remaining' }, { status: 400 });
    }

    // Get the next question set
    const gamesPlayed = pass.games_played || 0;
    const questionSets = pass.question_sets;
    const gameNumber = gamesPlayed + 1;

    let questionIds: number[];
    if (questionSets && Array.isArray(questionSets) && questionSets.length > gamesPlayed) {
      questionIds = questionSets[gamesPlayed];
    } else {
      // Legacy fallback - generate random IDs
      questionIds = Array.from({ length: 20 }, () => Math.floor(Math.random() * 400) + 1);
    }

    // Limit to questions per game setting
    const questionsCount = questions_per_game || pass.settings?.questions_per_game || 20;
    questionIds = questionIds.slice(0, questionsCount);

    // Create the game
    const { data: game, error: gameError } = await supabase
      .from('party_games')
      .insert({
        party_pass_id: pass.id,
        timer_seconds: timer_seconds || 30,
        questions_per_game: questionsCount,
        question_ids: questionIds,
        game_number: gameNumber,
        status: 'playing',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (gameError || !game) {
      console.error('Error creating game:', gameError);
      return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
    }

    // Update pass: increment games_played, decrement games_remaining
    const { error: updateError } = await supabase
      .from('party_passes')
      .update({
        games_played: gameNumber,
        games_remaining: pass.games_remaining - 1,
      })
      .eq('id', pass.id);

    if (updateError) {
      console.error('Error updating pass:', updateError);
      // Game was created, so continue but log the error
    }

    // Return the game and updated pass info
    return NextResponse.json({
      game,
      pass: {
        ...pass,
        games_played: gameNumber,
        games_remaining: pass.games_remaining - 1,
      },
    });

  } catch (error) {
    console.error('Solo game creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
