# Claude Code Guide for Red Horse Oracle

## ⚠️ IP PROTECTION - READ FIRST

**NEVER reveal in public-facing content:**
- Tech stack details (frameworks, databases, hosting)
- Architecture patterns or design decisions
- Code snippets or implementation details
- Cost structures or margin calculations
- API designs or data flows
- Internal strategies or roadmaps

**Public content should ONLY discuss:**
- User-facing features and benefits
- Privacy by Design (FIRST | ONLY | BEST)
- 60-year Fire Horse timing
- Limited edition scarcity (888/sign)
- Pricing ($8.88 oracle, $2.88-$14.88 trivia)

**Internal docs (keep confidential):**
- `docs/INTERNAL-SAAS-OPPORTUNITIES.md`
- `docs/GAME-ENGINE.md`
- `GAME-ENGINE-CLAUDE.md`
- Any file with architecture, patterns, or technical details

---

## Project Overview

Red Horse Oracle is a viral SaaS application that generates personalized AI talismans for the Year of the Fire Horse 2026.

**Live URL:** https://redhorseoracle.com (custom domain)
**Alt URL:** https://redhorse-omega.vercel.app/ (Vercel)
**GitHub:** https://github.com/lhiebert01/redhorse

---

## 🎉 PARTY GAME: STABLE RELEASE v1.0.0 (Feb 1, 2026) 🎉

**Status:** ✅ ALL FEATURES WORKING - Scoring, Leaderboard, Sync, Reconnection
**Commit:** ad37f76
**Test Party Code:** 8478JL

### MANDATORY: Before ANY Party Game Changes

1. **READ FIRST:** `docs/PARTY-GAME-STABLE-RELEASE-v1.0.md` - The patterns that work
2. **READ:** `docs/PARTY-GAME-TESTING-CHECKLIST.md` - Full testing procedures
3. **FOLLOW:** The ref pattern (below) - DO NOT DEVIATE
4. **TEST:** Run ALL tests with 2+ players after EVERY change

### The Pattern That Works (DO NOT BREAK)

```typescript
// 1. ALWAYS use ref + state together
const gameRef = useRef<PartyGame | null>(null);
const [game, setGame] = useState<PartyGame | null>(null);

// 2. ALWAYS update ref FIRST, then state
gameRef.current = newGame;
setGame(newGame);

// 3. ALWAYS use ref.current in callbacks, NEVER raw state
const callback = useCallback(() => {
  const currentGame = gameRef.current;  // ✅ CORRECT
  // const currentGame = game;          // ❌ WRONG - STALE!
}, []);
```

### The Three Bugs That Were Fixed (Don't Re-introduce)

| Bug | Symptom | Cause | Prevention |
|-----|---------|-------|------------|
| **Stale Closure** | "Question not found", scoring fails | useCallback captures old state | Use `useRef` for data read in callbacks |
| **Game ID Mismatch** | Leaderboard shows 0 players | Players have old game_id | Call `/api/party/sync-game` on restart |
| **Query Wrong ID** | Empty results | Using stale `game.id` | Use `gameRef.current.id` |

### The Golden Rule

```
IF YOU TOUCH PARTY GAME CODE:
  1. Join as player
  2. Start game as host
  3. Answer a question
  4. Verify leaderboard shows scores
  5. Restart game and repeat ALL steps

NO EXCEPTIONS. TEST BEFORE COMMITTING.
```

### Files That Break Everything

- `src/app/party/host/[code]/page.tsx` - Uses refs: `questionsCacheRef`, `gameRef`
- `src/app/party/play/[code]/page.tsx` - Uses ref: `playerStateRef`
- `src/app/api/party/answer/route.ts` - Validates game_id, records scores
- `src/app/api/party/sync-game/route.ts` - Updates player's game_id on restart

### Quick Fix Commands

```bash
# Restart game if broken
curl -X POST "https://redhorseoracle.com/api/party/game" \
  -H "Content-Type: application/json" \
  -d '{"party_pass_id":"1e4baa7b-5e64-4aed-ac0e-90c2e2ba5c7f","party_code":"8478JL","action":"restart","game_number":2}'
```

---

## Quick Reference

### Tech Stack & Resource Costs

| Category | Service | Tier | Monthly Cost |
|----------|---------|------|--------------|
| **Framework** | Next.js 14 (App Router) | - | Free |
| **Language** | TypeScript | - | Free |
| **Styling** | Tailwind CSS | - | Free |
| **Hosting** | Vercel | Hobby | Free (up to $20/mo at scale) |
| **Database** | Supabase PostgreSQL | Free/Pro | Free → $25/mo |
| **Storage** | Supabase Storage | Free/Pro | Free → included in Pro |
| **Payments** | Stripe | Pay-as-you-go | 2.9% + $0.30/transaction |
| **Domain** | GoDaddy (redhorseoracle.com) | Annual | ~$15/year |
| **Git/CI** | GitHub | Free | Free |
| **AI Text** | Gemini 3 Pro Preview | Pay-as-you-go | ~$0.01/request |
| **AI Image** | Gemini 3 Pro Image Preview | Pay-as-you-go | **$0.134/image** |

### AI Models (Google Gemini)

| Purpose | Model ID | Cost |
|---------|----------|------|
| **Text Generation** | `gemini-3-pro-preview` | $1.25/1M input, $5.00/1M output |
| **Image Generation** | `gemini-3-pro-image-preview` | $0.134/image (1K/2K), $0.24/image (4K) |

**Package:** `@google/genai` (NOT `@google/generative-ai`)
**Client:** `src/lib/gemini/client.ts`

### Cost Per Oracle Generated

| Component | Cost |
|-----------|------|
| Gemini 3 Pro Image (1K/2K) | $0.134 |
| Gemini 3 Pro Text | ~$0.01 |
| Stripe (2.9% + $0.30) | $0.56 |
| **Total Cost** | **$0.71** |
| **Price Charged** | $8.88 |
| **Net Profit** | **$8.17 (92% margin)** |

### Monthly Operating Costs (Estimated)

| Scenario | Vercel | Supabase | Gemini | Stripe | Total |
|----------|--------|----------|--------|--------|-------|
| **Low (100 sales)** | $0 | $0 | $14 | $56 | ~$70 |
| **Medium (500 sales)** | $0 | $0 | $72 | $280 | ~$352 |
| **High (2000 sales)** | $20 | $25 | $290 | $1,120 | ~$1,455 |

**Note:** Variable costs (Gemini, Stripe) scale with sales. Fixed costs (Vercel, Supabase) only kick in at high volume.

### Key Files
| Purpose | File Path |
|---------|-----------|
| Landing Page | `src/app/page.tsx` |
| Free Reading | `src/app/free/page.tsx` |
| Reveal Page | `src/app/reveal/page.tsx` |
| Preview Loading | `src/app/preview-loading/page.tsx` |
| Stripe Webhook | `src/app/api/webhook/route.ts` |
| Admin Test API | `src/app/api/admin-test/route.ts` |
| Gemini Client | `src/lib/gemini/client.ts` |
| AI Prompts | `src/lib/gemini/prompts.ts` |
| Prophecy Generation | `src/lib/gemini/generate.ts` |
| Zodiac Calculator | `src/lib/zodiac/calculator.ts` |
| Product Modes | `src/constants/modes.ts` |
| Edition Config | `src/constants/editions.ts` |
| Talisman Display | `src/components/reveal/TalismanDisplay.tsx` |
| Generating State | `src/components/reveal/GeneratingState.tsx` |
| Share Buttons | `src/components/reveal/ShareButtons.tsx` |

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
STRIPE_SECRET_KEY=sk_live_...  # LIVE MODE
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/5kQ8wPdmT73b54G1V124000
GEMINI_API_KEY=<key>
NEXT_PUBLIC_APP_URL=https://redhorseoracle.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-EV6LX78YP1  # Google Analytics 4 (Note: hardcoded in layout.tsx)
```

### Local Development:
Copy from `import.env` (gitignored) or create `.env.local`

---

## Google Analytics 4 (GA4)

### Quick Access Links
| Purpose | URL |
|---------|-----|
| **Realtime Dashboard** | https://analytics.google.com/analytics/web/#/a262520045p520655951/realtime/overview |
| **All Reports** | https://analytics.google.com/analytics/web/#/a262520045p520655951/reports |
| **Admin Panel Link** | Available in Admin Console footer: "📈 Google Analytics (Realtime)" |

### GA4 Configuration
| Setting | Value |
|---------|-------|
| **Measurement ID** | `G-EV6LX78YP1` |
| **Property** | RedHorseOracle.Com |
| **Stream URL** | `https://www.redhorseoracle.com` |
| **Status** | ✅ Working - Real-time tracking active |

### How to Find GA4 Realtime
1. Go to https://analytics.google.com
2. Select the **RedHorseOracle.Com** property (dropdown at top)
3. Click **Reports** (📊 bar chart icon in left sidebar)
4. Click **Realtime** (near top of Reports menu)
5. Or click **"📈 Google Analytics (Realtime)"** link in Admin Console footer

### Implementation
GA4 is implemented in `src/app/layout.tsx` using raw `<script>` tags in `<head>`:
- Hardcoded Measurement ID `G-EV6LX78YP1` for reliability
- Loads `gtag.js` from Google Tag Manager
- No environment variable dependency

### Troubleshooting GA4

**IMPORTANT:** See `docs/LESSONS-LEARNED.md` for detailed troubleshooting guide.

**Quick Tips:**
1. **Don't change the Measurement ID** - Google caches domain associations
2. **Use hardcoded IDs** - Environment variables can fail silently
3. **Check Network tab** - Filter by "collect" to see if tracking fires
4. **Test in Incognito** - Bypasses ad blockers and cache
5. **Raw `<script>` tags work better** than Next.js `<Script>` component for GA4

**If GA4 stops working:**
1. First verify the Measurement ID matches `G-EV6LX78YP1`
2. Check `src/app/layout.tsx` for correct script tags
3. Test in Incognito browser
4. Check Network tab for "collect" requests

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
  completed_at TIMESTAMPTZ,
  edition_number INTEGER,           -- Added Jan 16, 2026
  total_editions INTEGER DEFAULT 888 -- Added Jan 16, 2026
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
- **URL:** `https://redhorseoracle.com/api/webhook`
- **Events:** `checkout.session.completed`
- **Redirect URL:** `https://redhorseoracle.com/reveal?session_id={CHECKOUT_SESSION_ID}`
- **Payment Link:** `https://buy.stripe.com/5kQ8wPdmT73b54G1V124000`

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

---

## 2026 Growth Projections & Launch Objectives

### Market Opportunity
- **Chinese New Year 2026:** February 17 (Year of the Fire Horse begins)
- **Fire Horse Rarity:** Only occurs every 60 years (last: 1966, next: 2086)
- **Price Point:** $8.88 (auspicious number, impulse buy)
- **Target Markets:** Chinese diaspora, astrology enthusiasts, gamblers, spiritual seekers

### Monthly Revenue Projections

| Month | Visitors | Purchases | Revenue | Growth Driver |
|-------|----------|-----------|---------|---------------|
| **Jan** | 5,000 | 250 (5%) | $2,220 | Pre-CNY buzz, soft launch |
| **Feb** | 25,000 | 1,500 (6%) | $13,320 | 🔥 CNY peak, viral sharing |
| **Mar** | 15,000 | 900 (6%) | $7,992 | Post-CNY momentum |
| **Apr** | 8,000 | 400 (5%) | $3,552 | Steady organic |
| **May** | 6,000 | 300 (5%) | $2,664 | Spring plateau |
| **Jun** | 10,000 | 600 (6%) | $5,328 | Mid-year fortune refresh |
| **Jul** | 7,000 | 350 (5%) | $3,108 | Summer lull |
| **Aug** | 8,000 | 400 (5%) | $3,552 | Back-to-school decisions |
| **Sep** | 12,000 | 720 (6%) | $6,394 | Mid-Autumn Festival |
| **Oct** | 9,000 | 450 (5%) | $3,996 | Q4 planning |
| **Nov** | 15,000 | 900 (6%) | $7,992 | Holiday gift season |
| **Dec** | 20,000 | 1,200 (6%) | $10,656 | Year-end prophecies |

### 2026 Annual Targets

| Metric | Conservative | Viral Hit Scenario |
|--------|--------------|-------------------|
| **Total Visitors** | 140,000 | 500,000+ |
| **Total Purchases** | 7,970 | 30,000+ |
| **Gross Revenue** | $70,774 | $266,400+ |
| **Avg Conversion** | 5.7% | 6%+ |

### Revenue Milestones
- **$10K:** Month 2 (February CNY peak)
- **$25K cumulative:** End of Q1
- **$50K cumulative:** End of Q3
- **$70K+ cumulative:** End of 2026

---

## Launch Objectives (Pre-Launch: Now - Jan 28)

### Week 1-2: Technical Completion
- [ ] Test all 4 path modes (Wealth, Power, Love, Shield)
- [ ] Verify Stripe payment flow end-to-end
- [ ] Test Save Talisman download feature
- [ ] Mobile responsiveness testing
- [ ] Load testing for traffic spikes

