export interface StripeCustomField {
  key: string;
  type: 'text' | 'dropdown' | 'numeric';
  label?: { custom: string };
  text?: { value: string };
  dropdown?: { value: string };
  numeric?: { value: string };
}
