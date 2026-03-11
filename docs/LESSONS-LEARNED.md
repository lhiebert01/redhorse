# Lessons Learned - Red Horse Oracle

This document captures important lessons learned during development, especially issues that were difficult to diagnose and their solutions.

---

## Google Analytics 4 (GA4) Integration - January 20, 2026

### The Problem

GA4 was not tracking any page visits despite:
- Correct measurement ID in code
- Scripts appearing in page HTML
- Multiple implementation approaches tried

### Root Cause

**Google's Tag System caches domain associations.** When you first create a GA4 property and data stream for a domain, Google creates a "Google Tag" that permanently links that domain to a specific Measurement ID.

In our case:
1. Original stream created: `G-EV6LX78YP1` linked to `redhorseoracle.com`
2. User deleted that stream and created new ones (`G-S90TFZBY84`, `G-L2RG9HQ5HJ`)
3. Google's tag system still routed `redhorseoracle.com` to the deleted `G-EV6LX78YP1`
4. New measurement IDs never received data because Google ignored them

### What We Tried (That Didn't Work)

1. **Next.js Script component with `afterInteractive`**
   - Scripts rendered but didn't execute properly
   - No "collect" requests in Network tab

2. **Environment variables (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)**
   - Variable was set correctly in Vercel
   - Code read it properly
   - Still no tracking

3. **Multiple new data streams**
   - Created `G-S90TFZBY84` - didn't work
   - Created `G-L2RG9HQ5HJ` - didn't work
   - Google kept associating domain with original `G-EV6LX78YP1`

4. **Raw `<script>` tags in `<head>`**
   - Scripts appeared in HTML
   - gtag.js loaded
   - Still no "collect" requests with new IDs

### The Solution

**Use the Measurement ID that Google originally associated with the domain.**

```tsx
// src/app/layout.tsx - WORKING CONFIGURATION
<head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-EV6LX78YP1"
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-EV6LX78YP1');
      `,
    }}
  />
</head>
```

### Key Lessons

#### 1. Google Tag ≠ Measurement ID
- **Google Tag:** The gtag.js system that loads scripts
- **Measurement ID:** The G-XXXXXXX identifier for a data stream
- Google caches the association between domains and tags

#### 2. Don't Delete Streams Before Creating Replacements
If you need to recreate a GA4 stream:
1. Create the new stream FIRST
2. Update your code with the new Measurement ID
3. Verify tracking works
4. THEN delete the old stream

#### 3. Hardcode Critical Third-Party IDs
Environment variables can fail silently. For critical tracking:
```tsx
// RELIABLE: Hardcoded
const GA_ID = 'G-EV6LX78YP1';

// RISKY: Environment variable
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
```

#### 4. Test with Network Tab, Not Just GA4 Realtime
- GA4 Realtime can have delays
- Network tab shows immediately if requests are being made
- Filter by "collect" or "gtag" to see tracking requests

#### 5. Raw `<script>` Tags Are More Reliable Than Next.js Script
For GA4 in Next.js App Router:
```tsx
// MORE RELIABLE: Raw script tags in <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXX" />
<script dangerouslySetInnerHTML={{ __html: `...` }} />

// LESS RELIABLE: Next.js Script component
<Script src="..." strategy="afterInteractive" />
```

#### 6. Check Google Tag Settings in GA4 Admin
If tracking doesn't work:
1. GA4 Admin → Data Streams → Your Stream
2. Look at "Google tag" section
3. Check "Configure tag settings"
4. Look for domain associations

#### 7. When All Else Fails: Create New Property
If a domain is hopelessly tangled with deleted streams:
- Create a completely NEW GA4 Property (not just a stream)
- This gives a fresh Google Tag with no cached associations

### Debugging Checklist

When GA4 isn't tracking:

- [ ] Check Network tab for "collect" requests (not just "gtag")
- [ ] Verify Measurement ID matches exactly (case-sensitive)
- [ ] Test in Incognito (bypasses ad blockers)
- [ ] Test in different browser (rules out extensions)
- [ ] Check GA4 Admin → Data Streams → Tag status
- [ ] Look for "Tag quality: Excellent" indicator
- [ ] Verify domain association in Google Tag settings
- [ ] Try hardcoding the ID instead of using env vars

### Final Configuration

| Setting | Value |
|---------|-------|
| Measurement ID | `G-EV6LX78YP1` |
| Implementation | Raw `<script>` tags in `<head>` |
| Location | `src/app/layout.tsx` |
| Env Vars | Not used (hardcoded for reliability) |

---

## Stripe Webhook Timeout - March 11, 2026

### The Problem

Stripe webhook at `https://www.redhorseoracle.com/api/webhook` had a **44% failure rate** due to timeouts. Average response time was **11.7 seconds**, max **22 seconds** — exceeding Stripe's ~20-second tolerance.

