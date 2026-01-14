# Red Horse Oracle - Next Steps Plan

**Last Updated:** January 14, 2026 (Evening)
**Status:** PRODUCTION LIVE - Planning Marketing Launch

---

## COMPLETED: Production Launch Preparation

### 1.1 Stripe Production Setup - DONE
- [x] Switch from Stripe Test Mode to Live Mode
- [x] Create new Live Mode product ($8.88)
- [x] Create new Live Mode Payment Link with custom fields:
  - Text: "Date of Birth (MM/DD/YYYY)"
  - Dropdown: "Choose Your Path" (Wealth, Power, Love, Shield)
- [x] Configure Payment Link redirect URL
- [x] Create Live Mode webhook endpoint
- [x] Update Vercel environment variables:
  - `STRIPE_SECRET_KEY` → Live key
  - `STRIPE_WEBHOOK_SECRET` → Live webhook secret
  - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` → Live payment link

### 1.2 Privacy by Design - DONE
- [x] Complete Privacy Policy rewrite
- [x] Added "FIRST | ONLY | BEST" tagline to landing page
- [x] Added Privacy Info button + modal to Examples page
- [x] Added Privacy notice to ZodiacSummary component

### 1.3 Zodiac Summary Feature - DONE
- [x] Created ZodiacSummary component
- [x] Added 2026 forecasts for all 12 zodiac animals
- [x] Added characteristics and strengths
- [x] Fixed production bug (case-sensitivity)

### 1.4 Navigation & UX - DONE
- [x] Added navigation buttons for regular users on reveal page

### 1.5 Stripe Product Catalog Enhancement (Optional)
- [ ] Upload compelling product image: `Red-Horse-Oracle-Stripe-Graphic.jpeg`
- [ ] Write compelling product description
- [ ] Set product metadata for better analytics

---

## Priority 1: Domain & DNS Setup (NEXT)

### 2.1 Domain Purchase Options
Suggested domains to check availability:
- `redhorseoracle.com` (primary choice)
- `firehorseoracle.com`
- `firehorse2026.com`
- `redhorseai.com`

### 2.2 DNS Configuration
Once domain is purchased:
- [ ] Add domain to Vercel project
- [ ] Configure DNS records (Vercel will provide)
- [ ] Update `NEXT_PUBLIC_APP_URL` environment variable
- [ ] Update Stripe webhook URL to new domain
- [ ] Update Stripe Payment Link redirect URL
- [ ] Test full flow on new domain

### 2.3 SSL/HTTPS
- [ ] Vercel auto-provisions SSL (verify working)
- [ ] Test all pages load over HTTPS

---

## Priority 3: Social Sharing & OG Images

### 3.1 Current OG Image Options
Located in `/public/assets/`:
| File | Best For |
|------|----------|
| `Year-of-Horse-Hero-Image2.jpeg` | Fire Horse head visible - dramatic |
| `Year-of-Horse-Hero-Image3.jpeg` | All 12 zodiac animals - "which one are you?" |
| `Red-Horse-Oracle-Stripe-Graphic.jpeg` | Shows 4 modes + $8.88 price |

### 3.2 OG Image Updates Needed
- [ ] Decide on primary OG image for main site
- [ ] Consider different OG images for different pages:
  - Landing page: Fire Horse dramatic image
  - Examples page: 12 zodiac animals image
  - Reveal page: Dynamic (user's talisman?) or static
- [ ] Update `src/app/layout.tsx` metadata
- [ ] Test on Facebook Sharing Debugger
- [ ] Test on LinkedIn Post Inspector
- [ ] Test on Twitter Card Validator

### 3.3 Meta Tags Review
- [ ] Title: "Red Horse Oracle - AI-Powered Fire Horse Prophecy 2026"
- [ ] Description: "Receive your personalized Fire Horse prophecy. Lucky numbers, strategic mottos, love decrees, or protective mantras. Once-in-60-year opportunity. $8.88"
- [ ] Keywords: Chinese zodiac, Fire Horse 2026, AI talisman, lucky numbers, etc.

---

## Priority 4: SEO & Analytics

### 4.1 Google Analytics Setup
- [ ] Create Google Analytics 4 property
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add to Vercel environment variables or directly to code
- [ ] Install analytics in `src/app/layout.tsx`
- [ ] Set up conversion tracking for Stripe payments
- [ ] Create custom events for:
  - Page views
  - Mode selection
  - Payment initiated
  - Payment completed
  - Talisman saved
  - Social share clicks

### 4.2 Google Search Console
- [ ] Add and verify domain
- [ ] Submit sitemap (create if needed)
- [ ] Request indexing for key pages:
  - `/` (landing)
  - `/examples` (gallery)
  - `/terms`
  - `/privacy`

### 4.3 SEO Optimization
- [ ] Add structured data (JSON-LD) for:
  - Organization
  - Product ($8.88 prophecy)
  - FAQ (common questions)
- [ ] Create `robots.txt` if not exists
- [ ] Create `sitemap.xml`
- [ ] Optimize page titles and descriptions
- [ ] Add alt text to all images
- [ ] Ensure mobile-friendly (already is)
- [ ] Check page speed (Lighthouse audit)

---

## Priority 5: Content Marketing & PR

### 5.1 Blog/Article Content
Create content for multiple platforms:

**Main Article:** "Introducing Red Horse Oracle"
- Use `docs/ANNOUNCEMENT.md` as base
- Customize for each platform

**Platform-Specific Versions:**

| Platform | Tone | Length | Focus |
|----------|------|--------|-------|
| LinkedIn | Professional | 1,500 words | AI technology + business opportunity |
| Medium | Storytelling | 2,000 words | Cultural significance + personal journey |
| Substack | Newsletter | 1,000 words | Exclusive insights + behind-the-scenes |
| Facebook | Casual | 500 words | Visual focus + "which zodiac are you?" |
| Twitter/X | Punchy | Thread (10 tweets) | Key facts + link to examples |

### 5.2 LinkedIn Article Plan
- [ ] Write article: "I Built the World's First AI-Powered Fire Horse Oracle"
- [ ] Include:
  - The 60-year Fire Horse story
  - How Gemini AI generates masterpiece artwork
  - Screenshots of examples
  - Link to live app
  - Call to action
- [ ] Add relevant hashtags: #AI #ChineseNewYear #Startup #GoogleGemini

### 5.3 Medium Article Plan
- [ ] Write article: "The Fire Horse Returns: Building an AI Oracle for a Once-in-60-Year Event"
- [ ] Publish in relevant publications (submit to):
  - Towards Data Science
  - The Startup
  - Better Programming
- [ ] Include code snippets (prompting techniques)
- [ ] Include architecture diagram

### 5.4 Substack Newsletter
- [ ] Set up Substack if not exists
- [ ] Write launch announcement
- [ ] Include exclusive "making of" content
- [ ] Offer early access / discount code?

---

## Priority 6: Product Hunt Launch

### 6.1 Preparation Checklist
- [ ] Create Product Hunt maker account (if not exists)
- [ ] Prepare assets:
  - Logo (square, 240x240)
  - Gallery images (5-10 screenshots)
  - Video demo (optional but recommended)
- [ ] Write tagline (60 chars max):
  > "AI-powered Fire Horse prophecies for 2026"
- [ ] Write description (260 chars max):
  > "Get your personalized Chinese zodiac talisman. Choose Wealth (lucky numbers), Power (motto), Love (decree), or Shield (mantra). Stunning AI art. $8.88. Fire Horse only comes every 60 years!"

### 6.2 Launch Strategy
- [ ] Schedule launch for a Tuesday/Wednesday (best days)
- [ ] Prepare "first comment" with backstory
- [ ] Line up hunters/supporters to upvote early
- [ ] Be available all day to respond to comments
- [ ] Post on social media when live

### 6.3 Product Hunt Categories
- AI
- Artificial Intelligence
- Tech
- Design Tools
- Art

---

## Priority 7: Paid Advertising

### 7.1 Facebook/Instagram Ads
- [ ] Create Business Manager account
- [ ] Set up Facebook Pixel
- [ ] Create ad creatives:
  - Video: Examples gallery scrolling
  - Image: Fire Horse with "Which zodiac are you?"
  - Carousel: 4 modes explained
- [ ] Target audiences:
  - Interest: Chinese culture, astrology, zodiac
  - Demographics: 25-55, all genders
  - Locations: US, Canada, UK, Australia, Singapore
- [ ] Budget: Start with $20-50/day test

### 7.2 Google Ads
- [ ] Set up Google Ads account
- [ ] Create search campaigns for:
  - "Chinese zodiac 2026"
  - "Year of the Horse 2026"
  - "Fire Horse zodiac"
  - "Chinese New Year fortune"
  - "Lucky numbers Chinese zodiac"
- [ ] Budget: Start with $20-50/day test

### 7.3 TikTok Ads (Optional)
- [ ] Create TikTok for Business account
- [ ] Create short video content showing examples
- [ ] Target: Gen Z astrology enthusiasts

---

## Other Projects Reference

### NeoAesop.com
- Separate project
- Needs similar launch checklist
- TODO: Create separate plan document

### cc-ai.co
- Separate project
- Needs similar launch checklist
- TODO: Create separate plan document

---

## Next Session Priority Order

### Session 1: Domain & Analytics (2-3 hours)
1. **Domain Purchase** - Buy redhorseoracle.com or alternative
2. **DNS Configuration** - Point domain to Vercel
3. **Google Analytics** - Set up GA4 tracking
4. **Update URLs** - Webhook, payment link redirect

### Session 2: SEO & Content (2-3 hours)
5. **SEO Optimization** - Meta tags, sitemap, structured data
6. **LinkedIn Article** - "I Built the World's First AI Fire Horse Oracle"
7. **Medium Article** - Technical deep-dive

### Session 3: Marketing Prep (2-3 hours)
8. **Product Hunt Prep** - Assets, copy, screenshot gallery
9. **Ad Account Setup** - Facebook Business Manager, Google Ads
10. **Influencer List** - Identify astrology/Chinese culture creators

---

## Quick Reference Commands

```bash
# Navigate to project
cd /mnt/c/src/redhorse

