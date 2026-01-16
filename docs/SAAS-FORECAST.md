# Red Horse Oracle - SaaS Adoption & Revenue Forecast

**Last Updated:** January 16, 2026
**Product:** redhorseoracle.com
**Price:** $8.88 per Oracle

---

## Cost Structure (Per Oracle Generated)

### AI Generation Costs (Google Gemini)

| Model | Resolution | Cost per Image | Notes |
|-------|------------|----------------|-------|
| **Gemini 3 Pro Image Preview** | 1K/2K | **$0.134** | Current production model |
| Gemini 3 Pro Image Preview | 4K | $0.24 | High resolution option |
| Gemini 2.5 Flash Image | 1K | $0.039 | Cheaper alternative |
| Gemini 2.0 Flash | 1K | $0.039 | Budget option |

**Text Generation (Prophecy):**
- Gemini 3 Pro: ~$0.01-0.02 per request (minimal tokens)

**Source:** [Google AI Pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Payment Processing (Stripe)

| Component | Rate | Per $8.88 Sale |
|-----------|------|----------------|
| Percentage | 2.9% | $0.26 |
| Fixed fee | $0.30 | $0.30 |
| **Total Stripe** | - | **$0.56** |

### Total Cost Per Oracle

| Cost Component | Amount |
|----------------|--------|
| Gemini 3 Pro Image | $0.134 |
| Gemini Text | $0.015 |
| Stripe Fees | $0.56 |
| **Total Cost** | **$0.71** |
| **Net Revenue** | **$8.17** |

**Gross Margin:** 92%

---

## Edition Limits & Maximum Revenue

### Total Available Inventory

| Metric | Value |
|--------|-------|
| Zodiac Signs | 12 |
| Modes per Sign | 4 (Wealth, Power, Love, Shield) |
| Editions per Mode | 888 |
| **Total Oracles** | **42,624** |

### Maximum Revenue (100% Sold Out)

| Metric | Value |
|--------|-------|
| Total Oracles | 42,624 |
| Price per Oracle | $8.88 |
| **Gross Revenue** | **$378,501** |
| Total Costs | $30,262 |
| **Net Revenue** | **$348,239** |

---

## Revenue Projections by Adoption Scenario

### Conservative (5% Adoption)

| Metric | Value |
|--------|-------|
| Oracles Sold | 2,131 |
| Gross Revenue | $18,923 |
| AI Costs | $318 |
| Stripe Fees | $1,193 |
| **Net Revenue** | **$17,412** |

### Medium (15% Adoption)

| Metric | Value |
|--------|-------|
| Oracles Sold | 6,394 |
| Gross Revenue | $56,778 |
| AI Costs | $953 |
| Stripe Fees | $3,580 |
| **Net Revenue** | **$52,245** |

### Viral (40% Adoption)

| Metric | Value |
|--------|-------|
| Oracles Sold | 17,050 |
| Gross Revenue | $151,404 |
| AI Costs | $2,540 |
| Stripe Fees | $9,548 |
| **Net Revenue** | **$139,316** |

### Sold Out (100% Adoption)

| Metric | Value |
|--------|-------|
| Oracles Sold | 42,624 |
| Gross Revenue | $378,501 |
| AI Costs | $6,351 |
| Stripe Fees | $23,870 |
| **Net Revenue** | **$348,280** |

---

## Monthly Projections (Medium Scenario)

### Year of the Fire Horse Timeline
- **Start:** January 29, 2026 (Chinese New Year)
- **End:** February 16, 2027
- **Duration:** ~13 months

| Month | Visitors | Conv% | Sales | Revenue | Cumulative |
|-------|----------|-------|-------|---------|------------|
| Jan 2026 | 5,000 | 5% | 250 | $2,041 | $2,041 |
| Feb 2026 | 30,000 | 6% | 1,800 | $14,706 | $16,747 |
| Mar 2026 | 15,000 | 5% | 750 | $6,128 | $22,875 |
| Apr 2026 | 8,000 | 5% | 400 | $3,268 | $26,143 |
| May 2026 | 6,000 | 5% | 300 | $2,451 | $28,594 |
| Jun 2026 | 8,000 | 5% | 400 | $3,268 | $31,862 |
| Jul 2026 | 6,000 | 5% | 300 | $2,451 | $34,313 |
| Aug 2026 | 7,000 | 5% | 350 | $2,860 | $37,173 |
| Sep 2026 | 10,000 | 5% | 500 | $4,085 | $41,258 |
| Oct 2026 | 8,000 | 5% | 400 | $3,268 | $44,526 |
| Nov 2026 | 12,000 | 6% | 720 | $5,882 | $50,408 |
| Dec 2026 | 15,000 | 6% | 900 | $7,353 | $57,761 |
| Jan 2027 | 8,000 | 5% | 400 | $3,268 | $61,029 |
| Feb 2027 | 5,000 | 5% | 250 | $2,041 | $63,070 |

**Total (Medium):** ~7,720 sales, ~$63,000 net revenue

---

## Complete Infrastructure & Resource Costs

### Tech Stack Overview

| Layer | Service | Purpose |
|-------|---------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with SSR |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Hosting** | Vercel | Serverless deployment |
| **Database** | Supabase PostgreSQL | User data, prophecies |
| **Storage** | Supabase Storage | Talisman images (PNG) |
| **Payments** | Stripe Payment Links | $8.88 checkout |
| **AI Text** | Gemini 3 Pro Preview | Prophecy generation |
| **AI Image** | Gemini 3 Pro Image Preview | Talisman artwork |
| **Domain** | GoDaddy | redhorseoracle.com |
| **Git/CI** | GitHub | Version control, auto-deploy |

### AI Models (Google Gemini)

| Model | Model ID | Use Case | Cost |
|-------|----------|----------|------|
| **Text** | `gemini-3-pro-preview` | Prophecy, lucky numbers, mantras | $1.25/1M input, $5.00/1M output |
| **Image** | `gemini-3-pro-image-preview` | Talisman artwork (9:16) | **$0.134/image (1K/2K)** |

**Package:** `@google/genai`
**Note:** Gemini 3 Flash does NOT support image generation - Pro Image is required.

### Fixed Operating Costs (Monthly)

| Service | Free Tier Limit | Pro Tier Cost | When to Upgrade |
|---------|-----------------|---------------|-----------------|
| **Vercel** | 100GB bandwidth | $20/mo | >100K visitors/mo |
| **Supabase** | 500MB DB, 1GB storage | $25/mo | >500 prophecies or >1GB images |
| **GitHub** | Unlimited public repos | Free | Never (public repo) |
| **Domain** | N/A | $15/year | Annual renewal |

### Variable Costs (Per Transaction)

| Service | Rate | Per $8.88 Sale |
|---------|------|----------------|
| **Stripe** | 2.9% + $0.30 | $0.56 |
| **Gemini 3 Pro Image** | $0.134/image | $0.134 |
| **Gemini 3 Pro Text** | ~$0.01/request | $0.01 |
| **Supabase Storage** | Free up to 1GB | ~$0.00 |
| **Total Variable** | - | **$0.71** |

### Monthly Cost Projections by Volume

| Sales/Month | Gemini AI | Stripe | Vercel | Supabase | **Total Cost** | **Net Revenue** |
|-------------|-----------|--------|--------|----------|----------------|-----------------|
| 50 | $7 | $28 | $0 | $0 | $35 | $409 |
| 100 | $14 | $56 | $0 | $0 | $70 | $818 |
| 500 | $72 | $280 | $0 | $0 | $352 | $4,088 |
| 1,000 | $145 | $560 | $0 | $25 | $730 | $8,150 |
| 2,000 | $290 | $1,120 | $20 | $25 | $1,455 | $16,285 |
| 5,000 | $725 | $2,800 | $20 | $25 | $3,570 | $40,830 |

### Annual Infrastructure Budget

| Scenario | Fixed Costs | Variable (Est.) | Total Annual |
|----------|-------------|-----------------|--------------|
| **Minimal** | $15 (domain) | $500 | ~$515 |
| **Medium** | $315 (domain + some months Pro) | $5,000 | ~$5,315 |
| **High Volume** | $555 (domain + Vercel + Supabase) | $20,000 | ~$20,555 |

**Note:** Free tiers should cover most of the Fire Horse year unless traffic is exceptionally high.

---

## Break-Even Analysis

| Scenario | Sales Needed | Revenue |
|----------|--------------|---------|
| Cover hosting (yearly) | 69 | $565 |
| Cover 1 month ops | 6 | $49 |
| First $1,000 profit | 123 | $1,005 |
| First $10,000 profit | 1,224 | $10,000 |

**Break-even is essentially immediate** - first sale covers months of hosting.

---

## Cost Optimization Options

### Switch to Gemini 2.5 Flash Image

| Model | Cost/Image | Savings |
|-------|------------|---------|
| Current (3 Pro) | $0.134 | - |
| 2.5 Flash | $0.039 | 71% |

**Impact on Net Revenue:**
- Current: $8.17 per sale
- With Flash: $8.27 per sale (+$0.10/sale)
- At 10,000 sales: +$1,000 extra profit

**Trade-off:** Slightly lower image quality, but still excellent for this use case.

### Batch Processing (50% off)

If implementing async generation with batch API:
- Gemini 3 Pro: $0.067/image (vs $0.134)
- Gemini 2.5 Flash: $0.0195/image (vs $0.039)

---

## Risk Factors

### Downside Risks
1. **Low adoption** - Conservative scenario still profitable
2. **API price increases** - Gemini has been stable/decreasing
3. **Competition** - First mover advantage in Fire Horse niche

### Upside Potential
1. **Viral moment** - CNY sharing could explode
2. **Influencer pickup** - Single viral post = thousands of sales
3. **Gambling wins** - Wealth mode winners sharing = social proof
4. **Gift giving** - People buy for friends/family

---

## Summary

| Scenario | Sales | Net Revenue | Profit Margin |
|----------|-------|-------------|---------------|
| Conservative | 2,131 | $17,412 | 92% |
| Medium | 6,394 | $52,245 | 92% |
| Viral | 17,050 | $139,316 | 92% |
| Sold Out | 42,624 | $348,280 | 92% |

**Key Insight:** With 92% margins and near-zero fixed costs, this is highly profitable at any adoption level above a few dozen sales.

---

## Sources

- [Google Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Stripe Pricing](https://stripe.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing)

---

*火马年 2026 - Year of the Fire Horse*
