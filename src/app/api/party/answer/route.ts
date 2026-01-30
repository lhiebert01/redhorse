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

    console.log('[ANSWER API] Received:', { game_id, player_id, question_index, question_id, answer_given });

    // Validate inputs
    if (!game_id || !player_id || question_index === undefined || !answer_given) {
      console.log('[ANSWER API] Missing fields');
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
      console.log('[ANSWER API] Game not found:', gameError);
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // IMPORTANT: Convert question_index to number to handle type mismatches from JSON
    const questionIndexNum = Number(question_index);
    console.log('[ANSWER API] Game found, current_question_index:', game.current_question_index, 'submitted:', questionIndexNum);

    // Check game is still accepting answers (playing or showing_answer status)
    // We're more lenient here - as long as game is active and player hasn't answered this question yet
    if (game.status === 'finished' || game.status === 'abandoned') {
      console.log('[ANSWER API] Game is not active:', game.status);
      return NextResponse.json(
        { error: 'This game has ended' },
        { status: 400 }
      );
    }

    // Check for existing answer (prevent double submission)
    const { data: existingAnswer } = await supabase
      .from('party_answers')
      .select('*')
      .eq('party_game_id', game_id)
      .eq('player_id', player_id)
      .eq('question_index', questionIndexNum)
      .single();

    if (existingAnswer) {
      return NextResponse.json(
        { error: 'Already answered this question' },
        { status: 400 }
      );
    }

    // Get the correct answer from question bank
    // IMPORTANT: Convert question_id to number to handle type mismatches from JSON
    const questionIdNum = Number(question_id);
    console.log('[ANSWER API] Looking for question:', { question_id, questionIdNum, typeofOriginal: typeof question_id });

    const question = PARTY_QUESTIONS.find((q) => q.id === questionIdNum);
    if (!question) {
      console.log('[ANSWER API] Question not found in bank:', questionIdNum);
      console.log('[ANSWER API] Available question IDs (first 10):', PARTY_QUESTIONS.slice(0, 10).map(q => q.id));
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Detailed logging for debugging
    console.log('[ANSWER API] Question found:', {
      id: question.id,
      questionText: question.question.substring(0, 50),
      options: question.options,
      correctAnswer: question.correctAnswer,
      answer_given: answer_given,
    });

    // Trim whitespace and compare
    const trimmedAnswer = String(answer_given).trim();
    const trimmedCorrect = String(question.correctAnswer).trim();
    const isCorrect = trimmedAnswer === trimmedCorrect;

    console.log('[ANSWER API] Comparison:', {
      trimmedAnswer,
      trimmedCorrect,
      isCorrect,
      answerLength: trimmedAnswer.length,
      correctLength: trimmedCorrect.length,
      exactMatch: answer_given === question.correctAnswer,
    });

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
    console.log('[ANSWER API] Inserting answer:', {
      party_game_id: game_id,
      player_id: player_id,
      question_index: questionIndexNum,
      question_id: questionIdNum,
      answer_given: trimmedAnswer,
      is_correct: isCorrect,
      total_points: points.total,
    });

    const { data: insertedAnswer, error: insertError } = await supabase
      .from('party_answers')
      .insert({
        party_game_id: game_id,
        player_id: player_id,
        question_index: questionIndexNum,
        question_id: questionIdNum,
        answer_given: trimmedAnswer,
        is_correct: isCorrect,
        answer_time_ms: answer_time_ms,
        base_points: points.base,
        speed_bonus: points.speed,
        streak_bonus: points.streak,
        total_points: points.total,
        current_streak: newStreak,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[ANSWER API] Failed to insert answer:', insertError);
      return NextResponse.json(
        { error: 'Failed to save answer: ' + insertError.message },
        { status: 500 }
      );
    }

    console.log('[ANSWER API] Answer inserted successfully:', insertedAnswer?.id);

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
