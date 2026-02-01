import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DBQuestion {
  id: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
}

/**
 * GET /api/party/questions?ids=1,2,3,4,5
 * Fetch questions by their IDs from the database
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Missing ids parameter' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No valid IDs provided' },
        { status: 400 }
      );
    }

    const { data: questions, error } = await supabase
      .from('party_questions')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('[QUESTIONS API] Error fetching questions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // Transform to match the format expected by the frontend
    const formattedQuestions = questions.map((q: DBQuestion) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    }));

    // Sort by the order of IDs requested (maintain game order)
    const idOrder = new Map(ids.map((id, index) => [id, index]));
    formattedQuestions.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error('[QUESTIONS API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
