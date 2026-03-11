# Red Horse Oracle — Stripe Webhook Timeout Fix

**Created:** March 11, 2026
**Priority:** Medium (no money lost, but 44% first-attempt failure rate)
**Status:** TODO

## Problem

Stripe webhook at `https://www.redhorseoracle.com/api/webhook` has a **44% failure rate** due to timeouts.

- Stripe expects a response within ~20 seconds
- Average response time: **11,724ms** (nearly 12 seconds)
- Max response time: **21,990ms** (22 seconds — exceeds Stripe's tolerance)
- Stripe retries failed deliveries and they succeed on retry
- Idempotency check (`already_completed`) is working correctly — no double charges
- **No money is being lost**, but half of first attempts fail

## Root Cause

The webhook handler at `src/app/api/webhook/route.ts` does ALL of this synchronously before returning 200 to Stripe:

1. Verify signature (~fast)
2. Idempotency check (~fast)
3. Calculate zodiac (~fast)
4. Count editions in DB (~fast)
5. Insert pending record (~fast)
6. **`generateProphecy()` — AI generation with retry logic (~5-15 seconds)**
7. **`generateBrandedImage()` — image processing (~2-5 seconds)**
8. **`generateShareableImage()` — image processing (~2-5 seconds)**
9. **3x Supabase storage uploads (~1-3 seconds each)**
10. Update DB record (~fast)
11. Analytics tracking (~fast)

Steps 6-9 take **10-25 seconds total**, causing Stripe timeouts.

## The Fix

**Return 200 to Stripe immediately after creating the pending record (step 5), then do the heavy work asynchronously.**

### Option A: Background Processing with `waitUntil()` (Recommended for Vercel/Next.js)

Vercel supports `waitUntil()` to continue processing after sending a response:

```typescript
// src/app/api/webhook/route.ts

import { after } from 'next/server';  // Next.js 15+
// OR for older Next.js:
// import { waitUntil } from '@vercel/functions';

export async function POST(request: Request) {
  // ... signature verification (unchanged) ...
  // ... idempotency check (unchanged) ...
  // ... zodiac calculation (unchanged) ...
  // ... create pending record (unchanged) ...

  // IMMEDIATELY return 200 to Stripe
  // Then process prophecy in background
  after(async () => {
    try {
      await generateAndSaveProphecy(prophecy.id, session, zodiac, focusMode, editionNumber, totalEditions);
    } catch (error) {
      console.error('Background prophecy generation failed:', error);
      await supabase
        .from('prophecies')
        .update({ status: 'failed', error_message: error.message })
        .eq('id', prophecy.id);
    }
  });

  return NextResponse.json({ received: true, prophecy_id: prophecy.id });
}

// Extract heavy work into separate function
async function generateAndSaveProphecy(prophecyId, session, zodiac, focusMode, editionNumber, totalEditions) {
  const supabase = createAdminClient();

  // Steps 6-10 go here (generateProphecy, images, uploads, DB update)
  // ... all the existing code from line 132 onwards ...
}
```

### Option B: Simple `Promise` Fire-and-Forget (If `after()` not available)

```typescript
// After creating pending record, fire and forget:
processInBackground(prophecy.id, session, zodiac, focusMode, editionNumber, totalEditions)
  .catch(err => console.error('Background processing failed:', err));

// Return immediately
return NextResponse.json({ received: true, prophecy_id: prophecy.id });
```

**Warning:** On serverless platforms, the function may be killed before background work completes. Option A is safer.

### Option C: Queue-Based (Most Robust, More Complex)

Use Vercel KV, Supabase Edge Functions, or a message queue to process prophecies asynchronously. Overkill for current scale but most reliable.

## Key File

- **`src/app/api/webhook/route.ts`** — lines 132-328 need to be extracted into a background task

## Current Behavior (Working but Slow)

```
Stripe sends webhook → Handler does ALL work (10-25s) → Returns 200
                        ↑ Often exceeds Stripe timeout
                        → Stripe retries → Idempotency catches it → Returns 200 (skipped)
```

## Target Behavior (Fast)

```
Stripe sends webhook → Create pending record → Return 200 immediately (~1-2s)
                        ↓
                        Background: AI generation → Image processing → Upload → Update DB
```

## Testing

1. After implementing the fix, deploy to Vercel
2. Go to Stripe Dashboard → Webhooks → Red Horse endpoint → Send test webhook
3. Verify response time drops from ~12s to ~1-2s
4. Verify prophecy still generates correctly (check Supabase `prophecies` table)
5. Monitor the endpoint for a few days — error rate should drop from 44% to ~0%

## Notes

- The `maxDuration = 60` on line 16 is already set, which is good for the background processing
- The idempotency check is solid — even if the fix isn't perfect, no money will be lost
- The `reveal` page likely polls for `status: 'completed'` — verify this still works with async processing
- Party pass purchases (line 352+) are fast and don't need this fix
