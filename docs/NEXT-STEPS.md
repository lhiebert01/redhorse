# Red Horse Oracle - Next Steps & Launch Plan

**Last Updated:** January 17, 2026
**Current Phase:** ✅ PRODUCTION READY → MARKETING LAUNCH
**Version:** 1.2.0

---

## Current Status Summary

### ✅ COMPLETED (Jan 12-17)

| Category | Tasks | Date |
|----------|-------|------|
| **Core Development** | AI generation, Stripe integration, webhook | Jan 12-13 |
| **Examples Gallery** | 12 sample talismans, modal views | Jan 14 |
| **Production Launch** | Stripe LIVE mode enabled | Jan 14 |
| **Privacy by Design** | Zero PII collection, privacy policy | Jan 14 |
| **Custom Domain** | redhorseoracle.com purchased & configured | Jan 15 |
| **Free Reading Funnel** | /free page with zodiac preview + CTA | Jan 15 |
| **SEO Foundation** | Sitemap, robots.txt, meta tags, JSON-LD | Jan 15 |
| **Limited Edition System** | 888 per zodiac PER MODE, numbered editions | Jan 16 |
| **Maker's Mark & Provenance** | Certificate of authenticity | Jan 16 |
| **Database Schema** | edition_number, total_editions columns | Jan 16 |
| **Stripe Configuration** | Webhook (www.redhorseoracle.com) | Jan 16 |
| **Payment Flow Verified** | Real $8.88 purchase successful | Jan 16 |
| **Save Zodiac Forecast** | Paid users can download zodiac card PNG | Jan 16 |
| **Unified Closing Dates** | All signs close Feb 17, 2027 | Jan 16 |
| **Analytics Dashboard** | Track free/paid oracles by zodiac sign | Jan 17 |
| **Share Talisman Image** | Share direct Supabase image URL (paid only) | Jan 17 |
| **Webhook Idempotency** | Prevent double-processing on retry | Jan 17 |
| **Consistent Filenames** | element-animal-talisman/forecast.png | Jan 17 |
| **User-Friendly Language** | PII → "Personally Identifiable Information" | Jan 17 |

---

## ✅ PHASE 1: TESTING (COMPLETE)

**Status:** VERIFIED WORKING
**Real payment processed successfully!**

### Testing Results

#### Critical Path Testing
- [x] **Payment Flow Test** - Complete real $8.88 purchase ✅
- [x] **Webhook Processing** - 200 OK (requires www. in URL) ✅
- [x] **Edition Assignment** - Edition #4 of 888 Earth Dog Wealth ✅
- [x] **Reveal Page** - Edition badge + Maker's Mark display ✅
- [x] **Save Talisman** - Download works correctly ✅
- [x] **Save Zodiac Forecast** - NEW! Download zodiac card PNG ✅

#### 4 Oracle Modes (All Verified)
- [x] Wealth (6 lucky numbers: XX-XX-XX-XX-XX-XX) ✅
- [x] Power (3-word motto in CAPS) ✅
- [x] Love (4-word decree in CAPS) ✅
- [x] Shield (3-word mantra in CAPS) ✅

#### User Flows
- [x] Landing → Free Reading → Results → Purchase CTA ✅
- [x] Landing → Direct Purchase → Reveal ✅
- [x] Examples Gallery → Modal → Purchase ✅
- [x] Admin Test Console (PIN: 142857) ✅

---

## 🟢 PHASE 2: PRE-LAUNCH PREP (CURRENT)

**Goal:** Prepare marketing assets before announcement

### Analytics Setup
- [ ] Create GA4 property
- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel
- [ ] Verify tracking works
- [ ] Set up conversion events

### Social Media Accounts
- [ ] Create Twitter/X (@redhorseoracle)
- [ ] Create Instagram account
- [ ] Prepare 5-10 sample images for posts

### Launch Announcements
- [ ] Draft Hacker News "Show HN" post
- [ ] Draft Reddit posts
- [ ] Draft LinkedIn article
- [ ] Prepare Product Hunt listing

---

