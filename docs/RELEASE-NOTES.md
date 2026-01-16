# Red Horse Oracle - Release Notes

## Version 1.1.0 - Limited Edition System (January 16, 2026)

**Status:** PRODUCTION READY - TESTING PHASE
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
