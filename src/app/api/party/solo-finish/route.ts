import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      game_id,
      nickname,
      zodiac_sign,
      zodiac_element,
      total_points,
      correct_answers,
      total_questions,
      best_streak,
      fastest_answer_ms,
    } = body;

    if (!game_id) {
      return NextResponse.json({ error: 'Missing game_id' }, { status: 400 });
    }

    // Update game status
    const { error: gameError } = await supabase
      .from('party_games')
      .update({
        status: 'finished',
        ended_at: new Date().toISOString(),
      })
      .eq('id', game_id);

    if (gameError) {
      console.error('Error updating game:', gameError);
      return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
    }

    // Save score
    const accuracy = total_questions > 0
      ? Math.round((correct_answers / total_questions) * 100)
      : 0;

    const { error: scoreError } = await supabase.from('party_scores').insert({
      party_game_id: game_id,
      player_id: 'solo',
      nickname: nickname || 'Solo Player',
      zodiac_sign,
      zodiac_element,
      total_points: total_points || 0,
      correct_answers: correct_answers || 0,
      total_questions: total_questions || 0,
      accuracy_percent: accuracy,
      best_streak: best_streak || 0,
      fastest_answer_ms,
      rank: 1, // Solo play is always rank 1
    });

    if (scoreError) {
      console.error('Error saving score:', scoreError);
      // Don't fail - game is already marked as finished
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Solo finish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - fetch game data for next question
export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get('game_id');

  if (!gameId) {
    return NextResponse.json({ error: 'Missing game_id' }, { status: 400 });
  }

  try {
    const { data: game, error } = await supabase
      .from('party_games')
      .select('question_ids, questions_per_game')
      .eq('id', gameId)
      .single();

    if (error || !game) {
      console.error('Error fetching game:', error);
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);

  } catch (error) {
    console.error('Solo get game error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
