import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PASS_CONFIGS, PassType } from '@/types/party';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pass_type } = body as { pass_type: PassType };

    // Validate pass type
    if (!pass_type || !PASS_CONFIGS[pass_type]) {
      return NextResponse.json(
        { error: 'Invalid pass type' },
        { status: 400 }
      );
    }

    const passConfig = PASS_CONFIGS[pass_type];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Fire Horse Trivia ${passConfig.name}`,
              description: passConfig.description,
              images: ['https://redhorseoracle.com/assets/Fire-Horse-2026-Chart-v2.jpeg'],
            },
            unit_amount: passConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/party/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/party`,
      metadata: {
        product_type: 'party_pass',
        pass_type: pass_type,
        duration_hours: passConfig.durationHours.toString(),
        max_games: passConfig.maxGames.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
