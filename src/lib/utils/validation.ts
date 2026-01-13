import { z } from 'zod';
import { FocusMode } from '@/constants/modes';

export const birthDateSchema = z.string().refine(
  (val) => {
    // Accept various date formats
    const patterns = [
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY
    ];
    return patterns.some((p) => p.test(val)) || !isNaN(Date.parse(val));
  },
  { message: 'Invalid date format' }
);

export const focusModeSchema = z.enum(['wealth', 'power', 'love', 'shield']);

export const webhookPayloadSchema = z.object({
  email: z.string().email(),
  birthDate: z.string(),
  focusMode: focusModeSchema,
  sessionId: z.string(),
  paymentIntent: z.string().optional(),
});

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;

export function validateFocusMode(mode: string): FocusMode {
  const result = focusModeSchema.safeParse(mode.toLowerCase());
  return result.success ? result.data : 'wealth';
}
