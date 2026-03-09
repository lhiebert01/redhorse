# Red Horse Oracle - Release Notes

## Version 1.6.0 - Gemini Model Migration & Webhook Fix (March 9, 2026)

**Status:** PRODUCTION LIVE
**Release Date:** March 9, 2026

---

### Highlights

Emergency fix after Google deprecated `gemini-3-pro-preview` (text model) on March 9, 2026. The image model (`gemini-3-pro-image-preview`) was NOT deprecated — only the text model. An incorrect automated fix broke the webhook for ~9 hours by converting the single model export to an array with a fallback loop, which crashed the Vercel serverless function.

---

### Root Cause

Google deprecated the text model `gemini-3-pro-preview`. A Claude Code session attempted to fix this by:
1. Changing `TEXT_MODEL` (string) to `TEXT_MODELS` (array) in `client.ts`
2. Adding a for-loop fallback pattern in `generate.ts`
3. Incorrectly changing `IMAGE_MODEL` to `gemini-3.1-pro-image-preview` (does not exist)

This caused the Vercel function to crash with empty `""` responses on every Stripe webhook delivery. Two customer orders were stuck as "processing" in Supabase and required manual cleanup.

---

### Fixes Applied

#### Text Model Migration
- `TEXT_MODEL` changed from `gemini-3-pro-preview` to `gemini-3-flash-preview`
- Kept as a **single string export** — no arrays, no fallback chains

#### Image Model Preserved
- `IMAGE_MODEL` remains `gemini-3-pro-image-preview` (was never deprecated)
- Reverted incorrect change to non-existent `gemini-3.1-pro-image-preview`

#### Webhook Retry Logic
- Added retry logic for failed prophecy records (status `'failed'` → delete and re-process)
- Existing "processing" records still skip to prevent race conditions

#### Fixed Deprecated Meta Tag
- Changed `apple-mobile-web-app-capable` to `mobile-web-app-capable` in `layout.tsx`

#### CLAUDE.md Updated
- Added critical "DO NOT BREAK" instructions at the top of CLAUDE.md
- Documents exact model names, what not to change, and why
- Describes the March 9 incident to prevent recurrence