### Root Cause

The webhook handler did ALL work synchronously before returning 200 to Stripe:
1. Verify signature (~fast)
2. Idempotency check (~fast)
3. Calculate zodiac (~fast)
4. Create pending record (~fast)
5. **`generateProphecy()` — AI generation with retry (~5-15s)**
6. **`generateBrandedImage()` — image processing (~2-5s)**
7. **`generateShareableImage()` — image processing (~2-5s)**
8. **3x Supabase storage uploads (~1-3s each)**
9. Update DB record (~fast)

Steps 5-8 took **10-25 seconds total**, causing Stripe timeouts.

### The Solution

Use `waitUntil()` from `@vercel/functions` to return 200 to Stripe immediately after step 4 (creating the pending record), then do steps 5-9 in the background.

```typescript
import { waitUntil } from '@vercel/functions';

// After creating pending record:
waitUntil(generateAndSaveProphecy(prophecyId, ...params));
return NextResponse.json({ received: true, prophecy_id: prophecy.id });
```

### Key Lessons

1. **Never block Stripe webhooks with heavy processing** — Stripe expects a response within ~20 seconds. Return 200 first, process later.
2. **`waitUntil()` keeps the function alive** — On Vercel, serverless functions normally die after the response is sent. `waitUntil()` extends the lifetime up to `maxDuration`.
3. **The frontend must handle async completion** — The reveal page uses Supabase real-time subscriptions + 3-second polling + 15-second minimum loading animation. This worked perfectly without any frontend changes.
4. **Failed background work sets status to `'failed'`** — The next Stripe retry will find the failed record, delete it, and re-process. No manual intervention needed.
5. **No money was ever lost** — Stripe retries succeeded, and idempotency checks (`already_completed`, `already_processing`, `duplicate_key`) prevented double charges.

### Result

Response time: **~12s → ~1-2s**
Error rate: **44% → ~0%**

---

## Gemini Model Names - March 9-11, 2026

### The Problem

Google deprecated `gemini-3-pro-preview` (text model) on March 9, 2026. An automated fix incorrectly changed the image model to `gemini-3.1-pro-image-preview`, which does not exist.

### Key Lessons

1. **Text and image model versions are independent** — `gemini-3.1-pro-preview` (text) exists, but `gemini-3.1-pro-image-preview` does NOT
2. **Never guess model names** — Always verify at https://ai.google.dev/gemini-api/docs/models
3. **The image model was never deprecated** — `gemini-3-pro-image-preview` (Nano Banana Pro) still works
4. **Available image models (as of March 2026):**
   - `gemini-3.1-flash-image-preview` (Nano Banana 2 — fast)
   - `gemini-3-pro-image-preview` (Nano Banana Pro — best quality)
   - `gemini-2.5-flash-image` (Nano Banana — legacy)

---

## Other Lessons

### TypeScript Build Errors

See `CLAUDE.md` section "TypeScript Best Practices (Lessons Learned)" for:
- Optional chaining patterns
- Type mismatches with external APIs
- Handling Stripe/Gemini response types

### Vercel Deployment

- Auto-deploys from GitHub `main` branch
- Takes ~2 minutes to deploy
- Use `curl` to verify deployment before testing in browser
- Clear browser cache or use Incognito after deployments

### Stripe Webhook

- Webhook URL must include `www.` if domain redirects to www
- **Never block Stripe webhooks with heavy processing** — use `waitUntil()` for background work
- Always use HTTPS for production webhooks
- Idempotency checks (`already_completed`, `already_processing`, `duplicate_key`) are essential

---

*Last Updated: March 11, 2026*
