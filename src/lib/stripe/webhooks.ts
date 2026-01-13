import Stripe from 'stripe';
import { stripe } from './client';

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
}

export function extractCustomFields(session: Stripe.Checkout.Session): {
  birthDate: string;
  focusMode: string;
} {
  const customFields = (session as { custom_fields?: Array<{
    key: string;
    text?: { value: string };
    dropdown?: { value: string };
  }> }).custom_fields || [];

  const dobField = customFields.find((f) => f.key === 'dob');
  const focusField = customFields.find((f) => f.key === 'focus');

  return {
    birthDate: dobField?.text?.value || 'Unknown',
    focusMode: focusField?.dropdown?.value?.toLowerCase() || 'wealth',
  };
}