---

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/gemini/client.ts` | `TEXT_MODEL` = `gemini-3-flash-preview` (single string, not array) |
| `src/lib/gemini/generate.ts` | Reverted to single model call (no for-loop) |
| `src/app/api/webhook/route.ts` | Added retry logic for failed prophecy records |
| `src/app/layout.tsx` | Fixed deprecated meta tag |
| `CLAUDE.md` | Added critical model configuration rules and incident documentation |

---

### Correct Model Configuration (as of March 9, 2026)

```typescript
// src/lib/gemini/client.ts
export const TEXT_MODEL = 'gemini-3-flash-preview';       // Was gemini-3-pro-preview (deprecated)
export const IMAGE_MODEL = 'gemini-3-pro-image-preview';  // NOT deprecated, still works
```

---

### Lessons Learned

1. **Never convert single exports to arrays** — changes the import contract across files
2. **Never guess model names** — `gemini-3.1-pro-image-preview` does not exist
3. **Webhook functions crash silently** — empty response `""` means the function died during init or execution
4. **Stuck "processing" records block retries** — Stripe resends webhooks, but idempotency check skips them
5. **Always ask before changing model configuration** — the app processes real payments

---

### Database Cleanup Required

After the fix, two stuck records needed manual deletion from Supabase `prophecies` table:
- Records with status `'processing'` and null `main_text`/`image_url`
- After deletion, resending the Stripe webhook successfully generated the prophecies

---

## Version 1.5.0 - Google Analytics & Admin Enhancements (January 20, 2026)

**Status:** PRODUCTION LIVE
**Release Date:** January 20, 2026

---

### Highlights

This release adds **Google Analytics 4 (GA4) Integration**, **Enhanced Admin Dashboard**, **Date Validation**, **Comprehensive Analytics Tracking**, and **Green-Themed UI Consistency** across FREE and PAID pages.

---

### New Features

#### Google Analytics 4 (GA4) Integration
- **Measurement ID:** `G-EV6LX78YP1` (hardcoded for reliability)
- **Property Name:** `RedHorseOracle.Com`
- **Implementation:** Raw `<script>` tags in `<head>` section of `layout.tsx`
- **Status:** ✅ Working - Real-time tracking active
- **Quick Access:** Direct link to GA4 Realtime from Admin panel

#### GA4 Quick Access Links
| Purpose | URL |
|---------|-----|
| **Realtime Dashboard** | https://analytics.google.com → Select RedHorseOracle.Com → Realtime |
| **All Reports** | https://analytics.google.com → Select RedHorseOracle.Com |

#### GA4 Lessons Learned (January 20, 2026)
See `docs/LESSONS-LEARNED.md` for detailed troubleshooting guide.

#### Enhanced Admin Dashboard
- **New Analytics Tab:** Track FREE and PAID oracles by Year, Sign, Element, Mode
- **Summary Cards:** FREE total, PAID total, Combined total
- **Mode Distribution:** Shows PAID oracles breakdown by Wealth/Power/Love/Shield
- **CSV Export:** Download analytics data for FREE or PAID tables
- **Show Zero Rows Toggle:** Option to include all years even with zero counts
- **GA4 Link:** Direct link to Google Analytics Realtime in footer

#### Date Validation (1910-2027)
- **Friendly error messages** for dates outside supported range
- **Prevents spoofing/hacking** with extreme dates
- **Applied to:** FREE page date input, Admin Test Console
- **New utility:** `/src/lib/validation/date-validator.ts`
- **Error messaging:** "The Fire Horse Oracle supports years from 1910 to 2027..."

#### Analytics Tracking Enhancements
- **Birth Year Tracking:** Now tracks birth year (not full DOB - privacy preserved)
- **Focus Mode Tracking:** Tracks which oracle mode (Wealth/Power/Love/Shield)
- **Composite Key Format:** `YYYY-Sign-Element-Type-Mode`
- **Database Migration:** Added `birth_year` and `focus_mode` columns

#### Green-Themed UI Consistency (PAID Page)
- **Quote Banner:** Emerald/teal gradient with outer glow
- **Zodiac Card:** Green border with gradient background
- **Strengths Badges:** Green themed styling
- **Characteristics:** Green gradient treatment
- **Oracle Wisdom:** Green themed card
- **Save Button:** Green gradient with hover effects
- **Fun Facts:** Green header and mantra styling
- **Background:** Dark green (`#050a05`) for consistency with FREE page

---

### Modified Files

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | GA4 script integration with env var support |
| `src/app/admin-test/page.tsx` | Analytics tab, date validation, GA4 link in footer |
| `src/app/free/page.tsx` | Date validation with friendly errors |
| `src/app/api/analytics/track/route.ts` | Birth year and focus mode tracking |
| `src/app/api/analytics/stats/route.ts` | Comprehensive stats API with CSV export |
| `src/components/reveal/ZodiacSummary.tsx` | Green UI treatments for PAID page |
| `src/lib/validation/date-validator.ts` | NEW - Date validation utility |
| `CLAUDE.md` | Added GA4 section with quick access links |

---

### New Files

| File | Purpose |
|------|---------|
| `src/lib/validation/date-validator.ts` | Date validation for 1910-2027 range |
| `docs/migrations/003_analytics_birth_year.sql` | SQL migration for analytics columns |

---

### Database Migration

Run in Supabase SQL Editor:
```sql
-- Add new columns to oracle_analytics table
ALTER TABLE oracle_analytics
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS focus_mode TEXT;

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_oracle_analytics_birth_year
ON oracle_analytics (birth_year);

CREATE INDEX IF NOT EXISTS idx_oracle_analytics_type_year
ON oracle_analytics (oracle_type, birth_year);
```

---

### Environment Variables

