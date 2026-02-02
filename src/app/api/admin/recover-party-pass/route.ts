import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe/client';
import { PassType, generatePartyCode, PASS_CONFIGS } from '@/types/party';

const SUPERADMIN_PIN = '142857';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, session_id } = body;

    // Verify PIN
    if (pin !== SUPERADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Check if pass already exists
    const { data: existingPass } = await supabase
      .from('party_passes')
      .select('*')
      .eq('stripe_session_id', session_id)
      .single();

    if (existingPass) {
      return NextResponse.json({
        message: 'Pass already exists',
        pass: existingPass,
        recovered: false,
      });
    }

    // Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found in Stripe' }, { status: 404 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        error: 'Payment not completed',
        payment_status: session.payment_status,
      }, { status: 400 });
    }

    // Get pass type from metadata
    const passType = (session.metadata?.pass_type || 'solo') as PassType;
    const passConfig = PASS_CONFIGS[passType];

    if (!passConfig) {
      return NextResponse.json({
        error: 'Invalid pass type',
        metadata: session.metadata,
      }, { status: 400 });
    }

    const durationHours = parseInt(session.metadata?.duration_hours || String(passConfig.durationHours || 24));
    const maxGames = parseInt(session.metadata?.max_games || String(passConfig.maxGames || 5));
    const isSolo = passConfig.isSolo ?? false;

    // Generate unique party code
    let partyCode = generatePartyCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('party_passes')
        .select('id')
        .eq('party_code', partyCode)
        .single();

      if (!existing) break;

      partyCode = generatePartyCode();
      attempts++;
    }

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    // Generate question sets
    const questionsPerGame = 20;
    const questionSets = generateAllQuestionSets(maxGames, questionsPerGame);

    // Create party pass
    const { data: pass, error: insertError } = await supabase
      .from('party_passes')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        host_email: session.customer_details?.email || '',
        party_code: partyCode,
        pass_type: passType,
        expires_at: expiresAt.toISOString(),
        games_remaining: maxGames,
        games_total: maxGames,
        games_played: 0,
        question_sets: questionSets,
        settings: {
          timer_seconds: 30,
          questions_per_game: questionsPerGame,
        },
        is_active: true,
        is_solo: isSolo,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create party pass:', insertError);
      return NextResponse.json({ error: 'Failed to create pass', details: insertError }, { status: 500 });
    }

    // For party passes (not solo), create initial game
    if (!isSolo) {
      await supabase
        .from('party_games')
        .insert({
          party_pass_id: pass.id,
          timer_seconds: 30,
          questions_per_game: questionsPerGame,
          question_ids: questionSets[0],
          game_number: 1,
          status: 'lobby',
        });
    }

    return NextResponse.json({
      message: 'Pass recovered successfully',
      pass,
      recovered: true,
    });

  } catch (error) {
    console.error('Recovery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateAllQuestionSets(numGames: number, questionsPerGame: number = 20): number[][] {
  const totalQuestions = 400;
  const totalNeeded = numGames * questionsPerGame;

  const available = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  const allIds = available.slice(0, Math.min(totalNeeded, totalQuestions));
  while (allIds.length < totalNeeded) {
    allIds.push(available[allIds.length % totalQuestions]);
  }

  const questionSets: number[][] = [];
  for (let i = 0; i < numGames; i++) {
    const start = i * questionsPerGame;
    questionSets.push(allIds.slice(start, start + questionsPerGame));
  }

  return questionSets;
}
