-- Red Horse Oracle Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main prophecies table
CREATE TABLE prophecies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Stripe session tracking (CRITICAL for matching payments to prophecies)
    stripe_session_id TEXT UNIQUE NOT NULL,
    stripe_payment_intent TEXT,

    -- User data from Stripe checkout
    email TEXT NOT NULL,
    birth_date TEXT NOT NULL,

    -- Product selection
    focus_mode TEXT NOT NULL CHECK (focus_mode IN ('wealth', 'power', 'love', 'shield')),

    -- Zodiac calculation results
    zodiac_sign TEXT,
    zodiac_element TEXT,
    fire_horse_relation TEXT,

    -- AI Generated content
    main_text TEXT,
    sub_text TEXT,
    full_reading TEXT,

    -- Image handling
    image_url TEXT,
    image_storage_path TEXT,

    -- Processing status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Index for session lookups (primary access pattern)
CREATE INDEX idx_prophecies_session ON prophecies(stripe_session_id);

-- Index for status queries
CREATE INDEX idx_prophecies_status ON prophecies(status);

-- Index for analytics
CREATE INDEX idx_prophecies_focus_mode ON prophecies(focus_mode);
CREATE INDEX idx_prophecies_created_at ON prophecies(created_at);

-- Enable Row Level Security
ALTER TABLE prophecies ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read of prophecies (needed for reveal page)
CREATE POLICY "Allow public read" ON prophecies
    FOR SELECT
    USING (true);

-- Policy: Only authenticated/service role can insert/update
CREATE POLICY "Service role full access" ON prophecies
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON prophecies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Enable realtime for status updates (for the reveal page)
ALTER PUBLICATION supabase_realtime ADD TABLE prophecies;

-- Analytics view (optional but useful)
CREATE OR REPLACE VIEW prophecy_analytics AS
SELECT
    DATE_TRUNC('day', created_at) as date,
    focus_mode,
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count
FROM prophecies
GROUP BY DATE_TRUNC('day', created_at), focus_mode, status
ORDER BY date DESC;

-- Grant access to the analytics view
GRANT SELECT ON prophecy_analytics TO anon, authenticated;