Added to Vercel:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-S90TFZBY84
```

---

### Admin Panel Enhancements

#### Footer Links (Updated)
```
📈 Google Analytics (Realtime) | 📊 SuperAdmin Dashboard | 📸 Collections Screenshot | 🎨 Examples Page | Return to Home
```

#### Analytics Tab Features
- View FREE or PAID analytics separately
- Filter by showing/hiding zero rows
- Download CSV for either table
- See mode distribution for PAID oracles
- Auto-refresh capability

---

## Version 1.4.0 - Celebrity Quotes & Viral Share Content (January 19, 2026)

**Status:** PRODUCTION LIVE
**Release Date:** January 19, 2026

---

### Highlights

This release adds **Artistic Celebrity Quote Banners**, **Celebrity Descriptions**, **Enhanced Viral Share Content**, and positions quotes at the TOP of the forecast for immediate celebrity value recognition.

---

### New Features

#### Artistic Celebrity Quote Banner (TOP of Forecast)
- **Position:** Celebrity quote now displays at the TOP of the Oracle Forecast (both FREE and PAID pages)
- **Gradient text effect** matching element colors (Wood=green, Fire=red, Earth=yellow, Metal=silver, Water=blue)
- **Decorative corner elements** (✦) for artistic framing
- **Quote author with description** explaining who the celebrity is
- **Celebrity badge** with element-specific gradient background

#### Celebrity Descriptions (60 Zodiac Combinations)
- **New data structure:** `CelebrityInfo` with `name` and `description` fields
- **All 60 zodiac combinations** now have celebrity bios (who they are, what they do)
- **Example:** `{ name: 'LeBron James', description: 'NBA legend, 4x champion' }`
- **Quote author descriptions** added for attribution context

#### Enhanced Viral Share Content (PAID Page)
- **Mode-specific emojis:** 🎲💰 Wealth, ⚔️👑 Power, ❤️💕 Love, 🛡️✨ Shield
- **Urgency messaging:** "Next: 2086 - will you even be alive?"
- **Hashtags added:** #FireHorse2026 #ChineseZodiac #LimitedEdition #AI
- **Updated platforms:** Twitter, WhatsApp, Telegram share text enhanced
- **Copy Message button:** Full viral content with emojis and hashtags

#### Famous People Section (PAID Page)
- **Updated to object structure:** `person.name` and `person.description`
- **Numbered list with colorful badges** (gold #1, purple #2, pink #3)
- **Shows who each celebrity is** for users unfamiliar with names

---

### Modified Files

| File | Changes |
|------|---------|
| `src/constants/zodiac-fun-facts.ts` | NEW - 60 zodiac celebrity data entries |
| `src/components/reveal/ZodiacSummary.tsx` | Artistic quote at top, updated Famous People |
| `src/components/reveal/ShareButtons.tsx` | Viral share content with emojis/hashtags |
| `src/app/free/page.tsx` | Celebrity quote banner, updated Famous People |

---

### Data Structure Changes

#### CelebrityInfo Interface
```typescript
export interface CelebrityInfo {
  name: string;
  description: string;  // Who they are, what they do
}