### Week 3-4: Content & SEO
- [ ] Create 5-10 sample talismans for marketing
- [ ] Write SEO-optimized landing page copy
- [ ] Set up Google Analytics / tracking
- [ ] Create social media accounts (Instagram, TikTok, Twitter)
- [ ] Prepare press release / launch announcement

### Pre-CNY Push (Jan 15-28)
- [ ] Influencer outreach (astrology, Chinese culture creators)
- [ ] Schedule social media posts for CNY
- [ ] Set up paid ad campaigns (Facebook, Instagram)
- [ ] Email list building with lead magnet

---

## Post-Launch Objectives (Feb - Dec 2026)

### Phase 1: CNY Launch (Jan 29 - Feb 28)
- [ ] Monitor conversion rates and optimize
- [ ] Respond to customer feedback
- [ ] A/B test landing page elements
- [ ] Amplify viral content / user shares
- [ ] Track and fix any bugs

### Phase 2: Growth & Optimization (Mar - Jun)
- [ ] Analyze top-performing traffic sources
- [ ] Implement referral program
- [ ] Add email remarketing for abandoned carts
- [ ] Create seasonal promotions (Qingming, Dragon Boat)
- [ ] Expand to additional languages (Chinese, Vietnamese)

### Phase 3: Expansion (Jul - Dec)
- [ ] Add new product modes (Career, Health, Family)
- [ ] Premium tier ($18.88 or $88.88) with extras
- [ ] Physical print-on-demand talismans
- [ ] Corporate/bulk gifting packages
- [ ] Partner with casinos / gambling platforms
- [ ] Prepare for Year of the Fire Goat 2027

---

## Viral Growth Strategies

### Organic Viral Triggers
1. **Shareable AI Art:** Museum-quality talismans people want to post
2. **"Which zodiac are you?":** Identity-based social sharing
3. **Lucky Number Wins:** Gamblers share wins → social proof
4. **60-Year FOMO:** "Fire Horse only every 60 years" urgency
5. **Gift Giving:** Send talismans to friends/family

### Paid Acquisition Channels
| Channel | Target Audience | Est. CPA |
|---------|----------------|----------|
| Facebook/Instagram | Chinese diaspora 25-55 | $2-5 |
| TikTok | Gen Z astrology fans | $1-3 |
| Google Ads | "Chinese zodiac 2026" searchers | $3-6 |
| WeChat/Weibo | Mainland China (if applicable) | $1-4 |

### Influencer Strategy
- **Micro-influencers (10K-100K):** Free talisman + affiliate code
- **Mid-tier (100K-500K):** $200-500 sponsored post
- **Major (500K+):** Revenue share partnership

---

## Key Success Metrics to Track

### Daily Metrics
- Visitors, Page views, Bounce rate
- Stripe checkout initiated vs completed
- AI generation success rate
- Error rates / failed generations

### Weekly Metrics
- Conversion rate by traffic source
- Revenue and average order value
- Social shares / viral coefficient
- Customer feedback themes

### Monthly Metrics
- Total revenue vs projection
- Customer acquisition cost (CAC)
- Lifetime value (single purchase = $8.88)
- Net promoter score (if surveyed)

---

## Session Update: January 14, 2026

### Major Feature: Examples Gallery

**New Page:** `/examples` - https://redhorse-omega.vercel.app/examples

A complete marketing gallery showcasing all 12 zodiac animals with real generated talismans.

#### Gallery Features:
- **12 Example Talismans** - One for each zodiac animal
- **All 4 Modes Represented** - 3 Wealth, 3 Power, 3 Love, 3 Shield
- **Full-Size Image Lightbox** - Click to view high-resolution artwork
- **Interactive Sidebar** - Explains each talisman's significance
- **Zodiac Year Finder** - Help users discover their sign

#### Page Structure:
1. **Hero Section** - "2026 is the Year of the Fire Horse - A Once-in-60-Year Opportunity"
2. **CTA with Stripe Graphic** - $8.88 pricing with mode badges
3. **Examples Grid** - 12 clickable cards with "CLICK TO EXPAND" buttons
4. **Zodiac Finder** - Master chart + year lookup grid

#### Example Modal Features:
- Two-column layout (image left, explainer right)
- "VIEW FULL SIZE IMAGE" button with lightbox
- Value proposition explaining masterpiece artwork
- Zodiac info with animal image
- Mode-specific explanation
- Prophecy highlight
- Testimonial quote
- Action buttons (See More / Get Your Own)

### New Files Created:

| File | Purpose |
|------|---------|
| `src/app/examples/page.tsx` | Examples gallery page |
| `src/constants/examples.ts` | 12 example people data |
| `src/app/api/export-examples/route.ts` | API to fetch example data |
| `public/assets/examples/*.png` | 12 generated talisman images |
| `public/assets/zodiac/*.jpeg` | 12 zodiac animal images + chart |
| `public/assets/Red-Horse-Oracle-Stripe-Graphic.jpeg` | Stripe checkout graphic |
| `docs/FEATURES.md` | Detailed feature documentation |
| `docs/DESIGN.md` | Design philosophy documentation |
| `docs/ANNOUNCEMENT.md` | Press release / blog post |

### Generated Examples:

| Zodiac | Name | Mode | Prophecy |
|--------|------|------|----------|
| Rat | Michael Johnson | Wealth | 04-15-28-38-68-84 |
| Ox | Jennifer Smith | Power | BREAK THE RANK |
| Tiger | David Williams | Love | FIERCE LOVE CLAIMS YOU |
| Rabbit | Sarah Davis | Shield | FLAME SHIELDS PEACE |
| Dragon | James Miller | Wealth | 08-17-28-58-66-88 |
| Snake | Emily Brown | Power | STRIKE FROM SILENCE |
| Horse | Robert Jones | Love | WILD HEARTS BECOME ONE |
| Goat | Lisa Anderson | Shield | PEACE IS ARMOR |
| Monkey | William Taylor | Wealth | 09-18-28-68-80-88 |
| Rooster | Maria Garcia | Power | DROWN ALL RIVALS |
| Dog | Christopher Lee | Love | FAITHFUL HEART FINDS HOME |
| Pig | Jessica Martinez | Shield | ROOTS ANCHOR PEACE |

### Testing Status:

- [x] Wealth Mode - Verified (6 lucky numbers format)
- [x] Power Mode - Verified (3-word motto in CAPS)
- [x] Love Mode - Verified (4-word decree in CAPS)
- [ ] Shield Mode - Pending final test

### Documentation Created:

1. **README.md** - Completely rewritten with badges, examples, comprehensive docs
2. **docs/FEATURES.md** - Detailed feature breakdown
3. **docs/DESIGN.md** - Design philosophy and UX principles
4. **docs/ANNOUNCEMENT.md** - Press release for launch

### Assets Added:

**Zodiac Images:** `/public/assets/zodiac/`
- rat.jpeg, ox.jpeg, tiger.jpeg, rabbit.jpeg
- dragon.jpeg, snake.jpeg, horse.jpeg, goat.jpeg
- monkey.jpeg, rooster.jpeg, dog.jpeg, pig.jpeg
- Fire-Horse-2026-Chart.jpeg (master chart)

**Example Talismans:** `/public/assets/examples/`
- 12 generated PNG files (one per zodiac)

**Marketing:** `/public/assets/`
- Red-Horse-Oracle-Stripe-Graphic.jpeg (checkout graphic showing all 4 modes)

---

## Session Update: January 14, 2026 (Evening) - PRODUCTION LAUNCH

### Current Status: PRODUCTION LIVE

**Stripe is now in PRODUCTION MODE** - Real payments are being processed.

### What Was Completed This Session

#### 1. Stripe Production Setup (COMPLETED)
- [x] Switched from Test Mode to Live Mode
- [x] Created Live Mode product ($8.88)
- [x] Created Live Mode Payment Link with custom fields:
  - Text: "Date of Birth (MM/DD/YYYY)"
  - Dropdown: "Choose Your Path" (Wealth, Power, Love, Shield)
- [x] Configured Live Mode webhook endpoint
- [x] Updated Vercel environment variables with live keys:
  - `STRIPE_SECRET_KEY` → Live key (sk_live_...)
  - `STRIPE_WEBHOOK_SECRET` → Live webhook secret
  - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` → Live payment link

#### 2. ZodiacSummary Component - Added & Fixed
New component on reveal page showing personalized 2026 forecast:
- **File:** `src/components/reveal/ZodiacSummary.tsx`
- **Features:**
  - Zodiac animal image
  - Sign characteristics and core strengths
  - Personalized Fire Horse 2026 forecast
  - Fire Horse compatibility (ally/special/clash)
  - Oracle wisdom advice
  - Privacy-by-design notice

**Bug Fix:** Component was crashing in production due to case-sensitivity issues:
```typescript
// Added normalization helpers
function normalizeZodiacSign(sign: string): ZodiacAnimal | null {
  if (!sign) return null;
  const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  return ZODIAC_ANIMALS.includes(normalized as ZodiacAnimal)
    ? (normalized as ZodiacAnimal) : null;
}
```

#### 3. Privacy Policy - Complete Rewrite
New privacy policy emphasizing **Privacy by Design** architecture:
- **File:** `src/app/privacy/page.tsx`
- **Key Sections:**
  - What we DO NOT collect (names, DOB, email, cards, cookies)
  - How birth date is used (calculate → discard)
  - What appears on Oracle (NO PII)
  - Payment processing via Stripe
  - What we DO store (zodiac sign, prophecy - non-PII only)

#### 4. Privacy Messaging Throughout App
Added Privacy by Design notices to:
- **Landing Page:** Green banner with "FIRST | ONLY | BEST" tagline
- **Examples Page:** Privacy info button with modal explaining illustrative examples
- **Reveal Page:** ZodiacSummary includes privacy notice
- **Privacy Page:** Complete rewrite

**Key Tagline:**
> "FIRST | ONLY | BEST - The world's first Google Gemini 3 Pro zodiac app with COMPLETE Privacy by Design"

#### 5. Navigation Buttons on Reveal Page
Added proper navigation for regular users (not just admin):
- "Return to Home" button
- "Get Another Reading" button
- "View Examples Gallery" link

#### 6. Expanded Zodiac Data
**File:** `src/constants/zodiac-data.ts`
- Added `characteristics` for all 12 animals
- Added `strengths` arrays (4 traits each)
- Added `forecast2026` Fire Horse year predictions
- Added Fire Horse relations (ally/special/clash/neutral)

### Key Files Modified

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Added "FIRST \| ONLY \| BEST" Privacy by Design banner |
| `src/app/privacy/page.tsx` | Complete rewrite - Privacy by Design focus |
| `src/app/reveal/page.tsx` | Added ZodiacSummary, navigation buttons |
| `src/app/examples/page.tsx` | Added Privacy Info button + modal |
| `src/components/reveal/ZodiacSummary.tsx` | NEW - Zodiac forecast component |
| `src/constants/zodiac-data.ts` | Expanded with profiles, forecasts |

### Production Environment Variables

```env
# NOW LIVE
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_bsrjO6waD0dD7aHeMcp8XJK9BZKxa7a4
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/7sIdUP8Og5p31EY3cc
```

### Verified Working

- [x] Stripe production payment flow
- [x] Webhook receives checkout.session.completed
- [x] AI generation completes (30-60 seconds)
- [x] Talisman displays on reveal page
- [x] ZodiacSummary displays correctly
- [x] Navigation buttons work
- [x] Privacy notices appear throughout app

### Known Behavior

**Stripe Webhook Timeout:** The webhook shows "Timed out" in Stripe dashboard because AI generation takes 30-60 seconds. This is expected behavior - the Vercel function continues running and completes successfully. The prophecy is generated and stored correctly.

---

## Privacy by Design - KEY DIFFERENTIATOR

### Strategic Positioning

Red Horse Oracle is the **FIRST, ONLY, and BEST** Google Gemini 3 Pro app with:
- Complete Privacy by Design architecture
- Zero PII stored, retained, or displayed
- Birth date used only for zodiac calculation, immediately discarded
- Safe to share Oracle images publicly

### Data Flow

```
User enters DOB → Calculate Zodiac Sign → DISCARD DOB → Generate Oracle → Store only non-PII
```

### What's Stored vs. Discarded

| Data | Collected | Stored | On Oracle |
|------|-----------|--------|-----------|
| Name | NO | NO | NO |
| Birth Date | YES (input) | NO (discarded) | NO |
| Email | Stripe only | Stripe only | NO |
| Zodiac Sign | Calculated | YES (non-PII) | YES |
| Prophecy | Generated | YES | YES |

### Marketing Message

> "Unlike other apps that collect and store your personal information, Red Horse Oracle is architecturally designed to deliver a personalized experience WITHOUT ever storing your birth date, name, or any personally identifiable information. Your Oracle is safe to share publicly."

---

## Next Steps - Launch Preparation

### Immediate (Today/Tomorrow)

1. **Domain Purchase** - redhorseoracle.com
2. **Google Analytics** - Set up tracking
3. **SEO Optimization** - Meta tags, sitemap
4. **LinkedIn Article** - "I Built the World's First AI Fire Horse Oracle"

### Pre-CNY (Before Jan 29)

1. **Product Hunt** - Prepare launch assets
2. **Influencer Outreach** - Astrology/Chinese culture creators
3. **Paid Ads Setup** - Facebook Pixel, Google Ads
4. **Press Release** - Use docs/ANNOUNCEMENT.md

### Launch Week (Jan 29 - Feb 5)

1. **Product Hunt Launch** - Target Tuesday/Wednesday
2. **Social Media Push** - All platforms
3. **Monitor & Optimize** - Conversion rates, errors

---

## Quick Reference

### Test Payment Flow
```
1. Visit https://redhorse-omega.vercel.app/
2. Click "UNLOCK YOUR PROPHECY"
3. Enter real payment info ($8.88 will be charged)
4. Enter birth date and select mode
5. Complete checkout → Redirect to reveal page
6. Wait 30-60 seconds for AI generation
7. View talisman + zodiac forecast
```

### Admin Test (No Payment)
```
1. Visit https://redhorse-omega.vercel.app/
2. Click gear icon (top-right)
3. PIN: 142857
4. Select birth date and mode
5. Generate → View result
```

### Live URLs
| Page | URL |
|------|-----|
| Landing | https://redhorse-omega.vercel.app/ |
| Examples | https://redhorse-omega.vercel.app/examples |
| Privacy | https://redhorse-omega.vercel.app/privacy |
| Terms | https://redhorse-omega.vercel.app/terms |
| Admin Test | https://redhorse-omega.vercel.app/admin-test |

---

## Session Update: January 16, 2026 - Limited Edition System

### Current Status: TESTING → MARKETING LAUNCH

**Custom Domain Live:** https://redhorseoracle.com

### Major Features Completed

#### 1. Limited Edition Oracle System (888 per Zodiac)

Created a numbered limited edition system like fine art lithographs:

- **888 editions per zodiac sign** (10,656 total oracles EVER)
- **Edition numbers** assigned at generation (e.g., "#127 of 888")
- **Staggered closing dates** per zodiac throughout 2026

**New File:** `src/constants/editions.ts`
```typescript
export const EDITION_CONFIG: Record<ZodiacAnimal, EditionConfig> = {
  Rat: { totalSlots: 888, closingDate: '2026-02-28', chineseChar: '鼠' },
  Ox: { totalSlots: 888, closingDate: '2026-03-31', chineseChar: '牛' },
  // ... all 12 signs with staggered dates
  Pig: { totalSlots: 888, closingDate: '2026-12-31', chineseChar: '猪' },
};
```

**Closing Date Schedule:**
| Zodiac | Closing Date |
|--------|--------------|
| Rat | February 28, 2026 |
| Ox | March 31, 2026 |
| Tiger | April 30, 2026 |
| Rabbit | May 31, 2026 |
| Dragon | June 30, 2026 |
| Snake | July 31, 2026 |
| Horse | August 31, 2026 |
| Goat | September 30, 2026 |
| Monkey | October 31, 2026 |
| Rooster | November 30, 2026 |
| Dog | December 15, 2026 |
| Pig | December 31, 2026 |

#### 2. Maker's Mark & Provenance

Added authentication elements to every generated talisman:

**TalismanDisplay.tsx Changes:**
- **Maker's Mark Seal** - Circular seal in top-right corner: "RED HORSE 馬 2026"
- **Edition Badge** - Gold gradient badge: "✦ LIMITED EDITION #X of 888 ✦"
- **Certificate Footer** - "AUTHENTIC • VERIFIED • [ZODIAC]" + certificate ID
- **Minted By** - "Minted by redhorseoracle.com"

#### 3. Courage-Based Marketing

Added urgency and challenge messaging throughout the app:

**Free Reading Page (`/free`) Additions:**
- "THE FIRE HORSE DEMANDS COURAGE" header
- "Will YOU Be Bold Enough To Know Your 2026 Destiny?"
- "Are you someone who ACTS? Or someone who waits and wonders?"
- Limited Edition Certificate preview before purchase
- Edition-specific countdown (slots remaining, days until closing)

**Landing Page Value Prop:**
- "Authenticated Limited Edition AI Zodiac Oracle"
- Badges: NUMBERED EDITIONS | VERIFIABLE ART | PROVENANCE
- "100% PII-FREE • Privacy by Design • Maker's Mark Authenticated"

#### 4. Enhanced Privacy Messaging

**Free Reading Page Privacy Sections:**
- "100% PII-FREE" badge with privacy badges
- "ZERO DATA RETAINED" section before form
- "YOUR DATA? ALREADY GONE." section after results
- "VIEW OUR PRIVACY POLICY" buttons

#### 5. Database Schema Updates

Added columns to Supabase `prophecies` table:
```sql
ALTER TABLE prophecies ADD COLUMN edition_number INTEGER;
ALTER TABLE prophecies ADD COLUMN total_editions INTEGER DEFAULT 888;
```

**Updated `src/types/prophecy.ts`:**
```typescript
export interface Prophecy {
  // ... existing fields
  edition_number: number | null;  // Limited edition number
  total_editions: number | null;  // Total editions for this sign (888)
}
```

#### 6. Webhook Edition Assignment

**`src/app/api/webhook/route.ts` Changes:**
```typescript
// Get edition number for this zodiac sign
const { count: existingCount } = await supabase
  .from('prophecies')
  .select('*', { count: 'exact', head: true })
  .eq('zodiac_sign', zodiac.animal)
  .eq('status', 'completed');

