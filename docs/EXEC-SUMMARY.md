# Red Horse Oracle - Executive Summary

**Last Updated:** January 14, 2026
**Status:** Ready for Launch
**Owner:** Lindsay Hiebert, Chief GenAI Officer, Nybsys

---

## Document Directory

This executive summary serves as an index to all project documentation and strategic planning materials for Red Horse Oracle.

### Core Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **EXEC-SUMMARY.md** | `docs/EXEC-SUMMARY.md` | This file - Master index and current status |
| **CLAUDE.md** | `/CLAUDE.md` | AI development guide, quick reference, session notes |
| **README.md** | `/README.md` | Public repository documentation |

### Strategic Planning

| Document | Location | Purpose |
|----------|----------|---------|
| **Implementation Plan V6** | `/RED-HORSE-V6-IMPLEMENTATION-PLAN.md` | Complete technical specification, deployment guide, revenue projections |
| **NEXT-STEPS.md** | `docs/NEXT-STEPS.md` | Launch preparation checklist, marketing timeline |
| **MASTER-PROJECTS.md** | `docs/MASTER-PROJECTS.md` | Portfolio overview of 6 SaaS apps |

### Product Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **FEATURES.md** | `docs/FEATURES.md` | Detailed feature specifications, oracle modes, user journey |
| **DESIGN.md** | `docs/DESIGN.md` | UX philosophy, visual identity, design decisions |
| **ANNOUNCEMENT.md** | `docs/ANNOUNCEMENT.md` | Press release, public launch messaging |

---

## Project Overview

### What is Red Horse Oracle?

Red Horse Oracle is an AI-powered SaaS application that generates personalized Chinese zodiac talismans for the Year of the Fire Horse 2026 - a celestial event that occurs only once every 60 years.

### Value Proposition

- **For Users:** Receive a one-of-a-kind masterpiece AI artwork with a personalized prophecy based on their Chinese zodiac sign
- **For Business:** High-margin (90%+) digital product with viral potential and time-sensitive urgency

### Key Dates

| Event | Date |
|-------|------|
| **Chinese New Year 2026** | January 29, 2026 |
| **Target Launch** | Before January 29, 2026 |
| **Fire Horse Last Occurred** | 1966 (60 years ago) |
| **Fire Horse Next Occurrence** | 2086 (60 years from now) |

---

## Product Features

### The Four Oracle Paths

| Mode | Prophecy Type | Format | Example |
|------|--------------|--------|---------|
| **Wealth** | 6 Lucky Numbers | XX-XX-XX-XX-XX-XX | 04-15-28-38-68-84 |
| **Power** | Strategic Motto | 3 words, ALL CAPS | BREAK THE RANK |
| **Love** | Love Decree | 4 words, ALL CAPS | FIERCE LOVE CLAIMS YOU |
| **Shield** | Protective Mantra | 3 words, ALL CAPS | FLAME SHIELDS PEACE |

### Deliverables Per Purchase

1. **AI-Generated Talisman Artwork** - Museum-quality Chinese zodiac masterpiece powered by Gemini 3 Pro
2. **Personalized Prophecy** - Mode-specific decree or numbers
3. **Mystical Reading** - Fire Horse compatibility explanation
4. **Complete Zodiac Forecast** - Personalized 2026 outlook for their specific zodiac sign with characteristics and strengths
5. **Permanent Link** - Shareable URL that never expires
6. **Download Option** - High-resolution image for saving/printing

---

## Privacy-First Architecture

### KEY STRATEGIC ADVANTAGE: Zero PII Retention

Red Horse Oracle is designed with a **privacy-by-design** architecture that stores NO personally identifiable information (PII):

| Data Point | Collected? | Stored? | Shown on Talisman? |
|------------|------------|---------|-------------------|
| **Name** | NO | NO | NO |
| **Date of Birth** | YES (input only) | NO | NO |
| **Email** | YES (Stripe only) | Stripe only | NO |
| **Zodiac Sign** | Calculated | YES (non-PII) | YES (e.g., "Metal Rat") |

### How It Works

1. **User enters birth date** during Stripe checkout
2. **System calculates** Chinese zodiac sign from the date
3. **Date is immediately discarded** - never stored in database
4. **Only zodiac sign retained** - e.g., "Metal Rat" (non-PII)
5. **Generated artwork** contains NO personal information
6. **Example cards** show hypothetical names for illustration only

### Benefits to Users

- No data breach risk for personal information
- No identity exposure on shareable images
- Privacy-compliant by design
- Safe to share on social media
- No additional cookies or tracking beyond secure checkout and payment processing (Stripe uses industry-standard secure payment protocols)

### Benefits to Business

- Simplified GDPR/CCPA compliance
- Reduced data liability
- Competitive differentiation
- Trust-building feature for marketing
- No PII storage infrastructure needed

### Unique Value Proposition

