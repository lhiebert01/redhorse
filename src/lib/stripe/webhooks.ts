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
    label?: { custom: string };
    text?: { value: string };
    dropdown?: { value: string };
  }> }).custom_fields || [];

  // Log custom fields for debugging
  console.log('Custom fields received:', JSON.stringify(customFields, null, 2));

  // Find DOB field - look for keys containing 'birth', 'dob', or 'date'
  const dobField = customFields.find((f) => {
    const key = f.key.toLowerCase();
    return key.includes('birth') || key.includes('dob') || key === 'date_of_birth';
  });

  // Find focus/path field - look for keys containing 'path', 'focus', or 'choose'
  const focusField = customFields.find((f) => {
    const key = f.key.toLowerCase();
    return key.includes('path') || key.includes('focus') || key.includes('choose');
  });

  // Extract values
  const birthDate = dobField?.text?.value || 'Unknown';
  let focusMode = focusField?.dropdown?.value?.toLowerCase() || 'wealth';

  // Normalize focus mode value
  if (focusMode.includes('wealth')) focusMode = 'wealth';
  else if (focusMode.includes('power')) focusMode = 'power';
  else if (focusMode.includes('love')) focusMode = 'love';
  else if (focusMode.includes('shield')) focusMode = 'shield';
  else focusMode = 'wealth'; // default

  console.log(`Extracted - DOB: ${birthDate}, Focus: ${focusMode}`);

  return { birthDate, focusMode };
}