const editionNumber = (existingCount || 0) + 1;
```

#### 7. Stripe Configuration Updates

Updated for custom domain `redhorseoracle.com`:

- **Webhook URL:** `https://redhorseoracle.com/api/webhook`
- **Payment Link Redirect:** `https://redhorseoracle.com/reveal?session_id={CHECKOUT_SESSION_ID}`
- **Payment Link:** `https://buy.stripe.com/5kQ8wPdmT73b54G1V124000`

### Files Modified This Session

| File | Changes |
|------|---------|
| `src/constants/editions.ts` | NEW - Edition config for all 12 zodiac signs |
| `src/types/prophecy.ts` | Added edition_number, total_editions fields |
| `src/app/api/webhook/route.ts` | Edition number assignment logic |
| `src/components/reveal/TalismanDisplay.tsx` | Maker's Mark, Edition badge, Certificate footer |
| `src/app/free/page.tsx` | Limited Edition Certificate, courage CTA, privacy messaging |
| `src/app/page.tsx` | Enhanced value prop with authentication messaging |
| `src/app/layout.tsx` | Updated siteUrl to redhorseoracle.com |
| `src/app/sitemap.ts` | Added /free page |

### Bug Fix: Import Error

**Error:** `Module '"@/lib/zodiac/calculator"' has no exported member 'calculateChineseZodiac'`
**Fix:** Changed import to `getChineseZodiac` (the actual function name)

### Documentation Updates

Created/updated comprehensive documentation:

| Document | Purpose |
|----------|---------|
| `docs/RELEASE-NOTES.md` | v1.1.0 Limited Edition System release |
| `docs/TEST-PLAN.md` | Complete test scenarios for all flows |
| `docs/NEXT-STEPS.md` | 4-phase launch plan with marketing templates |

### Current URLs (Custom Domain)

| Page | URL |
|------|-----|
| Production | https://redhorseoracle.com |
| Free Reading | https://redhorseoracle.com/free |
| Examples | https://redhorseoracle.com/examples |
| Admin Test | https://redhorseoracle.com/admin-test |
| Privacy | https://redhorseoracle.com/privacy |
| Terms | https://redhorseoracle.com/terms |

### Testing Phase Status

See `docs/TEST-PLAN.md` for complete test scenarios.

**Critical Path Testing:**
- [ ] Payment Flow Test - Complete real $8.88 purchase
- [ ] Webhook Processing - Verify 200 OK response
- [ ] Edition Assignment - Confirm edition_number populated
- [ ] Reveal Page - Edition badge + Maker's Mark display
- [ ] Save Talisman - Download works correctly

**4 Oracle Modes:**
- [ ] Wealth (6 lucky numbers: XX-XX-XX-XX-XX-XX)
- [ ] Power (3-word motto in CAPS)
- [ ] Love (4-word decree in CAPS)
- [ ] Shield (3-word mantra in CAPS)

### Quick Start Commands

```bash
# Navigate to project
cd /mnt/c/src/redhorse

# Run locally
npm run dev

# Build check
npm run build

# Push changes
git add -A && git commit -m "message" && git push origin main
```

### Admin Test Console

1. https://redhorseoracle.com/admin-test (or click gear icon on landing page)
2. PIN: `142857`
3. Select birth date and mode
4. Generate → View result with edition badge and Maker's Mark

---

## Key Differentiators Summary

Red Horse Oracle is positioned as:

1. **Authenticated Limited Edition Digital Art** - Numbered like fine art lithographs
2. **Privacy by Design** - Zero PII stored, birth date immediately discarded
3. **Maker's Mark & Provenance** - Certificate of authenticity on every oracle
4. **60-Year Rarity** - Fire Horse only occurs every 60 years (1966 → 2026 → 2086)
5. **Courage-Based Marketing** - "The Fire Horse Demands Courage"

---

## Session Update: January 16, 2026 (Afternoon)

### Status: PRODUCTION READY - Payment Flow Verified

**Live URL:** https://www.redhorseoracle.com (note: www required for webhook)

### Completed This Session

#### 1. Save Zodiac Forecast Feature
- Added "Save Zodiac Forecast" button to paid reveal page
- Captures zodiac card (image, strengths, characteristics, forecast, wisdom) as PNG
- Uses html2canvas for high-quality capture
- Downloads as `fire-horse-2026-{element}-{animal}-forecast.png`
- **PAID ONLY** - Not available on free reading page

#### 2. Edition System Fixes
- **Unified closing date:** All zodiac signs now close February 17, 2027 (end of Fire Horse year)
- Previously had staggered dates (Feb-Dec 2026) - now consistent
- ~397 days remaining for all signs

#### 3. Simplified Messaging
- Removed redundant "888 Wealth × 888 Power × 888 Love × 888 Shield"
- Now just: "Only 888 of each oracle type will EVER be minted"

#### 4. Webhook Fix (Critical)
- **Issue:** Webhook returning 307 redirect, oracle not generating
- **Root cause:** Domain redirects `redhorseoracle.com` → `www.redhorseoracle.com`
- **Fix:** Changed Stripe webhook URL to `https://www.redhorseoracle.com/api/webhook`
- **Result:** Payment flow now works end-to-end

### Downloadable Assets (Paid Users Only)
Users can now save TWO items:
1. **Save Talisman** - AI-generated artwork + prophecy + edition badge
2. **Save Zodiac Forecast** - Personalized zodiac reading card

### Revenue Model

#### Maximum Potential (Sold Out)
| Metric | Value |
|--------|-------|
| Total Oracles | 42,624 (888 × 12 signs × 4 modes) |
| Price | $8.88 |
| **MAX Gross Revenue** | **$378,501** |

#### Costs Per Sale
- Stripe (2.9% + $0.30): ~$0.56
- Gemini 3 Pro Image: ~$0.134 (1K/2K resolution)
- Gemini 3 Pro Text: ~$0.01
- **Total cost: ~$0.71**
- **Net per sale: ~$8.17**

#### Projections (Updated with accurate Gemini 3 Pro costs)
| Scenario | Sales | Gross | Net (~$8.17/sale) |
|----------|-------|-------|-------------------|
| Conservative (5%) | 2,131 | $18,923 | ~$17,410 |
| Medium (15%) | 6,394 | $56,778 | ~$52,240 |
| Viral (40%) | 17,050 | $151,404 | ~$139,300 |
| Sold Out (100%) | 42,624 | $378,501 | ~$348,240 |

### Files Modified This Session
- `src/components/reveal/ZodiacSummary.tsx` - Added Save Zodiac Forecast
- `src/constants/editions.ts` - Unified closing dates to Feb 17, 2027
- `src/app/free/page.tsx` - Simplified edition messaging

### Next Session: Launch Planning
- Hacker News "Show HN" post
- Reddit posts (r/SideProject, r/ChineseZodiac)
- LinkedIn article
- Product Hunt listing
- Influencer outreach strategy

---

## Session Update: January 17, 2026 - Enhanced Loading Experience

### Current Status: PRODUCTION READY

### What Was Completed This Session

#### 1. Immersive Generating/Loading Page Enhancement

Completely redesigned the loading page that displays while Gemini 3 Pro generates the talisman after payment. The page now provides an engaging, visually stunning waiting experience.

**Visual Elements Added:**
- **Dark Cloud Background** - Mystical cloud/flame pattern at 50% opacity (`/assets/loading/background.jpeg`)
- **Bouncing Fire Horse** - Transparent PNG inside rotating fire frame (580x580px on desktop)
- **20 Floating Ember Particles** - Fire embers with transparency floating upward
- **Red Horse Oracle Logo** - Branded header image

**Information Display:**
- **Zodiac Title** - "Fire Dragon × Fire Horse" (element + sign) in gold with glow effect
- **Status Messages** - Two styled lines:
  - "Your personalized Fire Horse talisman is being crafted." (white with glow)
  - "This typically takes 30-60 seconds." (gold with glow)
- **Generating For Button** - Shows zodiac image + element + sign label (380px wide)
- **Rotating Oracle Messages** - Cycling mystical messages every 2.5 seconds
- **Progress Dots** - 5 bouncing gold dots
- **Did You Know Box** - Fun fact about Fire Horse rarity (warm gradient background)

