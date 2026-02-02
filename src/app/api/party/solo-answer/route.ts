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
      question_index,
      question_id,
      answer_given,
      is_correct,
      answer_time_ms,
      base_points,
      speed_bonus,
      streak_bonus,
      total_points,
      current_streak,
    } = body;

    if (!game_id || question_index === undefined || question_id === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the answer
    const { error } = await supabase.from('party_answers').insert({
      party_game_id: game_id,
      player_id: 'solo', // Special player ID for solo play
      question_index,
      question_id,
      answer_given,
      is_correct,
      answer_time_ms,
      base_points,
      speed_bonus,
      streak_bonus,
      total_points,
      current_streak,
    });

    if (error) {
      console.error('Error recording answer:', error);
      return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Solo answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
