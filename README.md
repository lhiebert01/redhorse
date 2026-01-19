# Red Horse Oracle

<div align="center">

![Fire Horse 2026](https://img.shields.io/badge/Year%20of%20the-Fire%20Horse%202026-FF4500?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?style=for-the-badge)
![Price](https://img.shields.io/badge/Price-$8.88-FFD700?style=for-the-badge)

**The World's First AI-Powered Fire Horse Oracle**

*Personalized Chinese Zodiac Talismans for the Once-in-60-Year Fire Horse Year*

![Privacy by Design](https://img.shields.io/badge/Privacy-By%20Design-22C55E?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-PRODUCTION%20LIVE-success?style=for-the-badge)

[Live Site](https://www.redhorseoracle.com) | [Free Reading](https://www.redhorseoracle.com/free) | [Examples](https://www.redhorseoracle.com/examples) | [Privacy](https://www.redhorseoracle.com/privacy)

</div>

---

## Overview

**Red Horse Oracle** is a groundbreaking AI-powered digital talisman generator that harnesses the mystical energy of the **Year of the Fire Horse 2026** — a rare celestial event that occurs only once every 60 years in the Chinese zodiac cycle.

Each talisman is a **one-of-a-kind masterpiece** of Chinese zodiac artwork, personally crafted by AI for the recipient's exact birthday and zodiac sign, delivering prophecies for wealth, power, love, or protection.

## The Four Oracle Paths

| Mode | Emoji | Prophecy Type | Description |
|------|-------|---------------|-------------|
| **Wealth** | 🎲 | 6 Lucky Numbers | Personal fortune numbers channeled by the Fire Horse |
| **Power** | ⚔️ | 3-Word Battle Motto | Strategic guidance to fuel your ambitions |
| **Love** | ❤️ | 4-Word Love Decree | Romantic destiny revealed by the Oracle |
| **Shield** | 🛡️ | 3-Word Protective Mantra | Sacred protection against harm and negativity |

## Features

### AI-Generated Masterpiece Artwork
- **Stunning visuals** powered by Google Gemini 3 Pro image generation
- **Culturally authentic** Chinese zodiac representations
- **All 12 zodiac animals** with traditional symbolism and artistry
- **Randomized art styles**: Ink wash, Song Dynasty, Dunhuang murals, Tang Dynasty
- **Personalized prophecy** based on zodiac sign and Fire Horse compatibility
- **Downloadable, shareable, printable** high-resolution images

### Privacy by Design - KEY DIFFERENTIATOR
- **FIRST, ONLY, BEST** Google Gemini 3 Pro zodiac app with complete privacy
- **Zero PII stored** - Your birth date is used to calculate zodiac, then immediately discarded
- **No names on Oracle** - We never ask for or display your name
- **Safe to share publicly** - Your Oracle contains no personally identifiable information
- **No tracking cookies** - Beyond secure Stripe checkout
- **Simplified compliance** - GDPR/CCPA friendly by design

### Examples Gallery
- **12 complete examples** showcasing all zodiac animals
- **All 4 oracle modes** demonstrated (3 Wealth, 3 Power, 3 Love, 3 Shield)
- **Full-size image lightbox** for viewing masterpiece artwork
- **Interactive sidebar** explaining each talisman's significance
- **Zodiac year finder** to discover your Chinese zodiac sign

### Reveal Experience
- **Real-time generation status** with animated progress
- **Beautiful talisman display** with decree and mystical reading
- **Zodiac Summary** - Personalized 2026 Fire Horse forecast with characteristics and strengths
- **Save Talisman** - Downloads AI artwork as `fire-horse-2026-{element}-{animal}-talisman.png`
- **Save Zodiac Forecast** - Downloads zodiac card as `fire-horse-2026-{element}-{animal}-forecast.png`
- **Copy Message** - Copies full prophecy + talisman link (most reliable)
- **Share to X/Twitter** - Pre-formatted tweet with full text
- **Share to LinkedIn** - Direct link sharing
- **Share to WhatsApp/Telegram** - Full text + link support
- **Navigation buttons** - Return home, get another reading, view examples

### Landing Page Experience
- **Rotating background images** with smooth crossfade transitions
- **16-second intervals** cycling through main chart and marketing grids
- **Crystal-clear imagery** - No blur, optimized opacity (30%)
- **OG image optimized** for LinkedIn and Facebook sharing

### Limited Edition System
- **888 editions per zodiac per mode** (42,624 total possible)
- **Numbered editions** - Each oracle shows "Edition #X of 888"
- **Maker's Mark** - Certificate of authenticity on every oracle
- **Closing date** - All editions close February 17, 2027 (end of Fire Horse year)

### Analytics Dashboard (Admin)
- **Access:** `/admin-analytics` (PIN required)
- **Tracks:** Free readings and paid oracles by zodiac sign
- **No PII collected** - Only counters for marketing purposes
- **Auto-refresh** every 30 seconds
- **Revenue tracking** - Shows gross revenue by zodiac sign

### Payment & Integration
- **$8.88 price point** (auspicious number in Chinese culture)
- **Stripe Payment Links** with custom checkout fields
- **Instant webhook processing** for immediate generation
- **Shareable reveal links** that persist forever

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Payments | Stripe Payment Links (LIVE) |
| AI Text | Google Gemini 3 Pro |
| AI Images | Google Gemini 3 Pro (Native) |
| Hosting | Vercel Edge Network |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/lhiebert01/redhorse.git
cd redhorse
npm install
```

### 2. Environment Setup

Create `.env.local`:

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
│   │   ├── export-examples/  # Export example data
│   │   └── health/           # Health check
│   ├── reveal/               # Talisman reveal page
│   ├── examples/             # Examples gallery page
│   ├── admin-test/           # SuperAdmin test console
│   ├── collections-grid/     # Screenshot tool for marketing
│   ├── free/                 # Free zodiac reading page
│   ├── terms/                # Terms of Service
│   └── privacy/              # Privacy Policy
├── components/
│   ├── reveal/               # Reveal page components
│   ├── ui/                   # UI components
│   ├── landing/              # Landing page components
│   └── layout/               # Layout components
├── lib/
│   ├── supabase/             # Database clients
│   ├── stripe/               # Payment processing
│   ├── gemini/               # AI generation
│   ├── zodiac/               # Zodiac calculations
│   └── utils/                # Utilities
├── constants/
│   ├── modes.ts              # Product modes
│   ├── examples.ts           # Gallery examples data
│   └── zodiac-data.ts        # Zodiac information
└── types/                    # TypeScript types

public/
├── assets/
│   ├── zodiac/               # 12 zodiac animal images + chart
│   ├── zodiac-badges/        # 60 element-animal cards + 12 collections
│   ├── examples/             # 12 generated talisman examples
│   ├── marketing-grid-*.jpg  # 5 marketing grid screenshots
│   └── *.jpeg                # Hero images, OG images, Stripe graphic
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhook` | POST | Stripe webhook handler |
| `/api/prophecy/[id]` | GET | Get prophecy by ID |
| `/api/admin-test` | POST | Generate test prophecy (requires PIN) |
| `/api/export-examples` | GET | Export example prophecy data |
| `/api/health` | GET | Health check |

## Chinese Zodiac Support

All 12 animals with authentic representations:

| Animal | Chinese | Years | Symbolism |
|--------|---------|-------|-----------|
| Rat | 鼠 | 1984, 1996, 2008, 2020 | Wealth, cleverness |
| Ox | 牛 | 1985, 1997, 2009, 2021 | Hard work, strength |
| Tiger | 虎 | 1986, 1998, 2010, 2022 | Bravery, power |
| Rabbit | 兔 | 1987, 1999, 2011, 2023 | Longevity, peace |
| Dragon | 龙 | 1988, 2000, 2012, 2024 | Nobility, luck |
| Snake | 蛇 | 1989, 2001, 2013, 2025 | Wisdom, mystery |
| Horse | 马 | 1990, 2002, 2014, 2026 | Success, freedom |
| Goat | 羊 | 1991, 2003, 2015 | Peace, creativity |
| Monkey | 猴 | 1992, 2004, 2016 | Cleverness, curiosity |
| Rooster | 鸡 | 1993, 2005, 2017 | Confidence, honesty |
| Dog | 狗 | 1994, 2006, 2018 | Loyalty, protection |
| Pig | 猪 | 1995, 2007, 2019 | Wealth, abundance |

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Development guide for AI assistants
- **[docs/EXEC-SUMMARY.md](./docs/EXEC-SUMMARY.md)** - Executive summary and document index
- **[docs/NEXT-STEPS.md](./docs/NEXT-STEPS.md)** - Launch preparation & marketing calendar
- **[docs/SOCIAL-MEDIA-LAUNCH.md](./docs/SOCIAL-MEDIA-LAUNCH.md)** - Social media copy & strategy
- **[docs/FEATURES.md](./docs/FEATURES.md)** - Detailed feature documentation
- **[docs/DESIGN.md](./docs/DESIGN.md)** - Design philosophy and UX principles
- **[docs/ANNOUNCEMENT.md](./docs/ANNOUNCEMENT.md)** - Press release and introduction
- **[docs/RELEASE-NOTES.md](./docs/RELEASE-NOTES.md)** - Version history and changelog (v1.3.0)

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Or:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## License

Proprietary - All rights reserved.

## Support

For support, email support@redhorseoracle.com

---

<div align="center">

*"The Fire Horse returns only once every 60 years. Your Oracle awaits."*

**火马年 2026**

</div>