export interface ZodiacFunFact {
  years: number[];
  famousPeople: CelebrityInfo[];  // Changed from string[]
  mantra: string;
  quote: string;
  quoteAuthor: string;
  quoteAuthorDescription: string;  // NEW - Celebrity bio
  funFact: string;
  emoji: string;
}
```

---

### Share Content Example

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

---

## Version 1.3.0 - Visual Polish & Marketing Assets (January 18, 2026)

**Status:** PRODUCTION LIVE
**Release Date:** January 18, 2026

---

### Highlights

This release adds **Rotating Background System**, **Collections Grid Screenshot Tool**, **LinkedIn Share Button**, **Marketing Grid Assets**, and visual refinements for the landing page.

---

### New Features

#### Rotating Background System (Landing Page)
- **Smooth crossfade transitions** between background images
- **16-second intervals** with 2.5-second fade duration
- **Two-layer approach** for seamless transitions (no snapping)
- **Sequence:** Main Chart → Grid 1 → Main Chart → Grid 3
- **Background sizing:** `contain` to show full images without edge cutoff
- **Position anchoring:** `top center` to ensure headers visible

#### Marketing Grid Assets
Added 5 marketing screenshots to `/public/assets/`:
- `marketing-grid-1.jpg` - 4x3 horizontal grid (all 60 zodiac cards)
- `marketing-grid-2.jpg` - Alternative horizontal layout
- `marketing-grid-3.jpg` - Horizontal with different sorting
- `marketing-grid-4.jpg` - Horizontal variant
- `marketing-grid-5-mobile.jpg` - Vertical layout for mobile

#### Collections Grid Screenshot Tool
- **New page:** `/collections-grid` - Dedicated page for screenshot capture
- **Controls:** Columns (1-4), Gap (0-16px), Scale (60-100%), Background
- **Keyboard shortcut:** Press `H` to toggle controls visibility
- **Purpose:** Generate marketing materials showing all 12 zodiac collections

#### LinkedIn Share Button
- **New button** on reveal page share panel
- **3x2 grid layout** for all share buttons
- **Platform-specific indicators:** "Works!" for Twitter/WhatsApp/Telegram, "Link only" for Facebook
- **Removed:** Native share button (unreliable across platforms)

#### Background Transparency Refinements
- **Landing page:** 30% opacity (increased from 18% for better visibility)
- **Reveal page:** 18% opacity (subtle, non-distracting)
- **Examples page:** 18% opacity
- **Removed blur filter** for crystal-clear image quality

#### OG Image Configuration
- **Current OG image:** `Fire-Horse-2026-Chart-v3.jpeg` (full brightness for social sharing)
- **Landing background:** `Fire-Horse-2026-Chart-v2.jpeg` (30% opacity)
- **Verified:** LinkedIn Post Inspector and Facebook Sharing Debugger

---

### Modified Files

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Rotating backgrounds with crossfade, contain sizing, top positioning |
| `src/app/collections-grid/page.tsx` | New collections screenshot page |
| `src/app/admin-test/page.tsx` | Added Collections tab with grid controls |
| `src/components/reveal/ShareButtons.tsx` | Added LinkedIn, 3x2 grid layout |
| `src/app/reveal/page.tsx` | Background opacity adjustments |
| `src/app/examples/page.tsx` | Background opacity adjustments |

---

### New Assets

| File | Purpose |
|------|---------|
| `/public/assets/marketing-grid-1.jpg` | Horizontal marketing grid |
| `/public/assets/marketing-grid-2.jpg` | Horizontal marketing grid |
| `/public/assets/marketing-grid-3.jpg` | Horizontal marketing grid |
| `/public/assets/marketing-grid-4.jpg` | Horizontal marketing grid |
| `/public/assets/marketing-grid-5-mobile.jpg` | Vertical mobile grid |

---

### Technical Details

#### Crossfade Implementation
```typescript
const BACKGROUND_IMAGES = [
  '/assets/Fire-Horse-2026-Chart-v2.jpeg',  // Main
  '/assets/marketing-grid-1.jpg',            // Grid 1
  '/assets/Fire-Horse-2026-Chart-v2.jpeg',  // Main
  '/assets/marketing-grid-3.jpg',            // Grid 3
];

const ROTATION_INTERVAL = 16000; // 16 seconds

// Two-layer approach for smooth crossfade
// Layer 1: currentIndex with opacity transition
// Layer 2: nextIndex with inverse opacity transition
// 2.5 second transition duration
```

#### Background CSS Settings
```css
backgroundSize: 'contain',      /* Full image, no cropping */
backgroundPosition: 'top center', /* Headers visible */
opacity: 0.30,                  /* 30% for landing page */
transition: 'opacity 2.5s ease-in-out'
```

---

## Version 1.2.0 - Analytics & Sharing (January 17, 2026)

**Status:** PRODUCTION LIVE
**Release Date:** January 17, 2026

---

### Highlights

This release adds **Analytics Tracking**, **Share Talisman Image** functionality, **Webhook Idempotency**, and numerous quality-of-life improvements.

---

### New Features

#### Analytics Dashboard (Admin)
- **Access:** `/admin-analytics` (PIN: 142857)
- Tracks free readings and paid oracles by zodiac sign
- Real-time counters with auto-refresh (30 seconds)
- Revenue tracking by zodiac sign
- No PII collected - only counters for marketing

#### Share Talisman Image (Paid Users Only)
- New gold "Share Talisman Image" button on reveal page
- Shares direct Supabase Storage URL to the authenticated talisman
- Includes edition number and zodiac info in share text
- Separate X/Twitter button for image sharing
- Free users can only share the app URL, not talisman images

#### Save Zodiac Forecast (Paid Users Only)
- New "Save Zodiac Forecast" button on reveal page
- Downloads zodiac card as PNG with strengths, characteristics, forecast
- Consistent filename: `fire-horse-2026-{element}-{animal}-forecast.png`

#### Consistent File Naming
- Talisman: `fire-horse-2026-{element}-{animal}-talisman.png`
- Forecast: `fire-horse-2026-{element}-{animal}-forecast.png`
- Users can identify zodiac sign from filename

#### Webhook Idempotency Fix
- Prevents double-processing if Stripe retries webhook
- Checks if session_id already exists before processing
- Handles race conditions with duplicate key detection
- Fixes potential double-charge issues

#### Edition System Updates
- **Unified closing date:** All signs close February 17, 2027
- Full Fire Horse year availability (Feb 17, 2026 - Feb 5, 2027)
- 888 editions per zodiac per mode (42,624 total)

#### UI Improvements
- Updated "PII" to user-friendly language
- "100% PII-FREE" now shows "(No Personally Identifiable Information)"
- Simplified messaging throughout

---

### New Files

| File | Purpose |
|------|---------|
| `src/app/admin-analytics/page.tsx` | Admin analytics dashboard |
| `src/app/api/analytics/track/route.ts` | Increment analytics counters |
| `src/app/api/analytics/stats/route.ts` | Get analytics stats (admin) |
| `supabase/migrations/001_analytics_table.sql` | Analytics table schema |

---

### Technical Changes

#### Database Changes (Supabase)
```sql
-- Run this SQL to create the analytics table
CREATE TABLE oracle_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composite_key TEXT UNIQUE NOT NULL,
  zodiac_sign TEXT NOT NULL,
  zodiac_element TEXT NOT NULL,
  oracle_type TEXT NOT NULL,  -- 'free' or 'paid'
  count INTEGER DEFAULT 1,
  last_generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Version 1.1.0 - Limited Edition System (January 16, 2026)