**Red Horse Oracle is the ONLY worldwide app that delivers:**
- Authentic **Gemini 3 Pro AI** powered Chinese zodiac forecasts
- **Complete privacy by design** - no PII stored, retained, or displayed
- Museum-quality **masterpiece digital Chinese artwork**
- Personalized **Year of the Fire Horse 2026 integrated forecast**
- All in one seamless, anonymous experience

---

## Tech Stack Summary

### Core Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Payments | Stripe Payment Links |
| AI Text | Google Gemini 2.0 Flash |
| AI Images | Google Gemini 2.0 Flash (Imagen) |
| Hosting | Vercel Edge Network |

### Unit Economics

| Metric | Value |
|--------|-------|
| Price | $8.88 |
| COGS | ~$0.67 |
| Gross Profit | $8.21 |
| Gross Margin | 92.5% |

---

## Go-To-Market Strategy

### Phase 1: Pre-Launch (Now - Jan 28)

1. **Stripe Production Setup** - Switch from test to live mode
2. **Domain Purchase** - redhorseoracle.com or similar
3. **SEO & Analytics** - Google Analytics, Search Console
4. **Content Marketing** - LinkedIn article, Medium, press release

### Phase 2: Launch Week (Jan 29 - Feb 5)

1. **Product Hunt Launch** - Target top 10
2. **Social Media Push** - X/Twitter, Instagram, TikTok
3. **Influencer Outreach** - Astrology/tarot creators
4. **Paid Ads** - Facebook/Instagram, Google Ads

### Phase 3: CNY Peak (Feb - Mar)

1. **Maximum Ad Spend** - Capitalize on CNY search volume
2. **User Testimonials** - Share wins/stories
3. **Viral Amplification** - Encourage social sharing

---

## Revenue Projections

### 2026 Targets

| Scenario | Visitors | Conversion | Revenue |
|----------|----------|------------|---------|
| Conservative | 20,000 | 3% | $5,328 |
| Base Case | 50,000 | 4% | $17,760 |
| Viral Success | 200,000 | 5% | $88,800 |

### Monthly Breakdown (Base Case)

| Month | Focus | Projected Revenue |
|-------|-------|-------------------|
| January | Soft launch | $2,220 |
| February | CNY peak | $13,320 |
| March | Post-CNY | $7,992 |
| Q2-Q4 | Steady state | $4,000-7,000/month |

---

## Current Status

### Completed

- [x] Core application development
- [x] All 4 oracle modes functional
- [x] AI image generation working
- [x] Examples gallery with 12 zodiac animals
- [x] Stripe payment integration (test mode)
- [x] Supabase database & storage
- [x] Vercel deployment
- [x] OG images for social sharing
- [x] Comprehensive documentation

### In Progress / Next Steps

- [ ] Stripe production mode switch
- [ ] Domain purchase and DNS setup
- [ ] Google Analytics implementation
- [ ] Privacy messaging updates (see below)
- [x] Chinese Zodiac Summary on reveal page (COMPLETED)
- [ ] Product Hunt preparation
- [ ] LinkedIn/Medium articles

### Completed Enhancements (January 14, 2026)

1. **Zodiac Forecast Section** - Added comprehensive 2026 forecast on reveal page with:
   - Zodiac animal image
   - Sign characteristics and strengths
   - Personalized Fire Horse 2026 forecast
   - Oracle wisdom
   - Privacy-by-design messaging

### Pending Enhancements

1. **Privacy Button Updates** - Enhance privacy disclosures throughout the app
2. **SEO Optimization** - Structured data, sitemap, meta tags

---

## Live URLs

| Page | URL |
|------|-----|
| Landing | https://redhorse-omega.vercel.app/ |
| Examples | https://redhorse-omega.vercel.app/examples |
| Admin Test | https://redhorse-omega.vercel.app/admin-test (PIN: 142857) |
| GitHub | https://github.com/lhiebert01/redhorse |

---

## Related Projects (Portfolio)

| # | Project | Status | Priority |
|---|---------|--------|----------|
| 1 | **Red Horse Oracle** | Ready for Launch | HIGH |
| 2 | NeoAesop | In Development | MEDIUM |
| 3 | CC-AI | In Development | MEDIUM |
| 4 | BookMobile | WIP | MEDIUM |
| 5 | Nybsys MWC 2026 | In Development | HIGH |
| 6 | TBD | TBD | TBD |

---

## Quick Reference

### Development Commands

```bash
cd /mnt/c/src/redhorse
npm run dev          # Local development
npm run build        # Production build
npx tsc --noEmit     # Type check
git push origin main # Deploy (auto via Vercel)
```

### Admin Test Console

1. Visit https://redhorse-omega.vercel.app/
2. Click gear icon (top-right)
3. PIN: **142857**
4. Select birth date and mode
5. Generate and test

### Environment Variables (Production)

```
STRIPE_SECRET_KEY=sk_live_...     # UPDATE FOR LAUNCH
STRIPE_WEBHOOK_SECRET=whsec_...   # UPDATE FOR LAUNCH
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=  # UPDATE FOR LAUNCH
```

---

*火马年 2026 | Year of the Fire Horse*

*"The Fire Horse returns. Your Oracle awaits."*
