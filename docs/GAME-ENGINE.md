# Fire Horse Trivia Game Engine

## Complete Technical Documentation for Reusable Multiplayer Trivia System

**Version:** 1.0.0
**Last Updated:** February 2, 2026
**Status:** Production-Ready, Battle-Tested

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Routes](#api-routes)
6. [Real-Time Communication](#real-time-communication)
7. [Components](#components)
8. [Game Flow](#game-flow)
9. [Scoring System](#scoring-system)
10. [Modularization Guide](#modularization-guide)
11. [SaaS Implementation](#saas-implementation)
12. [Question Upload System](#question-upload-system)
13. [Deployment Checklist](#deployment-checklist)
14. [Lessons Learned](#lessons-learned)

---

## Overview

The Fire Horse Trivia Game Engine is a real-time multiplayer trivia system that supports:

- **2-20 concurrent players** per game
- **Multiple simultaneous games** worldwide (multi-tenant)
- **Real-time scoring** with speed and streak bonuses
- **Live leaderboards** updated after each question
- **Host-controlled game flow** (not playing, just controlling)
- **Pre-generated question sets** for uniqueness across games
- **Pass-based monetization** (Day/Weekend/Festival passes)

### Key Differentiators

| Feature | Implementation |
|---------|---------------|
| **No Polling** | Supabase Realtime broadcasts for instant updates |
| **No Duplicate Questions** | Pre-generated sets at purchase time |
| **Stale Closure Prevention** | useRef pattern for all callbacks |
| **Multi-Tenant** | Game ID isolation ensures concurrent games don't interfere |
| **Host/Player Separation** | Distinct UIs and roles |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, Server Components, API Routes |
| **TypeScript** | Type safety across all components |
| **Tailwind CSS** | Responsive styling, animations |
| **React Hooks** | useState, useEffect, useCallback, useRef |

### Backend
| Technology | Purpose |
|------------|---------|
| **Supabase PostgreSQL** | Database, Row Level Security |
| **Supabase Realtime** | WebSocket broadcasts for game events |
| **Supabase Storage** | (Optional) For custom images |
| **Next.js API Routes** | Server-side logic with service role key |

### Payments
| Technology | Purpose |
|------------|---------|
| **Stripe Checkout** | Payment processing |
| **Stripe Webhooks** | Pass creation on successful payment |

### Hosting
| Technology | Purpose |
|------------|---------|
| **Vercel** | Serverless deployment, auto-scaling |
| **GitHub** | Version control, CI/CD trigger |

---

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        STRIPE CHECKOUT                          │
│  User purchases pass → Webhook creates pass + question sets     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PARTY PASS                              │
│  6-char code • Pre-generated question sets • Games remaining    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          GAME INSTANCE                          │
│  Created when host clicks "Start Game" or "Play Another Game"   │
│  Has unique game_id • Links to pass • Tracks current question   │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│       HOST CONSOLE       │   │      PLAYER SCREENS      │
│  /party/host/[code]      │   │  /party/play/[code]      │
│  Controls game flow      │   │  Answer questions        │
│  Broadcasts events       │   │  Receive broadcasts      │
│  Shows leaderboard       │   │  See scores/results      │
└──────────────────────────┘   └──────────────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE REALTIME                            │
│  Channel: party:{code} • Events: game_start, next_question,     │
│  question_end, show_answer, leaderboard_update, game_end,       │
│  new_game, party_end                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Data Isolation Model

```
party_passes (one per purchase)
    │
    ├── party_code: "8478JL" (unique 6-char)
    ├── question_sets: [[1,2,3...], [21,22,23...], ...] (pre-generated)
    ├── games_remaining: 10
    │
    └── party_games (multiple per pass)
            │
            ├── game_id: UUID (source of truth)
            ├── question_ids: [1,2,3...20] (from question_sets)
            ├── current_question_index: 0-19
            │
            ├── party_players (belong to ONE game)
            │       ├── player_id, nickname, zodiac
            │       └── party_game_id → links to game
            │
            └── party_answers (belong to ONE game + player)
                    ├── question_id, answer_given, is_correct
                    ├── total_points, current_streak
                    └── party_game_id → links to game
```

---

## Database Schema

### party_passes

```sql
CREATE TABLE party_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Identification
  party_code VARCHAR(6) UNIQUE NOT NULL,
  email TEXT,

  -- Stripe
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,

  -- Pass Configuration
  pass_type VARCHAR(20) NOT NULL, -- 'day', 'weekend', 'festival'
  expires_at TIMESTAMPTZ NOT NULL,
  max_players INTEGER DEFAULT 20,

  -- Game Tracking
  games_remaining INTEGER NOT NULL,
  games_played INTEGER DEFAULT 0,

  -- Pre-generated Question Sets (CRITICAL for uniqueness)
  question_sets JSONB DEFAULT '[]'::jsonb,
  -- Format: [[1,45,89,...], [23,67,101,...], ...]
  -- Each inner array = 20 question IDs for one game

  -- Status
  status VARCHAR(20) DEFAULT 'active'
);

-- Indexes
CREATE INDEX idx_party_passes_code ON party_passes(party_code);
CREATE INDEX idx_party_passes_stripe ON party_passes(stripe_session_id);
```

### party_games

```sql
CREATE TABLE party_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Links
  party_pass_id UUID REFERENCES party_passes(id) ON DELETE CASCADE,

  -- Game Configuration
  game_number INTEGER, -- 1, 2, 3... for this pass
  questions_per_game INTEGER DEFAULT 20,
  timer_seconds INTEGER DEFAULT 30, -- 0 = manual mode

  -- Question IDs for this game (from pass.question_sets)
  question_ids JSONB NOT NULL,
  -- Format: [45, 89, 123, 201, ...] (20 IDs)

  -- Game State
  status VARCHAR(20) DEFAULT 'lobby',
  -- Values: 'lobby', 'countdown', 'playing', 'showing_answer', 'finished', 'abandoned'

  current_question_index INTEGER DEFAULT 0,

  -- Timestamps
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_party_games_pass ON party_games(party_pass_id);
CREATE INDEX idx_party_games_status ON party_games(status);
```

### party_players

```sql
CREATE TABLE party_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Links (CRITICAL: player belongs to ONE game)
  party_game_id UUID REFERENCES party_games(id) ON DELETE CASCADE,

  -- Player Info
  nickname VARCHAR(50) NOT NULL,
  zodiac_sign VARCHAR(20),
  zodiac_element VARCHAR(20),
  birth_year INTEGER,

  -- Session tracking
  session_id TEXT, -- For reconnection
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_party_players_game ON party_players(party_game_id);
```

### party_answers

```sql
CREATE TABLE party_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Links (CRITICAL: answer belongs to ONE game + player)
  party_game_id UUID REFERENCES party_games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES party_players(id) ON DELETE CASCADE,

  -- Question
  question_index INTEGER NOT NULL,
  question_id INTEGER NOT NULL,

  -- Answer
  answer_given TEXT NOT NULL,
  answer_time_ms INTEGER, -- Milliseconds to answer
  is_correct BOOLEAN NOT NULL,

  -- Scoring
  base_points INTEGER DEFAULT 0,
  speed_bonus INTEGER DEFAULT 0,
  streak_bonus INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,

  -- Uniqueness constraint
  UNIQUE(party_game_id, player_id, question_index)
);

-- Indexes
CREATE INDEX idx_party_answers_game ON party_answers(party_game_id);
CREATE INDEX idx_party_answers_player ON party_answers(player_id);
CREATE INDEX idx_party_answers_game_player ON party_answers(party_game_id, player_id);
```

### party_questions (Content Database)

```sql
CREATE TABLE party_questions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Question Content
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL, -- Must match one of option_a/b/c/d

  -- Metadata
  category VARCHAR(100),
  difficulty VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  explanation TEXT, -- Shown after answer reveal

  -- For modular topics
  topic_id UUID, -- Link to topics table for multi-topic support

  -- Status
  is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_party_questions_category ON party_questions(category);
CREATE INDEX idx_party_questions_active ON party_questions(is_active);
```

---

## API Routes

### POST /api/party/create

**Purpose:** Create Stripe checkout session for pass purchase

**Request:**
```typescript
{
  pass_type: 'day' | 'weekend' | 'festival',
  email?: string
}
```

**Response:**
```typescript
{
  url: string // Stripe Checkout URL
}
```

### POST /api/party/webhook

**Purpose:** Handle Stripe payment success, create pass with pre-generated questions

**Key Logic:**
```typescript
// 1. Verify Stripe signature
// 2. Extract pass_type from metadata
// 3. Generate unique 6-char party code
// 4. Pre-generate question sets using Fisher-Yates shuffle
// 5. Create party_pass record
// 6. Create initial party_game record
```

### POST /api/party/game

**Purpose:** Create new game (host only) or restart

**Request:**
```typescript
{
  party_pass_id: string,
  party_code: string,
  timer_seconds?: number,
  game_number?: number,
  action?: 'create' | 'restart'
}
```

**Key Logic:**
```typescript
// 1. Validate pass exists and has games remaining
// 2. Get question set from pass.question_sets[games_played]
// 3. Create party_game with question_ids
// 4. Decrement games_remaining, increment games_played
// 5. Return game object
```

### POST /api/party/join

**Purpose:** Player joins a game

**Request:**
```typescript
{
  party_code: string,
  nickname: string,
  birth_year?: number
}
```

**Response:**
```typescript
{
  player_id: string,
  game_id: string,
  zodiac_sign?: string,
  zodiac_element?: string
}
```

### POST /api/party/answer

**Purpose:** Submit player answer

**Request:**
```typescript
{
  game_id: string,
  player_id: string,
  question_index: number,
  question_id: number,
  answer_given: string,
  answer_time_ms: number
}
```

**Response:**
```typescript
{
  is_correct: boolean,
  correct_answer: string,
  base_points: number,
  speed_bonus: number,
  streak_bonus: number,
  total_points: number,
  current_streak: number
}
```

### POST /api/party/sync-game

**Purpose:** Sync player to new game when host starts another game

**Request:**
```typescript
{
  player_id: string,
  old_game_id?: string,
  new_game_id: string
}
```

### GET /api/party/questions

**Purpose:** Fetch questions by IDs

**Request:**
```
/api/party/questions?ids=1,2,3,45,67
```

**Response:**
```typescript
{
  questions: [
    {
      id: number,
      question: string,
      options: [string, string, string, string],
      correctAnswer: string,
      category: string,
      difficulty: string,
      explanation?: string
    }
  ]
}
```

---

## Real-Time Communication

### Supabase Realtime Channel

```typescript
const channel = supabase.channel(`party:${partyCode}`);
```

### Event Types

| Event | Sender | Payload | Purpose |
|-------|--------|---------|---------|
| `game_start` | Host | `{ game_id, total_questions, timer_seconds }` | Game begins |
| `next_question` | Host | `{ question_index, question, timer_seconds }` | New question |
| `question_end` | Host | `{}` | Timer ended |
| `show_answer` | Host | `{ correct_answer, explanation, leaderboard }` | Reveal answer |
| `leaderboard_update` | Host | `{ leaderboard }` | Score update |
| `game_end` | Host | `{ scores }` | Game finished |
| `new_game` | Host | `{ game_id, message }` | Another game starting |
| `party_end` | Host | `{ message }` | Host ended party |

### Broadcast Pattern (Host)

```typescript
const channel = supabase.channel(`party:${partyCode}`);
await channel.send({
  type: 'broadcast',
  event: 'next_question',
  payload: {
    question_index: 0,
    question: questionData,
    timer_seconds: 30
  }
});
```

### Subscribe Pattern (Player)

```typescript
const channel = supabase.channel(`party:${partyCode}`)
  .on('broadcast', { event: 'next_question' }, (payload) => {
    const data = payload.payload;
    setCurrentQuestion(data.question);
    setTimeRemaining(data.timer_seconds * 1000);
  })
  .subscribe();
```

---

## Components

### Host Components

| Component | Path | Purpose |
|-----------|------|---------|
| `HostConsolePage` | `/party/host/[code]/page.tsx` | Main host interface |
| `Celebration` | `/components/party/Celebration.tsx` | Confetti, Fireworks, BouncingHorse |

### Player Components

| Component | Path | Purpose |
|-----------|------|---------|
| `PlayerGamePage` | `/party/play/[code]/page.tsx` | Main player interface |
| `PartyEndScreen` | `/components/party/PartyEndScreen.tsx` | Thank you screen |

### Shared Components

| Component | Path | Purpose |
|-----------|------|---------|
| `ANSWER_COLORS` | `/types/party.ts` | Color scheme for answer buttons |
| `calculatePoints` | `/types/party.ts` | Scoring calculation |
| `formatTimeRemaining` | `/types/party.ts` | Timer display |

---

## Game Flow

### 1. Purchase Flow

```
User clicks "Host a Party" → Stripe Checkout → Payment Success →
Webhook creates pass with:
  - 6-char party code
  - Pre-generated question sets (e.g., 10 sets × 20 questions)
  - games_remaining count
→ Redirect to /party/success?code=XXXXXX
```

### 2. Host Setup Flow

```
Host visits /party/host/[code] →
  - Loads pass data
  - Creates/finds active game
  - Subscribes to presence channel
  - Waits for players
```

### 3. Player Join Flow

```
Player visits /party/join →
  - Enters party code + nickname
  - API creates party_player record
  - Stores player state in sessionStorage
  - Redirects to /party/play/[code]
  - Subscribes to broadcast channel
  - Appears in host's player list
```

### 4. Game Loop

```
Host clicks "Start Game" →
  Broadcast: game_start { game_id, total_questions, timer_seconds }

FOR each question (0 to 19):
  Host calls showNextQuestion(index) →
    Broadcast: next_question { question, timer_seconds }

  Timer counts down (or manual mode) →
    Players answer via POST /api/party/answer

  Timer ends OR host clicks "End Question" →
    Broadcast: question_end

  Host clicks "Show Answer" →
    Calculate leaderboard
    Broadcast: show_answer { correct_answer, leaderboard }

  Host clicks "Next Question" →
    Loop continues

After question 19:
  Host clicks "Finish Game" →
    Calculate final scores
    Broadcast: game_end { scores }
    Update game status to 'finished'
```

### 5. New Game Flow

```
Host clicks "Play Another Game" →
  POST /api/party/game (create new game)
  Broadcast: new_game { game_id }

Players receive new_game →
  Reset all state
  Sync to new game_id
  Call /api/party/sync-game
  Return to lobby state
```

### 6. End Party Flow

```
Host clicks "End Party" →
  Broadcast: party_end
  Show fireworks celebration

Players receive party_end →
  Show PartyEndScreen with thank you message
```

---

## Scoring System

### Points Calculation

```typescript
function calculatePoints(
  isCorrect: boolean,
  answerTimeMs: number,
  timerSeconds: number,
  currentStreak: number
): { basePoints, speedBonus, streakBonus, totalPoints, newStreak } {

  if (!isCorrect) {
    return { basePoints: 0, speedBonus: 0, streakBonus: 0, totalPoints: 0, newStreak: 0 };
  }

  const basePoints = 100;

  // Speed Bonus (based on answer time)
  let speedBonus = 0;
  if (timerSeconds > 0) {
    const percentTimeUsed = answerTimeMs / (timerSeconds * 1000);
    if (percentTimeUsed < 0.25) speedBonus = 50;      // < 25% time used
    else if (percentTimeUsed < 0.50) speedBonus = 25; // < 50% time used
  }

  // Streak Bonus (consecutive correct answers)
  const newStreak = currentStreak + 1;
  let streakBonus = 0;
  if (newStreak >= 2) streakBonus = 25;   // 2 in a row
  if (newStreak >= 3) streakBonus = 50;   // 3 in a row
  if (newStreak >= 4) streakBonus = 100;  // 4+ in a row

  const totalPoints = basePoints + speedBonus + streakBonus;

  return { basePoints, speedBonus, streakBonus, totalPoints, newStreak };
}
```

### Maximum Points Per Question

| Component | Max Points |
|-----------|------------|
| Base (correct) | 100 |
| Speed Bonus | 50 |
| Streak Bonus | 100 |
| **Total** | **250** |

### Perfect Game Score

20 questions × 250 max = **5,000 points** (theoretical maximum)

---

## Modularization Guide

### To Create a New Trivia Topic

1. **Create Question Database**

   ```sql
   -- Option A: Add to existing table with topic_id
   INSERT INTO party_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, topic_id)
   VALUES ('Your question?', 'A', 'B', 'C', 'D', 'B', 'Category Name', 'your-topic-uuid');

   -- Option B: Create separate table
   CREATE TABLE trivia_questions_[topic] (
     -- Same schema as party_questions
   );
   ```

2. **Update Question Fetching**

   ```typescript
   // In /api/party/questions/route.ts
   const { data } = await supabase
     .from('party_questions')
     .select('*')
     .eq('topic_id', topicId) // Filter by topic
     .in('id', questionIds);
   ```

3. **Update Question Set Generation**

   ```typescript
   // In webhook - generate sets from topic-specific pool
   const { data: allQuestions } = await supabase
     .from('party_questions')
     .select('id')
     .eq('topic_id', topicId)
     .eq('is_active', true);

   const questionSets = generateQuestionSets(
     gamesPerPass,
     questionsPerGame,
     allQuestions.map(q => q.id)
   );
   ```

4. **Update UI Theme** (Optional)

   - Change color scheme in Tailwind classes
   - Update emojis and messaging
   - Customize celebration animations

### Abstraction Points

| Current | Modular Version |
|---------|-----------------|
| `party_questions` | `trivia_questions` with `topic_id` |
| Fire Horse theme | Configurable theme object |
| Chinese Zodiac calculation | Optional feature flag |
| 400 questions | Dynamic pool size |
| 20 questions/game | Configurable |

---

## SaaS Implementation

### Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────┐
│                 ORGANIZATIONS                   │
│  id, name, subdomain, settings, subscription    │
└─────────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   TOPICS     │ │   TOPICS     │ │   TOPICS     │
│  "Science"   │ │  "History"   │ │  "Movies"    │
└──────────────┘ └──────────────┘ └──────────────┘
          │             │             │
          ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  QUESTIONS   │ │  QUESTIONS   │ │  QUESTIONS   │
│   500 Q's    │ │   300 Q's    │ │   400 Q's    │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 topic, 50 questions, 3 games/month |
| **Starter** | $19/mo | 3 topics, 500 questions, unlimited games |
| **Pro** | $49/mo | 10 topics, 2000 questions, custom branding |
| **Enterprise** | $199/mo | Unlimited, API access, SSO, dedicated support |

### Database Additions for SaaS

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics (owned by org)
CREATE TABLE trivia_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_public BOOLEAN DEFAULT false,
  question_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions (owned by topic)
ALTER TABLE party_questions ADD COLUMN topic_id UUID REFERENCES trivia_topics(id);
ALTER TABLE party_questions ADD COLUMN organization_id UUID REFERENCES organizations(id);
```

---

## Question Upload System

### CSV Format

```csv
question,option_a,option_b,option_c,option_d,correct_answer,category,difficulty,explanation
"What is 2+2?","3","4","5","6","4","Math","easy","Basic addition"
"Capital of France?","London","Paris","Berlin","Rome","Paris","Geography","easy","Paris is the capital"
```

### Upload API

```typescript
// POST /api/questions/upload
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const topicId = formData.get('topic_id') as string;

  // Parse CSV
  const text = await file.text();
  const rows = parseCSV(text);

  // Validate each row
  const validQuestions = [];
  const errors = [];

  for (const [index, row] of rows.entries()) {
    const validation = validateQuestion(row);
    if (validation.valid) {
      validQuestions.push({
        question: row.question,
        option_a: row.option_a,
        option_b: row.option_b,
        option_c: row.option_c,
        option_d: row.option_d,
        correct_answer: row.correct_answer,
        category: row.category || 'General',
        difficulty: row.difficulty || 'medium',
        explanation: row.explanation || null,
        topic_id: topicId,
        is_active: true
      });
    } else {
      errors.push({ row: index + 1, error: validation.error });
    }
  }

  // Bulk insert valid questions
  const { data, error } = await supabase
    .from('party_questions')
    .insert(validQuestions);

  return NextResponse.json({
    imported: validQuestions.length,
    errors: errors,
    total: rows.length
  });
}
```

### Validation Rules

```typescript
function validateQuestion(row: CSVRow): { valid: boolean; error?: string } {
  // Required fields
  if (!row.question?.trim()) return { valid: false, error: 'Missing question' };
  if (!row.option_a?.trim()) return { valid: false, error: 'Missing option A' };
  if (!row.option_b?.trim()) return { valid: false, error: 'Missing option B' };
  if (!row.option_c?.trim()) return { valid: false, error: 'Missing option C' };
  if (!row.option_d?.trim()) return { valid: false, error: 'Missing option D' };
  if (!row.correct_answer?.trim()) return { valid: false, error: 'Missing correct answer' };

  // Correct answer must match an option
  const options = [row.option_a, row.option_b, row.option_c, row.option_d];
  if (!options.includes(row.correct_answer)) {
    return { valid: false, error: 'Correct answer must match one of the options' };
  }

  // Length limits
  if (row.question.length > 500) return { valid: false, error: 'Question too long (max 500 chars)' };
  if (options.some(o => o.length > 200)) return { valid: false, error: 'Option too long (max 200 chars)' };

  return { valid: true };
}
```

---

## Deployment Checklist

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Database Setup

1. Run all CREATE TABLE statements
2. Create indexes
3. Enable Row Level Security (RLS)
4. Create RLS policies for anon access to questions
5. Seed initial questions

### Stripe Setup

1. Create products for each pass type
2. Create Payment Links with custom fields
3. Configure webhook endpoint
4. Set redirect URLs

### Vercel Setup

1. Connect GitHub repo
2. Add environment variables
3. Configure custom domain
4. Enable auto-deploy on main branch

---

## Lessons Learned

### Critical: useRef for Callbacks

**Problem:** useCallback captures stale state values.

**Solution:**
```typescript
// BAD - stale closure
const [data, setData] = useState(null);
const callback = useCallback(() => {
  console.log(data); // Always null!
}, [data]);

// GOOD - use ref
const dataRef = useRef(null);
const [data, setData] = useState(null);

// Update both
dataRef.current = newData;
setData(newData);

const callback = useCallback(() => {
  console.log(dataRef.current); // Current value!
}, []);
```

### Critical: Game ID Isolation

**Problem:** Players from old games appear in new game leaderboards.

**Solution:** Always query with `party_game_id`:
```typescript
const { data } = await supabase
  .from('party_answers')
  .select('*')
  .eq('party_game_id', currentGame.id); // CRITICAL!
```

### Critical: Sync Players on New Game

**Problem:** Players have old game_id when host starts new game.

**Solution:** Broadcast new game_id and sync:
```typescript
// Host broadcasts
await channel.send({
  type: 'broadcast',
  event: 'new_game',
  payload: { game_id: newGame.id }
});

// Player syncs
const data = payload.payload;
if (data.game_id) {
  await fetch('/api/party/sync-game', {
    method: 'POST',
    body: JSON.stringify({
      player_id: playerState.player_id,
      new_game_id: data.game_id
    })
  });
}
```

### Critical: Pre-Generate Questions

**Problem:** Random question generation causes duplicates across games.

**Solution:** Generate all question sets at purchase time:
```typescript
// In webhook
const questionSets = [];
const allIds = [...Array(400)].map((_, i) => i + 1);
const shuffled = fisherYatesShuffle(allIds);

for (let i = 0; i < gamesPerPass; i++) {
  questionSets.push(shuffled.slice(i * 20, (i + 1) * 20));
}

// Store in pass
await supabase.from('party_passes').insert({
  question_sets: questionSets,
  // ...
});
```

---

## File Structure

```
src/
├── app/
│   ├── party/
│   │   ├── page.tsx              # Landing page
│   │   ├── join/page.tsx         # Player join form
│   │   ├── host/[code]/page.tsx  # Host console
│   │   ├── play/[code]/page.tsx  # Player game screen
│   │   ├── results/[code]/page.tsx # Results page
│   │   └── success/page.tsx      # Post-purchase
│   │
│   └── api/party/
│       ├── create/route.ts       # Create checkout
│       ├── webhook/route.ts      # Stripe webhook
│       ├── game/route.ts         # Create/manage games
│       ├── join/route.ts         # Player join
│       ├── answer/route.ts       # Submit answer
│       ├── sync-game/route.ts    # Sync player to game
│       └── questions/route.ts    # Fetch questions
│
├── components/party/
│   ├── Celebration.tsx           # Confetti, Fireworks, BouncingHorse
│   └── PartyEndScreen.tsx        # Thank you screen
│
├── constants/
│   └── party-questions.ts        # 400 questions (or DB)
│
└── types/
    └── party.ts                  # Types, helpers, scoring
```

---

## Summary

The Fire Horse Trivia Game Engine is a production-ready, battle-tested multiplayer trivia system that can be easily adapted for any topic or use case. Key strengths:

1. **Real-time** - Supabase broadcasts for instant updates
2. **Scalable** - Multi-tenant architecture supports concurrent games
3. **Fair** - Pre-generated questions prevent duplicates
4. **Engaging** - Speed/streak bonuses encourage fast, consistent play
5. **Monetizable** - Pass-based model with clear upgrade path to SaaS

For questions or support, refer to the main CLAUDE.md file or create an issue in the repository.

---

*Built with ❤️ and 🔥 for the Year of the Fire Horse 2026*