**Status:** PRODUCTION READY
**Release Date:** January 16, 2026

---

### Highlights

This release adds the **Limited Edition Oracle System** with numbered editions, maker's mark authentication, and provenance tracking. This positions Red Horse Oracle as authenticated digital art, not just a fortune app.

---

### New Features

#### Limited Edition System
- **888 editions per zodiac sign** (10,656 total oracles EVER)
- Unique edition numbers assigned at generation (e.g., "#127 of 888")
- Staggered closing dates per zodiac throughout 2026
- Database tracking: `edition_number`, `total_editions` columns

| Zodiac | Closing Date | Total Editions |
|--------|--------------|----------------|
| Rat | February 28, 2026 | 888 |
| Ox | March 31, 2026 | 888 |
| Tiger | April 30, 2026 | 888 |
| Rabbit | May 31, 2026 | 888 |
| Dragon | June 30, 2026 | 888 |
| Snake | July 31, 2026 | 888 |
| Horse | August 31, 2026 | 888 |
| Goat | September 30, 2026 | 888 |
| Monkey | October 31, 2026 | 888 |
| Rooster | November 30, 2026 | 888 |
| Dog | December 15, 2026 | 888 |
| Pig | December 31, 2026 | 888 |

#### Maker's Mark & Provenance
- Visual Maker's Mark seal on every talisman (RED HORSE 馬 2026)
- Certificate of Authenticity footer with certificate ID
- "AUTHENTIC • VERIFIED • [ZODIAC]" branding
- "Minted by redhorseoracle.com" attribution

#### Certificate of Authenticity (Free Reading Page)
- Limited Edition Certificate preview before purchase
- Shows slots remaining and days until closing
- Zodiac-specific watermark background
- "What You Get" section: Edition #, Maker's Mark, AI Talisman, Prophecy

#### Courage-Based Marketing
- "The Fire Horse Demands Courage" messaging
- "Will YOU Be Bold Enough To Know Your 2026 Destiny?"
- "Are you someone who ACTS? Or someone who waits and wonders?"
- Urgency: "This app will be permanently archived after 2026"

#### Enhanced Value Proposition
- "Authenticated Limited Edition AI Zodiac Oracle"
- Badges: NUMBERED EDITIONS | VERIFIABLE ART | PROVENANCE
- "100% PII-FREE • Privacy by Design • Maker's Mark Authenticated"

#### Free Reading Funnel Enhancements
- "100% PII-FREE" header with privacy badges
- "ZERO DATA STORED • NO TRACKING • NO COOKIES" chips
- "Verifiable Digital Art • Provenance Tracked • Maker's Mark Authenticated"
- Enhanced privacy section after results: "YOUR DATA? ALREADY GONE."

#### Custom Domain
- Live at: https://redhorseoracle.com
- DNS configured via GoDaddy
- Vercel deployment connected

---

### Technical Changes

