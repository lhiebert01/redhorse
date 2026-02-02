# 🚨 MANDATORY: Party Game Testing Checklist

## BEFORE MAKING ANY CODE CHANGES

Read this checklist. Understand the architecture. Don't break things.

---

## Critical Architecture Rules

### 1. Data Flow (MEMORIZE THIS)

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE TABLES                          │
├─────────────────────────────────────────────────────────────────┤
│  party_passes                                                    │
│    └── party_games (FK: party_pass_id)                          │
│          └── party_players (FK: party_game_id) ← CRITICAL!      │
│          └── party_answers (FK: party_game_id + player_id)      │
│          └── party_questions (referenced by question_ids array) │
└─────────────────────────────────────────────────────────────────┘
```

### 2. The Three Critical IDs

| ID | Where It Lives | What It Links |
|----|----------------|---------------|
| `party_pass_id` | party_passes.id | Pass → Games |
| `party_game_id` | party_games.id | Game → Players, Answers |
| `player_id` | party_players.id | Player → Answers |

**RULE:** If you restart a game (new game_id), you MUST update:
- Player's session storage (game_id)
- Player's database record (party_players.party_game_id)
- All queries must use the NEW game_id

### 3. React Stale Closure Problem (THE #1 BUG SOURCE)

```typescript
// ❌ BAD - State captured at callback creation time
const [data, setData] = useState(null);
const handleClick = useCallback(() => {
  console.log(data); // ALWAYS null or stale!
}, [data]);

// ✅ GOOD - Ref always has current value
const dataRef = useRef(null);
const [data, setData] = useState(null);

// Update BOTH when data changes
setData(newData);
dataRef.current = newData;

const handleClick = useCallback(() => {
  console.log(dataRef.current); // Always current!
}, []);
```

**RULE:** Any data read inside useCallback that changes during the session MUST use useRef.

---

## MANDATORY Testing After EVERY Code Change

### Test 1: Game Starts
```
□ Host page loads without errors
□ Console shows: "[LOAD] Resuming existing game: XXX"
□ Console shows: "[QUESTIONS] Fetched 20 questions from database"
□ Click "Start Game" → countdown appears
□ First question displays on host screen
□ NO console errors about "Question not found in cache"
```

### Test 2: Players Can Join
```
□ Player goes to /party/join
□ Enter code and nickname
□ Player appears in host's player list
□ Player sees "Waiting for Host" screen
```

### Test 3: Answers Are Recorded
```
□ Player clicks an answer
□ Console shows: "[PLAYER] Submitting answer: {...}"
□ Console shows: "[PLAYER] API response: {status: 200, ...}"
□ Console shows: "[PLAYER] Correct!" or "[PLAYER] Wrong!"
□ Player sees feedback (green/red highlight)
```

### Test 4: Leaderboard Updates
```
□ Host clicks "Reveal Answer" or timer ends
□ Console shows: "[SHOW ANSWER] Answers found: X"
□ Console shows: "[SHOW ANSWER] Players found: X" (NOT 0!)
□ Console shows: "[SHOW ANSWER] Leaderboard built: [...]"
□ Leaderboard shows on host screen with correct scores
□ Players see their rank and points
```

### Test 5: Game Restart Works
```
□ Restart game via API or UI
□ Host refreshes → sees new game
□ Players refresh → still connected
□ Start game → players receive game_start broadcast
□ Console shows: "[PLAYER] Synced game_id from host: XXX"
□ Console shows: "[PLAYER] Synced player record in DB: {success: true}"
□ All tests 1-4 pass again with new game
```

---

## Files That Break Things (BE CAREFUL)

| File | What It Does | What Breaks If Wrong |
|------|--------------|---------------------|
| `src/app/party/host/[code]/page.tsx` | Host game control | Game won't start, leaderboard empty |
| `src/app/party/play/[code]/page.tsx` | Player game view | Answers not recorded, scores wrong |
| `src/app/api/party/answer/route.ts` | Records answers | Scoring broken |
| `src/app/api/party/game/route.ts` | Creates games | Games won't start |
| `src/app/api/party/questions/route.ts` | Fetches questions | "Question not found" errors |
| `src/app/api/party/sync-game/route.ts` | Syncs player game_id | Leaderboard shows 0 players |
| `src/types/party.ts` | Shared types/functions | Everything breaks |

---

## Common Bugs and Their Fixes

### Bug: "Question not found in cache"
**Cause:** questionsCache state is stale in useCallback
**Fix:** Use questionsCacheRef.current instead of questionsCache

### Bug: Leaderboard shows 0 players
**Cause:** Players have old game_id in party_players table
**Fix:** Call /api/party/sync-game when player syncs new game_id

### Bug: Answers not recording
**Cause:** playerState.game_id is stale in handleAnswer
**Fix:** Use playerStateRef.current instead of playerState

### Bug: Scores show 0 for all players
**Cause:** Querying party_answers with wrong game_id
**Fix:** Ensure game.id used in queries is current (use gameRef.current)

### Bug: Game won't start after restart
**Cause:** Old game still in "lobby" status blocking new game
**Fix:** Mark old game as "abandoned" before creating new

---

## Code Change Checklist

Before committing ANY change to party game files:

```
□ I understand which IDs are involved (pass_id, game_id, player_id)
□ I checked if any useCallback reads state that might be stale
□ If I added state that callbacks read, I also added a ref
□ I updated both state AND ref when the value changes
□ I ran all 5 tests above manually
□ I checked browser console for errors
□ I verified the feature works after a game restart
```

---

## Quick Debug Commands

```bash
# Check if question exists
curl "https://redhorseoracle.com/api/party/questions?ids=250"

# Restart game with fresh questions
curl -X POST "https://redhorseoracle.com/api/party/game" \
  -H "Content-Type: application/json" \
  -d '{"party_pass_id":"PASS_ID","party_code":"CODE","action":"restart","game_number":N}'

# Check Vercel logs
# Go to: https://vercel.com/dashboard → Project → Logs
```

---

## The Golden Rule

**If you touch party game code, you MUST test the full flow:**
1. Join as player
2. Start game as host
3. Answer at least one question
4. Check leaderboard shows correct scores
5. Restart game and repeat

**NO EXCEPTIONS.**
