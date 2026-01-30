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

      // Create party pass record
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
          settings: {
            timer_seconds: 30,
            questions_per_game: 20,
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

      console.log(`Party pass created: ${partyCode} (${passType})`);

      // Create initial game in lobby state
      const { error: gameError } = await supabase
        .from('party_games')
        .insert({
          party_pass_id: pass.id,
          timer_seconds: 30,
          questions_per_game: 20,
          question_ids: generateRandomQuestionIds(20),
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
