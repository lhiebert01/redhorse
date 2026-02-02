# Game Engine Claude Instructions

## Quick Reference for AI Assistants

This file contains instructions for Claude (or other AI assistants) working on the Fire Horse Trivia Game Engine. For full documentation, see `docs/GAME-ENGINE.md`.

---

## 🚨 CRITICAL PATTERNS - MUST FOLLOW

### 1. useRef for Callback Data (MANDATORY)

**NEVER read state directly in callbacks. ALWAYS use refs.**

```typescript
// ❌ WRONG - Will cause stale closure bugs
const [data, setData] = useState(null);
const callback = useCallback(() => {
  console.log(data); // STALE!
}, [data]);

// ✅ CORRECT - Use ref pattern
const dataRef = useRef(null);
const [data, setData] = useState(null);

// Always update BOTH
const updateData = (newData) => {
  dataRef.current = newData;  // Update ref FIRST
  setData(newData);           // Then state
};

const callback = useCallback(() => {
  console.log(dataRef.current); // Current value!
}, []); // No dependency needed
```

### 2. Game ID Isolation (MANDATORY)

**ALWAYS include `party_game_id` in queries.**

```typescript
// ❌ WRONG - Will mix data from different games
const { data } = await supabase
  .from('party_answers')
  .select('*');

// ✅ CORRECT - Filter by game ID
const { data } = await supabase
  .from('party_answers')
  .select('*')
  .eq('party_game_id', gameRef.current.id); // Use ref!
```

### 3. Broadcast new_game with game_id (MANDATORY)

**When starting a new game, ALWAYS include game_id in payload.**

```typescript
// Host broadcasts new game
await channel.send({
  type: 'broadcast',
  event: 'new_game',
  payload: {
    game_id: newGame.id,  // CRITICAL!
    message: 'New game starting'
  }
});
```

### 4. Player Sync on New Game (MANDATORY)

**Player must sync to new game when receiving new_game event.**

```typescript
.on('broadcast', { event: 'new_game' }, async (payload) => {
  const data = payload.payload;

  // Reset UI state
  setShowPartyEnd(false);
  setShowCelebration(false);

  // Sync to new game
  if (data.game_id && playerStateRef.current) {
    // Update local state
    const updatedState = { ...playerStateRef.current, game_id: data.game_id };
    setPlayerState(updatedState);
    playerStateRef.current = updatedState;

    // Update sessionStorage
    sessionStorage.setItem('party_player', JSON.stringify(updatedState));

    // Sync with database
    await fetch('/api/party/sync-game', {
      method: 'POST',
      body: JSON.stringify({
        player_id: playerStateRef.current.player_id,
        new_game_id: data.game_id
      })
    });
  }

  // Reset game state
  setGameState({ status: 'lobby', current_question_index: 0 });
  // ... reset other state
});
```

---

## Key Files

| File | Purpose | Touch With Care |
|------|---------|-----------------|
| `src/app/party/host/[code]/page.tsx` | Host console | ⚠️ Complex refs |
| `src/app/party/play/[code]/page.tsx` | Player screen | ⚠️ Complex refs |
| `src/app/api/party/answer/route.ts` | Answer API | ⚠️ Scoring logic |
| `src/app/api/party/game/route.ts` | Game creation | ⚠️ Question sets |
| `src/app/api/party/webhook/route.ts` | Stripe webhook | ⚠️ Pass creation |
| `src/types/party.ts` | Types & helpers | Safe to modify |
| `src/constants/party-questions.ts` | Question DB | Safe to modify |

---

## Common Tasks

### Adding a New Question

```typescript
// In src/constants/party-questions.ts
{
  id: 401, // Next available ID
  question: "Your question here?",
  option_a: "Option A",
  option_b: "Option B",
  option_c: "Option C",
  option_d: "Option D",
  correct_answer: "Option B", // Must match exactly
  category: "Category Name",
  difficulty: "medium",
  explanation: "Why this is correct"
}
```

### Adding a New Event Type