## 🟢 PHASE 3: MARKETING LAUNCH

**Goal:** Drive traffic and conversions

### Launch Channels (Priority Order)

#### 1. Hacker News "Show HN"

**Recommended Title:**
```
Show HN: Red Horse Oracle – Limited edition AI zodiac art with Privacy by Design
```

**Post Template:**
```
Hi HN,

I built Red Horse Oracle for the Year of the Fire Horse (2026) - which only comes every 60 years.

What makes it different:

1. Privacy by Design: Birth date calculates zodiac locally and is immediately discarded. Zero PII stored.

2. Limited Editions: Only 888 oracles per zodiac sign (10,656 total EVER) - numbered like fine art prints.

3. Maker's Mark: Each oracle has a certificate of authenticity with provenance.

4. Google Gemini 3 Pro: Museum-quality Dunhuang-style AI art.

Tech: Next.js 14, Supabase, Stripe, Vercel, Gemini AI

Free reading: https://redhorseoracle.com/free
Full oracle: $8.88

Feedback welcome on the privacy approach and limited edition concept.
```

**Best time:** Tuesday-Thursday, 9-11 AM EST

#### 2. Reddit

| Subreddit | Post Type |
|-----------|-----------|
| r/SideProject | Project share |
| r/ChineseZodiac | Resource share |
| r/astrology | Discussion |
| r/InternetIsBeautiful | Link (after traction) |

#### 3. LinkedIn
- Personal post with talisman screenshot
- Focus: Privacy by Design, AI innovation, limited editions

#### 4. Product Hunt
- Schedule for Tuesday launch
- Prepare all assets (logo, screenshots, video)

---

## 🔵 PHASE 4: GROWTH & OPTIMIZATION

### Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Daily visitors | 100+ | GA4 |
| Free → Paid conversion | 5%+ | GA4 + Stripe |
| Checkout completion | 70%+ | Stripe |
| Generation success | 98%+ | Supabase |

### Future Optimizations
- A/B test landing page copy
- A/B test pricing
- Referral program
- Seasonal promotions

---

## Revenue Projections 2026

| Month | Visitors | Conv% | Sales | Revenue |
|-------|----------|-------|-------|---------|
| Jan | 5,000 | 5% | 250 | $2,220 |
| Feb | 25,000 | 6% | 1,500 | $13,320 |
| Mar | 15,000 | 6% | 900 | $7,992 |
| **Q1** | **45,000** | - | **2,650** | **$23,532** |

**Full 2026 Target:** $70,000+ gross revenue

---

## Quick Reference

### Key URLs
| Page | URL |
|------|-----|
| Production | https://redhorseoracle.com |
| Free Reading | https://redhorseoracle.com/free |
| Examples | https://redhorseoracle.com/examples |
| Admin Test | https://redhorseoracle.com/admin-test |
| Privacy | https://redhorseoracle.com/privacy |
| Terms | https://redhorseoracle.com/terms |

### Dashboards
| Service | URL |
|---------|-----|
| Stripe | https://dashboard.stripe.com |
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |
| GoDaddy | https://godaddy.com (domain) |

### Credentials
- Admin PIN: `142857`
- Stripe: LIVE mode
- Payment Link: `https://buy.stripe.com/5kQ8wPdmT73b54G1V124000`

### Contact
- Email: lindsay.hiebert@gmail.com
- Display: privacy@redhorseoracle.com

---

## Environment Variables (Production)

```env
# All configured in Vercel

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ykptxslgxlsbvpbeujfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<configured>
SUPABASE_SERVICE_ROLE_KEY=<configured>

# Stripe - LIVE
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/5kQ8wPdmT73b54G1V124000

# Gemini
GEMINI_API_KEY=<configured>

# App
NEXT_PUBLIC_APP_URL=https://redhorseoracle.com

# Analytics (TODO)
NEXT_PUBLIC_GA_MEASUREMENT_ID=<to be added>
```

---

## 🏆 PHASE 5: ANTHROPIC CLAUDE SHOWCASE AWARD

