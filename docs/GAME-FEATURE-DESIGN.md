# Fire Horse Trivia Party Game - Feature Design

## Executive Summary

**Product Name:** Fire Horse Trivia
**URL:** redhorseoracle.com/party
**Vision:** A Kahoot-style real-time competitive trivia game for Chinese New Year 2026 parties.

**The Opportunity:**
- Millions of CNY party hosts have NO fun, engaging games for Fire Horse 2026
- Kahoot-style games are proven viral mechanisms
- Combines education (Chinese Zodiac) with entertainment
- Creates recurring engagement beyond one-time oracle purchases

---

## Pricing & Passes

### Pass Types (Like Amazon Movie Rentals)

| Pass | Price | Duration | Max Players | Max Games | Features |
|------|-------|----------|-------------|-----------|----------|
| **Day Pass** | $4.88 | 24 hours | 20 | 5 | Basic party hosting |
| **Weekend Pass** | $8.88 | 48 hours | 20 | 10 | Extended CNY celebration |
| **Festival Pass** | $14.88 | 72 hours | 20 | 15 | Full CNY weekend |

**Why These Prices?**
- **8** is the luckiest number (sounds like "wealth" in Cantonese)
- **88** appears in all pricing (double luck)
- Low friction impulse buy for party hosts

### What's Included

1. **Custom Party Code** - 6-character code (e.g., `FIRE88`)
2. **Host Console** - Control game flow from any device
3. **Timer Settings** - 15s / 30s / 45s / 60s per question
4. **Question Count** - 10 / 15 / 20 / 25 questions per game
5. **Up to 5 Games** - Replayable within pass duration
6. **Private Leaderboard** - Party-only scores
7. **CSV Export** - Download results for prizes

---

## Game Flow

### 1. Host Flow (Purchases Pass)

```
Landing Page (/party)
    │
    ├─→ "HOST A PARTY" button
    │       │
    │       ├─→ Select Pass (Day/Weekend/Festival)
    │       │
    │       ├─→ Stripe Checkout ($4.88 / $8.88 / $14.88)
    │       │
    │       └─→ Success Page
    │               │
    │               ├─→ Display PARTY CODE (e.g., FIRE88)
    │               ├─→ "Share Code with Guests" buttons
    │               └─→ "Go to Host Console" button
    │
    └─→ Host Console (/party/host/[code])
            │
            ├─→ See connected players
            ├─→ Configure game (timer, # questions)
            ├─→ "START GAME" button
            └─→ Advance questions manually
```

### 2. Player Flow (Joins Free)

```
Landing Page (/party)
    │
    ├─→ "JOIN A PARTY" button
    │       │
    │       ├─→ Enter Party Code
    │       │
    │       ├─→ Enter Nickname + Birth Year
    │       │       (Auto-calculates zodiac sign)
    │       │
    │       └─→ Enter Lobby (/party/play/[code])
    │               │
    │               ├─→ See other players
    │               ├─→ Wait for host to start
    │               └─→ Game begins!
```

### 3. Gameplay Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    HOST SCREEN (TV/Laptop)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  QUESTION 7 of 20                     ⏱️ 00:25       │  │
│   │                                                       │  │
│   │  "What is the element of the Horse in 2026?"         │  │
│   │                                                       │
│   │  ┌─────────────┐ ┌─────────────┐                    │  │
│   │  │  🔴 Wood    │ │  🔵 Fire    │                    │  │
│   │  └─────────────┘ └─────────────┘                    │  │
│   │  ┌─────────────┐ ┌─────────────┐                    │  │
│   │  │  🟢 Earth   │ │  🟡 Metal   │                    │  │
│   │  └─────────────┘ └─────────────┘                    │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
│   Players Answered: 15/20                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐
│     PLAYER PHONE SCREEN       │
├───────────────────────────────┤
│                               │
│  ┌─────────┐ ┌─────────┐     │
│  │ 🔴      │ │ 🔵      │     │
│  │ Wood    │ │ Fire    │     │
│  └─────────┘ └─────────┘     │
│                               │
│  ┌─────────┐ ┌─────────┐     │
│  │ 🟢      │ │ 🟡      │     │
│  │ Earth   │ │ Metal   │     │
│  └─────────┘ └─────────┘     │
│                               │
│      ⏱️ 00:25 remaining      │
│                               │
└───────────────────────────────┘
```

### 4. Scoring System

| Factor | Points |
|--------|--------|
| Correct Answer | 100 |
| Speed Bonus (answer in first 25%) | +50 |
| Speed Bonus (answer in first 50%) | +25 |
| Streak Bonus (3 correct in a row) | +25 |
| Streak Bonus (5 correct in a row) | +50 |
| Streak Bonus (10 correct in a row) | +100 |

**Max Points Per Question:** 150 (100 base + 50 speed)
**Max Points Per Game (20 questions):** 3,000 + streak bonuses

---

## Database Schema

### New Tables (Supabase)

```sql
-- Party passes (purchased)
CREATE TABLE party_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  host_email TEXT NOT NULL,
  party_code VARCHAR(6) UNIQUE NOT NULL,
  pass_type TEXT NOT NULL, -- 'day', 'weekend', 'festival'
  expires_at TIMESTAMPTZ NOT NULL,
  games_remaining INTEGER NOT NULL DEFAULT 5,
  settings JSONB DEFAULT '{"timer": 30, "questions": 20}',
  is_active BOOLEAN DEFAULT true
);

