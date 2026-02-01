# Fire Horse Trivia - Database Setup

## Overview

The party trivia game now stores all 400 questions in the Supabase database instead of the TypeScript file. This allows:
- Easy question editing without code deploys
- Database-level querying and analytics
- Consistent data source for all API routes

## Migration Required

**Run this SQL in Supabase SQL Editor:**

File: `docs/migrations/003_party_questions_table.sql`

This will:
1. Create the `party_questions` table
2. Insert all 400 verified questions
3. Set up indexes and RLS policies

## How It Works

### Pass Purchase Flow
1. User purchases a party pass via Stripe
2. Webhook generates non-redundant random question sets using Fisher-Yates shuffle
3. Question IDs are stored in `party_passes.question_sets` (e.g., `[[1,45,200,...], [5,22,88,...]]`)
4. Each game uses one pre-generated set

### Game Flow
1. Host loads game → Fetches questions from database via `/api/party/questions?ids=1,45,200,...`
2. Questions are cached in React state
3. Host broadcasts questions to players
4. Players answer → `/api/party/answer` validates against database

### Database Schema

```sql
CREATE TABLE party_questions (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/party/questions?ids=1,2,3` | Fetch questions by IDs |
| `POST /api/party/answer` | Submit answer, validates against DB |
| `POST /api/party/game` | Create game with pre-generated question IDs |

## Files Changed

- `src/app/api/party/questions/route.ts` - NEW: Fetch questions from DB
- `src/app/api/party/answer/route.ts` - Updated: Validates against DB
- `src/app/party/host/[code]/page.tsx` - Updated: Fetches questions via API
- `docs/migrations/003_party_questions_table.sql` - NEW: Migration with 400 questions

## Backup

The original TypeScript file with all 400 questions is preserved:
- `src/constants/party-questions.ts`

This can be used to regenerate the database if needed.

## Question Categories

| Category | Count |
|----------|-------|
| Fire Horse & Great Race | 25 |
| CNY Traditions & Food | 25 |
| History, Art & Horse Lore | 25 |
| 2026 Astronomy & Traditions | 25 |
| Modern Culture & Global Horses | 25 |
| Logic, Math & Zodiac Riddles | 25 |
| Biological & Scientific Facts | 25 |
| Historical War Horses | 25 |
| Horse Equipment & Sports | 25 |
| The Five Elements | 25 |
| Horse Idioms & Phrases | 25 |
| Literature, Myth & Fantasy | 25 |
| Pop Music & Sound | 25 |
| 2026 CNY Taboos & Superstitions | 25 |
| Grandmaster Zodiac & Math | 25 |
| Final Countdown & Future Lore | 25 |

**Total: 400 questions**