#### New Files
| File | Purpose |
|------|---------|
| `src/constants/editions.ts` | Edition config per zodiac (dates, slots, Chinese chars) |

#### Modified Files
| File | Changes |
|------|---------|
| `src/types/prophecy.ts` | Added `edition_number`, `total_editions` fields |
| `src/app/api/webhook/route.ts` | Assigns edition # based on completed count per zodiac |
| `src/components/reveal/TalismanDisplay.tsx` | Edition badge + Maker's Mark + Certificate footer |
| `src/app/free/page.tsx` | Limited Edition Certificate, courage CTA, privacy messaging |
| `src/app/page.tsx` | Enhanced value prop with authentication messaging |
| `src/app/sitemap.ts` | Added /free page |
| `src/app/layout.tsx` | Updated siteUrl to redhorseoracle.com |

#### Database Changes (Supabase)
```sql
ALTER TABLE prophecies ADD COLUMN edition_number INTEGER;
ALTER TABLE prophecies ADD COLUMN total_editions INTEGER DEFAULT 888;
```

#### Stripe Configuration
- Webhook URL: `https://redhorseoracle.com/api/webhook`
- Payment Link redirect: `https://redhorseoracle.com/reveal?session_id={CHECKOUT_SESSION_ID}`

---

### Configuration Checklist

- [x] Custom domain (redhorseoracle.com) configured
- [x] Supabase columns added (edition_number, total_editions)
- [x] Stripe webhook updated to new domain
- [x] Payment Link redirect updated to new domain
- [ ] End-to-end payment flow testing
- [ ] All 4 oracle modes tested
- [ ] Marketing launch

---

## Version 1.0.0 - Production Launch (January 14, 2026)

**Status:** PRODUCTION LIVE
**Release Date:** January 14, 2026 (Evening)

---

### Highlights

This release marks the **production launch** of Red Horse Oracle, the world's first AI-powered Fire Horse Oracle with complete Privacy by Design.

**Key Milestone:** Stripe is now in LIVE mode - real payments are being processed.

---

### New Features

#### Stripe Production Integration
- Live Mode payment processing ($8.88 USD)
- Custom checkout fields (Date of Birth, Oracle Path)
- Webhook handling for `checkout.session.completed`
- Automatic redirect to reveal page after payment

#### ZodiacSummary Component
- New component on reveal page showing personalized 2026 forecast
- Displays zodiac animal image, characteristics, and strengths
- Fire Horse compatibility indicator (ally/special/clash/neutral)
- Personalized 2026 Fire Horse year forecast
- Oracle wisdom advice

#### Privacy by Design Implementation
- **"FIRST | ONLY | BEST"** tagline on landing page
- Complete Privacy Policy rewrite emphasizing zero PII collection
- Privacy Info button + modal on Examples page
- Privacy notice integrated into ZodiacSummary
- Data flow: DOB → Calculate Zodiac → Discard DOB → Generate Oracle

#### Expanded Zodiac Data
- Added characteristics for all 12 zodiac animals
- Added core strengths (4 traits per animal)
- Added 2026 Fire Horse year forecasts
- Added Fire Horse relations (ally/special/clash/neutral)

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.6.0 | Mar 9, 2026 | Gemini model migration, webhook crash fix, CLAUDE.md safety rules |
| 1.5.0 | Jan 20, 2026 | Google Analytics 4, Admin enhancements, date validation |
| 1.4.0 | Jan 19, 2026 | Celebrity quotes, viral share content, quote descriptions |
| 1.3.0 | Jan 18, 2026 | Rotating backgrounds, LinkedIn share, marketing assets |
| 1.2.0 | Jan 17, 2026 | Analytics, Share Talisman Image, webhook idempotency |
| 1.1.0 | Jan 16, 2026 | Limited Edition system, Maker's Mark, custom domain |
| 1.0.0 | Jan 14, 2026 | Production launch - Stripe live, Privacy by Design |
| 0.9.0 | Jan 14, 2026 | Examples gallery, comprehensive documentation |
| 0.8.0 | Jan 13, 2026 | Art style system, admin test loop, background watermark |
| 0.5.0 | Jan 12, 2026 | Initial working prototype |

---

## Contributors

- **Lindsay Hiebert** - Chief GenAI Officer, Nybsys
- **Claude (Anthropic)** - AI Development Assistant

---

*火马年 2026 - Year of the Fire Horse*
