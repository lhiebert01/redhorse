# RED HORSE ORACLE
## Executive Summary & Board Briefing

**Document Date:** January 21, 2026
**Status:** PRODUCTION LIVE — Ready for Marketing Launch
**Prepared For:** Executive Review & Stakeholder Download

---

# 1. PRODUCT OVERVIEW

## What Is Red Horse Oracle?

Red Horse Oracle is an AI-powered SaaS application that generates personalized Chinese zodiac prophecies and museum-quality digital art collectibles for the Year of the Fire Horse 2026.

| Attribute | Value |
|-----------|-------|
| **Product Name** | Red Horse Oracle |
| **Domain** | redhorseoracle.com |
| **Alternate URL** | redhorse-omega.vercel.app |
| **Price Point** | $8.88 (auspicious triple-8 pricing) |
| **Free Tier** | Yes — full zodiac reading, no payment required |
| **Status** | Production live, accepting real payments |

## The Opportunity

The Fire Horse (火马) is a rare celestial event in Chinese astrology that occurs only once every 60 years:

| Occurrence | Year |
|------------|------|
| Previous | 1966 |
| **Current** | **2026** |
| Next | 2086 |

For most people alive today, 2026 is their **only opportunity** to experience a Fire Horse year. This creates natural urgency and cultural relevance, particularly for:
- Chinese diaspora worldwide
- Astrology and spirituality enthusiasts
- Gamblers seeking lucky numbers
- AI art collectors
- Privacy-conscious consumers

---

# 2. UNIQUE VALUE PROPOSITION

## Three Pillars of Differentiation

### 1. State-of-the-Art AI (Gemini 3 Pro)
- **Text Generation:** Google Gemini 3 Pro Preview — latest and most capable model
- **Image Generation:** Gemini 3 Pro Image Preview — museum-quality digital art
- Each talisman is unique — no two are ever identical
- Art styles include: Dunhuang murals, Song Dynasty, Tang Dynasty, traditional ink wash

### 2. Authenticated Limited Edition Collectibles
- **888 editions per zodiac sign per mode** — numbered like fine art lithographs
- **Certificate of authenticity** on every oracle
- **Maker's Mark seal** — "RED HORSE 馬 2026"
- **Edition badge** — "✦ LIMITED EDITION #X of 888 ✦"
- Total possible oracles: 42,624 (888 × 12 signs × 4 modes)
- Maximum gross revenue potential: $378,501

### 3. Privacy by Design Architecture
- **Zero PII stored** — birth date calculated, then immediately deleted
- **No tracking cookies** — no Facebook Pixel, no Google Analytics surveillance
- **No account required** — no email harvesting
- **Safe to share** — generated artwork contains no personal information
- First and only AI zodiac app with complete privacy architecture

## Competitive Positioning Statement

> "Red Horse Oracle is the world's first and only AI zodiac application that delivers state-of-the-art Gemini 3 Pro generated art, authenticated limited edition collectibles, and complete Privacy by Design — all in one product."

---

# 3. PRODUCT FEATURES

## Four Oracle Modes

| Mode | Prophecy Type | Format | Example |
|------|---------------|--------|---------|
| 🎲 **Wealth** | 6 Lucky Numbers | XX-XX-XX-XX-XX-XX | 04-15-28-38-68-84 |
| ⚔️ **Power** | Strategic Motto | 3 words, ALL CAPS | STRIKE FROM SILENCE |
| ❤️ **Love** | Romance Decree | 4 words, ALL CAPS | FIERCE LOVE CLAIMS YOU |
| 🛡️ **Shield** | Protective Mantra | 3 words, ALL CAPS | FLAME SHIELDS PEACE |

## What Customers Receive

### Paid Oracle ($8.88)
1. **AI-Generated Talisman Artwork** — unique, museum-quality digital art
2. **Personalized Prophecy** — mode-specific (numbers, motto, decree, or mantra)
3. **Limited Edition Certificate** — numbered #X of 888
4. **Maker's Mark Authentication** — branded seal
5. **Zodiac Forecast** — personalized 2026 outlook with characteristics and strengths
6. **Celebrity Quote** — famous person who shares their zodiac sign
7. **Permanent Shareable Link** — never expires
8. **High-Resolution Download** — save talisman and zodiac card

