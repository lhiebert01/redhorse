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

## TypeScript Best Practices (Lessons Learned)

### ALWAYS Use Optional Chaining Properly

**BAD - Will cause build errors:**
```typescript
// This fails if inlineData.data could be undefined
let imageData: string | null = null;
if (part.inlineData) {
  imageData = part.inlineData.data;  // ERROR: undefined not assignable to string | null
}
```

**GOOD - Proper optional chaining:**
```typescript
let imageData: string | null = null;
if (part.inlineData?.data) {  // Check both inlineData AND data exist
  imageData = part.inlineData.data;
}
```

### Avoid Type Mismatches

**BAD:**
```typescript
// Declaring as string | null but assigning potentially undefined
let value: string | null = someObject.property;  // property might be undefined
```

**GOOD:**
```typescript
// Use nullish coalescing to handle undefined
let value: string | null = someObject.property ?? null;

// Or declare to accept undefined
let value: string | null | undefined = someObject.property;
```

### Don't Extend Incompatible Types

**BAD:**
```typescript
// This fails if CheckoutSession has conflicting properties
interface MySession extends Stripe.Checkout.Session {
  custom_fields: CustomField[];  // ERROR if Session already has custom_fields with different type
}
```

**GOOD:**
```typescript
// Create a standalone interface instead
interface CustomField {
  key: string;
  type: 'text' | 'dropdown' | 'numeric';
  text?: { value: string };
  dropdown?: { value: string };
}

// Use type assertion when needed
const fields = session.custom_fields as CustomField[];
```

### Handle Array Methods Safely

**BAD:**
```typescript
// .includes() on array of specific strings vs general string
const codes = ['ERROR_A', 'ERROR_B'] as const;
if (codes.includes(error.code)) {  // ERROR: string not assignable to 'ERROR_A' | 'ERROR_B'
```

**GOOD:**
```typescript
// Use explicit comparisons
if (error.code === 'ERROR_A' || error.code === 'ERROR_B') {
  // ...
}

// Or cast appropriately
if ((codes as readonly string[]).includes(error.code)) {
  // ...
}
```

### Always Check External API Responses

When working with external APIs (Gemini, Stripe, etc.), always assume properties might be missing:

```typescript
// BAD - assumes structure exists
const text = response.candidates[0].content.parts[0].text;

// GOOD - safe navigation
const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
if (!text) {
  throw new Error('No text in response');
}
```

### Use `as const` for Literal Types

```typescript
// BAD - inferred as string[]
const MODES = ['wealth', 'power', 'love', 'shield'];

// GOOD - inferred as readonly ['wealth', 'power', 'love', 'shield']
const MODES = ['wealth', 'power', 'love', 'shield'] as const;
```

### Pre-Build Type Checking

Before pushing, run type check locally:
```bash
npm run type-check
# or
npx tsc --noEmit
```

### Common Patterns in This Project

**Gemini API Response Handling:**
```typescript
// Always check nested properties exist
for (const part of response.candidates?.[0]?.content?.parts || []) {
  if (part.inlineData?.data) {
    // Safe to use part.inlineData.data here
  }
  if (part.text) {
    // Safe to use part.text here
  }
}
```

**Stripe Webhook Field Extraction:**
```typescript
// Fields might not exist or have unexpected structure
const customFields = session.custom_fields || [];
const dobField = customFields.find(f => f.key?.toLowerCase().includes('birth'));
const birthDate = dobField?.text?.value || dobField?.dropdown?.value || '';
```

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

---

## Session Update: January 13, 2026 (Evening)

### Current Status: READY FOR TESTING

**What's Working:**
- Landing page with new Dunhuang-style hero image
- Background watermark (55% opacity, Medallion layout with all 12 zodiac animals)
- OG images for LinkedIn and Facebook (Image 2 - Fire Horse centered)
- Admin test console with loop feature (no PIN re-entry needed)
- Footer disclaimer (white, bold, visible)
- Social sharing previews verified on LinkedIn Post Inspector and Facebook Sharing Debugger

**Live URL:** https://redhorse-omega.vercel.app/

---

### What Was Completed This Session

