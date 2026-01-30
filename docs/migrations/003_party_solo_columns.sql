-- Migration: Add columns for Solo Play Pass and Pre-generated Question Sets
-- Run this in Supabase SQL Editor

-- ============================================================
-- PARTY_PASSES TABLE - Add solo play and question set columns
-- ============================================================

-- Add is_solo column (true for solo play passes)
ALTER TABLE party_passes
ADD COLUMN IF NOT EXISTS is_solo BOOLEAN DEFAULT false;

-- Add games_played column (tracks how many games have been started)
ALTER TABLE party_passes
ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0;

-- Add question_sets column (pre-generated question IDs for all games)
-- This is a JSONB array of arrays: [[set1], [set2], ...]
ALTER TABLE party_passes
ADD COLUMN IF NOT EXISTS question_sets JSONB DEFAULT '[]'::jsonb;

-- ============================================================
-- PARTY_GAMES TABLE - Add game_number column
-- ============================================================

-- Add game_number column (which game this is: 1, 2, 3, etc.)
ALTER TABLE party_games
ADD COLUMN IF NOT EXISTS game_number INTEGER;

-- ============================================================
-- INDEXES for better query performance
-- ============================================================

-- Index for finding solo passes
CREATE INDEX IF NOT EXISTS idx_party_passes_is_solo
ON party_passes (is_solo)
WHERE is_solo = true;

-- Index for finding passes by code (already exists but ensure it's there)
CREATE INDEX IF NOT EXISTS idx_party_passes_party_code
ON party_passes (party_code);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify columns were added:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'party_passes'
-- AND column_name IN ('is_solo', 'games_played', 'question_sets');

-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'party_games'
-- AND column_name = 'game_number';