1. **Host sends:**
```typescript
await channel.send({
  type: 'broadcast',
  event: 'your_event',
  payload: { /* data */ }
});
```

2. **Player receives:**
```typescript
.on('broadcast', { event: 'your_event' }, (payload) => {
  const data = payload.payload;
  // Handle event
})
```

### Modifying Scoring

Edit `calculatePoints` in `src/types/party.ts`:

```typescript
export function calculatePoints(
  isCorrect: boolean,
  answerTimeMs: number,
  timerSeconds: number,
  currentStreak: number
): PointsResult {
  // Modify scoring logic here
}
```

---

## Testing After Changes

### MANDATORY TEST CHECKLIST

After ANY change to party game code:

1. [ ] Open host URL in one browser
2. [ ] Open player URL in different browser/incognito
3. [ ] Join as player
4. [ ] Start game as host
5. [ ] Answer a question
6. [ ] Verify leaderboard shows score
7. [ ] Complete game OR click "Play Another Game"
8. [ ] Verify player auto-transitions to lobby
9. [ ] Start new game
10. [ ] Verify scoring works in new game

### Quick Test URLs

```
Host:   https://redhorseoracle.com/party/host/[CODE]
Player: https://redhorseoracle.com/party/play/[CODE]
```

---

## Database Queries

### Get All Players in Current Game

```typescript
const { data: players } = await supabase
  .from('party_players')
  .select('*')
  .eq('party_game_id', game.id);
```

### Get Leaderboard

```typescript
const { data: answers } = await supabase
  .from('party_answers')
  .select('player_id, total_points')
  .eq('party_game_id', game.id);

// Aggregate by player
const playerScores = new Map();
for (const answer of answers) {
  const current = playerScores.get(answer.player_id) || 0;
  playerScores.set(answer.player_id, current + answer.total_points);
}
```

### Get Pass with Games Remaining

```typescript
const { data: pass } = await supabase
  .from('party_passes')
  .select('*')
  .eq('party_code', code)
  .single();

console.log(pass.games_remaining); // Games left
console.log(pass.question_sets);   // Pre-generated questions
```

---

## Error Handling

### "Question not found in cache"

**Cause:** Question IDs in game don't exist in database.

**Fix:** Restart game with valid questions:
```bash
curl -X POST "https://redhorseoracle.com/api/party/game" \
  -H "Content-Type: application/json" \
  -d '{"party_pass_id":"xxx","party_code":"XXX","action":"restart"}'
```

### Players Not Appearing in Leaderboard

**Cause:** Players have wrong `party_game_id`.

**Fix:** Call sync-game API:
```typescript
await fetch('/api/party/sync-game', {
  method: 'POST',
  body: JSON.stringify({
    player_id: playerId,
    new_game_id: currentGameId
  })
});
```

### Scoring Shows 0 for Everyone

**Cause:** Answers recorded with wrong `party_game_id`.

**Check:** Query answers table:
```sql
SELECT * FROM party_answers
WHERE party_game_id = 'current-game-id';
```

---

## Modularization Notes

To reuse this engine for different topics:

1. **Create topic-specific question table** or add `topic_id` to existing
2. **Update question fetching** to filter by topic
3. **Update webhook** to generate sets from topic pool
4. **Customize UI theme** (colors, emojis, messaging)
5. **Update celebrations** (optional)

See `docs/GAME-ENGINE.md` for full modularization guide.

---

## Do NOT

- ❌ Read state directly in callbacks (use refs)
- ❌ Query without `party_game_id` filter
- ❌ Broadcast events without `game_id` in payload
- ❌ Create games without using question_sets from pass
- ❌ Modify question IDs after games have used them
- ❌ Skip the test checklist after changes

---

## Quick Fixes

### Timer Not Synced

Cosmetic issue - each client runs local countdown. Host controls actual progression.

### Ghost Players in Leaderboard

Players from old games. They'll disappear when you start a fresh game.

### "Already answered" Error

Duplicate submission - safe to ignore. Answer was recorded.

---

*Fire Horse Trivia Engine v1.0.0 - February 2026*
