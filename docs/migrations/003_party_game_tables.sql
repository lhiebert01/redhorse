-- Migration: 003_party_game_tables.sql
-- Description: Create tables for Fire Horse Trivia Party Game
-- Created: January 29, 2026

-- ============================================================
-- PARTY PASSES TABLE
-- ============================================================
-- Stores purchased party passes (like movie rentals)
-- Pass types: 'day' (24h), 'weekend' (48h), 'festival' (72h)

CREATE TABLE IF NOT EXISTS party_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Stripe integration
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,

  -- Host info
  host_email TEXT NOT NULL,

  -- Party code (6 characters, uppercase alphanumeric)
  party_code VARCHAR(6) UNIQUE NOT NULL,

  -- Pass configuration
  pass_type TEXT NOT NULL CHECK (pass_type IN ('day', 'weekend', 'festival')),
  expires_at TIMESTAMPTZ NOT NULL,
  games_remaining INTEGER NOT NULL DEFAULT 5,
  games_total INTEGER NOT NULL DEFAULT 5,

  -- Game settings (configurable by host)
  settings JSONB DEFAULT '{"timer_seconds": 30, "questions_per_game": 20}'::jsonb,

  -- Status
  is_active BOOLEAN DEFAULT true
);

-- Index for quick party code lookup
CREATE INDEX IF NOT EXISTS idx_party_passes_code ON party_passes(party_code);
CREATE INDEX IF NOT EXISTS idx_party_passes_active ON party_passes(is_active, expires_at);

-- ============================================================
-- PARTY GAMES TABLE
-- ============================================================
-- Individual game sessions within a party pass

CREATE TABLE IF NOT EXISTS party_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_pass_id UUID NOT NULL REFERENCES party_passes(id) ON DELETE CASCADE,

  -- Timing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Game configuration
  timer_seconds INTEGER DEFAULT 30,
  questions_per_game INTEGER DEFAULT 20,

  -- Question selection (array of question IDs from question bank)
  question_ids INTEGER[] NOT NULL,

  -- Current state
  current_question_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'lobby' CHECK (status IN ('lobby', 'countdown', 'playing', 'showing_answer', 'finished'))
);

-- Index for finding active games
CREATE INDEX IF NOT EXISTS idx_party_games_pass ON party_games(party_pass_id);
CREATE INDEX IF NOT EXISTS idx_party_games_status ON party_games(status);

-- ============================================================
-- PARTY PLAYERS TABLE
-- ============================================================
-- Players who join a party game (free to join)

CREATE TABLE IF NOT EXISTS party_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_game_id UUID NOT NULL REFERENCES party_games(id) ON DELETE CASCADE,

  -- Player info
  nickname TEXT NOT NULL,
  birth_year INTEGER,
  zodiac_sign TEXT,
  zodiac_element TEXT,

  -- Connection tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_connected BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate nicknames in same game
  UNIQUE(party_game_id, nickname)
);

-- Index for finding players in a game
CREATE INDEX IF NOT EXISTS idx_party_players_game ON party_players(party_game_id);
CREATE INDEX IF NOT EXISTS idx_party_players_connected ON party_players(party_game_id, is_connected);

-- ============================================================
-- PARTY ANSWERS TABLE
-- ============================================================
-- Individual answer submissions from players

CREATE TABLE IF NOT EXISTS party_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_game_id UUID NOT NULL REFERENCES party_games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES party_players(id) ON DELETE CASCADE,

  -- Question reference
  question_index INTEGER NOT NULL, -- 0-based index in game's question_ids array
  question_id INTEGER NOT NULL,    -- ID from question bank

  -- Answer details
  answer_given TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answer_time_ms INTEGER NOT NULL, -- Milliseconds to answer

  -- Scoring
  base_points INTEGER DEFAULT 0,      -- 100 for correct, 0 for wrong
  speed_bonus INTEGER DEFAULT 0,      -- 0-50 based on speed
  streak_bonus INTEGER DEFAULT 0,     -- 0-100 based on streak
  total_points INTEGER DEFAULT 0,     -- Sum of above
  current_streak INTEGER DEFAULT 0,   -- Streak at time of answer

  -- Timing
  answered_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent multiple answers to same question
  UNIQUE(party_game_id, player_id, question_index)
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_party_answers_game ON party_answers(party_game_id);
CREATE INDEX IF NOT EXISTS idx_party_answers_player ON party_answers(player_id);
CREATE INDEX IF NOT EXISTS idx_party_answers_question ON party_answers(party_game_id, question_index);

-- ============================================================
-- PARTY SCORES TABLE
-- ============================================================
-- Final scores for completed games (denormalized for quick leaderboard)