### Free Reading (No Payment)
1. **Chinese Zodiac Calculation** — animal + element (e.g., "Metal Rat")
2. **2026 Fire Horse Forecast** — personalized outlook
3. **Zodiac Characteristics** — strengths and traits
4. **Celebrity Connection** — famous people with same sign
5. **Oracle Wisdom Quote** — inspirational guidance
6. **Preview of Paid Features** — with clear upsell path

## User Journey

```
Landing Page → Free Reading → Zodiac Results → Upsell → Stripe Checkout → AI Generation (30-60 sec) → Reveal Page → Share/Download
```

---

# 4. TECHNICAL ARCHITECTURE

## Tech Stack

| Component | Technology | Cost |
|-----------|------------|------|
| Framework | Next.js 14 (App Router) | Free |
| Language | TypeScript | Free |
| Styling | Tailwind CSS | Free |
| Database | Supabase PostgreSQL | Free tier / $25/mo at scale |
| Storage | Supabase Storage | Included |
| Payments | Stripe | 2.9% + $0.30/transaction |
| AI Text | Gemini 3 Pro Preview | ~$0.01/request |
| AI Image | Gemini 3 Pro Image Preview | ~$0.134/image |
| Hosting | Vercel | Free tier / $20/mo at scale |
| Domain | GoDaddy | ~$15/year |

## Privacy Architecture Flow

```
User enters birth date
       ↓
System calculates Chinese zodiac (e.g., "Earth Dragon")
       ↓
Birth date IMMEDIATELY DELETED — never stored
       ↓
Only zodiac sign retained (non-PII)
       ↓
AI generates personalized content
       ↓
Oracle contains NO personal information — safe to share
```

## Unit Economics

| Metric | Value |
|--------|-------|
| Price | $8.88 |
| Stripe fees (2.9% + $0.30) | ~$0.56 |
| Gemini 3 Pro Image | ~$0.134 |
| Gemini 3 Pro Text | ~$0.01 |
| **Total COGS** | **~$0.71** |
| **Gross Profit** | **$8.17** |
| **Gross Margin** | **92%** |

---

# 5. DEVELOPMENT COMPLETED

