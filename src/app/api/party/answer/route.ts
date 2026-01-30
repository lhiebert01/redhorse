import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PARTY_QUESTIONS } from '@/constants/party-questions';
import { calculatePoints } from '@/types/party';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      game_id,
      player_id,
      question_index,
      question_id,
      answer_given,
      answer_time_ms,
    } = body;

    // Validate inputs
    if (!game_id || !player_id || question_index === undefined || !answer_given) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the game
    const { data: game, error: gameError } = await supabase
      .from('party_games')
      .select('*')
      .eq('id', game_id)
      .single();

    if (gameError || !game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Verify this is the current question
    if (game.current_question_index !== question_index) {
      return NextResponse.json(
        { error: 'This question has already ended' },
        { status: 400 }
      );
    }

    // Check for existing answer (prevent double submission)
    const { data: existingAnswer } = await supabase
      .from('party_answers')
      .select('*')
      .eq('party_game_id', game_id)
      .eq('player_id', player_id)
      .eq('question_index', question_index)
      .single();

    if (existingAnswer) {
      return NextResponse.json(
        { error: 'Already answered this question' },
        { status: 400 }
      );
    }

    // Get the correct answer from question bank
    const question = PARTY_QUESTIONS.find((q) => q.id === question_id);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const isCorrect = answer_given === question.correctAnswer;

    // Get current streak (count previous correct answers in a row)
    const { data: previousAnswers } = await supabase
      .from('party_answers')
      .select('is_correct')
      .eq('party_game_id', game_id)
      .eq('player_id', player_id)
      .order('question_index', { ascending: false })
      .limit(20);

    let currentStreak = 0;
    if (previousAnswers) {
      for (const ans of previousAnswers) {
        if (ans.is_correct) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate points
    const points = calculatePoints(
      isCorrect,
      answer_time_ms,
      game.timer_seconds,
      currentStreak
    );

    // Update streak based on this answer
    const newStreak = isCorrect ? currentStreak + 1 : 0;

    // Insert answer
    const { error: insertError } = await supabase
      .from('party_answers')
      .insert({
        party_game_id: game_id,
        player_id: player_id,
        question_index: question_index,
        question_id: question_id,
        answer_given: answer_given,
        is_correct: isCorrect,
        answer_time_ms: answer_time_ms,
        base_points: points.base,
        speed_bonus: points.speed,
        streak_bonus: points.streak,
        total_points: points.total,
        current_streak: newStreak,
      });

    if (insertError) {
      console.error('Failed to insert answer:', insertError);
      return NextResponse.json(
        { error: 'Failed to save answer' },
        { status: 500 }
      );
    }

    // Get count of answers for this question (for broadcast)
    const { count: answersReceived } = await supabase
      .from('party_answers')
      .select('*', { count: 'exact', head: true })
      .eq('party_game_id', game_id)
      .eq('question_index', question_index);

    // Broadcast that player answered (without revealing if correct)
    const channel = supabase.channel(`party:${game_id}`);
    await channel.send({
      type: 'broadcast',
      event: 'player_answered',
      payload: {
        player_id,
        question_index,
        answers_received: answersReceived || 0,
      },
    });

    return NextResponse.json({
      success: true,
      is_correct: isCorrect,
      base_points: points.base,
      speed_bonus: points.speed,
      streak_bonus: points.streak,
      total_points: points.total,
      current_streak: newStreak,
      correct_answer: question.correctAnswer, // Will be shown after question ends
      explanation: question.explanation,
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
