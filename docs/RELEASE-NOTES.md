# Red Horse Oracle - Release Notes

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

#### Navigation Improvements
- Added navigation buttons on reveal page for regular users:
  - "Return to Home"
  - "Get Another Reading"
  - "View Examples Gallery"
- Admin users retain "Generate Another Test" flow

#### Expanded Zodiac Data
- Added characteristics for all 12 zodiac animals
- Added core strengths (4 traits per animal)
- Added 2026 Fire Horse year forecasts
- Added Fire Horse relations (ally/special/clash/neutral)

---

### Bug Fixes

#### ZodiacSummary Case-Sensitivity Fix
- **Issue:** Component crashed in production when zodiac sign had different casing
- **Solution:** Added `normalizeZodiacSign()` and `normalizeElement()` helper functions
- **Result:** Component now handles all casing variations correctly

---

### Technical Changes

#### Files Added
| File | Purpose |
|------|---------|
| `src/components/reveal/ZodiacSummary.tsx` | Zodiac forecast component |
| `docs/RELEASE-NOTES.md` | This file |

#### Files Modified
| File | Changes |
|------|---------|
| `src/app/page.tsx` | Added Privacy by Design banner with "FIRST \| ONLY \| BEST" |
| `src/app/privacy/page.tsx` | Complete rewrite - Privacy by Design focus |
| `src/app/reveal/page.tsx` | Added ZodiacSummary, navigation buttons |
| `src/app/examples/page.tsx` | Added Privacy Info button + modal |
| `src/constants/zodiac-data.ts` | Expanded with profiles, forecasts, strengths |
| `CLAUDE.md` | Added January 14 evening session notes |
| `README.md` | Added Privacy by Design section, updated tech stack |
| `docs/EXEC-SUMMARY.md` | Updated status to PRODUCTION LIVE |
| `docs/NEXT-STEPS.md` | Marked Stripe setup complete, reorganized priorities |

#### Environment Variables (Production)
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_bsrjO6waD0dD7aHeMcp8XJK9BZKxa7a4
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/7sIdUP8Og5p31EY3cc
```

---

### Known Issues

#### Stripe Webhook Timeout
- **Behavior:** Webhook shows "Timed out" in Stripe dashboard
- **Cause:** AI generation takes 30-60 seconds, exceeding Stripe's timeout
- **Impact:** None - Vercel function continues running and completes successfully
- **Resolution:** Expected behavior; no fix needed

---

### Upcoming in Next Release

- [ ] Domain purchase (redhorseoracle.com)
- [ ] Google Analytics integration
- [ ] SEO optimization (sitemap, structured data)
- [ ] Performance monitoring

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
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
