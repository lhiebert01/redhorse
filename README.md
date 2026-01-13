# Red Horse Oracle 🐎🔥

> **AI-Powered Digital Talisman Generator for the Year of the Fire Horse 2026**

A viral SaaS application that generates personalized AI talismans with lucky numbers, strategic advice, and protective mantras based on Chinese zodiac and the rare Fire Horse year (occurs every 60 years).

## Features

- 🎲 **Wealth Mode** - Generate 6 Personal Lucky Numbers
- ⚔️ **Power Mode** - Get Your Strategic 2026 Motto
- ❤️ **Love Mode** - Receive Your Relationship Decree
- 🛡️ **Shield Mode** - Obtain Your Protective Mantra

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Payments:** Stripe Payment Links
- **AI:** Google Gemini 2.0 Flash
- **Hosting:** Vercel

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/lhiebert01/redhorse.git
cd redhorse
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` - Your Stripe payment link URL
- `GEMINI_API_KEY` - Google AI Studio API key

### 3. Database Setup

Run the SQL migration in your Supabase SQL Editor:

```sql
-- See supabase/migrations/001_initial_schema.sql
```

Create a storage bucket named `talismans` (public).

### 4. Stripe Setup

1. Create a product ($8.88)
2. Create a Payment Link with custom fields:
   - Text field: "Date of Birth (MM/DD/YYYY)" - Key: `dob`
   - Dropdown: "Choose Your Path" - Key: `focus`
     - Options: Wealth, Power, Love, Shield
3. Set redirect URL: `https://yourdomain.com/reveal?session_id={CHECKOUT_SESSION_ID}`
4. Configure webhook endpoint: `https://yourdomain.com/api/webhook`
   - Events: `checkout.session.completed`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   │   ├── webhook/     # Stripe webhook handler
│   │   ├── prophecy/    # Prophecy API
│   │   └── health/      # Health check
│   ├── reveal/          # Talisman reveal page
│   ├── terms/           # Terms of Service
│   └── privacy/         # Privacy Policy
├── components/          # React components
│   └── reveal/          # Reveal page components
├── lib/                 # Core libraries
│   ├── supabase/        # Database clients
│   ├── stripe/          # Payment processing
│   ├── gemini/          # AI generation
│   ├── zodiac/          # Zodiac calculations
│   └── utils/           # Utilities
├── constants/           # App constants
└── types/               # TypeScript types
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhook` | POST | Stripe webhook handler |
| `/api/prophecy/[id]` | GET | Get prophecy by ID |
| `/api/health` | GET | Health check |

## License

Proprietary - All rights reserved.

## Support

For support, email support@redhorseoracle.com

---

*"The Fire Horse returns. Your Oracle awaits."* 🔥🐎