**CSS Animations:**
- `bounce-horse` - 2s vertical bounce cycle
- `spin-slow` - Frame rotates 360° over 60 seconds
- `float-ember` - Particles rise from bottom with fade in/out

#### 2. Preview Loading Page

Created `/preview-loading` page to test loading animation locally without payment.

**File:** `src/app/preview-loading/page.tsx`
```typescript
'use client';
import GeneratingState from '@/components/reveal/GeneratingState';

export default function PreviewLoadingPage() {
  return (
    <GeneratingState
      zodiacSign="Dragon"
      zodiacElement="Fire"
      focusMode="wealth"
    />
  );
}
```

#### 3. Share Button Simplification

Removed "Share Talisman Image" button because the raw Supabase image URL doesn't include the Maker's Mark, Certificate, or Edition badge. Users were sharing unbranded images.

**Current Share Options:**
- "Share Page" - Shares the reveal page URL (full branded experience)
- "𝕏" - Quick share to Twitter/X

**Future Enhancement:** Server-side branded image generation for Phase II.

### Key Files Modified

| File | Changes |
|------|---------|
| `src/components/reveal/GeneratingState.tsx` | Complete redesign with animations, PNG transparency, styled text |
| `src/components/reveal/ShareButtons.tsx` | Removed "Share Talisman Image" button |
| `src/app/preview-loading/page.tsx` | NEW - Test loading animation without payment |

### New Assets Added

**Directory:** `/public/assets/loading/`

| File | Purpose |
|------|---------|
| `fire-horse-bouncing-3.png` | Bouncing horse (transparent background) |
| `fire-frame.png` | Rotating frame (transparent center) |
| `ember1.png` - `ember6.png` | 6 ember variations (transparent) |
| `background.jpeg` | Dark cloud/flame pattern |
| `logo-firehorse1.jpeg` | Red Horse Oracle logo |

### Lessons Learned This Session

#### PNG Transparency vs JPEG

**Issue:** AI-generated images with "transparent backgrounds" were JPEGs with visible checkered patterns (the Photoshop transparency indicator rendered as actual pixels).

**Solution:** JPEGs don't support transparency. Must convert to PNG format with actual transparency removed.

**Rule:** Always use PNG for images that need transparent backgrounds. JPEG format cannot store alpha channel data.

#### CSS Animation Layering

**Issue:** Fire frame was blocking/occluding the bouncing horse inside it because the frame's center was solid (checkered pattern).

**Solution:** The frame PNG must have a transparent center hole, not just transparent edges.

**Rule:** For overlay animations, ensure inner elements can show through by using actual transparency.

#### Browser Cache During Development

**Issue:** Changes to CSS, images, and components weren't appearing despite successful compilation.

**Solutions:**
1. Clear `.next` cache: `rm -rf .next && npm run dev`
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux)
3. Incognito window: `Ctrl+Shift+N` bypasses all caching
4. Kill and restart dev server

**Rule:** When visual changes don't appear, always clear caches before debugging code.

#### Preview Pages for Testing

**Pattern:** Created `/preview-loading` to test the loading animation without making a real payment. Useful for isolated component testing.

**Future applications:**
- `/preview-talisman` - Test talisman display
- `/preview-zodiac` - Test zodiac summary

### Quick Start

```bash
# Test loading animation locally
npm run dev
# Visit http://localhost:3000/preview-loading

# Clear cache and restart if changes don't appear
rm -rf .next && npm run dev
```

---

## Session Update: January 17, 2026 (Evening) - Branded Image Generation

### Current Status: BRANDED IMAGES READY FOR TESTING

### What Was Completed This Session

#### 1. Server-Side Branded Image Generation

Created a complete system to generate branded talisman images with edition/certificate info baked directly into the image for sharing.

**New Module:** `src/lib/image/branded-generator.ts`

