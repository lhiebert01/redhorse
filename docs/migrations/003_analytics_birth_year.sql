-- Migration 003: Add birth_year and focus_mode to oracle_analytics
-- Run this in Supabase SQL Editor

-- Add new columns to oracle_analytics table
ALTER TABLE oracle_analytics
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS focus_mode TEXT;

-- Create index for year-based queries
CREATE INDEX IF NOT EXISTS idx_oracle_analytics_birth_year
ON oracle_analytics (birth_year);

-- Create index for type + year queries
CREATE INDEX IF NOT EXISTS idx_oracle_analytics_type_year
ON oracle_analytics (oracle_type, birth_year);

-- Create index for composite queries
CREATE INDEX IF NOT EXISTS idx_oracle_analytics_full
ON oracle_analytics (oracle_type, birth_year, zodiac_sign, zodiac_element, focus_mode);

-- Update existing records to have a new composite key format
-- This is optional - existing data will still work, new records will use the new format

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'oracle_analytics'
ORDER BY ordinal_position;