# Run locally
npm run dev

# Check for issues
npm run build

# Push changes
git add -A && git commit -m "message" && git push origin main

# Check Vercel deployment
# Visit: https://vercel.com/dashboard
```

---

## Environment Variables Status (Production)

```env
# Supabase - LIVE
NEXT_PUBLIC_SUPABASE_URL=https://ykptxslgxlsbvpbeujfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<configured>
SUPABASE_SERVICE_ROLE_KEY=<configured>

# Stripe - LIVE (COMPLETED Jan 14)
STRIPE_SECRET_KEY=sk_live_...  # LIVE
STRIPE_WEBHOOK_SECRET=whsec_bsrjO6waD0dD7aHeMcp8XJK9BZKxa7a4  # LIVE
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/7sIdUP8Og5p31EY3cc  # LIVE

# Gemini - LIVE
GEMINI_API_KEY=<configured>

# App URL - UPDATE AFTER DOMAIN PURCHASE
NEXT_PUBLIC_APP_URL=https://redhorse-omega.vercel.app  # Current
# NEXT_PUBLIC_APP_URL=https://redhorseoracle.com  # After domain purchase
```

---

## Success Metrics to Track

### Launch Week Goals
- [ ] 1,000+ visitors
- [ ] 50+ prophecies generated
- [ ] $444+ revenue (50 x $8.88)
- [ ] Product Hunt top 10
- [ ] 100+ social shares

### Month 1 Goals (February - CNY)
- [ ] 25,000+ visitors
- [ ] 1,500+ prophecies generated
- [ ] $13,000+ revenue
- [ ] Press coverage (1-2 articles)
- [ ] 10,000+ social impressions

---

## Current Status Summary

**PRODUCTION IS LIVE!** Real payments are being processed.

**Completed:**
- Stripe production setup
- Privacy by Design implementation
- ZodiacSummary feature
- All documentation updated

**Next Priority:**
1. Domain purchase (redhorseoracle.com)
2. Google Analytics
3. SEO optimization
4. Content marketing (LinkedIn, Medium)
5. Product Hunt preparation

---

*The Fire Horse awaits. Launch is imminent.* 🔥🐴

火马年 2026
