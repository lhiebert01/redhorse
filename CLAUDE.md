# Claude Code Guide for Red Horse Oracle

## Project Overview

Red Horse Oracle is a viral SaaS application that generates personalized AI talismans for the Year of the Fire Horse 2026. Built with Next.js 14, TypeScript, Supabase, Stripe, and Google Gemini AI.

**Live URL:** https://redhorse-omega.vercel.app/
**GitHub:** https://github.com/lhiebert01/redhorse

---

## Quick Reference

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (talismans bucket)
- **Payments:** Stripe Payment Links
- **AI:** Google Gemini 3 Pro (text + image generation)
- **Hosting:** Vercel

### Key Files
| Purpose | File Path |
|---------|-----------|
| Landing Page | `src/app/page.tsx` |
| Reveal Page | `src/app/reveal/page.tsx` |
| Stripe Webhook | `src/app/api/webhook/route.ts` |
| Admin Test API | `src/app/api/admin-test/route.ts` |
| Gemini Client | `src/lib/gemini/client.ts` |
| AI Prompts | `src/lib/gemini/prompts.ts` |
| Prophecy Generation | `src/lib/gemini/generate.ts` |
| Zodiac Calculator | `src/lib/zodiac/calculator.ts` |
| Product Modes | `src/constants/modes.ts` |

---

## Deployment & Git Workflow

### GitHub Repository
- **Repo:** `lhiebert01/redhorse`
- **Token in remote URL:** Yes (embedded in origin URL)

### Vercel Deployment

**Auto-deploy is connected to GitHub.** When pushing to `main`, Vercel should auto-deploy.

#### If Vercel Doesn't Trigger:

1. **Check repo visibility** - Vercel free tier works best with public repos
   ```bash
   # Make repo public via API
   curl -X PATCH \
     -H "Authorization: token <GITHUB_TOKEN>" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/lhiebert01/redhorse \
     -d '{"visibility":"public"}'
   ```

2. **Create empty commit to trigger deploy:**
   ```bash
   git commit --allow-empty -m "Trigger Vercel deployment" && git push origin main
   ```

3. **Manual Vercel redeploy:**
   - Go to Vercel Dashboard → Deployments
   - Click "..." → Create Deployment or Redeploy with latest commit

### Getting GitHub Token
The token is embedded in the git remote URL:
```bash
git remote -v
# Shows: https://lhiebert01:<TOKEN>@github.com/lhiebert01/redhorse.git
```

---

## Environment Variables

### Required in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://ykptxslgxlsbvpbeujfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_...
GEMINI_API_KEY=<key>
NEXT_PUBLIC_APP_URL=https://redhorse-omega.vercel.app
```

### Local Development:
Copy from `import.env` (gitignored) or create `.env.local`

---

## AI Image Generation

### Models Used (Gemini 3 Pro)
- **Text Generation:** `gemini-3-pro-preview`
- **Image Generation:** `gemini-3-pro-image-preview`

### Package
Using `@google/genai` (NOT `@google/generative-ai`)

```typescript
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Text generation
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: { responseMimeType: 'application/json' },
});

// Image generation
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',
  contents: { parts: [{ text: imagePrompt }] },
  config: { imageConfig: { aspectRatio: '9:16' } },
});
```

### Image Prompt Structure
See `src/lib/gemini/prompts.ts` for the full prompt template including:
- All 12 zodiac animals with Chinese characters
- Art style variations (randomized)
- Background element variations (randomized)
- Cultural authenticity requirements

---

## SuperAdmin Test Console

### Access
1. Click the **gear icon** (top-right corner of main page, subtle 30% opacity)
2. Navigate to `/admin-test`
3. Enter PIN: **142857**

### Features
- Generate prophecies without Stripe payment
- Select any birth date and oracle mode
- Uses same AI pipeline as paid users
- Results appear on standard reveal page

### API Endpoint
`POST /api/admin-test`
```json
{
  "pin": "142857",
  "birthDate": "03/14/1958",
  "focusMode": "wealth"
}
```

### To Hide in Production
Remove or comment out the gear icon in `src/app/page.tsx` (lines 10-35)

---

## Product Modes

| Mode | Emoji | Description |
|------|-------|-------------|
| Wealth | 🎲 | Generate 6 Lucky Numbers |
| Power | ⚔️ | Strategic 2026 Motto |
| Love | ❤️ | Relationship Decree |
| Shield | 🛡️ | Protective Mantra |

Defined in: `src/constants/modes.ts`

---

## Database Schema

### Prophecies Table
```sql
CREATE TABLE prophecies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  email TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  focus_mode TEXT NOT NULL,
  zodiac_sign TEXT,
  zodiac_element TEXT,
  fire_horse_relation TEXT,
  main_text TEXT,
  sub_text TEXT,
  full_reading TEXT,
  image_url TEXT,
  image_storage_path TEXT,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  completed_at TIMESTAMPTZ
);
```

### Storage
- **Bucket:** `talismans` (public)
- **Path:** `{prophecy_id}.png`

---

## Stripe Configuration

### Payment Link Custom Fields
1. **Date of Birth** (Text) - Key: `dob` or contains "birth"/"date"
2. **Choose Your Path** (Dropdown) - Key: `focus` or contains "path"/"mode"
   - Options: Wealth, Power, Love, Shield

### Webhook
- **URL:** `https://redhorse-omega.vercel.app/api/webhook`
- **Events:** `checkout.session.completed`
- **Redirect URL:** `https://redhorse-omega.vercel.app/reveal?session_id={CHECKOUT_SESSION_ID}`

---

## Common Tasks

### Update AI Prompts
Edit `src/lib/gemini/prompts.ts`

### Add New Zodiac Data
Edit `src/constants/zodiac-data.ts` and `src/lib/gemini/prompts.ts`

### Change Product Modes
Edit `src/constants/modes.ts`

### Modify Reveal Page Display
Edit `src/components/reveal/TalismanDisplay.tsx`

### Update Landing Page
Edit `src/app/page.tsx`

---

## Troubleshooting

### Vercel Not Deploying
1. Check if repo is public
2. Create empty commit to trigger
3. Check Vercel GitHub integration in Settings → Git

### Webhook Not Working
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check Vercel function logs for errors
3. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`

### AI Generation Failing
1. Check `GEMINI_API_KEY` is valid
2. Check Vercel function logs
3. Ensure using correct package (`@google/genai`)

### Images Not Displaying
1. Check Supabase Storage bucket is public
2. Verify `image_url` in prophecies table
3. Check Next.js image domains in `next.config.js`

---

## Reference: Neo-Storyteller Comparison

This project's Gemini implementation is modeled after `C:\src\neo-storyteller`:
- Same `@google/genai` package
- Same `gemini-3-pro-preview` and `gemini-3-pro-image-preview` models
- Similar API structure for content generation
