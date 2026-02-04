-- Influencer/Partner Applications Table
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS influencer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact info
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- Platform info (optional)
  platform VARCHAR(50),  -- 'tiktok', 'instagram', 'youtube', 'twitter', 'other'
  handle VARCHAR(100),   -- @username
  follower_count VARCHAR(50),  -- '10K-50K', '50K-100K', etc.

  -- Proposal
  message TEXT NOT NULL,

  -- Admin tracking
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'approved', 'declined', 'completed')),
  admin_notes TEXT,
  responded_at TIMESTAMPTZ,

  -- Source tracking
  source_page VARCHAR(50)  -- 'landing', 'party', 'vip', 'footer'
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_influencer_applications_status ON influencer_applications(status);
CREATE INDEX IF NOT EXISTS idx_influencer_applications_created ON influencer_applications(created_at DESC);

-- Enable RLS
ALTER TABLE influencer_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON influencer_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE influencer_applications IS 'Inbound influencer/partner applications from the Become an Influencer form';