-- Game sessions within a party
CREATE TABLE party_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_pass_id UUID REFERENCES party_passes(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  question_indices INTEGER[], -- Random selection of question IDs
  current_question INTEGER DEFAULT 0,
  status TEXT DEFAULT 'lobby' -- 'lobby', 'playing', 'finished'
);

-- Players in a party
CREATE TABLE party_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_game_id UUID REFERENCES party_games(id),
  nickname TEXT NOT NULL,
  birth_year INTEGER,
  zodiac_sign TEXT,
  zodiac_element TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_connected BOOLEAN DEFAULT true
);

-- Player answers
CREATE TABLE party_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_game_id UUID REFERENCES party_games(id),
  player_id UUID REFERENCES party_players(id),
  question_index INTEGER NOT NULL,
  answer_given TEXT,
  is_correct BOOLEAN,
  answer_time_ms INTEGER, -- Time to answer in milliseconds
  points_earned INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Final scores per game
CREATE TABLE party_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_game_id UUID REFERENCES party_games(id),
  player_id UUID REFERENCES party_players(id),
  total_points INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  best_streak INTEGER DEFAULT 0,
  rank INTEGER,
  zodiac_sign TEXT,
  zodiac_element TEXT
);

-- Indexes for performance
CREATE INDEX idx_party_code ON party_passes(party_code);
CREATE INDEX idx_party_game_status ON party_games(status);
CREATE INDEX idx_party_players_game ON party_players(party_game_id);
CREATE INDEX idx_party_answers_game ON party_answers(party_game_id);
```

---

## Question Bank Structure

### JSON Format

```typescript
interface Question {
  id: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[]; // Always 4 options
  correctAnswer: string;
  explanation?: string;
  funFact?: string;
}

// Example
{
  id: 1,
  category: "Fire Horse & Great Race",
  difficulty: "easy",
  question: "What is the element of the Horse in 2026?",
  options: ["Wood", "Fire", "Earth", "Metal"],
  correctAnswer: "Fire",
  explanation: "2026 is the Year of the Fire Horse (Bing Wu).",
  funFact: "The last Fire Horse year was 1966!"
}
```

### Categories (from your 400 questions)

| Set | Category | Count |
|-----|----------|-------|
| 1 | Fire Horse & The Great Race | 25 |
| 2 | CNY Traditions & Food | 25 |
| 3 | History, Art & Horse Lore | 25 |
| 4 | 2026 Astronomy & Traditions | 25 |
| 5 | Modern Culture & Global Horses | 25 |
| 6 | Logic, Math & Zodiac Riddles | 25 |
| 7 | Biological & Scientific Facts | 25 |
| 8 | Historical War Horses | 25 |
| 9 | Horse Equipment & Sports | 25 |
| 10 | The Five Elements | 25 |
| 11 | Horse Idioms & Phrases | 25 |
| 12 | Literature, Myth & Fantasy | 25 |
| 13 | Pop Music, Songs & Sound | 25 |
| 14 | 2026 CNY Taboos & Superstitions | 25 |
| 15 | Grandmaster Zodiac & Math | 25 |
| 16 | Final Countdown & Future Lore | 25 |
| **TOTAL** | | **400** |

---

## Real-Time Architecture

### Supabase Realtime Channels

```typescript
// Channel structure
const channel = supabase.channel(`party:${partyCode}`, {
  config: {
    broadcast: { self: true },
    presence: { key: 'player_id' }
  }
});

