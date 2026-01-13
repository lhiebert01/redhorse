# Red Horse Oracle

> **AI-Powered Digital Talisman Generator for the Year of the Fire Horse 2026**

A viral SaaS application that generates personalized AI talismans with lucky numbers, strategic advice, and protective mantras based on Chinese zodiac and the rare Fire Horse year (occurs every 60 years).

**Live:** https://redhorse-omega.vercel.app/

## Features

### Oracle Modes
- **Wealth Mode** - Generate 6 Personal Lucky Numbers
- **Power Mode** - Get Your Strategic 2026 Motto
- **Love Mode** - Receive Your Relationship Decree
- **Shield Mode** - Obtain Your Protective Mantra

### AI-Generated Talismans
- Stunning artwork using **Gemini 3 Pro Image** generation
- Culturally authentic Chinese zodiac representations
- All 12 zodiac animals with traditional symbolism
- Randomized art styles for unique images (ink wash, Song Dynasty, Dunhuang, Tang Dynasty)
- Personalized prophecy text based on zodiac and Fire Horse compatibility

### Reveal Page Features
- Real-time prophecy generation status
- Beautiful talisman display with decree and reading
- **Save Talisman** - Downloads full card as image (header, image, decree, zodiac, reading)
- **Share** - Native share or copy to clipboard
- **Share to X/Twitter** - Pre-formatted tweet with link

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Payments | Stripe Payment Links |
| AI Text | Google Gemini 3 Pro |
| AI Images | Google Gemini 3 Pro Image |
| Hosting | Vercel |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/lhiebert01/redhorse.git
cd redhorse
npm install
```

### 2. Environment Setup

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/...
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run in Supabase SQL Editor:
```sql
-- See supabase/migrations/001_initial_schema.sql
```

Create storage bucket: `talismans` (public)

### 4. Stripe Setup

1. Create product ($8.88)
2. Create Payment Link with custom fields:
   - Text: "Date of Birth (MM/DD/YYYY)" - Key: `dob`
   - Dropdown: "Choose Your Path" - Key: `focus`
     - Options: Wealth, Power, Love, Shield
3. Set redirect: `https://yourdomain.com/reveal?session_id={CHECKOUT_SESSION_ID}`
4. Configure webhook: `https://yourdomain.com/api/webhook`
   - Event: `checkout.session.completed`

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── webhook/          # Stripe webhook handler
│   │   ├── prophecy/[id]/    # Get prophecy by ID
│   │   ├── admin-test/       # SuperAdmin test endpoint
│   │   └── health/           # Health check
│   ├── reveal/               # Talisman reveal page
│   ├── admin-test/           # SuperAdmin test console
│   ├── terms/                # Terms of Service
│   └── privacy/              # Privacy Policy
├── components/
│   ├── reveal/               # Reveal page components
│   │   ├── TalismanDisplay.tsx
│   │   ├── GeneratingState.tsx
│   │   └── ShareButtons.tsx
│   ├── ui/                   # UI components
│   ├── landing/              # Landing page components
│   └── layout/               # Layout components
├── lib/
│   ├── supabase/             # Database clients
│   ├── stripe/               # Payment processing
│   ├── gemini/               # AI generation
│   │   ├── client.ts         # Gemini API client
│   │   ├── generate.ts       # Prophecy generation
│   │   └── prompts.ts        # AI prompts
│   ├── zodiac/               # Zodiac calculations
│   └── utils/                # Utilities
├── constants/
│   ├── modes.ts              # Product modes
│   └── zodiac-data.ts        # Zodiac information
└── types/                    # TypeScript types
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhook` | POST | Stripe webhook handler |
| `/api/prophecy/[id]` | GET | Get prophecy by ID |
| `/api/admin-test` | POST | Generate test prophecy (requires PIN) |
| `/api/health` | GET | Health check |

## SuperAdmin Test Console

For development and testing, access the admin console to generate prophecies without payment:

1. Click the **gear icon** (top-right corner, subtle)
2. Or navigate directly to `/admin-test`
3. Enter PIN: `142857`
4. Select birth date and oracle mode
5. Generate test prophecy

> **Note:** Hide the gear icon for production by removing/commenting lines 10-35 in `src/app/page.tsx`

## Chinese Zodiac Support

All 12 animals with authentic representations:

| Animal | Chinese | Symbolism |
|--------|---------|-----------|
| Rat | 鼠 | Wealth, cleverness |
| Ox | 牛 | Hard work, strength |
| Tiger | 虎 | Bravery, power |
| Rabbit | 兔 | Longevity, peace |
| Dragon | 龙 | Nobility, luck |
| Snake | 蛇 | Wisdom, mystery |
| Horse | 马 | Success, freedom |
| Goat | 羊 | Peace, creativity |
| Monkey | 猴 | Cleverness, curiosity |
| Rooster | 鸡 | Confidence, honesty |
| Dog | 狗 | Loyalty, protection |
| Pig | 猪 | Wealth, abundance |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Development guide for Claude Code AI assistant
- **[supabase/migrations/](./supabase/migrations/)** - Database schema

## License

Proprietary - All rights reserved.

## Support

For support, email support@redhorseoracle.com

---

*"The Fire Horse returns. Your Oracle awaits."*
