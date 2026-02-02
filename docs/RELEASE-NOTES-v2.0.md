# Red Horse Oracle v2.0 - Fire Horse Trivia Edition

## Release Date: February 2, 2026

---

## 🔥 What's New in v2.0

### Fire Horse Trivia Party Game

A complete real-time multiplayer trivia game for CNY 2026 celebrations:

- **400 Epic Questions** across 16 categories
- **Real-Time Multiplayer** - 2-20 players compete simultaneously
- **Solo Play Mode** - Test your knowledge alone
- **Speed & Streak Bonuses** - Faster answers = more points
- **Live Leaderboards** - See rankings after every question
- **Host Controls** - Perfect for dinner parties and events
- **Zodiac-Specific Rankings** - See how your sign stacks up

### Privacy by Design Branding

Both products now prominently feature our privacy-first architecture:

- **FIRST | ONLY | BEST** — The world's only Privacy by Design Chinese Zodiac experience
- No accounts required
- No emails stored
- No data retained
- Birth year never linked to identity

### Fire Horse Fallback

Players who don't enter their birth year now receive:
- Year of the Fire Horse 2026 digital card
- Explanation message for why they received the Fire Horse card
- Privacy by Design messaging
- Full download capability

---

## 🎮 Party Game Features

### Pass Types

| Pass | Price | Duration | Games | Players |
|------|-------|----------|-------|---------|
| Day Pass | $4.88 | 24 hours | 5 | 20 |
| Weekend Pass | $8.88 | 48 hours | 10 | 20 |
| Festival Pass | $14.88 | 72 hours | 15 | 20 |
| Solo Pass | $2.88 | 24 hours | 5 | 1 |

### Question Categories (16 Total)

1. Fire Horse & The Great Race
2. CNY Traditions & Food
3. The Five Elements
4. Grandmaster Zodiac & Math
5. Historical War Horses
6. Horse Equipment & Sports
7. Horse Idioms & Phrases
8. History, Art & Horse Lore
9. Literature, Myth & Fantasy
10. Modern Culture & Global Horses
11. Pop Music & Sound
12. Biological & Scientific Facts
13. 2026 CNY Taboos & Superstitions
14. 2026 Astronomy & Traditions
15. Logic, Math & Zodiac Riddles
16. Final Countdown & Future Lore

### Scoring System

| Component | Points |
|-----------|--------|
| Correct Answer | 100 |
| Speed Bonus (< 5s) | +50 |
| Speed Bonus (5-10s) | +25 |
| Streak Bonus (2 in a row) | +25 |
| Streak Bonus (3 in a row) | +50 |
| Streak Bonus (4+ in a row) | +100 |
| **Maximum per question** | **250** |

---

## 🔮 Oracle Features (Unchanged)

- **AI-Generated Talismans** — Gemini 3 Pro creates museum-quality art
- **Limited Editions** — Only 888 per zodiac sign
- **Maker's Mark** — Authenticated with certificate
- **Four Paths** — Wealth, Power, Love, Shield
- **Privacy by Design** — Zero PII stored

---

## 📁 New Files

### Party Game Core
- `src/app/party/page.tsx` - Landing page
- `src/app/party/host/[code]/page.tsx` - Host console
- `src/app/party/play/[code]/page.tsx` - Player screen
- `src/app/party/join/page.tsx` - Join page
- `src/app/party/solo/[code]/page.tsx` - Solo play mode

### API Routes
- `src/app/api/party/create/route.ts` - Stripe checkout
- `src/app/api/party/webhook/route.ts` - Payment handling
- `src/app/api/party/game/route.ts` - Game management
- `src/app/api/party/join/route.ts` - Player joining
- `src/app/api/party/answer/route.ts` - Answer submission
- `src/app/api/party/sync-game/route.ts` - Game sync

### Constants & Types
- `src/types/party.ts` - TypeScript interfaces
- `src/constants/party-questions.ts` - 400 questions

### Components
- `src/components/party/PartyEndScreen.tsx` - Thank you screen
- `src/components/party/Celebration.tsx` - Confetti animations

### Documentation
- `docs/GAME-ENGINE.md` - Full technical documentation
- `GAME-ENGINE-CLAUDE.md` - AI assistant instructions
- `docs/ANNOUNCEMENT-PARTY-GAME.md` - Marketing content
- `docs/ANNOUNCEMENT-ORACLE.md` - Oracle marketing
- `docs/migrations/003_party_game_tables.sql` - Database schema

---

## 🔧 Technical Highlights

### Architecture
- **Supabase Realtime** for live multiplayer sync
- **Pre-generated question sets** at purchase time
- **Game ID isolation** for multi-tenant support
- **useRef pattern** to prevent stale closure bugs
- **Service role API routes** for RLS bypass

### Database Tables
- `party_passes` - Purchased passes with codes
- `party_games` - Individual game sessions
- `party_players` - Players per game
- `party_answers` - Answer submissions
- `party_questions` - 400 trivia questions

---

## 🌐 Live URLs

| Page | URL |
|------|-----|
| Oracle | https://redhorseoracle.com |
| Free Reading | https://redhorseoracle.com/free |
| Examples | https://redhorseoracle.com/examples |
| Party Game | https://redhorseoracle.com/party |
| Privacy | https://redhorseoracle.com/privacy |

---

## 🐴 The Fire Horse Returns

The Year of the Fire Horse (丙午年) occurs only once every 60 years:
- **Last:** 1966
- **Now:** 2026
- **Next:** 2086

This is a once-in-a-lifetime celebration. The Fire Horse demands ACTION.

---

*火马年 2026 - Year of the Fire Horse*
*Red Horse Oracle v2.0 - February 2026*
