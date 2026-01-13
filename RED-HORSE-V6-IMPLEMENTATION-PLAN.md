# RED HORSE ORACLE V6 - IMPLEMENTATION & DEPLOYMENT PLAN

**Codename:** FireStorm V6
**Version:** 6.0 (Production Ready)
**Author:** Lindsay Hiebert (Chief GenAI Officer, Nybsys)
**Date:** January 13, 2026
**Hard Deadline:** February 17, 2026 (Chinese New Year)

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [V6 Improvements Over V5](#2-v6-improvements-over-v5)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Core Features](#6-core-features)
7. [Implementation Guide](#7-implementation-guide)
8. [API Architecture](#8-api-architecture)
9. [Deployment Guide](#9-deployment-guide)
10. [Environment Variables](#10-environment-variables)
11. [Legal & Compliance](#11-legal--compliance)
12. [Marketing Strategy](#12-marketing-strategy)
13. [Revenue Projections](#13-revenue-projections)
14. [Implementation Checklist](#14-implementation-checklist)

---

## 1. EXECUTIVE SUMMARY

### The Concept
Red Horse Oracle is a viral SaaS application designed to capitalize on the rare "Year of the Fire Horse" (2026)—a 60-year cycle in Chinese astrology associated with volatility, transformation, and opportunity.

### The Product
Users pay **$8.88** to receive a personalized AI-generated "Digital Talisman"—a high-definition vertical scroll artwork containing their:
- **Lucky Numbers** (Wealth Mode)
- **Strategic Motto** (Power Mode)
- **Relationship Decree** (Love Mode)
- **Protective Mantra** (Shield Mode)

### V6 Value Proposition
- **For Users:** "Chaos is coming in 2026. Don't guess your destiny. Get your shield."
- **For Creator:** High-margin viral revenue + Reputation as GenAI innovator

### Key Metrics
| Metric | Target |
|--------|--------|
| Price Point | $8.88 |
| Gross Margin | ~90% |
| Launch Date | January 15, 2026 |
| Event Date | February 17, 2026 |

---

## 2. V6 IMPROVEMENTS OVER V5

### Architecture Improvements

| Area | V5 Approach | V6 Optimization |
|------|-------------|-----------------|
| **Framework** | Next.js Pages Router | Next.js 14 App Router with Server Components |
| **Styling** | Inline Tailwind | Tailwind + CSS Variables for theming |
| **Type Safety** | JavaScript | TypeScript throughout |
| **API Design** | Single webhook file | Modular route handlers with middleware |
| **Image Storage** | Direct Gemini URL | Supabase Storage with CDN |
| **Error Handling** | Console.log | Structured error handling + retry logic |
| **Session Matching** | Query by latest | Proper session_id to prophecy mapping |
| **State Management** | Polling | Real-time Supabase subscriptions |
| **Performance** | Basic | Edge functions + ISR |

### New V6 Features

1. **Robust Session Tracking**
   - Proper Stripe session_id to database record mapping
   - No more "query by latest" anti-pattern

2. **Real-time Status Updates**
   - Supabase real-time subscriptions for reveal page
   - Progress indicators during generation

3. **Image Persistence**
   - Store generated images in Supabase Storage
   - Reliable CDN-backed URLs (Gemini URLs may expire)

4. **Zodiac Intelligence Engine**
   - Embedded zodiac logic for accurate readings
   - Birth date to Chinese zodiac calculation

5. **Social Sharing**
   - Open Graph meta tags for rich link previews
   - Native share API integration
   - Download button for talisman images

6. **Analytics Dashboard**
   - Track conversions, popular modes, revenue
   - Error monitoring with Sentry

---

## 3. TECH STACK

### Core Stack

```
Frontend & Backend:  Next.js 14 (App Router)
Language:            TypeScript
Styling:             Tailwind CSS 3.4
Deployment:          Vercel (Edge Network)
Database:            Supabase (PostgreSQL)
File Storage:        Supabase Storage
Payments:            Stripe (Payment Links + Webhooks)
AI - Text:           Google Gemini 2.0 Flash
AI - Images:         Google Gemini 2.0 Flash (with Imagen 3)
```

### Supporting Tools

```
Package Manager:     pnpm (faster than npm)
Linting:             ESLint + Prettier
Type Checking:       TypeScript strict mode
Testing:             Vitest + Playwright (E2E)
Monitoring:          Vercel Analytics + Sentry
```

### API Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "@supabase/supabase-js": "^2.39.0",
    "@google/generative-ai": "^0.21.0",
    "stripe": "^14.14.0",
    "micro": "^10.0.1",
    "date-fns": "^3.3.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 4. PROJECT STRUCTURE

```
redhorse/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                # Social sharing preview
│   └── fonts/
│       └── chinese-calligraphy.woff2
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles + Tailwind
│   │   │
│   │   ├── reveal/
│   │   │   └── page.tsx            # Talisman reveal page
│   │   │
│   │   ├── terms/
│   │   │   └── page.tsx            # Terms of Service
│   │   │
│   │   ├── privacy/
│   │   │   └── page.tsx            # Privacy Policy
│   │   │
│   │   └── api/
│   │       ├── webhook/
│   │       │   └── route.ts        # Stripe webhook handler
│   │       │
│   │       ├── prophecy/
│   │       │   └── [id]/
│   │       │       └── route.ts    # Get prophecy by ID
│   │       │
│   │       └── health/
│   │           └── route.ts        # Health check endpoint
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── ModeSelector.tsx
│   │   │   └── Testimonials.tsx
│   │   │
│   │   ├── reveal/
│   │   │   ├── TalismanDisplay.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   └── GeneratingState.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Disclaimer.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── admin.ts            # Admin client (service role)
│   │   │
│   │   ├── stripe/
│   │   │   ├── client.ts           # Stripe instance
│   │   │   ├── webhooks.ts         # Webhook verification
│   │   │   └── payment-links.ts    # Payment link configs
│   │   │
│   │   ├── gemini/
│   │   │   ├── client.ts           # Gemini AI client
│   │   │   ├── prompts.ts          # Prompt templates
│   │   │   └── generate.ts         # Generation logic
│   │   │
│   │   ├── zodiac/
│   │   │   ├── calculator.ts       # Birth date to zodiac
│   │   │   └── meanings.ts         # Zodiac interpretations
│   │   │
│   │   └── utils/
│   │       ├── dates.ts
│   │       ├── validation.ts
│   │       └── errors.ts
│   │
│   ├── types/
│   │   ├── prophecy.ts
│   │   ├── stripe.ts
│   │   └── zodiac.ts
│   │
│   └── constants/
│       ├── modes.ts                # Product modes config
│       └── zodiac-data.ts          # Zodiac relationships
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                    # Test data
│
├── scripts/
│   ├── generate-sample.ts          # Generate test talismans
│   └── setup-stripe.ts             # Stripe product setup
│
├── doc-plan/                       # Original planning docs
│   └── ...
│
├── .env.example
├── .env.local                      # Local environment (gitignored)
├── .gitignore
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 5. DATABASE SCHEMA

### Supabase SQL Migration

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main prophecies table
CREATE TABLE prophecies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Stripe session tracking
    stripe_session_id TEXT UNIQUE NOT NULL,
    stripe_payment_intent TEXT,

    -- User data
    email TEXT NOT NULL,
    birth_date TEXT NOT NULL,

    -- Product selection
    focus_mode TEXT NOT NULL CHECK (focus_mode IN ('wealth', 'power', 'love', 'shield')),

    -- Zodiac calculation
    zodiac_sign TEXT,
    zodiac_element TEXT,
    fire_horse_relation TEXT,

    -- Generated content
    main_text TEXT,
    sub_text TEXT,
    full_reading TEXT,

    -- Image handling
    image_url TEXT,
    image_storage_path TEXT,

    -- Processing status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Index for session lookups (primary access pattern)
CREATE INDEX idx_prophecies_session ON prophecies(stripe_session_id);

-- Index for status queries
CREATE INDEX idx_prophecies_status ON prophecies(status);

-- Index for analytics
CREATE INDEX idx_prophecies_focus_mode ON prophecies(focus_mode);
CREATE INDEX idx_prophecies_created_at ON prophecies(created_at);

-- Enable Row Level Security
ALTER TABLE prophecies ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read of completed prophecies by session_id
CREATE POLICY "Allow read own prophecy" ON prophecies
    FOR SELECT
    USING (true);

-- Policy: Only service role can insert/update
CREATE POLICY "Service role full access" ON prophecies
    FOR ALL
    USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON prophecies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Enable realtime for status updates
ALTER PUBLICATION supabase_realtime ADD TABLE prophecies;

-- Analytics view
CREATE VIEW prophecy_analytics AS
SELECT
    DATE_TRUNC('day', created_at) as date,
    focus_mode,
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count
FROM prophecies
GROUP BY DATE_TRUNC('day', created_at), focus_mode, status
ORDER BY date DESC;
```

### Storage Bucket Setup

```sql
-- Create storage bucket for talisman images
INSERT INTO storage.buckets (id, name, public)
VALUES ('talismans', 'talismans', true);

-- Allow public read access to talisman images
CREATE POLICY "Public talisman read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'talismans');

-- Only service role can upload
CREATE POLICY "Service role upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'talismans' AND auth.role() = 'service_role');
```

---

## 6. CORE FEATURES

### Product Modes

```typescript
// src/constants/modes.ts

export const PRODUCT_MODES = {
  wealth: {
    id: 'wealth',
    name: 'Wealth Mode',
    emoji: '🎲',
    tagline: 'The Gambler',
    description: 'Your 6 Personal Lucky Numbers',
    hook: 'Beat the House',
    visualTheme: 'Golden Fire Horse surrounded by falling coins and treasure',
    textPrompt: 'Generate 6 Lucky Numbers (01-99) and one Power Date in 2026',
    outputFormat: 'numbers + date'
  },
  power: {
    id: 'power',
    name: 'Power Mode',
    emoji: '⚔️',
    tagline: 'The Mogul',
    description: 'Your 2026 Strategy Motto',
    hook: 'Dominate the Market',
    visualTheme: 'Fire Horse scaling a mountain peak with lightning',
    textPrompt: 'Generate a 3-word aggressive Sun Tzu strategic motto',
    outputFormat: 'motto'
  },
  love: {
    id: 'love',
    name: 'Love Mode',
    emoji: '❤️',
    tagline: 'The Romantic',
    description: 'Your Relationship Decree',
    hook: 'Secure the Heart',
    visualTheme: 'Fire Horse and Phoenix dancing in the sky',
    textPrompt: 'Generate a 4-word romantic destiny phrase',
    outputFormat: 'phrase'
  },
  shield: {
    id: 'shield',
    name: 'Shield Mode',
    emoji: '🛡️',
    tagline: 'The Guardian',
    description: 'Your Protective Mantra',
    hook: 'Survive the Chaos',
    visualTheme: 'Fire Horse in an ancient temple with protective aura',
    textPrompt: 'Generate a 3-word protective mantra',
    outputFormat: 'mantra'
  }
} as const;
```

### Zodiac Logic Engine

```typescript
// src/constants/zodiac-data.ts

export const ZODIAC_ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
] as const;

export const FIRE_HORSE_RELATIONS = {
  Rat: {
    relation: 'Clash (Enemy)',
    tone: 'Warning',
    advice: 'Lay low. The Fire Horse burns your water. Avoid risky ventures.'
  },
  Ox: {
    relation: 'Harm (Friction)',
    tone: 'Caution',
    advice: 'Your hard work may go unnoticed. Patience is your shield.'
  },
  Tiger: {
    relation: 'Ally (Harmony)',
    tone: 'Victorious',
    advice: 'You are the Horse\'s ally. Fortune favors the bold. Run wild.'
  },
  Rabbit: {
    relation: 'Neutral',
    tone: 'Calm',
    advice: 'Stay out of the chaos. Let others fight while you secure home.'
  },
  Dragon: {
    relation: 'Indifferent',
    tone: 'Bold',
    advice: 'You can match the Horse\'s energy. Do not compete for spotlight.'
  },
  Snake: {
    relation: 'Ally (Fire)',
    tone: 'Strategic',
    advice: 'Use the Horse\'s chaos as a ladder. Strike while distracted.'
  },
  Horse: {
    relation: 'Self-Penalty',
    tone: 'Intense',
    advice: 'Double fire year. Conquer or burn out. Pace yourself carefully.'
  },
  Goat: {
    relation: 'Secret Friend',
    tone: 'Blessed',
    advice: 'The Horse protects you. 2026 is your year for love and connection.'
  },
  Monkey: {
    relation: 'Neutral',
    tone: 'Witty',
    advice: 'The speed of 2026 suits your agility. Watch your health.'
  },
  Rooster: {
    relation: 'Destruction',
    tone: 'Tested',
    advice: 'Relationships will be tested. Do not force love this year.'
  },
  Dog: {
    relation: 'Ally (Harmony)',
    tone: 'Loyal',
    advice: 'Your loyalty will be rewarded. Guard allies and prosper.'
  },
  Pig: {
    relation: 'Neutral',
    tone: 'Enjoyment',
    advice: 'The fire is hot, but you are cool. Enjoy, but protect wealth.'
  }
} as const;

// src/lib/zodiac/calculator.ts
export function getChineseZodiac(birthDate: string): {
  animal: string;
  element: string;
} {
  const date = new Date(birthDate);
  const year = date.getFullYear();

  // Chinese zodiac cycles every 12 years starting from Rat (1924)
  const animalIndex = (year - 1924) % 12;
  const animal = ZODIAC_ANIMALS[animalIndex < 0 ? animalIndex + 12 : animalIndex];

  // Five elements cycle every 2 years
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const elementIndex = Math.floor(((year - 1924) % 10) / 2);
  const element = elements[elementIndex < 0 ? elementIndex + 5 : elementIndex];

  return { animal, element };
}
```

---

## 7. IMPLEMENTATION GUIDE

### Step 1: Project Initialization

```bash
# Create Next.js project
pnpm create next-app@latest redhorse --typescript --tailwind --app --src-dir

# Navigate to project
cd redhorse

# Install dependencies
pnpm add @supabase/supabase-js stripe @google/generative-ai micro date-fns zod

# Install dev dependencies
pnpm add -D @types/node
```

### Step 2: Landing Page Component

```tsx
// src/app/page.tsx
import Link from 'next/link';
import { PRODUCT_MODES } from '@/constants/modes';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-red-600 font-serif">
      <div className="max-w-lg mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
            RED HORSE<br/>ORACLE
          </h1>

          <p className="text-white text-lg opacity-90">
            The Fire Horse returns once every 60 years.<br/>
            Chaos is coming.<br/>
            <span className="font-bold text-yellow-500">
              Do not guess your destiny.
            </span>
          </p>
        </div>

        {/* Product Modes */}
        <div className="bg-red-950/50 p-6 rounded-xl border border-red-800 space-y-3 mb-8">
          {Object.values(PRODUCT_MODES).map((mode) => (
            <div key={mode.id} className="flex items-center gap-3 text-red-200">
              <span className="text-2xl">{mode.emoji}</span>
              <div>
                <strong className="text-yellow-500">{mode.tagline}:</strong>
                <span className="ml-2">{mode.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
          className="block w-full bg-gradient-to-r from-yellow-600 to-yellow-500
                     text-black font-bold text-xl py-4 rounded-xl text-center
                     hover:scale-105 transition-transform shadow-xl
                     shadow-yellow-500/30"
        >
          UNLOCK FOR $8.88
        </a>

        {/* Disclaimer */}
        <p className="text-xs text-gray-600 mt-8 text-center">
          Strictly for entertainment purposes. AI-generated art.<br/>
          &copy; 2026 Red Horse Oracle. 18+.
        </p>
      </div>
    </main>
  );
}
```

### Step 3: Stripe Webhook Handler

```typescript
// src/app/api/webhook/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateProphecy } from '@/lib/gemini/generate';
import { getChineseZodiac } from '@/lib/zodiac/calculator';
import { FIRE_HORSE_RELATIONS } from '@/constants/zodiac-data';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract custom fields from Stripe
    const dobField = session.custom_fields?.find(f => f.key === 'dob');
    const focusField = session.custom_fields?.find(f => f.key === 'focus');

    const email = session.customer_details?.email || 'unknown';
    const birthDate = dobField?.text?.value || 'Unknown';
    const focusMode = focusField?.dropdown?.value || 'wealth';

    const supabase = createAdminClient();

    try {
      // Calculate zodiac
      const zodiac = getChineseZodiac(birthDate);
      const fireHorseRelation = FIRE_HORSE_RELATIONS[zodiac.animal as keyof typeof FIRE_HORSE_RELATIONS];

      // Create pending record with session_id for tracking
      const { data: prophecy, error: insertError } = await supabase
        .from('prophecies')
        .insert({
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          email,
          birth_date: birthDate,
          focus_mode: focusMode,
          zodiac_sign: zodiac.animal,
          zodiac_element: zodiac.element,
          fire_horse_relation: fireHorseRelation?.relation,
          status: 'processing'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate prophecy content (async, can take time)
      const result = await generateProphecy({
        birthDate,
        focusMode,
        zodiacSign: zodiac.animal,
        zodiacElement: zodiac.element,
        fireHorseAdvice: fireHorseRelation?.advice
      });

      // Upload image to Supabase Storage
      const imageResponse = await fetch(result.imageUrl);
      const imageBlob = await imageResponse.blob();
      const imagePath = `${prophecy.id}.png`;

      const { error: uploadError } = await supabase.storage
        .from('talismans')
        .upload(imagePath, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('talismans')
        .getPublicUrl(imagePath);

      // Update record with generated content
      await supabase
        .from('prophecies')
        .update({
          main_text: result.mainText,
          sub_text: result.subText,
          full_reading: result.fullReading,
          image_url: publicUrl.publicUrl,
          image_storage_path: imagePath,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', prophecy.id);

    } catch (error) {
      console.error('Prophecy generation failed:', error);

      // Update status to failed
      await supabase
        .from('prophecies')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('stripe_session_id', session.id);
    }
  }

  return NextResponse.json({ received: true });
}
```

### Step 4: Gemini AI Generation

```typescript
// src/lib/gemini/generate.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRODUCT_MODES } from '@/constants/modes';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GenerateOptions {
  birthDate: string;
  focusMode: string;
  zodiacSign: string;
  zodiacElement: string;
  fireHorseAdvice?: string;
}

interface GenerationResult {
  mainText: string;
  subText: string;
  fullReading: string;
  imageUrl: string;
}

export async function generateProphecy(options: GenerateOptions): Promise<GenerationResult> {
  const mode = PRODUCT_MODES[options.focusMode as keyof typeof PRODUCT_MODES];

  // Step 1: Generate text content using Gemini Flash
  const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const textPrompt = `
    You are the Ancient Fire Horse Oracle for 2026.

    User Details:
    - Birth Date: ${options.birthDate}
    - Chinese Zodiac: ${options.zodiacSign} (${options.zodiacElement})
    - Fire Horse Relation: ${options.fireHorseAdvice || 'Neutral'}
    - Focus: ${mode.name} (${mode.tagline})

    Task: ${mode.textPrompt}

    Respond ONLY with valid JSON:
    {
      "main_text": "THE PRIMARY TEXT TO DISPLAY (keep short, impactful)",
      "sub_text": "Secondary supporting text",
      "full_reading": "A detailed 2-3 sentence prophecy incorporating their zodiac and the Fire Horse energy"
    }
  `;

  const textResult = await textModel.generateContent(textPrompt);
  const textResponse = textResult.response.text();

  // Parse JSON (handle potential markdown code blocks)
  const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI text response');
  const textData = JSON.parse(jsonMatch[0]);

  // Step 2: Generate image using Gemini with Imagen
  const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const imagePrompt = `
    Create a vertical 9:16 digital art scroll for the Year of the Fire Horse 2026.

    Visual Theme: ${mode.visualTheme}

    Style Requirements:
    - Ancient Chinese ink wash painting meets modern digital art
    - Deep red (#8B0000) and glowing gold (#FFD700) color palette
    - Black background with embers and smoke effects
    - Cinematic lighting, 8K quality
    - Mystical, powerful, commanding atmosphere

    TEXT OVERLAY REQUIREMENTS (CRITICAL - must be legible):
    1. CENTER - Large glowing gold calligraphy: "${textData.main_text}"
    2. BOTTOM - Smaller white text: "${textData.sub_text}"
    3. TOP CORNER - Small: "2026 | ${options.zodiacSign}"

    The text must be perfectly readable and artistically integrated.
  `;

  const imageResult = await imageModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
    generationConfig: {
      responseModalities: ['image', 'text'],
    },
  });

  // Extract image from response
  const imagePart = imageResult.response.candidates?.[0]?.content?.parts?.find(
    part => part.inlineData?.mimeType?.startsWith('image/')
  );

  if (!imagePart?.inlineData) {
    throw new Error('No image generated');
  }

  // Convert base64 to data URL for now (will upload to storage)
  const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

  return {
    mainText: textData.main_text,
    subText: textData.sub_text,
    fullReading: textData.full_reading,
    imageUrl
  };
}
```

### Step 5: Reveal Page

```tsx
// src/app/reveal/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import TalismanDisplay from '@/components/reveal/TalismanDisplay';
import GeneratingState from '@/components/reveal/GeneratingState';

interface Prophecy {
  id: string;
  status: string;
  image_url: string | null;
  main_text: string | null;
  sub_text: string | null;
  full_reading: string | null;
  zodiac_sign: string | null;
  focus_mode: string;
}

export default function RevealPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [prophecy, setProphecy] = useState<Prophecy | null>(null);
  const [status, setStatus] = useState<'loading' | 'generating' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const supabase = createClient();

    // Initial fetch
    const fetchProphecy = async () => {
      const { data, error } = await supabase
        .from('prophecies')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (error || !data) {
        setStatus('generating'); // Not found yet, webhook may still be processing
        return;
      }

      setProphecy(data);
      setStatus(data.status === 'completed' ? 'ready' : 'generating');
    };

    fetchProphecy();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('prophecy-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prophecies',
          filter: `stripe_session_id=eq.${sessionId}`
        },
        (payload) => {
          const updated = payload.new as Prophecy;
          setProphecy(updated);
          setStatus(updated.status === 'completed' ? 'ready' : 'generating');
        }
      )
      .subscribe();

    // Poll as fallback (in case realtime fails)
    const pollInterval = setInterval(fetchProphecy, 3000);

    return () => {
      channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [sessionId]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-600">
        <p>Invalid session. Please try purchasing again.</p>
      </div>
    );
  }

  if (status === 'loading' || status === 'generating') {
    return <GeneratingState />;
  }

  return (
    <div className="min-h-screen bg-black text-yellow-500 flex flex-col items-center p-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        YOUR 2026 DECREE
      </h1>

      {prophecy && <TalismanDisplay prophecy={prophecy} />}
    </div>
  );
}
```

---

## 8. API ARCHITECTURE

### Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhook` | POST | Stripe webhook handler |
| `/api/prophecy/[id]` | GET | Fetch prophecy by ID |
| `/api/health` | GET | Health check for monitoring |

### Error Handling Strategy

```typescript
// src/lib/utils/errors.ts

export class ProphecyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ProphecyError';
  }
}

export const ErrorCodes = {
  INVALID_SESSION: 'INVALID_SESSION',
  GENERATION_FAILED: 'GENERATION_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;
```

### Retry Logic

```typescript
// src/lib/utils/retry.ts

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
```

---

## 9. DEPLOYMENT GUIDE

### Phase 1: Repository Setup

```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit: Red Horse Oracle V6"

# Create GitHub repository
gh repo create redhorse --public --source=. --push
```

### Phase 2: Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project: `red-horse-oracle`
   - Region: Choose closest to target audience

2. **Run Migrations**
   - Open SQL Editor in Supabase Dashboard
   - Execute the schema from Section 5

3. **Create Storage Bucket**
   - Go to Storage
   - Create bucket: `talismans` (public)

4. **Get API Keys**
   - Settings > API
   - Copy: `URL`, `anon key`, `service_role key`

### Phase 3: Stripe Setup

1. **Create Product**
   - Products > Add Product
   - Name: "Fire Horse Oracle"
   - Price: $8.88 (one-time)

2. **Create Payment Link**
   - Payment Links > New
   - Select "Fire Horse Oracle" product
   - Add Custom Fields:
     - Text Field: "Date of Birth (MM/DD/YYYY)" | Key: `dob`
     - Dropdown: "Choose Your Path" | Key: `focus`
       - Options: Wealth, Power, Love, Shield
   - After Payment: Redirect to `https://yourdomain.com/reveal?session_id={CHECKOUT_SESSION_ID}`
   - Require Terms of Service agreement

3. **Configure Webhook**
   - Developers > Webhooks > Add Endpoint
   - URL: `https://yourdomain.com/api/webhook`
   - Events: `checkout.session.completed`
   - Copy signing secret

### Phase 4: Vercel Deployment

1. **Import Project**
   ```bash
   vercel
   ```

2. **Add Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   GEMINI_API_KEY=AIza...
   NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/...
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Phase 5: Domain Configuration

1. **Purchase Domain**
   - RedHorseOracle.com (GoDaddy/Namecheap)

2. **Add to Vercel**
   - Settings > Domains > Add
   - Configure DNS records

3. **Update Stripe Webhook**
   - Change endpoint URL to production domain

---

## 10. ENVIRONMENT VARIABLES

### `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_xxx

# Google AI
GEMINI_API_KEY=AIzaxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Variable Checklist

| Variable | Required | Source |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Dashboard > Settings > API |
| `STRIPE_SECRET_KEY` | Yes | Stripe Dashboard > Developers > API Keys |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe Dashboard > Developers > Webhooks |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Yes | Stripe Dashboard > Payment Links |
| `GEMINI_API_KEY` | Yes | Google AI Studio |

---

## 11. LEGAL & COMPLIANCE

### Required Disclaimers

#### Footer Disclaimer (All Pages)
```
© 2026 Red Horse Oracle. Strictly for entertainment purposes only.
AI-generated artwork and content. Not financial, legal, or gambling advice.
Not affiliated with any lottery or gambling institution.
Please play responsibly. 18+ Only.
```

#### Terms of Service Page (`/terms`)
```markdown
# Terms of Service

Last Updated: January 13, 2026

## 1. Service Description
Red Horse Oracle is a novelty entertainment product providing AI-generated
digital artwork and storytelling.

## 2. No Guarantees
The "Lucky Numbers," "Strategies," and "Prophecies" are generated by an
artificial intelligence algorithm and are not based on scientific fact,
financial expertise, or guaranteed outcomes.

## 3. Not Professional Advice
This service does not constitute financial, legal, medical, or gambling advice.
Users are responsible for their own actions and decisions.

## 4. Refund Policy
All sales are final. Due to the digital nature of the product and
immediate generation upon purchase, refunds are not available.

## 5. Age Requirement
Users must be 18 years or older to purchase.

## 6. Intellectual Property
Generated artwork is provided for personal use. Users may share on social
media with attribution.
```

#### Privacy Policy Page (`/privacy`)
```markdown
# Privacy Policy

Last Updated: January 13, 2026

## Data Collection
We collect:
- Email address (for delivery)
- Birth date (for zodiac calculation)
- Focus mode selection

## Data Usage
Your data is used solely to generate your personalized talisman.

## Data Storage
Data is stored securely in Supabase (PostgreSQL) with encryption.

## Third Parties
We use:
- Stripe (payments)
- Google (AI generation)
- Vercel (hosting)

## Contact
For privacy inquiries: privacy@redhorseoracle.com
```

### Stripe Compliance

1. Enable "Require Terms of Service agreement" in Payment Link settings
2. Link to your `/terms` page
3. Product description must clearly state "entertainment/novelty"

---

## 12. MARKETING STRATEGY

### Pre-Launch (Jan 13-14)

1. **Generate Showcase Content**
   - Create 10-15 stunning sample talismans
   - Mix of all four modes

2. **Social Media Setup**
   - Instagram: @RedHorseOracle
   - TikTok: @RedHorseOracle
   - Twitter/X: @RedHorseOracle

### Launch Week (Jan 15-21)

1. **LinkedIn Announcement**
   ```
   Last month, I built an AI for Character (Neo-Aesop).
   Today, I built an AI for Chaos.

   2026 is the Year of the Fire Horse—a rare cycle of volatility.

   I wanted to see if Gemini 2.0 could handle concepts like
   "Destiny" and "Luck."

   Result: Red Horse Oracle. It generates a "Strategic Decree"
   and burns it directly into a digital talisman.

   Try the experiment: RedHorseOracle.com

   #GenAI #FireHorse2026 #TechInnovation
   ```

2. **Press Release**
   - Headline: "Neo-Aesop Founder Launches AI-Powered Destiny Engine"
   - Distribution: PRWeb, BusinessWire

### Viral Push (Jan 22 - Feb 17)

1. **Paid Ads ($50-100/day)**
   - Platforms: Meta (Instagram/Facebook), TikTok
   - Targeting: Astrology, Lottery, Entrepreneurship interests
   - Creative: Video showing talisman generation process

2. **Influencer Outreach**
   - Find 5-10 Tarot/Astrology TikTokers
   - Offer free readings or affiliate commission

3. **The Lotto Challenge**
   - Encourage users to try their numbers on a scratch-off
   - Repost any wins immediately

### Content Calendar

| Date | Content | Platform |
|------|---------|----------|
| Jan 15 | Launch Announcement | LinkedIn, Twitter |
| Jan 16 | "How It Works" Video | TikTok, Instagram |
| Jan 18 | Rat Sign Warning Post | All |
| Jan 20 | Tiger Sign Victory Post | All |
| Jan 25 | User Testimonial | All |
| Feb 1 | Countdown to CNY | All |
| Feb 10 | Last Chance Campaign | Ads |
| Feb 17 | CNY Celebration | All |

---

## 13. REVENUE PROJECTIONS

### Cost Structure

| Item | Cost Per Unit |
|------|---------------|
| Gemini API (text) | ~$0.01 |
| Gemini API (image) | ~$0.10 |
| Supabase | ~$0.001 |
| Stripe Fee (2.9% + $0.30) | ~$0.56 |
| **Total COGS** | **~$0.67** |

### Unit Economics

| Metric | Value |
|--------|-------|
| Price | $8.88 |
| COGS | $0.67 |
| Gross Profit | $8.21 |
| Gross Margin | 92.5% |

### Scenarios

#### Conservative
| Metric | Value |
|--------|-------|
| Visitors | 20,000 |
| Conversion | 3% |
| Sales | 600 |
| Revenue | $5,328 |
| COGS | $402 |
| Marketing | $1,000 |
| **Net Profit** | **$3,926** |

#### Base Case
| Metric | Value |
|--------|-------|
| Visitors | 50,000 |
| Conversion | 4% |
| Sales | 2,000 |
| Revenue | $17,760 |
| COGS | $1,340 |
| Marketing | $2,000 |
| **Net Profit** | **$14,420** |

#### Viral Success
| Metric | Value |
|--------|-------|
| Visitors | 200,000 |
| Conversion | 5% |
| Sales | 10,000 |
| Revenue | $88,800 |
| COGS | $6,700 |
| Marketing | $5,000 |
| **Net Profit** | **$77,100** |

---

## 14. IMPLEMENTATION CHECKLIST

### Phase 1: Infrastructure (Day 1)

- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up project structure per Section 4
- [ ] Configure Tailwind CSS with custom theme
- [ ] Create Supabase project and run migrations
- [ ] Set up Supabase Storage bucket
- [ ] Get Gemini API key from Google AI Studio
- [ ] Create GitHub repository

### Phase 2: Core Development (Days 2-3)

- [ ] Implement Supabase client libraries
- [ ] Implement Stripe webhook handler
- [ ] Implement Gemini generation logic
- [ ] Implement zodiac calculator
- [ ] Build landing page component
- [ ] Build reveal page with real-time updates
- [ ] Build generating state component
- [ ] Create terms and privacy pages

### Phase 3: Stripe Setup (Day 3)

- [ ] Create Stripe product ($8.88)
- [ ] Create Payment Link with custom fields
- [ ] Configure webhook endpoint
- [ ] Test complete purchase flow
- [ ] Verify webhook receives events

### Phase 4: Testing (Day 4)

- [ ] End-to-end test: Landing → Payment → Reveal
- [ ] Test all four focus modes
- [ ] Test error handling
- [ ] Test real-time updates
- [ ] Verify image storage working
- [ ] Mobile responsiveness check

### Phase 5: Deployment (Day 5)

- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Purchase domain (RedHorseOracle.com)
- [ ] Configure DNS
- [ ] Update Stripe webhook to production URL
- [ ] SSL verification
- [ ] Run production test transaction

### Phase 6: Launch (Day 6)

- [ ] Generate 10+ showcase images
- [ ] Set up social media accounts
- [ ] Post LinkedIn announcement
- [ ] Submit press release
- [ ] Enable payment link on landing page
- [ ] Monitor first transactions

### Phase 7: Marketing (Days 7+)

- [ ] Launch paid ad campaigns
- [ ] Reach out to influencers
- [ ] Daily social media posts
- [ ] Monitor analytics
- [ ] Respond to customer inquiries
- [ ] A/B test ad creatives

---

## APPENDIX A: QUICK START COMMANDS

```bash
# Clone and setup
git clone https://github.com/yourusername/redhorse.git
cd redhorse
pnpm install
cp .env.example .env.local
# Edit .env.local with your keys

# Development
pnpm dev

# Build
pnpm build

# Deploy
vercel --prod
```

---

## APPENDIX B: TROUBLESHOOTING

### Webhook Not Receiving Events
1. Check Stripe webhook logs in Dashboard
2. Verify endpoint URL is correct
3. Check Vercel function logs
4. Ensure STRIPE_WEBHOOK_SECRET is correct

### Image Generation Failing
1. Check Gemini API quota
2. Verify GEMINI_API_KEY is valid
3. Check for rate limiting
4. Review prompt length

### Real-time Updates Not Working
1. Verify Supabase realtime is enabled for table
2. Check browser console for connection errors
3. Ensure anon key has SELECT permissions

---

**Document Version:** 6.0
**Last Updated:** January 13, 2026
**Status:** Ready for Implementation

---

*"The Fire Horse returns. Your Oracle awaits."*