**Strategic Objective:** Position Red Horse Oracle as a showcase example of how to build KILLER AI apps that generate INCOME and GO VIRAL using Claude Code

### Goal Statement
Win recognition from Anthropic as a demonstration of:
1. **Claude Code as Development Partner** - Entire app built collaboratively with Claude
2. **Viral AI Consumer App** - Replicating Lensa-level virality ($50M+ potential)
3. **Revenue-Generating SaaS** - Profitable AI business model at $8.88/user
4. **Cultural Moment Capitalization** - Fire Horse year (once every 60 years)

### Why This App Qualifies

| Criteria | Red Horse Oracle Evidence |
|----------|---------------------------|
| Built with Claude | 100% designed & coded collaboratively |
| Revenue Generating | Live Stripe payments, $8.88/oracle |
| Viral Potential | Shareable AI art, zodiac identity, FOMO |
| Technical Excellence | Next.js 14, Supabase, Gemini AI integration |
| Privacy by Design | Zero PII stored, ethical AI implementation |
| Limited Edition Scarcity | 888 per zodiac per mode = urgency |

### Submission Targets

#### 1. Anthropic Economic Futures Research Awards
- **Grant Range:** $10,000 - $50,000
- **Focus:** Empirical research on AI's economic impacts
- **Angle:** Case study on AI-powered micro-SaaS revenue generation
- **Bonus:** $5,000 Claude API credits
- **Action:** Submit proposal highlighting Red Horse Oracle as economic case study

#### 2. Code with Claude Events
- **Previous Event:** July 15, 2025
- **Action:** Monitor for 2026 announcements
- **Preparation:** Document full development journey with Claude Code

#### 3. Anthropic Blog / Case Study Feature
- **Action:** Reach out to Anthropic comms team
- **Pitch:** "From Zero to Viral: Building a Fire Horse Oracle with Claude"
- **Assets:** Screenshots of Claude Code sessions, revenue metrics, user testimonials

---

## 🔥 VIRAL MARKETING PLAYBOOK

### Research Insights (January 2026)

Based on analysis of successful viral AI apps and current market trends:

#### Lensa AI Case Study - Key Learnings
- **Revenue:** $50M+ from "Magic Avatars" feature
- **Peak:** $8M per day at viral height
- **Margin:** 50¢ cost per avatar pack, $3.99+ price = ~87% margin
- **Strategy:**
  - Launched during peak AI interest (Nov 2022 alongside ChatGPT)
  - Seeded influencers with free avatars → unpaid promotion
  - Leveraged FOMO from seeing friends' unique results
  - Identity-based sharing ("this is MY avatar")

#### What Makes Apps Go Viral in 2026
1. **"Make-Me-the-Hero"** - Generative tools outperform by making participation the hook
2. **Low Friction** - Instant creation + instant sharing = winning combo
3. **Cultural Relevance** - Timing with cultural moments (CNY, Fire Horse)
4. **Hyper-Personalization** - Unique results create sharing urgency
5. **Viral Loops** - Each user brings others through natural sharing

### Red Horse Oracle Viral Advantages

| Factor | Our Implementation |
|--------|-------------------|
| Identity Hook | "Your zodiac sign + Fire Horse decree" |
| Shareability | Museum-quality AI art people WANT to post |
| FOMO | 60-year cycle + 888 limited editions |
| Cultural Timing | CNY 2026 peak (Jan 29 - Feb 15) |
| Price Point | $8.88 impulse buy (auspicious number) |
| Personalization | Unique talisman for each birth date |

### Viral Content Strategy

#### TikTok / Instagram Reels
- **Format:** "Which Fire Horse zodiac are you?" carousel/video
- **Hook:** Bold statement in first 3 seconds
- **Action:** Partner with astrology micro-influencers (10K-100K followers)
- **Target:** @maren.altman style astrology content creators

#### Twitter/X Threads
- **Format:** "The Year of the Fire Horse only comes every 60 years. Here's what it means for each zodiac:"
- **Visuals:** Generated talismans as images
- **CTA:** Link to /free reading

