import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe/client';
import { PassType, generatePartyCode } from '@/types/party';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Use the same webhook secret as main webhook or create a separate one
const webhookSecret = process.env.STRIPE_PARTY_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Check if this is a party pass purchase
    if (session.metadata?.product_type !== 'party_pass') {
      // Not a party pass, let main webhook handle it
      return NextResponse.json({ received: true, skipped: true });
    }

    try {
      const passType = session.metadata.pass_type as PassType;
      const durationHours = parseInt(session.metadata.duration_hours || '24');
      const maxGames = parseInt(session.metadata.max_games || '5');

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

      if (attempts >= maxAttempts) {
        console.error('Failed to generate unique party code after max attempts');
        return NextResponse.json(
          { error: 'Failed to generate party code' },
          { status: 500 }
        );
      }

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + durationHours);

      // PRE-GENERATE ALL QUESTION SETS AT PURCHASE TIME
      // This ensures non-redundant random questions across ALL games for this pass
      const questionsPerGame = 20;
      const questionSets = generateAllQuestionSets(maxGames, questionsPerGame);

      console.log(`[PASS CREATION] Pre-generated ${maxGames} question sets for ${passType} pass`);
      console.log(`[PASS CREATION] Set 1 preview: [${questionSets[0].slice(0, 5).join(', ')}...]`);

      // Create party pass record with pre-generated question sets
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
          games_played: 0, // Track how many games have been started
          question_sets: questionSets, // Pre-generated question sets for all games
          settings: {
            timer_seconds: 30,
            questions_per_game: questionsPerGame,
          },
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create party pass:', insertError);
        return NextResponse.json(
          { error: 'Failed to create party pass' },
          { status: 500 }
        );
      }

      console.log(`Party pass created: ${partyCode} (${passType}) with ${maxGames} pre-generated question sets`);

      // Create initial game in lobby state using the FIRST pre-generated set
      const { error: gameError } = await supabase
        .from('party_games')
        .insert({
          party_pass_id: pass.id,
          timer_seconds: 30,
          questions_per_game: questionsPerGame,
          question_ids: questionSets[0], // Use first pre-generated set
          game_number: 1, // Track which game number this is
          status: 'lobby',
        });

      if (gameError) {
        console.error('Failed to create initial game:', gameError);
      }

      return NextResponse.json({
        received: true,
        party_code: partyCode,
        pass_id: pass.id,
      });
    } catch (error) {
      console.error('Party webhook error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Generate ALL question sets for a party pass at purchase time.
 * This pre-generates non-redundant random questions for ALL games upfront.
 *
 * @param numGames - Number of games (5 for Day, 10 for Weekend, 15 for Festival)
 * @param questionsPerGame - Questions per game (default 20)
 * @returns Array of question ID arrays: [[set1], [set2], ...]
 */
function generateAllQuestionSets(numGames: number, questionsPerGame: number = 20): number[][] {
  const totalQuestions = 400;
  const totalNeeded = numGames * questionsPerGame;

  // Generate all unique question IDs we'll need
  const allIds: number[] = [];
  const used = new Set<number>();

  // Use Fisher-Yates shuffle for true randomness
  const available = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  // Take the first totalNeeded IDs (or all if we need more than 400)
  allIds.push(...available.slice(0, Math.min(totalNeeded, totalQuestions)));

  // If we need more than 400 questions, cycle back through (unlikely but safe)
  while (allIds.length < totalNeeded) {
    allIds.push(available[allIds.length % totalQuestions]);
  }

  // Split into sets of questionsPerGame
  const questionSets: number[][] = [];
  for (let i = 0; i < numGames; i++) {
    const start = i * questionsPerGame;
    const set = allIds.slice(start, start + questionsPerGame);
    questionSets.push(set);
  }

  console.log(`[PASS CREATION] Generated ${numGames} question sets of ${questionsPerGame} each (${totalNeeded} total unique questions)`);

  return questionSets;
}

// Legacy function for backwards compatibility
function generateRandomQuestionIds(count: number): number[] {
  const totalQuestions = 400;
  const ids: number[] = [];
  const used = new Set<number>();

  while (ids.length < count && ids.length < totalQuestions) {
    const id = Math.floor(Math.random() * totalQuestions) + 1;
    if (!used.has(id)) {
      used.add(id);
      ids.push(id);
    }
  }

  return ids;
}