// Events
channel.on('broadcast', { event: 'game_start' }, handleGameStart);
channel.on('broadcast', { event: 'next_question' }, handleNextQuestion);
channel.on('broadcast', { event: 'question_end' }, handleQuestionEnd);
channel.on('broadcast', { event: 'show_answer' }, handleShowAnswer);
channel.on('broadcast', { event: 'game_end' }, handleGameEnd);
channel.on('presence', { event: 'sync' }, handlePresenceSync);
```

### Host → Player Flow

```
HOST ACTION                    BROADCAST EVENT           PLAYER REACTION
─────────────────────────────────────────────────────────────────────────
Click "Start Game"      →      { event: 'game_start' }   →  Hide lobby, show Q1
Timer expires           →      { event: 'question_end' } →  Disable buttons
Click "Show Answer"     →      { event: 'show_answer' }  →  Show correct/wrong
Click "Next Question"   →      { event: 'next_question'} →  Show next Q
Last question ends      →      { event: 'game_end' }     →  Show leaderboard
```

---

## Page Structure

### New Routes

| Route | Purpose |
|-------|---------|
| `/party` | Landing page with "Host" and "Join" buttons |
| `/party/host/[code]` | Host console (requires pass ownership) |
| `/party/join` | Enter party code |
| `/party/play/[code]` | Player game screen |
| `/party/results/[code]` | Game results & leaderboard |
| `/api/party/create` | Create party pass (Stripe) |
| `/api/party/join` | Join a party |
| `/api/party/answer` | Submit answer |
| `/api/party/advance` | Host advances question |

---

## UI/UX Design

### Theme

- **Colors:** Red (#DC2626), Gold (#F59E0B), Black background
- **Font:** Bold, high-contrast for TV viewing
- **Animations:**
  - Bouncing horse on waiting screen
  - Pulsing timer countdown
  - Celebration confetti on correct answer
  - Shake effect on wrong answer

### Host Console Features

1. **Lobby View**
   - Live player list with zodiac signs
   - Player count (X/20)
   - Game settings controls
   - Big "START GAME" button

2. **Question View**
   - Large question text (TV-readable)
   - 4 colored answer buttons
   - Timer countdown (circular)
   - "Answers received" counter
   - "SHOW ANSWER" button

3. **Answer Reveal View**
   - Correct answer highlighted
   - Quick stats (% who got it right)
   - "NEXT QUESTION" button

4. **Results View**
   - Top 10 leaderboard
   - Podium animation (1st, 2nd, 3rd)
   - "PLAY AGAIN" button
   - "EXPORT CSV" button

### Player Screen Features

1. **Join Screen**
   - Enter party code
   - Enter nickname
   - Select birth year (auto-calculates zodiac)

2. **Lobby Screen**
   - Your zodiac badge
   - Other players list
   - "Waiting for host..." message

3. **Question Screen**
   - 4 large colored buttons
   - Timer countdown
   - Tap to answer (one chance only)

4. **Feedback Screen**
   - Green flash = CORRECT (+points)
   - Red flash = WRONG
   - Points earned animation
   - Current rank position

5. **Results Screen**
   - Your final score
   - Your rank
   - Zodiac champion (best of your sign)

---

## Stripe Configuration

### Products to Create

```javascript
// Stripe Products
const products = [
  {
    name: "Fire Steed Day Pass",
    description: "24-hour party hosting for up to 20 players",
    price: 488, // $4.88 in cents
    metadata: { pass_type: 'day', duration_hours: 24, max_games: 5 }
  },
  {
    name: "Fire Steed Weekend Pass",
    description: "48-hour party hosting for up to 20 players",
    price: 888, // $8.88 in cents
    metadata: { pass_type: 'weekend', duration_hours: 48, max_games: 10 }
  },
  {
    name: "Fire Steed Festival Pass",
    description: "72-hour party hosting for up to 20 players",
    price: 1488, // $14.88 in cents
    metadata: { pass_type: 'festival', duration_hours: 72, max_games: 15 }
  }
];
```

### Webhook Events

- `checkout.session.completed` → Create party_pass record, generate party_code

---

## FREE vs PAID Features

### Always FREE

- Join any party as a player
- Play unlimited games as a player
- See your zodiac calculation
- View party leaderboard

### PAID (Pass Required)

- Host a party
- Control game flow
- Customize timer/questions
- Export results CSV
- Multiple games within duration

---

## Global Leaderboard (Future Phase)

### Leaderboard Types

1. **Global All-Time** - All players ever
2. **By Zodiac Sign** - "Top Fire Horses", "Top Metal Tigers"
3. **By Element** - "Top Fire Signs", "Top Water Signs"
4. **Daily/Weekly** - Reset leaderboards

### Entry Requirement

Players who play in paid parties can optionally "publish" their score to the global leaderboard using their nickname.

---

## Implementation Phases

### Phase 1: MVP (2-3 days)

- [ ] Landing page with host/join buttons
- [ ] Stripe checkout for Weekend Pass ($8.88)
- [ ] Party code generation
- [ ] Basic lobby with player list
- [ ] 20-question game flow
- [ ] Real-time question sync
- [ ] Basic scoring
- [ ] Results leaderboard

### Phase 2: Polish (1-2 days)

- [ ] All 3 pass types
- [ ] Timer customization
- [ ] Question count customization
- [ ] Sound effects
- [ ] Animations (confetti, shake)
- [ ] CSV export

### Phase 3: Enhancement (Post-Launch)

- [ ] Global leaderboard
- [ ] Zodiac-specific rankings
- [ ] Achievement badges
- [ ] Custom party themes
- [ ] Team mode

---

## File Structure

```
src/
├── app/
│   ├── party/
│   │   ├── page.tsx              # Landing page
│   │   ├── host/
│   │   │   └── [code]/
│   │   │       └── page.tsx      # Host console
│   │   ├── join/
│   │   │   └── page.tsx          # Join form
│   │   ├── play/
│   │   │   └── [code]/
│   │   │       └── page.tsx      # Player game screen
│   │   └── results/
│   │       └── [code]/
│   │           └── page.tsx      # Results page
│   └── api/
│       └── party/
│           ├── create/route.ts   # Stripe checkout
│           ├── webhook/route.ts  # Stripe webhook
│           ├── join/route.ts     # Join party
│           ├── answer/route.ts   # Submit answer
│           └── advance/route.ts  # Host advance
├── components/
│   └── party/
│       ├── HostConsole.tsx
│       ├── PlayerScreen.tsx
│       ├── QuestionDisplay.tsx
│       ├── AnswerButtons.tsx
│       ├── Timer.tsx
│       ├── Leaderboard.tsx
│       └── PartyLobby.tsx
├── constants/
│   └── questions.ts              # 400 questions
├── lib/
│   └── party/
│       ├── realtime.ts           # Supabase realtime helpers
│       ├── scoring.ts            # Scoring logic
│       └── zodiac.ts             # Calculate sign from year
└── types/
    └── party.ts                  # TypeScript interfaces