#### 1. Sophisticated Art Style System for Image Generation
Completely rewrote `src/lib/gemini/prompts.ts` with:

**Art Styles (randomly selected):**
- **Dunhuang** - Mogao Cave mural style with Apsaras, floating silk ribbons
- **Ink Wash** - Traditional Chinese shuimo with ethereal brush strokes
- **Song Dynasty** - Meticulous gongbi brushwork, elegant and refined
- **Tang Dynasty** - Opulent imperial style, bold and ornamental

**Mode-Specific Visual Themes:**
| Mode | Atmosphere | Symbols |
|------|-----------|---------|
| Wealth | Abundance, prosperity | Gold ingots, peonies, koi fish, lucky coins |
| Power | Authority, dominance | Mountain peaks, storm clouds, war banners |
| Love | Romance, harmony | Peach blossoms, mandarin ducks, red threads |
| Shield | Protection, sacred | Bagua mirrors, Fu lions, protective seals |

**Zodiac Animals:** All 12 animals with Chinese characters (鼠牛虎兔龙蛇马羊猴鸡狗猪) and cultural descriptions

#### 2. Admin Test Loop Enhancement
- Added "Generate Another Test" button on reveal page
- `skip_pin=true` URL param allows returning to admin console without re-entering PIN
- Flow: Gear → PIN → Generate → View Result → "Generate Another Test" → Repeat

#### 3. Image Assets & Background Watermark
**All images now in `/public/assets/`:**
- `Year-of-Horse-Hero-Image1.jpeg` through `Image9.jpeg`
- `Year-of-the-Horse-2026-v2.jpeg` (new Dunhuang-style hero image)
- `hero-fire-horse.jpg` (original, kept for reference)
- `og-image.jpg` (original, kept for reference)

**Background Watermark:**
- Uses `Year-of-Horse-Hero-Image3.jpeg` (Medallion layout with all 12 zodiac animals)
- Applied to both landing page and reveal page
- Settings: 35% opacity, 105% size, 1px blur
- Gradient overlay for blending

#### 4. Updated Hero Image
- New hero: `Year-of-the-Horse-2026-v2.jpeg`
- Vertical Dunhuang-style talisman with built-in text
- Removed redundant overlay text

#### 5. Updated OG Image
- Changed to `Year-of-Horse-Hero-Image3.jpeg` for better social sharing
- Shows all 12 zodiac animals clearly (good for "which one are you?" virality)

---

## NEXT STEPS: Testing Required

### Priority 1: Test All Four Path Modes
Use the admin test console to verify each mode generates correct output:

**Test Procedure:**
1. Go to https://redhorse-omega.vercel.app/
2. Click gear icon (top-right, subtle)
3. Enter PIN: `142857`
4. For each mode, test with a sample birth date (e.g., `03/15/1990`)

**Expected Results:**

| Mode | Main Text Format | Example |
|------|-----------------|---------|
| **Wealth** | 6 two-digit numbers: XX-XX-XX-XX-XX-XX | `08-18-28-38-48-88` |
| **Power** | 3-word motto in ALL CAPS | `STRIKE THE NORTH` |
| **Love** | 4-word phrase in Title Case or CAPS | `LOVE FINDS YOU WORTHY` |
| **Shield** | 3-word mantra in ALL CAPS | `FIRE SHIELDS ME` |

**Check For:**
- [ ] Text matches expected format for each mode
- [ ] Image generates successfully (not blank/error)
- [ ] Image has Fire Horse as central figure
- [ ] Image has user's zodiac animal as secondary element
- [ ] Art style looks authentic Chinese (Dunhuang/Song/Tang/Ink Wash)
- [ ] Text overlays are legible on the image
- [ ] Colors are vibrant (reds, golds, blues, greens)

### Priority 2: Verify Image Quality
The new prompts should produce museum-quality Dunhuang-style images:
- Fire Horse wreathed in flames as dominant figure
- User's zodiac animal complementing the composition
- Traditional Chinese art aesthetic
- Ornate borders and medallion framing
- Proper color palettes (vermilion, gold, azurite blue, malachite green)