#### "Crying Horse" Trend Opportunity
- The "Crying Horse" mascot went viral in China
- **Angle:** Create "Hopeful Fire Horse" counter-narrative
- **Messaging:** "Don't just cry about 2026 - get your Fire Horse prophecy"

### Influencer Seeding Strategy

| Tier | Followers | Approach | Cost |
|------|-----------|----------|------|
| Nano | 1K-10K | Free oracle + affiliate code | $0 |
| Micro | 10K-100K | Free oracle + $50-100 | $50-100 |
| Mid | 100K-500K | Sponsored post | $200-500 |
| Macro | 500K+ | Revenue share partnership | % of sales |

**Target Niches:**
- Astrology/zodiac content creators
- Chinese culture enthusiasts
- Spiritual/wellness influencers
- Asian-American lifestyle creators

### Paid Acquisition Targets

| Channel | Audience | Est. CPA | Budget |
|---------|----------|----------|--------|
| Facebook/Instagram | Chinese diaspora 25-55 | $2-5 | $500/mo |
| TikTok Ads | Gen Z astrology fans | $1-3 | $300/mo |
| Google Ads | "Chinese zodiac 2026" | $3-6 | $200/mo |

### Viral Loop Implementation

```
User sees friend's talisman on social media
    ↓
Clicks link → lands on /examples or /free
    ↓
Gets free zodiac preview → sees their sign
    ↓
Buys $8.88 full oracle (5-6% conversion)
    ↓
Receives unique talisman with edition number
    ↓
Shares on social media ("I'm #47 of 888!")
    ↓
Friends see post → cycle repeats
```

---

## 📋 VIRAL MARKETING ACTION ITEMS

### Week 1 (Jan 18-24)
- [ ] Create social media accounts (Twitter, Instagram, TikTok)
- [ ] Prepare 12 sample talisman images for posting (1 per zodiac)
- [ ] Write 5 TikTok video scripts ("Which zodiac are you?" format)
- [ ] Identify 20 astrology micro-influencers to contact
- [ ] Draft influencer outreach template

### Week 2 (Jan 25-31) - PRE-CNY PUSH
- [ ] Send outreach to 20 influencers with free oracle offers
- [ ] Post first TikTok video (goal: 10K views)
- [ ] Post Instagram carousel of all 12 zodiac talismans
- [ ] Schedule 3 tweets/day during CNY buildup
- [ ] Launch Facebook ad campaign ($100 test budget)

### Week 3 (Feb 1-7) - CNY PEAK
- [ ] Monitor viral metrics hourly during CNY
- [ ] Amplify any organic viral content
- [ ] Respond to all comments/mentions within 1 hour
- [ ] Document user testimonials for social proof
- [ ] A/B test ad creatives based on performance

### Week 4+ (Feb 8+) - OPTIMIZE
- [ ] Analyze which content performed best
- [ ] Double down on winning channels
- [ ] Implement referral program if justified by metrics
- [ ] Prepare Anthropic case study submission

---

## 📊 Success Metrics for Showcase Award

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Total Revenue | $10,000+ | Q1 2026 |
| Unique Visitors | 50,000+ | Q1 2026 |
| Conversion Rate | 5%+ | Ongoing |
| Social Shares | 5,000+ | CNY period |
| Media Mentions | 5+ | Q1 2026 |
| User Testimonials | 50+ | Q1 2026 |

### Documentation for Anthropic Submission
- [ ] Screenshot Claude Code development sessions
- [ ] Track all revenue with Stripe dashboard exports
- [ ] Record user testimonials (with permission)
- [ ] Document technical architecture decisions
- [ ] Write blog post: "How We Built Red Horse Oracle with Claude Code"

---

## Quick Commands

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

---

## Notes for Next Claude Session

1. Check test results from PHASE 1
2. Review Vercel error logs (if any)
3. Check Stripe webhook logs
4. Run `git pull` for latest code
5. Run `npm run dev` for local server
6. Reference `docs/TEST-PLAN.md` for test scenarios

---

*The Fire Horse awaits. Launch is imminent.* 🔥🐴

火马年 2026