```

---

## Marketing Angles

### For Party Hosts

> "Turn your CNY 2026 gathering into an unforgettable trivia battle! Host a Fire Horse Trivia party for just $8.88 — up to 20 players, 5 games, 48 hours of fun!"

### For Players

> "Think you know the Fire Horse? Join a party and prove it! Free to play, compete for zodiac glory!"

### Social Proof

> "400 questions covering zodiac lore, celebrity Fire Horses, CNY traditions, and more!"

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Pass purchases (CNY week) | 500+ |
| Average players per party | 12+ |
| Games per pass | 3+ |
| Return rate (same host) | 20%+ |

---

## Technical Notes

### Why Supabase Realtime?

1. **Built-in** with our existing Supabase setup
2. **Presence** for live player lists
3. **Broadcast** for instant game sync
4. **No additional cost** (included in plan)

### Why Not WebSocket Server?

- Would require separate infrastructure
- Additional hosting cost
- More complex deployment
- Supabase handles scaling

### Mobile Optimization

- Large touch targets (min 48px)
- Portrait orientation
- Minimal scrolling during play
- Haptic feedback on answer

---

## Questions to Confirm

1. **Pricing:** Are $4.88 / $8.88 / $14.88 the right price points?
2. **Players:** Is 20 players the right max?
3. **Games:** Is 5/10/15 games per pass enough?
4. **Timer:** Should default be 30s or 45s?
5. **Questions:** 20 per game, or configurable?

---

**Document Status:** READY FOR IMPLEMENTATION
**Created:** January 29, 2026
**Author:** Claude + Lindsay Hiebert