## Core Application ✅
- [x] Landing page with rotating backgrounds
- [x] Free zodiac reading flow (no payment required)
- [x] Stripe payment integration (LIVE MODE)
- [x] Webhook processing for payment completion
- [x] AI text generation (Gemini 3 Pro)
- [x] AI image generation (Gemini 3 Pro Image)
- [x] Talisman reveal page with full display
- [x] Edition numbering system (#X of 888)
- [x] Maker's Mark and certificate authentication
- [x] Save/download functionality (talisman + zodiac card)
- [x] Social sharing buttons (X, LinkedIn, WhatsApp, Telegram, Email)

## Content & Assets ✅
- [x] 12 example talismans (one per zodiac animal)
- [x] 60 zodiac badge cards (12 animals × 5 elements)
- [x] 12 zodiac collection panels
- [x] Celebrity quotes and data for all 60 zodiac combinations
- [x] Marketing grid images for social media
- [x] OG images configured for social sharing

## Pages Live ✅
| Page | URL | Purpose |
|------|-----|---------|
| Landing | redhorseoracle.com | Main entry point |
| Free Reading | redhorseoracle.com/free | Free zodiac calculation |
| Examples | redhorseoracle.com/examples | Gallery of 12 sample oracles |
| Privacy Policy | redhorseoracle.com/privacy | Privacy by Design explanation |
| Terms | redhorseoracle.com/terms | Terms of service |
| Admin Test | redhorseoracle.com/admin-test | Internal testing (PIN: 142857) |
| SuperAdmin | redhorseoracle.com/superadmin | Image browser (PIN: 142857) |

## Documentation ✅
- [x] CLAUDE.md — comprehensive development guide
- [x] README.md — public repository documentation
- [x] SOCIAL-POSTS-READY.md — complete social media launch guide
- [x] LAUNCH-KIT-PRIVACY-BY-DESIGN.md — messaging and assets
- [x] FEATURES.md — detailed feature documentation
- [x] DESIGN.md — design philosophy
- [x] ANNOUNCEMENT.md — press release template

---

# 6. MARKETING STRATEGY

## Target Audiences

| Segment | Why They Buy | Channel |
|---------|--------------|---------|
| **Chinese Diaspora** | Cultural connection, CNY gifting | Facebook, WeChat |
| **Astrology Enthusiasts** | Personalized readings, zodiac identity | Instagram, TikTok |
| **Gamblers** | Lucky numbers for lottery/betting | Facebook, word of mouth |
| **AI Art Collectors** | Unique generative art, limited editions | Twitter, Product Hunt |
| **Privacy Advocates** | Support privacy-first products | Hacker News, Reddit |
| **Tech Early Adopters** | Novel AI application | Hacker News, Product Hunt |

## Messaging Framework

### Primary Hook
> "The Year of the Fire Horse has arrived."

### Three Questions (Engagement)
> Will 2026 be YOUR year to:
> • Know your fortune?
> • Own authenticated AI art?
> • Support privacy-first products?

### Value Proposition (30 seconds)
> Red Horse Oracle uses state-of-the-art Gemini 3 Pro AI to generate personalized prophecies and museum-quality digital art collectibles.
>
> 🎨 Limited Edition (#/888)
> 🔐 Authenticated & Certified
> 🛡️ Privacy by Design — zero personal data stored
>
> The Fire Horse appears once every 60 years. Last: 1966. Next: 2086.
>
> This is your moment.

### Call to Action
> Free reading (no email): redhorseoracle.com/free
> Full oracle: redhorseoracle.com

## Hashtags
```
#FireHorse2026 #PrivacyByDesign #AIArt #ChineseNewYear
```

---

# 7. LAUNCH PLAN

## Prepared Assets

All launch content is ready in `docs/SOCIAL-POSTS-READY.md`:

| Platform | Content Status | Instructions |
|----------|----------------|--------------|
| LinkedIn | ✅ Ready | Copy-paste post + image |
| X/Twitter | ✅ Ready | Copy-paste post + image |
| Facebook | ✅ Ready | Copy-paste post + image |
| Hacker News | ✅ Ready | Title + URL ready |
| Reddit | ✅ Ready | Multiple subreddit posts |
| Product Hunt | ✅ Ready | Full listing + maker comment |

## Launch Image
```
C:\src\redhorse\public\assets\Fire-Horse-2026-Chart-v3.jpeg
```
Use this single image across all platforms.

## Launch Schedule

| Date | Time | Platform | Action |
|------|------|----------|--------|
| **Jan 21** | 9-11am | LinkedIn | Post announcement |
| **Jan 21** | 9-11am | X/Twitter | Post announcement |
| **Jan 21** | 9-11am | Facebook | Post announcement |
| **Jan 21-24** | 9am PST | Hacker News | Submit Show HN |
| **Jan 21-24** | After HN | Reddit | Post to r/SideProject |
| **Jan 29** | 12:01am PST | Product Hunt | Scheduled launch (CNY) |

## Post-Launch Engagement
- Reply to EVERY comment within 1 hour
- Thank people who share
- Answer questions about privacy architecture
- Monitor conversion rates and errors

---

# 8. REVENUE PROJECTIONS

## Scenario Analysis

| Scenario | Sales | Gross Revenue | Net Revenue (92%) |
|----------|-------|---------------|-------------------|
| Conservative (5% of 42,624) | 2,131 | $18,923 | ~$17,410 |
| Medium (15%) | 6,394 | $56,778 | ~$52,240 |
| Viral (40%) | 17,050 | $151,404 | ~$139,300 |
| **Sold Out (100%)** | **42,624** | **$378,501** | **~$348,240** |

## Monthly Projections (Base Case)

| Month | Driver | Projected Revenue |
|-------|--------|-------------------|
| January | Soft launch | $2,000-3,000 |
| **February** | **CNY peak** | **$10,000-15,000** |
| March | Post-CNY momentum | $5,000-8,000 |
| Q2-Q4 | Steady state | $3,000-5,000/month |

## Key Dates
- **Chinese New Year 2026:** January 29, 2026 (8 days away)
- **Fire Horse Year Ends:** February 2027

---

# 9. OPEN QUESTIONS & RISKS

## Open Questions

| Question | Current Status | Recommendation |
|----------|----------------|----------------|
| Should we do paid advertising? | Not started | Wait for organic traction first; if conversion > 3%, invest in ads |
| Influencer partnerships? | Not started | Offer free oracles to 10-20 astrology/Chinese culture creators |
| International expansion? | English only | Add Chinese language support if demand materializes |
| Additional oracle modes? | 4 modes live | Monitor which modes sell best; consider Career, Health modes |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low organic reach | Medium | High | Diversify across platforms; engage actively |
| Stripe webhook failures | Low | High | Logging in place; manual recovery possible |
| AI generation errors | Low | Medium | Error handling with retry; admin test console |
| Negative HN reception | Medium | Low | Lead with privacy/tech angle, not astrology |
| Competition | Low | Low | First-mover advantage; limited time window |

---

# 10. RECOMMENDED NEXT STEPS

## Immediate (January 21)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 1 | Post to LinkedIn | You | 9-11am |
| 2 | Post to X/Twitter | You | 9-11am |
| 3 | Post to Facebook | You | 9-11am |
| 4 | Monitor comments and engage | You | Ongoing |

## This Week (January 21-24)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 5 | Submit to Hacker News | You | Weekday 9am PST |
| 6 | Post to Reddit r/SideProject | You | After HN |
| 7 | Schedule Product Hunt for Jan 29 | You | Before Jan 28 |
| 8 | Track first conversions | You | Daily |

## Pre-CNY (January 25-28)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 9 | Prepare Product Hunt launch day plan | You | Jan 27 |
| 10 | Alert friends/contacts for PH support | You | Jan 28 |
| 11 | Review analytics and adjust messaging | You | Jan 28 |

## CNY Launch Week (January 29 - February 5)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 12 | Product Hunt launch | You | Jan 29, 12:01am PST |
| 13 | Maximum social engagement | You | All week |
| 14 | Respond to all PH comments | You | Jan 29 all day |
| 15 | Evaluate paid advertising | You | If conversion > 3% |

---

# 11. SUCCESS METRICS

## Launch Week KPIs

| Metric | Target | How to Measure |
|--------|--------|----------------|
| LinkedIn post impressions | 1,000+ | LinkedIn analytics |
| Twitter post impressions | 500+ | Twitter analytics |
| Website visitors | 500+ | Vercel analytics |
| Free readings completed | 100+ | Supabase query |
| Paid conversions | 10+ | Stripe dashboard |
| Conversion rate | 3%+ | Paid / Visitors |

## First Month KPIs

| Metric | Target |
|--------|--------|
| Total visitors | 5,000+ |
| Free readings | 1,000+ |
| Paid oracles | 100+ |
| Gross revenue | $888+ |
| Product Hunt upvotes | 100+ |

---

# 12. DOCUMENT REFERENCES

| Document | Location | Purpose |
|----------|----------|---------|
| **Social Posts (Ready)** | `docs/SOCIAL-POSTS-READY.md` | Copy-paste posts for all platforms |
| **Launch Kit** | `docs/LAUNCH-KIT-PRIVACY-BY-DESIGN.md` | Messaging framework and assets |
| **Development Guide** | `CLAUDE.md` | Technical reference and session notes |
| **Features** | `docs/FEATURES.md` | Detailed feature documentation |
| **Announcement** | `docs/ANNOUNCEMENT.md` | Press release template |

---

# 13. FINAL SANITY CHECK

## Ready to Launch ✅

| Category | Status |
|----------|--------|
| Product | ✅ Live and functional |
| Payments | ✅ Stripe live mode |
| AI Generation | ✅ Working (30-60 sec) |
| Free Tier | ✅ Complete flow |
| Paid Tier | ✅ Complete flow |
| Documentation | ✅ Comprehensive |
| Social Posts | ✅ Ready to copy-paste |
| Launch Image | ✅ Ready |
| Domain | ✅ redhorseoracle.com |

## Messages Verified ✅

| Element | Status |
|---------|--------|
| Primary hook | ✅ "The Year of the Fire Horse has arrived" |
| Value proposition | ✅ Gemini 3 Pro + Limited Edition + Privacy |
| CTAs | ✅ Free reading + Full oracle |
| Hashtags | ✅ #FireHorse2026 #PrivacyByDesign |

## Nothing Blocking Launch

**The product is ready. The content is ready. The plan is ready.**

**Next action:** Post to LinkedIn at 9-11am on January 21, 2026.

---

# APPENDIX: KEY LINKS

| Purpose | URL |
|---------|-----|
| Production Site | https://redhorseoracle.com |
| Free Reading | https://redhorseoracle.com/free |
| Examples Gallery | https://redhorseoracle.com/examples |
| GitHub Repository | https://github.com/lhiebert01/redhorse |
| Stripe Dashboard | https://dashboard.stripe.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |

---

**Document Prepared:** January 21, 2026, 11:00 AM
**Launch Status:** GO
**Confidence Level:** HIGH

---

*火马年 2026 — Year of the Fire Horse*

*"The Fire Horse has arrived. This is your moment."*