CREATE TABLE IF NOT EXISTS party_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_game_id UUID NOT NULL REFERENCES party_games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES party_players(id) ON DELETE CASCADE,

  -- Player info (copied for historical record)
  nickname TEXT NOT NULL,
  zodiac_sign TEXT,
  zodiac_element TEXT,

  -- Score details
  total_points INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  accuracy_percent NUMERIC(5,2) DEFAULT 0,

  -- Achievements
  best_streak INTEGER DEFAULT 0,
  fastest_answer_ms INTEGER, -- Fastest correct answer

  -- Ranking
  rank INTEGER,

  -- Timing
  completed_at TIMESTAMPTZ DEFAULT NOW(),

  -- One score per player per game
  UNIQUE(party_game_id, player_id)
);

-- Indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_party_scores_game ON party_scores(party_game_id);
CREATE INDEX IF NOT EXISTS idx_party_scores_rank ON party_scores(party_game_id, rank);
CREATE INDEX IF NOT EXISTS idx_party_scores_zodiac ON party_scores(zodiac_sign, total_points DESC);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to generate unique 6-character party code
CREATE OR REPLACE FUNCTION generate_party_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No I, O, 0, 1 (avoid confusion)
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get pass duration hours based on type
CREATE OR REPLACE FUNCTION get_pass_duration_hours(pass_type TEXT)
RETURNS INTEGER AS $$
BEGIN
  CASE pass_type
    WHEN 'day' THEN RETURN 24;
    WHEN 'weekend' THEN RETURN 48;
    WHEN 'festival' THEN RETURN 72;
    ELSE RETURN 24; -- Default to day pass
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get max games based on pass type
CREATE OR REPLACE FUNCTION get_pass_max_games(pass_type TEXT)
RETURNS INTEGER AS $$
BEGIN
  CASE pass_type
    WHEN 'day' THEN RETURN 5;
    WHEN 'weekend' THEN RETURN 10;
    WHEN 'festival' THEN RETURN 15;
    ELSE RETURN 5; -- Default to day pass
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE party_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active party passes (for joining)
CREATE POLICY "Allow read active passes" ON party_passes
  FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Policy: Service role can do everything (for API routes)
CREATE POLICY "Service role full access on passes" ON party_passes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on games" ON party_games
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on players" ON party_players
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on answers" ON party_answers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on scores" ON party_scores
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: Anyone can read games, players, answers, scores (public game data)
CREATE POLICY "Allow read games" ON party_games FOR SELECT USING (true);
CREATE POLICY "Allow read players" ON party_players FOR SELECT USING (true);
CREATE POLICY "Allow read answers" ON party_answers FOR SELECT USING (true);
CREATE POLICY "Allow read scores" ON party_scores FOR SELECT USING (true);

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================

-- Enable realtime for game state updates
ALTER PUBLICATION supabase_realtime ADD TABLE party_games;
ALTER PUBLICATION supabase_realtime ADD TABLE party_players;
ALTER PUBLICATION supabase_realtime ADD TABLE party_answers;
ALTER PUBLICATION supabase_realtime ADD TABLE party_scores;

-- ============================================================
-- COMMENTS (Documentation)
-- ============================================================

COMMENT ON TABLE party_passes IS 'Purchased party passes for hosting Fire Horse Trivia games. Like movie rentals with expiration.';
COMMENT ON TABLE party_games IS 'Individual game sessions within a party pass. Each game has 10-25 questions.';
COMMENT ON TABLE party_players IS 'Players who join a party game. Free to join, just need nickname and birth year.';
COMMENT ON TABLE party_answers IS 'Individual answer submissions with timing and scoring details.';
COMMENT ON TABLE party_scores IS 'Final scores for completed games. Denormalized for fast leaderboard queries.';

COMMENT ON COLUMN party_passes.party_code IS '6-character uppercase code for joining (e.g., FIRE88). No I/O/0/1 to avoid confusion.';
COMMENT ON COLUMN party_passes.pass_type IS 'day = 24h/$4.88, weekend = 48h/$8.88, festival = 72h/$14.88';
COMMENT ON COLUMN party_passes.settings IS 'JSON with timer_seconds (15/30/45/60) and questions_per_game (10/15/20/25)';

COMMENT ON COLUMN party_games.question_ids IS 'Array of question IDs from the question bank, randomly selected at game creation';
COMMENT ON COLUMN party_games.status IS 'lobby = waiting, countdown = 3-2-1, playing = showing question, showing_answer = reveal, finished = done';

COMMENT ON COLUMN party_players.zodiac_sign IS 'Calculated from birth_year using Chinese Zodiac cycle (Rat, Ox, Tiger, etc.)';
COMMENT ON COLUMN party_players.zodiac_element IS 'Calculated from birth_year (Wood, Fire, Earth, Metal, Water)';

COMMENT ON COLUMN party_answers.answer_time_ms IS 'Milliseconds from question display to answer submission. Used for speed bonus.';
COMMENT ON COLUMN party_answers.speed_bonus IS '+50 if answered in first 25% of timer, +25 if in first 50%';
COMMENT ON COLUMN party_answers.streak_bonus IS '+25 for 3 streak, +50 for 5 streak, +100 for 10 streak';