Uses Sharp library to composite:
- **Header:** Edition badge (✦ LIMITED EDITION #X of 888 ✦)
- **Body:** Raw AI-generated talisman image
- **Maker's Mark:** Circular seal overlay (RED HORSE 馬 2026)
- **Footer:** Prophecy text, zodiac info, certificate number, branding

**Generated Image Structure:**
```
┌──────────────────────────────────┐
│  ✦ LIMITED EDITION #2 of 888 ✦  │  ← Header (edition badge)
├──────────────────────────────────┤
│                            [馬]  │  ← Maker's mark overlay
│                                  │
│     [AI-Generated Talisman]      │  ← Raw image
│                                  │
├──────────────────────────────────┤
│     STRIKE FROM SILENCE          │  ← Prophecy text
│   Earth Dragon • ⚔️ Power Oracle │  ← Zodiac + mode
│ 🔥 AUTHENTIC • Certificate #ABC123│  ← Certificate
│   redhorseoracle.com • 2026      │  ← Branding
└──────────────────────────────────┘
```

#### 2. Dual Image Storage

Webhook now stores TWO images per prophecy:
- **Raw Image:** `{id}.png` - Just the AI artwork
- **Branded Image:** `{id}-branded.png` - Complete with edition/certificate

Both images have metadata attached to Supabase Storage for querying:
```json
{
  "prophecy_id": "cff80c84-...",
  "edition_number": "2",
  "total_editions": "888",
  "zodiac_sign": "Dragon",
  "zodiac_element": "Earth",
  "focus_mode": "power",
  "certificate_id": "CFF80C84",
  "created_at": "2026-01-17T..."
}
```

#### 3. Share Talisman Image Button (Restored)

Re-added "Share Talisman Image" button that:
- Uses branded image URL (with edition/certificate baked in)
- Tries native share with image file on mobile
- Falls back to copying image URL on desktop

#### 4. SuperAdmin Image Browser

**New Page:** `/superadmin` (PIN protected: 142857)

Features:
- Browse all generated oracles in grid view
- Filter by zodiac sign, element, oracle mode
- Filter by edition number range (e.g., #1-10)
- Toggle between Raw AI and Branded views
- Click for full details: edition, certificate, prophecy, URLs
- Quality control: verify image uniqueness and consistency

**Use Cases:**
- View first 5 Earth Dragon oracles
- Check all Shield mode talismans
- Compare images for quality control
- Get URLs for any prophecy

### Database Migration Required

Run this SQL in Supabase:
```sql
ALTER TABLE prophecies
ADD COLUMN IF NOT EXISTS branded_image_url TEXT,
ADD COLUMN IF NOT EXISTS branded_image_storage_path TEXT;

-- Indexes for SuperAdmin queries
CREATE INDEX IF NOT EXISTS idx_prophecies_zodiac_edition
ON prophecies (zodiac_sign, zodiac_element, edition_number)
WHERE status = 'completed';
```

Full migration: `docs/migrations/002_branded_image_columns.sql`

### New Files Created

| File | Purpose |
|------|---------|
| `src/lib/image/branded-generator.ts` | Server-side branded image generation |
| `src/app/superadmin/page.tsx` | SuperAdmin image browser (PIN: 142857) |
| `docs/migrations/002_branded_image_columns.sql` | Database migration |

### Files Modified

| File | Changes |
|------|---------|
| `src/app/api/webhook/route.ts` | Generate & store branded image + metadata |
| `src/components/reveal/ShareButtons.tsx` | Restored Share Talisman Image button |
| `src/types/prophecy.ts` | Added branded_image_url fields |
| `package.json` | Added sharp dependency |

### Dependencies Added

```bash
npm install sharp
npm install --save-dev @types/sharp
```

### Testing Checklist

1. **Run Migration:**
   - Execute SQL in Supabase Dashboard → SQL Editor

2. **Test Generation:**
   - Use admin test console to generate a new prophecy
   - Verify branded image URL is populated
   - Check branded image has edition badge, maker's mark, certificate

3. **Test SuperAdmin:**
   - Visit /superadmin
   - Enter PIN: 142857
   - Browse images, test filters
   - Toggle Raw/Branded view

4. **Test Share Button:**
   - On reveal page, click "Share Talisman Image"
   - Verify branded image URL is shared (not raw)

### URLs

| Page | URL |
|------|-----|
| SuperAdmin Browser | https://redhorseoracle.com/superadmin |
| Production | https://redhorseoracle.com |
| Admin Test | https://redhorseoracle.com/admin-test |

---

## Session Update: January 17, 2026 (Late Evening) - Final Polish

### Current Status: PRODUCTION READY FOR LAUNCH 🚀

### What Was Completed This Session

#### 1. Persistent Admin Authentication
- Shared `sessionStorage` key across `/superadmin` and `/admin-test`
- Enter PIN once, stay logged in for browser session
- Added navigation links between admin pages
- Logout button to clear session

#### 2. Backfill Editions API
- New endpoint: `/api/admin/backfill-editions`
- Assigns sequential edition numbers to existing prophecies
- Groups by `zodiac_sign` + `focus_mode`, orders by `created_at`
- "Backfill Editions" button in SuperAdmin header

#### 3. Edition Badge & Certificate Styling Fixes
- Edition Badge: Proper vertical centering with `pt-1 pb-2.5`
- Certificate #: Bold white text (`text-white text-xs font-bold`)
- Both now clearly visible in downloaded talisman images

### App Status Summary

| Feature | Status |
|---------|--------|
| Landing Page | ✅ Ready |
| Payment Flow (Stripe Live) | ✅ Ready |
| AI Generation (Gemini 3 Pro) | ✅ Ready |
| Talisman Display | ✅ Ready |
| Edition Badge (#X of 888) | ✅ Ready |
| Certificate Number | ✅ Ready |
| Maker's Mark | ✅ Ready |
| Save Talisman (Download) | ✅ Ready |
| Share Page | ✅ Ready |
| Share Talisman Image | ✅ Ready |
| Branded Image Generation | ✅ Ready |
| Free Reading | ✅ Ready |
| Examples Gallery | ✅ Ready |
| SuperAdmin Image Browser | ✅ Ready |
| Admin Test Console | ✅ Ready |
| Privacy Policy | ✅ Ready |
| Terms of Service | ✅ Ready |
| 15-Second Loading Animation | ✅ Ready |
| Zodiac Forecast Card | ✅ Ready |

### Key URLs

| Page | URL |
|------|-----|
| Production | https://redhorseoracle.com |
| Free Reading | https://redhorseoracle.com/free |
| Examples Gallery | https://redhorseoracle.com/examples |
| Privacy Policy | https://redhorseoracle.com/privacy |
| Terms of Service | https://redhorseoracle.com/terms |
| Admin Test | https://redhorseoracle.com/admin-test |
| SuperAdmin | https://redhorseoracle.com/superadmin |

### Pricing & Editions

- **Price:** $8.88 (auspicious number)
- **Editions:** 888 per zodiac sign × 4 modes = 42,624 total possible
- **Revenue Potential:** $378,501 (if sold out)
- **Net Margin:** ~92% ($8.17 per sale after costs)

### Launch Timeline

**Chinese New Year 2026:** January 29, 2026 (12 days away)

**Fire Horse Year:** Only occurs every 60 years
- Last: 1966
- Current: 2026
- Next: 2086

---

## Session Update: January 18, 2026 - FREE Page Overhaul & Zodiac Digital Art Cards

### Current Status: FREE PAGE DRAMATICALLY IMPROVED

### What Was Completed This Session

#### 1. Zodiac Digital Art Cards (60 Cards + 12 Collections)
Created and organized complete zodiac badge collection:
- **60 individual cards:** All 5 elements × 12 animals (wood-rat.jpeg, fire-ox.jpeg, etc.)
- **12 collection panels:** One per animal showing all 5 elements
- **Location:** `/public/assets/zodiac-badges/`
- **Source images:** `/public/assets/zodiac-badge-source-images/` (83 originals)
- **Naming convention:** `{element}-{animal}.jpeg` and `{animal}-collection.jpeg`

**Scripts created:**
- `scripts/rename_zodiac_images.py` - Copies and renames source images with proper naming

#### 2. FREE Page Complete Redesign (`/src/app/free/page.tsx`)

**New Hero Section:**
- Gold-bordered card: "HERE IS YOUR FREE ORACLE for the Year of the Fire Horse 2026"
- Shows "You are a [Element] [Animal]" with Chinese characters
- Prominent visual impact

**Share CTA Section (Purple):**
- "Don't Miss Out on the Limited Edition Oracle for 2026!"
- GET YOURS NOW — $8.88 button
- "Share This — Please! Supplies won't last. Only 888 per zodiac sign."
- Social share buttons: X (Twitter), Facebook, Share Link (native share API)

**Green Glowing FREE ORACLE Card:**
- Animated pulsing green border effect
- "YOUR FREE ORACLE" badge
- User's zodiac digital art card (clear, no blur, with light watermark)
- Title: "Privacy by Design — Your [Element] [Animal]"
- Full forecast (all sentences, not truncated)
- Oracle wisdom quote
- Core strengths badges
- Upsell: "Want a more detailed, personalized reading?"

**Visual Equation Section:**
- [User's Zodiac Card] + [Fire Horse Card] = Your Unique Masterpiece
- Both cards shown as thumbnails (w-36) with watermarks
- Large green "See Examples" button
- Links to /examples gallery

**Multiple CTAs Throughout:**
- Position 1: After hero title (Share CTA)
- Position 2: After FREE oracle card (Immediate CTA)
- Position 3: Courage Challenge section
- Position 4: Visual equation with final CTA button

#### 3. Zodiac Card Integration in Reveal Page
Added bonus zodiac card section to `ZodiacSummary.tsx`:
- Purple-themed "Exclusive Bonus" section for paid users
- Shows user's matching zodiac digital art card
- Download button for the card
- Collection panel preview showing all 5 elements

#### 4. Simple-Named Example Images
Created simple-named copies for dynamic loading:
- `/public/assets/examples/rat.png`, `ox.png`, `tiger.png`, etc.
- Maps to existing full-named files (e.g., `michael-johnson-rat-wealth.png`)
- Enables `/assets/examples/${animal.toLowerCase()}.png` references

### Key Design Decisions

**Zodiac Cards as Marketing + Value-Add (NOT $0.99 product):**
- Decision: Use zodiac cards for marketing and as downloadable bonus for $8.88 purchasers
- Reason: $0.99 price point loses ~33% to Stripe fees, causes product confusion
- Implementation: Free preview (watermarked) + download with purchase

**Full Forecast in FREE Version:**
- Decision: Show complete forecast (all sentences) instead of preview
- Reason: Provide real value, build trust, differentiate with AI-generated art
- Upsell: Focus on "one-of-a-kind masterpiece" combining their sign with Fire Horse

**Visual Equation Approach:**
- [Their Card] + [Fire Horse Card] = Masterpiece
- Shows actual digital art card thumbnails (not emojis)
- Demonstrates product quality visually
- Links to examples gallery for Fire Horse combinations

### Files Modified/Created

| File | Changes |
|------|---------|
| `src/app/free/page.tsx` | Complete redesign with hero, share CTA, green FREE card, visual equation |
| `src/components/reveal/ZodiacSummary.tsx` | Added bonus zodiac card section |
| `public/assets/zodiac-badges/*.jpeg` | 60 individual + 12 collection images |
| `public/assets/examples/*.png` | 12 simple-named copies |
| `scripts/rename_zodiac_images.py` | Image renaming utility |

### FREE Page Flow Summary

```
1. Hero: "HERE IS YOUR FREE ORACLE - You are a [Element] [Animal]"
2. Share CTA: "Don't Miss Out!" + $8.88 button + Share buttons
3. Zodiac Identity Card
4. Green FREE ORACLE Card:
   - "Privacy by Design — Your [Element] [Animal]"
   - Clear zodiac digital art card (watermarked)
   - Full forecast + Oracle wisdom + Core strengths
   - "Want more detailed reading?" upsell
5. Immediate CTA: "Would you like Authenticated Limited Edition?"
6. Certificate of Authenticity preview
7. Courage Challenge: "Will YOU Claim Your Authentic Oracle?"
8. Visual Equation: [Your Card] + [Fire Horse] = Masterpiece + "See Examples" button
9. Four Paths grid (Wealth, Power, Love, Shield)
10. Final CTA: "I BET ON MYSELF — GET MY ORACLE" button
11. Privacy Reinforcement
12. Footer
```

### Lessons Learned / Claude Tips

#### 1. Always Commit and Push Before Testing
- Changes aren't visible until deployed to Vercel
- Use `git status` to verify uncommitted changes
- Common issue: User sees old version, changes were never pushed

#### 2. Image Path Debugging
- If images show alt text instead of image, check file path exists
- Use `ls` to verify files in `/public/assets/` directory
- Dynamic paths need matching file names (e.g., `${animal.toLowerCase()}.png`)

#### 3. Visual Impact Matters
- Thumbnail-only sections make page feel "smaller"
- Balance thumbnails with larger hero images
- Use actual product images instead of emojis when possible

#### 4. Multiple CTAs Increase Conversion
- Don't let users scroll past without seeing a conversion opportunity
- Place CTAs after each major content section
- Vary the CTA messaging (urgency, FOMO, value proposition)

#### 5. Watermarking Strategy
- Light watermark at bottom: `"Free Oracle • redhorseoracle.com"`
- Don't obscure the image - subtle protection only
- Clear image shows product quality, builds desire

#### 6. Element + Animal = 60 Combinations
- Chinese Zodiac: 12 animals × 5 elements = 60 unique signs
- Each element changes the personality traits significantly
- Fire Horse is just one of 60 (but special because 2026 is Fire Horse year)

### Asset Inventory

**Zodiac Badges:** `/public/assets/zodiac-badges/`
- 60 individual cards: `{element}-{animal}.jpeg`
- 12 collections: `{animal}-collection.jpeg`
- Total: 72 images

**Example Oracles:** `/public/assets/examples/`
- 12 full-named: `{name}-{animal}-{mode}.png`
- 12 simple-named: `{animal}.png`
- Total: 24 images

**Hero Images:** `/public/assets/`
- `Year-of-the-Horse-2026-v2.jpeg` (main hero)
- `Year-of-Horse-Hero-Image2.jpeg` (OG image)
- `Year-of-Horse-Hero-Image3.jpeg` (background watermark)

---

## Session Update: January 18, 2026 (Evening) - Visual Polish & Marketing Assets

### Current Status: PRODUCTION READY - MARKETING LAUNCH IMMINENT

### What Was Completed This Session

#### 1. Rotating Background System (Landing Page)
Implemented smooth crossfade background rotation on the main landing page:

**Implementation:**
- **Sequence:** Main Chart → Grid 1 → Main Chart → Grid 3
- **Interval:** 16 seconds between transitions
- **Fade Duration:** 2.5 seconds smooth crossfade
- **Technique:** Two-layer approach (eliminates snapping)

**Background Settings:**
- `backgroundSize: 'contain'` - Shows full images without edge cutoff
- `backgroundPosition: 'top center'` - Headers visible on grid images
- `opacity: 0.30` - 30% opacity for landing page (brighter than inner pages)

**Code Location:** `src/app/page.tsx` (lines 7-65)

#### 2. Marketing Grid Assets
Added 5 marketing grid screenshots for social media campaigns:

| File | Orientation | Description |
|------|-------------|-------------|
| `marketing-grid-1.jpg` | Horizontal | 4x3 grid, all 60 zodiac cards |
| `marketing-grid-2.jpg` | Horizontal | Alternative layout |
| `marketing-grid-3.jpg` | Horizontal | Different sorting |
| `marketing-grid-4.jpg` | Horizontal | Variant |
| `marketing-grid-5-mobile.jpg` | Vertical | Mobile-optimized |

**Location:** `/public/assets/`

#### 3. Collections Grid Screenshot Tool
Created dedicated page for generating marketing screenshots:

**Page:** `/collections-grid`
**Features:**
- Columns control (1, 2, 3, 4)
- Gap control (0px, 4px, 8px, 16px)
- Scale control (60%, 70%, 80%, 90%, 100%)
- Background options (black, gradient, transparent)
- Press `H` to toggle controls for clean screenshots
- Back link to admin panel

**Also Added:** Collections tab to admin-test page with same controls

#### 4. LinkedIn Share Button
Enhanced share functionality on reveal page:

**Changes:**
- Added dedicated LinkedIn share button
- Reorganized to 3x2 grid layout (was 2x3)
- Added platform indicators: "Works!" / "Link only"
- Removed unreliable native share button

**Platforms:**
- ✅ Twitter/X - Full text support
- ✅ LinkedIn - Link sharing
- ✅ WhatsApp - Full text support
- ✅ Telegram - Full text support
- ✅ Email - Full text support
- ⚠️ Facebook - Link only (dimmed)

#### 5. Background Transparency Refinements

| Page | Opacity | Notes |
|------|---------|-------|
| Landing | 30% | Brighter for marketing impact |
| Reveal | 18% | Subtle, non-distracting |
| Examples | 18% | Consistent with reveal |

- Removed blur filter on all pages for crystal-clear images
- Changed from `center center` to `top center` positioning

#### 6. OG Image Configuration (Verified)

| Purpose | Image | Notes |
|---------|-------|-------|
| Social Sharing (OG) | `Fire-Horse-2026-Chart-v3.jpeg` | Full brightness, Fire Horse center |
| Landing Background | `Fire-Horse-2026-Chart-v2.jpeg` | 30% opacity, all 12 unique animals |

**Note:** v3 has duplicate Goat visible but looks fantastic for sharing. v2 has all 12 unique animals. Keeping both as-is.

### Files Modified

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Rotating backgrounds, crossfade, contain/top-center |
| `src/app/collections-grid/page.tsx` | New screenshot tool page |
| `src/app/admin-test/page.tsx` | Collections tab with controls |
| `src/components/reveal/ShareButtons.tsx` | LinkedIn button, 3x2 grid |
| `src/app/reveal/page.tsx` | Background opacity 18% |
| `src/app/examples/page.tsx` | Background opacity 18% |

### Assets Added

| File | Purpose |
|------|---------|
| `marketing-grid-1.jpg` | Social media marketing |
| `marketing-grid-2.jpg` | Social media marketing |
| `marketing-grid-3.jpg` | Social media marketing |
| `marketing-grid-4.jpg` | Social media marketing |
| `marketing-grid-5-mobile.jpg` | Mobile marketing |

### Technical Notes

#### Crossfade Implementation
```typescript
// Two-layer approach prevents "snapping" during transitions
// Layer 1: Shows current image, fades to 0 opacity
// Layer 2: Shows next image, fades to 30% opacity
// After transition completes, swap indices and reset opacities

const ROTATION_INTERVAL = 16000; // 16 seconds
// Transition: 2.5 seconds
// Total cycle: 64 seconds (4 images × 16 seconds)
```

#### Background Sizing Decision
- `cover` was cropping edges of wide grid images
- `contain` shows full image, grid headers visible
- Trade-off: Some letterboxing on tall screens, but content integrity preserved

### Next Steps Ready

The app is now ready for marketing launch:
1. ✅ Visual polish complete
2. ✅ Marketing assets created
3. ✅ OG image verified (LinkedIn, Facebook)
4. ✅ Share buttons working
5. 🟢 Ready for social media campaign
6. 🟢 Ready for influencer outreach
7. 🟢 Ready for CNY (Feb 17, 2026)

---

## Session Update: January 19, 2026 - Celebrity Quotes & Viral Share Content

### Current Status: v1.4.0 PRODUCTION LIVE

### What Was Completed This Session

#### 1. Celebrity Quote Banner - TOP of Forecast

Added artistic celebrity quote display at the TOP of both FREE and PAID forecast pages:

**Design Elements:**
- **Position:** Quote now appears FIRST for immediate celebrity value recognition
- **Gradient text effect:** Quotes use element-specific gradient colors
  - Wood = green gradient
  - Fire = red/orange gradient
  - Earth = yellow/gold gradient
  - Metal = silver/gray gradient
  - Water = blue gradient
- **Decorative corners:** ✦ symbols in corners for artistic framing
- **Quote marks:** Large opening/closing quotes with element color
- **Attribution:** Author name + description (who they are, what they do)
- **Celebrity badge:** Element-colored gradient badge showing "Famous [Element] [Animal]"

**Example Display:**
```
     ✦                                    ✦
          ❝
   "Be yourself; everyone else
    is already taken."
          ❞

   — Oscar Wilde
   Irish playwright & poet

   [🐀 Famous Wood Rat 🐀]
     ✦                                    ✦
```

#### 2. Celebrity Descriptions - 60 Zodiac Combinations

**New Data File:** `src/constants/zodiac-fun-facts.ts`

Created comprehensive celebrity data for all 60 zodiac combinations (12 animals × 5 elements):

**Data Structure:**
```typescript
export interface CelebrityInfo {
  name: string;
  description: string;  // Who they are, what they do
}

export interface ZodiacFunFact {
  years: number[];
  famousPeople: CelebrityInfo[];
  mantra: string;
  quote: string;
  quoteAuthor: string;
  quoteAuthorDescription: string;  // NEW
  funFact: string;
  emoji: string;
}
```

**Example Entry:**
```typescript
'Fire-Dragon': {
  years: [1916, 1976],
  famousPeople: [
    { name: 'Benedict Cumberbatch', description: 'Actor, Sherlock Holmes, Doctor Strange' },
    { name: 'Ryan Reynolds', description: 'Actor, Deadpool, entrepreneur' },
    { name: 'Reese Witherspoon', description: 'Actress, producer, Legally Blonde' },
  ],
  mantra: 'I transform challenges into legendary victories',
  quote: 'The only limit to our realization of tomorrow is our doubts of today.',
  quoteAuthor: 'Franklin D. Roosevelt',
  quoteAuthorDescription: '32nd U.S. President, New Deal architect',
  funFact: 'Fire Dragons are considered the most powerful zodiac combination...',
  emoji: '🐉',
}
```

#### 3. Enhanced Viral Share Content (PAID Page)

**Updated ShareButtons.tsx with viral-optimized content:**

**Mode-specific emojis:**
- 🎲💰 Wealth
- ⚔️👑 Power
- ❤️💕 Love
- 🛡️✨ Shield

**Urgency messaging added:**
- "Next: 2086 (will you even be alive?)"
- "The Fire Horse returns only once every 60 years!"

**Hashtags:**
- #FireHorse2026 #ChineseZodiac #[ZodiacSign] #AI #LimitedEdition

**Full copy message example:**
```
🔥 I just got my Authenticated Limited Edition Fire Horse Oracle! 🐴

✨ I'm a Earth Dragon ⚔️👑

💬 My prophecy: "STRIKE FROM SILENCE"

🎨 VIEW MY TALISMAN: [URL]

🔮 The Fire Horse returns only once every 60 years!
   • Last: 1966
   • NOW: 2026
   • Next: 2086 (will you even be alive?)

🎯 Get YOUR Fire Horse Oracle:
redhorseoracle.com

#FireHorse2026 #ChineseZodiac #Dragon #AI #LimitedEdition
```

#### 4. Famous People Section Update (PAID Page)

Updated ZodiacSummary.tsx Famous People display:

**Before:** Simple badge with name only
**After:** Numbered list with name + description

**Visual:**
```
⭐ Famous Earth Dragon ⭐

[1] Benedict Cumberbatch
    Actor, Sherlock Holmes, Doctor Strange

[2] Ryan Reynolds
    Actor, Deadpool, entrepreneur

[3] Reese Witherspoon
    Actress, producer, Legally Blonde

You share your Earth Dragon sign with these legends!
```

### Files Modified

| File | Changes |
|------|---------|
| `src/constants/zodiac-fun-facts.ts` | NEW - 60 celebrity data entries |
| `src/components/reveal/ZodiacSummary.tsx` | Quote at top, Famous People with descriptions |
| `src/components/reveal/ShareButtons.tsx` | Viral content with emojis, hashtags |
| `src/app/free/page.tsx` | Already had updates from previous session |

### Key Technical Decisions

#### Quote Position: TOP vs BOTTOM
**Decision:** Move quote to TOP of forecast
**Reasoning:** Immediate celebrity association creates value recognition. Users see "Oscar Wilde was a Wood Rat like me!" before reading the forecast, establishing credibility.

#### Celebrity Descriptions: Always Show
**Decision:** Always show celebrity descriptions, not just on hover
**Reasoning:** Many users won't recognize all celebrities. "LeBron James - NBA legend, 4x champion" provides context that "LeBron James" alone doesn't.

#### Element Colors: Gradient vs Solid
**Decision:** Use gradient text for quotes
**Reasoning:** Matches the artistic aesthetic of the digital art cards. Creates visual interest and brand consistency.

### Current Version Status

| Version | Date | Key Features |
|---------|------|--------------|
| **1.4.0** | **Jan 19** | **Celebrity quotes at TOP, viral share content** |
| 1.3.0 | Jan 18 | Rotating backgrounds, LinkedIn share, marketing grids |
| 1.2.0 | Jan 17 | Analytics, Share Talisman Image |
| 1.1.0 | Jan 16 | Limited Edition system, Maker's Mark |
| 1.0.0 | Jan 14 | Production launch |

### Marketing Launch Status

**All systems ready for marketing push:**
- ✅ Celebrity quotes add perceived value
- ✅ Viral share content optimized
- ✅ Visual polish complete
- ✅ Share buttons working across platforms
- ✅ Privacy messaging prominent
- 🟢 29 days until CNY (Feb 17, 2026)

### Quick Commands

```bash
# Navigate to project
cd /mnt/c/src/redhorse

# Run locally
npm run dev

# Type check
npx tsc --noEmit

# Push changes
git add -A && git commit -m "message" && git push origin main
```

---

## Session Update: January 19, 2026 - Landing Page Redesign & Simplification

### Current Status: PRODUCTION READY - CLEAN & SIMPLE

### What Was Completed This Session

#### 1. Landing Page Complete Reorganization
Restructured the landing page for clarity with TWO CLEAR PATHS:

**Before:** Confusing layout with "Choose Your Path" options appearing before FREE button
**After:** Clean separation - FREE first, then PAID

**New Structure:**
```
1. RED HORSE ORACLE title + 丙午年
2. Value Prop Badge (World's First, Authenticated Limited Edition, AI Zodiac Oracle)
3. Three badges: ✦ NUMBERED | 🖼️ VERIFIED | 🛡️ PRIVATE
4. Hero Image
5. Product Card:
   ├── 🔮 FREE Section (green border)
   │   ├── "START HERE — IT'S FREE!"
   │   ├── [GET YOUR FREE RED HORSE ORACLE READING NOW] button
   │   └── ✓ No Payment ✓ No Personal Info ✓ No Login ✓ No Email
   │
   ├── ═══ OR ═══ divider
   │
   └── 🔥 PAID Section (gold border)
       ├── "THE LIMITED EDITION — COMPLETE ORACLE"
       ├── Oracle preview image
       ├── [GET MY ORACLE — $8.88] button
       ├── ✓ No Personal Info ✓ No Login ✓ No Email
       └── 🎲 Wealth ⚔️ Power ❤️ Love 🛡️ Shield
6. See Examples link
7. Footer
```

#### 2. Scrolling Marquee Ticker
Added celebrity quote ticker at bottom of page:

**Features:**
- Position: fixed bottom, z-0 (behind content)
- Text: 2xl/3xl (~24-30px)
- Opacity: 30% (subtle background element)
- pointer-events: none (clicks pass through)
- 45-second scroll loop

**Quotes Include:**
- 🔥 Beyoncé (Metal Rooster, 1981): "I don't like to gamble, but if there's one thing I'm willing to bet on, it's myself."
- 🐴 Halle Berry (Fire Horse, 1966): "I'm going to follow my path. I'm going to run my race."
- 🔥 Janet Jackson (Fire Horse, 1966): "I only have to follow my heart."
- 🐴 Robin Wright (Fire Horse, 1966): "I was always willful. I'll do it my way."

**Beyoncé Quote Significance:**
- Metal Rooster = confident, ambitious, high standards
- "Bet on yourself" ties directly to paid oracle CTA
- Perfect marketing alignment

#### 3. FREE Page Share Modal
Fixed share buttons that weren't working:

**Old:** Buttons copied text then immediately opened windows (confusing)
**New:** Modal popup with:
- Pre-formatted share text visible
- Big "COPY POST TO CLIPBOARD" button
- Success confirmation
- Quick links to Twitter, LinkedIn, Facebook

**Share Content Includes:**
- User's zodiac element + animal
- 2026 mantra
- Fun fact
- Famous person with same sign
- Fire Horse 2026 mention
- Link to redhorseoracle.com/free
- Hashtags

#### 4. Simplified Messaging
Removed redundancy throughout:

**Removed:**
- "Google Gemini 3 Pro Powered" (too technical)
- Detailed "Once-in-60-Year Opportunity" card (redundant with mode emojis)
- Duplicate hero image inside paid section
- Verbose Privacy by Design section (now just badges + button text)
- Social proof quote with "(Fictional)"

**Kept Simple:**
- World's First
- Authenticated Limited Edition
- AI Zodiac Oracle
- Three badges: NUMBERED, VERIFIED, PRIVATE

#### 5. Privacy Badges Under Both Buttons
Added consistent privacy messaging:

**FREE button:** ✓ No Payment ✓ No Personal Info ✓ No Login ✓ No Email
**PAID button:** ✓ No Personal Info ✓ No Login ✓ No Email (no "No Payment")

### Files Modified

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Complete reorganization, marquee ticker, simplified value prop |
| `src/app/free/page.tsx` | Share modal with copy-to-clipboard |
| `src/constants/zodiac-fun-facts.ts` | Updated Fire Horse celebrities, added Beyoncé quote |

### Design Principles Applied

1. **Less text, more simple** - Removed verbose explanations
2. **Non-redundant** - Each piece of info appears once
3. **Two clear paths** - FREE (green) vs PAID (gold)
4. **CTAs are the exception** - OK to repeat call-to-action buttons
5. **Privacy as feature** - Badges + button text, not verbose sections
6. **Background elements don't block UI** - Marquee at z-0, pointer-events-none

### Current Version Status

| Version | Date | Key Features |
|---------|------|--------------|
| **1.6.0** | **Jan 22** | **PWA support - Install App button, service worker, manifest** |
| 1.5.0 | Jan 19 | Landing page redesign, marquee ticker, share modal |
| 1.4.0 | Jan 19 | Celebrity quotes at TOP, viral share content |
| 1.3.0 | Jan 18 | Rotating backgrounds, LinkedIn share, marketing grids |
| 1.2.0 | Jan 17 | Analytics, Share Talisman Image |
| 1.1.0 | Jan 16 | Limited Edition system, Maker's Mark |
| 1.0.0 | Jan 14 | Production launch |

---

## Next Steps Plan

### Immediate (When You Return)

1. **Marketing Launch Prep**
   - [ ] Create social media posts with screenshots of new landing page
   - [ ] Draft LinkedIn article: "Building a Privacy-First AI Product"
   - [ ] Prepare Product Hunt listing

2. **Content Creation**
   - [ ] Record short video walkthrough of FREE → PAID flow
   - [ ] Create Instagram/TikTok content showing oracle generation
   - [ ] Write press release for CNY launch

3. **Technical (If Needed)**
   - [ ] Test full payment flow end-to-end
   - [ ] Verify all 4 modes generate correctly
   - [ ] Mobile responsiveness check

### Pre-CNY (Before Jan 29, 2026)

1. **Influencer Outreach**
   - Identify 10-20 astrology/Chinese culture influencers
   - Prepare free oracle codes for gifting
   - Draft outreach templates

2. **Paid Advertising**
   - Set up Facebook/Instagram ad account
   - Create ad creatives using new landing page screenshots
   - Define target audiences (Chinese diaspora, astrology enthusiasts)

3. **SEO & Analytics**
   - Verify Google Analytics tracking
   - Submit sitemap to Google Search Console
   - Check meta tags and OG images

### CNY Launch Week (Jan 29 - Feb 5)

1. **Product Hunt Launch** - Target Tuesday or Wednesday
2. **Social Media Blitz** - Post across all platforms
3. **Monitor & Optimize** - Watch conversion rates, fix issues

---

## Quick Reference

### Live URLs
| Page | URL |
|------|-----|
| Production | https://redhorseoracle.com |
| Free Reading | https://redhorseoracle.com/free |
| Examples | https://redhorseoracle.com/examples |
| Admin Test | https://redhorseoracle.com/admin-test (PIN: 142857) |
| SuperAdmin | https://redhorseoracle.com/superadmin (PIN: 142857) |

### Quick Commands
```bash
cd /mnt/c/src/redhorse
npm run dev              # Local development
npm run build            # Production build
npx tsc --noEmit         # Type check
git add -A && git commit -m "message" && git push origin main  # Deploy
```

### Key Dates
- **Today:** January 22, 2026
- **CNY 2026:** January 29, 2026 (7 days away)
- **Fire Horse Year Ends:** February 2027

---

## Session Update: January 22, 2026 - PWA Support

### Current Status: v1.6.0 PRODUCTION LIVE

### What Was Completed This Session

#### 1. Progressive Web App (PWA) Implementation
Made the app installable on iPhone/Android without App Store:

**New Files Created:**
| File | Purpose |
|------|---------|
| `/public/manifest.json` | App metadata (name, icons, colors, display mode) |
| `/public/sw.js` | Service worker for caching static assets |
| `/public/assets/icons/icon-192x192.png` | Small app icon |
| `/public/assets/icons/icon-512x512.png` | Large app icon |

**Modified Files:**
| File | Changes |
|------|---------|
| `/src/app/layout.tsx` | Added PWA meta tags + service worker registration |
| `/src/app/page.tsx` | Added Install App button + instructions modal |

#### 2. Install App Button & Modal
Added visible "Install App" button on landing page:
- **Position:** Top-left corner, gold button
- **Modal:** Step-by-step instructions for iPhone and Android
- **Benefits listed:** Faster loading, works offline, no browser bar

#### 3. Unique OG Images Per Page
Fixed social sharing images:
- **Main page:** Uses `Fire-Horse-2026-Chart-v3.jpeg`
- **/free page:** Uses `og-free-reading.jpeg` (created `/src/app/free/layout.tsx`)
- **Key fix:** OG images require ABSOLUTE URLs, not relative

#### 4. PWA Documentation
Created comprehensive reusable guide:
- **File:** `/docs/PWA-SETUP-GUIDE.md`
- **Contents:** Step-by-step PWA setup for any Next.js app
- **Includes:** manifest.json template, service worker template, layout.tsx additions, install button code

### PWA Quick Reference

**Required Files:**
```
/public/manifest.json          # App metadata
/public/sw.js                  # Service worker
/public/assets/icons/icon-192x192.png
/public/assets/icons/icon-512x512.png
```

**Layout.tsx Additions:**
```tsx
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#dc2626" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Your App Name" />
  <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png" />
  {/* Service Worker Registration Script */}
</head>
```

**Testing PWA:**
1. Chrome DevTools → Application tab → Manifest (verify loads)
2. Chrome DevTools → Application tab → Service Workers (verify registration)
3. Mobile: Share → Add to Home Screen

---

## Best Practices & Lessons Learned

### Standard Practice: Add PWA to Every Web App

**Why:** Increases perceived value, enables "Install App" without App Store, faster repeat visits.

**Implementation Time:** 30-60 minutes

**Files Required:**
1. `/public/manifest.json` - App metadata
2. `/public/sw.js` - Service worker for caching
3. `/public/assets/icons/icon-192x192.png` - Small icon
4. `/public/assets/icons/icon-512x512.png` - Large icon
5. Layout.tsx updates - Meta tags + SW registration

**See:** `/docs/PWA-SETUP-GUIDE.md` for complete implementation guide.

### OG Images Must Use Absolute URLs

**Problem:** Relative paths like `/assets/og-image.jpeg` don't work for social sharing.

**Solution:** Always use full URLs:
```tsx
openGraph: {
  images: [{
    url: 'https://yourdomain.com/assets/og-image.jpeg',  // ABSOLUTE
    width: 1200,
    height: 630,
  }],
}
```

### Page-Specific Metadata in Next.js App Router

**Problem:** Different pages need different OG images.

**Solution:** Create `layout.tsx` in route folder:
```
/src/app/free/layout.tsx  → Unique OG for /free
/src/app/examples/layout.tsx → Unique OG for /examples
```

### iOS PWA Limitations

| Feature | iOS Support |
|---------|-------------|
| Add to Home Screen | ✅ Yes |
| Full-screen mode | ✅ Yes |
| App icon | ✅ Yes |
| Push notifications | ❌ No |
| Background sync | ❌ No |

**Recommendation:** PWA is sufficient for most apps. Only go native if you need iOS push notifications.

---

## Session Update: January 29, 2026 - Fire Horse Trivia Party Game

### Current Status: COMPLETE - READY FOR DEPLOYMENT

### Major Feature: Kahoot-Style Party Trivia Game

Built a complete multiplayer trivia game for CNY 2026 parties at `/party`.

#### Pricing & Passes

| Pass | Price | Duration | Max Games | Max Players |
|------|-------|----------|-----------|-------------|
| **Day Pass** | $4.88 | 24 hours | 5 | 20 |
| **Weekend Pass** | $8.88 | 48 hours | 10 | 20 |
| **Festival Pass** | $14.88 | 72 hours | 15 | 20 |

#### Key Features

- **Real-time multiplayer** with Supabase Realtime
- **400 trivia questions** across 16 categories
- **Scoring system** with speed bonuses and streak bonuses
- **Leaderboard** with zodiac-specific rankings
- **CSV export** for results/prizes
- **Mobile-first** design with large touch targets

#### New Pages

| Route | Purpose |
|-------|---------|
| `/party` | Landing page with host/join options |
| `/party/host/[code]` | Host console (control game flow) |
| `/party/join` | Enter party code and nickname |
| `/party/play/[code]` | Player game screen |
| `/party/results/[code]` | Game results and leaderboard |
| `/party/success` | Post-purchase confirmation |

#### New API Routes

| Route | Purpose |
|-------|---------|
| `/api/party/create` | Create Stripe checkout for pass |
| `/api/party/join` | Join a party as player |
| `/api/party/answer` | Submit answer |
| `/api/party/webhook` | Handle Stripe payments |

#### New Files

| File | Purpose |
|------|---------|
| `src/types/party.ts` | TypeScript interfaces and helper functions |
| `src/constants/party-questions.ts` | 400 questions (3,282 lines) |
| `docs/GAME-FEATURE-DESIGN.md` | Complete feature specification |
| `docs/migrations/003_party_game_tables.sql` | Database schema |

### Database Tables (Run Migration)

```sql
-- Run this in Supabase SQL Editor:
-- docs/migrations/003_party_game_tables.sql

-- Tables created:
-- party_passes - Purchased passes with party codes
-- party_games - Individual game sessions
-- party_players - Players in each game
-- party_answers - Individual answer submissions
-- party_scores - Final scores for leaderboard
```

### Question Categories (400 Total)

| Category | Count |
|----------|-------|
| Fire Horse & The Great Race | 25 |
| CNY Traditions & Food | 25 |
| History, Art & Horse Lore | 25 |
| 2026 Astronomy & Traditions | 25 |
| Modern Culture & Global Horses | 25 |
| Logic, Math & Zodiac Riddles | 25 |
| Biological & Scientific Facts | 25 |
| Historical War Horses | 25 |
| Horse Equipment & Sports | 25 |
| The Five Elements | 25 |
| Horse Idioms & Phrases | 25 |
| Literature, Myth & Fantasy | 25 |
| Pop Music, Songs & Sound | 25 |
| 2026 CNY Taboos & Superstitions | 25 |
| Grandmaster Zodiac & Math | 25 |
| Final Countdown & Future Lore | 25 |

### Scoring System

| Factor | Points |
|--------|--------|
| Correct Answer | 100 |
| Speed Bonus (first 25% of time) | +50 |
| Speed Bonus (first 50% of time) | +25 |
| Streak Bonus (3 in a row) | +25 |
| Streak Bonus (5 in a row) | +50 |
| Streak Bonus (10 in a row) | +100 |

### Game Flow

1. **Host purchases pass** → Gets 6-character party code
2. **Players join free** → Enter code + nickname + birth year
3. **Host starts game** → 3-2-1 countdown
4. **Questions appear** → Timer counts down
5. **Players answer** → Points calculated instantly
6. **Host reveals answer** → Stats shown
7. **Repeat for all questions** → Game ends
8. **Leaderboard displayed** → Export CSV option

### Stripe Webhook Configuration

Add a new webhook endpoint:
- **URL:** `https://redhorseoracle.com/api/party/webhook`
- **Events:** `checkout.session.completed`
- **Secret:** Store in `STRIPE_PARTY_WEBHOOK_SECRET` (or use main secret)

### Revenue Projections (Party Game)

| Scenario | Passes Sold | Revenue |
|----------|-------------|---------|
| Conservative | 500 | $4,440 |
| Medium | 2,000 | $17,760 |
| Viral | 10,000 | $88,800 |

### Quick Commands

```bash
# Run migration
# Go to Supabase Dashboard → SQL Editor
# Paste contents of docs/migrations/003_party_game_tables.sql

# Test locally
npm run dev
# Visit http://localhost:3000/party
```

### Party URLs (Production)

| Page | URL |
|------|-----|
| Landing | https://redhorseoracle.com/party |
| Join | https://redhorseoracle.com/party/join |
| Host Console | https://redhorseoracle.com/party/host/[CODE] |
| Player Screen | https://redhorseoracle.com/party/play/[CODE] |
| Results | https://redhorseoracle.com/party/results/[CODE] |

---

## Session Update: January 30, 2026 - Party Game Bug Fixes & Player UI Improvements

### Current Status: PRODUCTION READY - All Major Bugs Fixed

### Issues Fixed This Session

#### 1. "Question Has Already Ended" Error (FIXED)
**Problem:** Players were receiving "This question has already ended" errors even when the timer was still running.
**Root Cause:** The answer API was using strict question index comparison which failed due to timing issues.
**Solution:** Changed answer API to check game status (`finished`/`abandoned`) instead of strict question index matching.
**File Modified:** `src/app/api/party/answer/route.ts`

```typescript
// OLD - Too strict
if (game.current_question_index !== questionIndexNum) {
  return NextResponse.json({ error: 'This question has already ended' }, { status: 400 });
}

// NEW - More lenient, checks game status instead
if (game.status === 'finished' || game.status === 'abandoned') {
  return NextResponse.json({ error: 'This game has ended' }, { status: 400 });
}
```

#### 2. Timer Not Showing on Player Screens (FIXED)
**Problem:** Players saw no timer countdown on their screens during gameplay.
**Root Cause:** `timer_seconds` wasn't being updated in the player's gameState when receiving broadcast events.
**Solution:** Added `timer_seconds` to the gameState update when receiving new question broadcasts.
**File Modified:** `src/app/party/play/[code]/page.tsx`

```typescript
setGameState((prev) => ({
  ...prev,
  status: 'playing',
  current_question_index: data.question_index,
  timer_seconds: data.timer_seconds,  // ADDED - was missing!
}));
```

#### 3. Confusing Answer Feedback UI (FIXED)
**Problem:** Players were seeing BOTH "✓ CORRECT ANSWER" and "✗ WRONG" boxes simultaneously, causing confusion.
**Solution:** Combined into a single result box with clear conditional rendering:
- Shows 🎉 "YOU GOT IT!" with points for correct answers
- Shows 😔 "NOT QUITE" with correct answer for wrong answers
- Shows ⏰ "TIME'S UP!" with correct answer if no answer submitted

**File Modified:** `src/app/party/play/[code]/page.tsx`

#### 4. Question Display Format (UPDATED)
**Change:** Updated "Q1 of 20" to "Question 1 of 20" to match host screen format.
**File Modified:** `src/app/party/play/[code]/page.tsx` (lines 441 and 588)

#### 5. Category Display Added
**Change:** Added category badges (e.g., "Grandmaster Zodiac & Math", "Fire Horse & Great Race") to both playing and showing_answer states.
**File Modified:** `src/app/party/play/[code]/page.tsx`

#### 6. Sidebar Leaderboard Layout (MAJOR UI UPDATE)
**Problem:** Leaderboard was positioned below the answer buttons on player screens, inconsistent with host layout.
**Solution:** Restructured player page to use flex layout with sidebar:
- **Desktop (lg+):** Main content on left, sidebar leaderboard on right (64px wide)
- **Mobile:** Leaderboard appears below main content
- Sidebar is sticky and scrollable for many players
- Current player's entry highlighted in yellow
- Top 3 players show medal emojis (🥇🥈🥉)

**File Modified:** `src/app/party/play/[code]/page.tsx`

```jsx
{/* PLAYING / SHOWING ANSWER - with Sidebar Layout */}
{(gameState.status === 'playing' || gameState.status === 'showing_answer') && currentQuestion && (
  <div className="flex gap-4 lg:gap-6">
    {/* Main Content */}
    <div className="flex-1">
      {/* Playing or Showing Answer content */}
    </div>

    {/* Sidebar Leaderboard - visible on large screens */}
    <div className="w-64 hidden lg:block">
      {/* Leaderboard content */}
    </div>
  </div>
)}
```

### Database Migration Required

If not already run, execute this SQL in Supabase:

```sql
-- Add Solo Play Pass columns
ALTER TABLE party_passes
ADD COLUMN IF NOT EXISTS is_solo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS question_sets JSONB DEFAULT '[]'::jsonb;

-- Add game number tracking
ALTER TABLE party_games
ADD COLUMN IF NOT EXISTS game_number INTEGER;
```

**Migration File:** `docs/migrations/003_party_solo_columns.sql`

### Commits Made This Session

1. **6a7cb16** - Update player screen: Question X of 20 format and category badges
2. **d2514a8** - Add sidebar leaderboard layout to player screen

### Files Modified

| File | Changes |
|------|---------|
| `src/app/api/party/answer/route.ts` | Made answer API more lenient, checks game status instead of question index |
| `src/app/party/play/[code]/page.tsx` | Timer sync fix, combined answer feedback UI, sidebar leaderboard, category badges, question format |

### Testing Checklist

- [x] Timer displays correctly on player screens
- [x] Answer feedback shows single combined result box
- [x] Category badges display during gameplay
- [x] Question format shows "Question X of 20"
- [x] Sidebar leaderboard visible on desktop
- [x] Mobile leaderboard shows below content
- [x] Current player highlighted in leaderboard
- [x] Scoring works correctly (100 base + speed bonus + streak bonus)

### Party Game Scoring System

| Component | Points |
|-----------|--------|
| Base (correct answer) | 100 |
| Speed Bonus (< 5s) | 50 |
| Speed Bonus (5-10s) | 25 |
| Streak Bonus (2 in a row) | 25 |
| Streak Bonus (3 in a row) | 50 |
| Streak Bonus (4+ in a row) | 100 |

**Maximum points per question:** 250 (100 base + 50 speed + 100 streak)

### Question Categories (16 total)

1. Fire Horse & Great Race
2. CNY Traditions & Food
3. The Five Elements
4. Grandmaster Zodiac & Math
5. Historical War Horses
6. Horse Equipment & Sports
7. Horse Idioms & Phrases
8. History, Art & Horse Lore
9. Literature, Myth & Fantasy
10. Modern Culture & Global Horses
11. Pop Music & Sound
12. Biological & Scientific Facts
13. 2026 CNY Taboos & Superstitions
14. 2026 Astronomy & Traditions
15. Logic, Math & Zodiac Riddles
16. Final Countdown & Future Lore

### Quick Reference

```bash
# Test party game locally
npm run dev
# Visit http://localhost:3000/party

# Check TypeScript errors
npx tsc --noEmit

# Build for production
npm run build

# Push to production
git add -A && git commit -m "message" && git push origin main
```

### Party URLs

| Page | URL |
|------|-----|
| Landing | https://redhorseoracle.com/party |
| Join | https://redhorseoracle.com/party/join |
| Host Console | https://redhorseoracle.com/party/host/[CODE] |
| Player Screen | https://redhorseoracle.com/party/play/[CODE] |
| Solo Play | https://redhorseoracle.com/party/solo/[CODE] |
| Results | https://redhorseoracle.com/party/results/[CODE] |
| Success | https://redhorseoracle.com/party/success |

### Active Test Pass

| Pass Type | Code | Valid |
|-----------|------|-------|
| **Weekend 2-Day Pass** | **8478JL** | Jan 31 - Feb 2, 2026 |

**Test URLs:**
- Host: https://redhorseoracle.com/party/host/8478JL
- Players join: https://redhorseoracle.com/party/join → Enter code `8478JL`

---

## Party Trivia Architecture & Lessons Learned

### Multi-Tenant Architecture

**CRITICAL:** The Party Trivia game supports MULTIPLE HOSTS running SIMULTANEOUS games worldwide. At any given moment (e.g., 1 PM on a Saturday), there could be:
- Host A in New York with 15 players
- Host B in London with 8 players
- Host C in Tokyo with 20 players

Each host has their OWN UNIQUE game, but all games run on the same infrastructure concurrently.

### Data Isolation Model

```
party_passes (unique per purchase)
    └── party_games (multiple per pass, one active at a time)
            └── party_players (belong to ONE specific game)
            └── party_answers (belong to ONE specific game + player)
```

**Key Relationships:**
- `party_passes.party_code` → Unique 6-character code (e.g., "8478JL")
- `party_games.party_pass_id` → Links game to specific pass
- `party_players.party_game_id` → Links player to specific game
- `party_answers.party_game_id` + `party_answers.player_id` → Links answer to specific game + player

### Game ID is the Source of Truth

**ALWAYS use `game.id` (UUID) to:**
- Query players: `WHERE party_game_id = game.id`
- Query answers: `WHERE party_game_id = game.id`
- Broadcast events: Use channel name `party:${partyCode}` but include `game.id` in payloads
- Calculate leaderboards: Sum points `WHERE party_game_id = game.id`

### Question Pre-Generation Architecture

**At Purchase Time (Webhook):**
1. Generate ALL question sets for all games upfront
2. Store as `question_sets` JSONB array in `party_passes`
3. Use Fisher-Yates shuffle for true randomness
4. Each set is UNIQUE and NON-REDUNDANT

```typescript
// Example: Weekend Pass (10 games × 20 questions = 200 unique questions)
question_sets: [
  [14, 87, 203, 45, ...],  // Game 1 questions
  [312, 56, 178, 92, ...], // Game 2 questions
  // ... 10 sets total
]
```

**At Game Start:**
- Use `question_sets[games_played]` for current game
- NO runtime question generation needed
- Every game is guaranteed unique questions

### Lessons Learned (January 2026)

#### 1. Game ID Mismatch Bug (CRITICAL)

**Problem:** Scoring broke because players were in a DIFFERENT game than the host.

**Root Cause:** The Join API was creating NEW games if it couldn't find one:
```typescript
// BAD - Creates duplicate games!
if (!game) {
  const newGame = await createGame();
  game = newGame;
}
```

**Result:**
- Host creates Game A
- Player join API creates Game B
- Player answers go to Game B
- Host queries Game A → finds nothing → 0% correct!

**Fix:** Join API should ONLY find existing games, never create:
```typescript
// GOOD - Only find, never create
const game = await findActiveGame(pass.id);
if (!game) {
  return { error: 'No active game. Wait for host.' };
}
```

**Rule:** Only the HOST creates games (via `/api/party/game`). Players only JOIN.

#### 2. RLS (Row Level Security) Blocking Inserts

**Problem:** Client-side Supabase couldn't insert into `party_games` table.

**Root Cause:** RLS policies blocked inserts from anon key.

**Fix:** Create server-side API route with service role key:
```typescript
// /api/party/game/route.ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Service role bypasses RLS
);
```

**Rule:** For tables with RLS, use API routes with service role key.

#### 3. Legacy Pass Compatibility

**Problem:** Old passes don't have pre-generated `question_sets`.

**Solution:** API falls back to Fisher-Yates shuffle if no pre-generated sets:
```typescript
if (questionSets && questionSets.length > setIndex) {
  questionIds = questionSets[setIndex];
} else {
  // Legacy fallback - generate on the fly
  questionIds = generateRandomQuestions(20);
}
```

#### 4. No "Restart" Button Needed

**Old Design:** Had "RESTART GAME — Same Questions" button.

**Why Removed:**
- Pre-generated sets mean every START GAME uses NEXT unique set
- No need to "refresh" questions - they're already unique
- Simpler UX: Just "START GAME" and "PLAY ANOTHER GAME"

### API Routes Summary

| Route | Purpose | Auth |
|-------|---------|------|
| `/api/party/create` | Create Stripe checkout for pass purchase | None |
| `/api/party/webhook` | Handle Stripe payment, create pass + first game | Stripe signature |
| `/api/party/game` | Create new game (host only) | Service role |
| `/api/party/join` | Player joins existing game | Service role |
| `/api/party/answer` | Submit player answer | Service role |

### Real-Time Event Flow

```
Host Page                    Player Pages
    │                             │
    ├── startGame() ──────────────┤
    │   broadcast: game_start     │
    │                             │
    ├── showNextQuestion() ───────┤
    │   broadcast: next_question  │
    │   payload: { question, timer_seconds }
    │                             │
    │                             ├── handleAnswer()
    │                             │   POST /api/party/answer
    │                             │
    ├── handleQuestionEnd() ──────┤
    │   broadcast: question_end   │
    │                             │
    ├── showAnswer() ─────────────┤
    │   broadcast: show_answer    │
    │   payload: { correct_answer, stats, leaderboard }
    │                             │
    ├── endParty() ───────────────┤
    │   broadcast: party_end      │
```

### Debugging Checklist

When scoring isn't working:

1. **Check Game IDs Match**
   - Host debug shows: `Game: XXXXXXXX-...`
   - Player should be in SAME game ID
   - Query: `SELECT * FROM party_players WHERE party_game_id = 'XXX'`

2. **Check Answer Table**
   - `SELECT * FROM party_answers WHERE party_game_id = 'XXX'`
   - Verify `is_correct` column is TRUE for correct answers

3. **Check Question ID**
   - Compare `question_id` in answer with actual question shown
   - Mismatch means wrong question was sent

4. **Check Leaderboard Query**
   - Should sum `total_points` grouped by `player_id`
   - WHERE clause must include correct `party_game_id`

### Testing Multiple Concurrent Games

To simulate multiple hosts:

1. **Open multiple browser windows** (or use different browsers)
2. **Each purchases a different pass** (or use test passes)
3. **Each has unique party code**
4. **Players join their respective games**
5. **All games run simultaneously without interference**

**Verification:**
- Each host sees ONLY their players
- Each player sees ONLY their game
- Scores don't mix between games
- Leaderboards are independent

---

## 🚨 CRITICAL: Party Trivia Troubleshooting Guide

### Error: "Question not found in cache" - Game Won't Start

**Symptoms:**
- Host clicks "Start Game" but nothing happens
- Console shows: `Question not found in cache: [ID]`
- Players stuck on "Waiting for Host" screen

**Root Cause:**
This happens when a game's `question_ids` array contains IDs that can't be loaded from the database. Common causes:

1. **Legacy Pass Issue** - Pass was created BEFORE `question_sets` were pre-generated at purchase time
   - Console shows: `[LOAD] Pre-generated question sets: 0`
   - Game has random question IDs generated at game creation, not purchase

2. **Database Migration Issue** - Question IDs reference questions that were modified/replaced
   - Placeholder questions (like "Congratulations! You've reached X questions...") were replaced
   - IDs 200, 250, 300, 350 were previously placeholder questions

3. **Cache Timing Issue** - Questions fetched but cache not populated before game starts

**Diagnosis Steps:**
```
1. Open browser console (F12) on host page
2. Look for these log messages:
   - "[LOAD] Pre-generated question sets: X" → If 0, it's a legacy pass
   - "[QUESTIONS] Fetched X questions from database" → Should be 20
   - "Question not found in cache: Y" → The problematic question ID

3. Test the question ID directly:
   curl "https://redhorseoracle.com/api/party/questions?ids=250"
```

**Immediate Fix - Restart Game with Fresh Questions:**
```bash
curl -X POST "https://redhorseoracle.com/api/party/game" \
  -H "Content-Type: application/json" \
  -d '{
    "party_pass_id": "[PASS_ID_FROM_CONSOLE]",
    "party_code": "[CODE]",
    "timer_seconds": 30,
    "game_number": [CURRENT_GAME_NUMBER],
    "action": "restart"
  }'
```

Then refresh the host page - game will have fresh question IDs.

**Prevention - ALWAYS Do These:**

1. **Pre-generate question sets at purchase time** (already implemented in webhook)
   ```typescript
   // In /api/party/webhook - generate 6 sets of 20 unique questions
   const questionSets = generateQuestionSets(6, 20, 400);
   // Store in party_passes.question_sets
   ```

2. **Never modify question IDs in the database** without:
   - Checking if any active games reference those IDs
   - Regenerating question_sets for affected passes

3. **When replacing/deleting questions:**
   - Use UPDATE to modify content, not DELETE + INSERT
   - Keep IDs stable (1-400)
   - If adding new questions, use IDs 401+

4. **Validate question IDs exist before game creation:**
   ```typescript
   // In /api/party/game - verify all IDs exist in DB
   const { count } = await supabase
     .from('party_questions')
     .select('id', { count: 'exact', head: true })
     .in('id', questionIds);

   if (count !== questionIds.length) {
     // Regenerate question set
   }
   ```

### Error: Players Can't Join Game

**Symptoms:**
- Player enters code but gets error
- Player joins but doesn't appear in host's player list

**Common Causes:**
1. **Wrong game_id** - Player registered to old/abandoned game
2. **Presence channel not subscribed** - Supabase realtime issue
3. **RLS policy blocking** - Service role key not used

**Fix:**
```bash
# Check if game exists and is in lobby status
SELECT id, status, party_pass_id FROM party_games
WHERE party_pass_id = (SELECT id FROM party_passes WHERE party_code = 'XXXX')
ORDER BY created_at DESC LIMIT 1;

# Verify players are linked to correct game
SELECT * FROM party_players WHERE party_game_id = '[GAME_ID]';
```

### Error: Answers Not Recording / Leaderboard Empty

**Symptoms:**
- Players answer but host shows 0 answers
- Leaderboard shows all zeros
- Console: "Failed to submit answer"

**Common Causes:**
1. **game_id mismatch** - Player has old game_id in session storage
2. **question_index mismatch** - Type coercion issue (string vs number)
3. **RLS policy** - party_answers insert blocked

**Fix:**
```javascript
// In answer API - always convert to numbers
const questionIndexNum = Number(question_index);
const questionIdNum = Number(question_id);
```

### Quick Reference: Party Trivia API Endpoints

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `POST /api/party/game` | Create/restart game | Service role |
| `GET /api/party/questions?ids=1,2,3` | Fetch questions by ID | Service role |
| `POST /api/party/answer` | Submit player answer | Service role |
| `POST /api/party/join` | Player joins game | Service role |

### Quick Reference: Database Tables

| Table | Key Columns |
|-------|-------------|
| `party_passes` | id, party_code, question_sets (JSONB), games_remaining |
| `party_games` | id, party_pass_id, question_ids (JSONB), status, game_number |
| `party_players` | id, party_game_id, nickname, zodiac_sign |
| `party_answers` | id, party_game_id, player_id, question_id, is_correct, total_points |
| `party_questions` | id (1-400), question, option_a-d, correct_answer |

### Test Pass for Development

**Code:** `8478JL`
**Pass ID:** `1e4baa7b-5e64-4aed-ac0e-90c2e2ba5c7f`
**Note:** This is a legacy pass (no pre-generated question_sets). Use restart API if games fail.

---

## 🚨 React useCallback Stale Closure Bug (CRITICAL)

### The Problem

When using `useCallback`, the callback captures state values at the time of creation. If state updates later, the callback still uses the OLD values.

**BAD Example (Party Host Page Bug):**
```typescript
const [questionsCache, setQuestionsCache] = useState<Map>(new Map());

// This captures questionsCache at creation time (empty Map)
const showNextQuestion = useCallback((index) => {
  const question = questionsCache.get(id); // ALWAYS EMPTY!
}, [questionsCache]); // Even with dependency, still stale on first call

// Later: cache is populated...
setQuestionsCache(newCache);

// But when startGame calls showNextQuestion, it uses the OLD empty cache!
```

### The Fix: Use useRef for Mutable Data

```typescript
// Ref always has current value - no stale closure
const questionsCacheRef = useRef<Map>(new Map());

const fetchQuestions = useCallback(async (ids) => {
  const cache = new Map();
  // ... populate cache

  // CRITICAL: Update ref immediately
  questionsCacheRef.current = cache;
  return cache;
}, []);

const showNextQuestion = useCallback((index) => {
  // Use ref instead of state - always current!
  const question = questionsCacheRef.current.get(id);
}, []); // No dependency needed - ref is mutable
```

### When to Use Ref vs State

| Use Case | Use Ref | Use State |
|----------|---------|-----------|
| Data read in callbacks | ✅ | ❌ |
| Data that triggers re-render | ❌ | ✅ |
| Mutable values (counters, flags) | ✅ | ❌ |
| UI display values | ❌ | ✅ |
| Cache/lookup tables | ✅ | ❌ |

### Rule: If callback reads data that changes, use useRef

This is especially important for:
- Game state machines
- Real-time data (subscriptions)
- Caches populated asynchronously
- Counters/accumulators

---

*火马年 2026 - Year of the Fire Horse*
