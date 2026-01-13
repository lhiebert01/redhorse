import Stripe from 'stripe';

export interface StripeCustomField {
  key: string;
  type: 'text' | 'dropdown' | 'numeric';
  text?: { value: string };
  dropdown?: { value: string };
  numeric?: { value: string };
}

export interface CheckoutSessionWithCustomFields extends Stripe.Checkout.Session {
  custom_fields?: StripeCustomField[];
}