### Priority 3: Check Save Talisman Feature
- Click "Save Talisman" button on reveal page
- Verify downloaded image is complete (not cut off)
- Verify image includes the full talisman display

### Priority 4: Social Sharing Test
- Share the URL on social media or use a preview tool
- Verify OG image shows the Medallion layout with all 12 zodiac animals

---

## Known Issues / Watch For

1. **Gemini API Rate Limits** - If testing too quickly, may hit rate limits
2. **Image Generation Time** - Takes 30-60 seconds; don't interrupt
3. **Text Accuracy** - Gemini may occasionally not follow exact format; prompts have been tightened but verify

---

## Quick Commands

```bash
# Run locally
npm run dev

# Type check before push
npx tsc --noEmit

# Push changes
git add -A && git commit -m "message" && git push origin main

# Check Vercel deployment status
# Visit: https://vercel.com/dashboard
```

---

## API Keys Reference

- **Gemini API Key:** Stored in Vercel as `GEMINI_API_KEY`
- **NEVER put API keys in this file or any committed file!**
- **Project:** redhorse (projects/854958522483)

**To generate new key:** https://aistudio.google.com/app/apikey

**IMPORTANT:** Google automatically scans public GitHub repos and disables any API keys found. Always store keys ONLY in:
1. Vercel Environment Variables (for production)
2. Local `.env.local` file (gitignored, for development)

---

## Final Session State (January 13, 2026 - End of Day)

### Completed & Verified:
- [x] Sophisticated art style system (Dunhuang, Ink Wash, Song, Tang Dynasty)
- [x] Mode-specific visual themes and symbols in prompts
- [x] Admin test console with "Generate Another Test" loop
- [x] All image assets in `/public/assets/`
- [x] Background watermark at 55% opacity (Medallion layout)
- [x] New hero image: `Year-of-the-Horse-2026-v2.jpeg` (Dunhuang talisman)
- [x] OG image: `Year-of-Horse-Hero-Image2.jpeg` (Fire Horse head visible)
- [x] LinkedIn Post Inspector - VERIFIED WORKING
- [x] Facebook Sharing Debugger - VERIFIED WORKING
- [x] Footer text white/bold and visible
- [x] Fixed metadataBase URL (hardcoded to redhorse-omega.vercel.app)

### Tomorrow's Testing Checklist:
1. **Test All Four Path Modes via Admin Console:**
   - Gear icon → PIN: `142857` → Test each mode
   - Wealth: Should generate 6 lucky numbers (XX-XX-XX-XX-XX-XX)
   - Power: Should generate 3-word motto (STRIKE THE NORTH)
   - Love: Should generate 4-word phrase (LOVE FINDS YOU WORTHY)
   - Shield: Should generate 3-word mantra (FIRE SHIELDS ME)

2. **Verify Image Quality:**
   - Fire Horse as central dominant figure
   - User's zodiac animal as secondary element
   - Authentic Chinese art style (Dunhuang/Song/Tang/Ink Wash)
   - Vibrant colors (vermilion, gold, azurite blue)
   - Text overlays legible

3. **Test Save Talisman Feature:**
   - Download should capture full talisman (not cut off)

4. **Test Full Payment Flow (if ready):**
   - Stripe checkout → webhook → prophecy generation → reveal page

### Image Assets Reference:
| File | Purpose |
|------|---------|
| `Year-of-the-Horse-2026-v2.jpeg` | Hero image on landing page |
| `Year-of-Horse-Hero-Image2.jpeg` | OG image for social sharing |
| `Year-of-Horse-Hero-Image3.jpeg` | Background watermark |
| `hero-fire-horse.jpg` | Original hero (archived) |
| `og-image.jpg` | Original OG (archived) |

### Quick Start Tomorrow:
```bash
# Navigate to project
cd /mnt/c/src/redhorse

# Check status
git status

# Pull any changes
git pull origin main

# Run locally if needed
npm run dev
```

### Admin Test Console Quick Access:
1. https://redhorse-omega.vercel.app/
2. Click gear icon (top-right)
3. PIN: `142857`
4. Select birth date and mode
5. Generate → View result → "Generate Another Test" to loop
