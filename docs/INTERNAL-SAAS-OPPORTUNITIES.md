# INTERNAL: SaaS & Licensing Opportunities

## ⚠️ CONFIDENTIAL - NOT FOR PUBLIC DISTRIBUTION

This document outlines potential SaaS and licensing opportunities for the Fire Horse Trivia game engine. This is for internal business development only.

---

## Game Engine Assets

### Core Technology

The Fire Horse Trivia engine is built on a modular, reusable architecture:

1. **Real-Time Multiplayer Framework**
   - Supabase Realtime for live sync
   - Host-controlled game flow
   - Player joining with codes
   - Answer submission and scoring
   - Live leaderboards

2. **Question Management System**
   - Pre-generated question sets at purchase time
   - Fisher-Yates shuffle for randomization
   - Category-based organization
   - Difficulty levels

3. **Scoring Engine**
   - Base points for correct answers
   - Speed bonuses (tiered)
   - Streak bonuses (progressive)
   - Real-time calculation

4. **Pass/Subscription System**
   - Time-limited passes
   - Game count limits
   - Stripe integration
   - Code-based access

---

## Licensing Models

### Option 1: White-Label SaaS

License the complete engine to event companies, corporate trainers, or entertainment platforms:

| Tier | Monthly Fee | Features |
|------|-------------|----------|
| Starter | $299/mo | 1,000 games, custom branding |
| Pro | $799/mo | 10,000 games, API access, analytics |
| Enterprise | Custom | Unlimited, dedicated support, SLA |

### Option 2: Topic-Specific Franchises

Create topic-specific trivia products using the same engine:

- **Sports Trivia** — NFL, NBA, Soccer seasons
- **Movie/TV Trivia** — Oscar season, Netflix releases
- **Corporate Training** — Compliance, onboarding, team building
- **Education** — History, Science, Geography
- **Holiday Themes** — Halloween, Christmas, Valentine's Day

Each topic can be sold separately or licensed to partners.

### Option 3: API-as-a-Service

Expose the game engine as an API for developers:

```
POST /api/v1/games/create
POST /api/v1/games/{id}/start
POST /api/v1/games/{id}/answer
GET  /api/v1/games/{id}/leaderboard
```

Pricing: $0.01 per game started + $0.001 per player

---

## Technical Modularity

### Files That Would Be Shared

```
src/types/party.ts           → src/types/game-engine.ts
src/constants/party-questions.ts → Replaced per topic
src/app/api/party/           → src/app/api/game/
src/app/party/host/          → src/app/[topic]/host/
src/app/party/play/          → src/app/[topic]/play/
```

### Configuration Points

```typescript
interface GameEngineConfig {
  // Branding
  productName: string;
  primaryColor: string;
  logo: string;

  // Gameplay
  questionsPerGame: number;
  timerOptions: number[];
  maxPlayers: number;

  // Scoring
  basePoints: number;
  speedBonusThresholds: number[];
  streakBonusThresholds: number[];

  // Questions
  questionSource: 'database' | 'api' | 'file';
  categories: string[];
}
```

### Estimated Extraction Effort

| Task | Hours |
|------|-------|
| Extract core engine | 20-30 |
| Create configuration system | 10-15 |
| Build admin dashboard | 20-30 |
| API documentation | 10 |
| Sample implementations | 15-20 |
| **Total** | **75-105 hours** |

---

## Market Opportunities

### Corporate Training Market

- $370B global corporate training market
- Gamification growing 30% YoY
- Compliance training is mandatory (captive audience)
- Team building budgets expanding post-COVID

### Event Entertainment

- Wedding entertainment market
- Corporate event hosts
- Birthday party planners
- Bar/pub trivia nights

### Education Technology

- K-12 classroom engagement
- University review sessions
- Professional certification prep
- Language learning gamification

---

## Competitive Advantages

1. **Privacy by Design** — No player data stored (compliance-friendly)
2. **No App Download** — Browser-based, instant access
3. **Host Controls** — Perfect for live events
4. **Proven at Scale** — Battle-tested with Fire Horse Trivia
5. **Modern Stack** — Next.js, TypeScript, Supabase (easy to hire for)

---

## Next Steps (Phase 2)

1. **Extract engine to separate package** (`@redhorse/game-engine`)
2. **Create configuration interface**
3. **Build demo with different topic** (prove modularity)
4. **Create sales deck**
5. **Identify 5 pilot customers**

---

## Revenue Projections (SaaS Model)

| Year | Customers | ARR |
|------|-----------|-----|
| Year 1 | 10 | $50K |
| Year 2 | 50 | $250K |
| Year 3 | 200 | $1M |

Assumes average $5K/year per customer (mix of tiers).

---

*Internal Document - Created February 2, 2026*
*Do not share externally*
