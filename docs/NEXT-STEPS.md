# Red Horse Oracle - Next Steps Plan

**Created:** January 14, 2026 (Late Night)
**For:** Tomorrow's Work Session

---

## Priority 1: Production Launch Preparation

### 1.1 Stripe Production Setup
- [ ] Switch from Stripe Test Mode to Live Mode
- [ ] Create new Live Mode product ($8.88)
- [ ] Create new Live Mode Payment Link with custom fields:
  - Text: "Date of Birth (MM/DD/YYYY)" - Key: `dob`
  - Dropdown: "Choose Your Path" - Key: `focus` (Wealth, Power, Love, Shield)
- [ ] Update Payment Link redirect URL to production domain
- [ ] Create new Live Mode webhook endpoint
- [ ] Update Vercel environment variables:
  - `STRIPE_SECRET_KEY` → Live key (sk_live_...)
  - `STRIPE_WEBHOOK_SECRET` → Live webhook secret
  - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` → Live payment link

### 1.2 Stripe Product Catalog Enhancement
- [ ] Upload compelling product image: `Red-Horse-Oracle-Stripe-Graphic.jpeg`
- [ ] Write compelling product description:
  > "Fire Horse Oracle Prophecy - Personalized AI-generated talisman for the Year of the Fire Horse 2026. Choose your path: Wealth (6 Lucky Numbers), Power (Strategic Motto), Love (Destiny Decree), or Shield (Protective Mantra). One-of-a-kind masterpiece Chinese zodiac artwork. Once-in-60-year opportunity!"
- [ ] Set product metadata for better analytics

---

## Priority 2: Domain & DNS Setup

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

## Tomorrow's Priority Order

### Morning Session (2-3 hours)
1. **Stripe Production Setup** - Switch to live mode
2. **Domain Purchase** - Buy and configure
3. **OG Images** - Finalize and test

### Afternoon Session (2-3 hours)
4. **Google Analytics** - Set up tracking
5. **SEO Basics** - Meta tags, sitemap
6. **LinkedIn Article** - Write and post

### Evening Session (1-2 hours)
7. **Product Hunt Prep** - Assets and copy
8. **Ad Account Setup** - Facebook Pixel, Google Ads

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

## Environment Variables Checklist (Production)

```env
# Supabase (already live)
NEXT_PUBLIC_SUPABASE_URL=https://ykptxslgxlsbvpbeujfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<keep current>
SUPABASE_SERVICE_ROLE_KEY=<keep current>

# Stripe (UPDATE TO LIVE)
STRIPE_SECRET_KEY=sk_live_...  # CHANGE FROM sk_test_
STRIPE_WEBHOOK_SECRET=whsec_... # NEW LIVE WEBHOOK
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/live_... # NEW LIVE LINK

# Gemini (already live)
GEMINI_API_KEY=<keep current>

# App URL (UPDATE AFTER DOMAIN)
NEXT_PUBLIC_APP_URL=https://redhorseoracle.com  # UPDATE TO NEW DOMAIN
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

*Rest well! Big day tomorrow.* 🔥🐴

火马年 2026
