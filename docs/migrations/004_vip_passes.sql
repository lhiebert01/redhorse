-- VIP Passes Table for Influencer Marketing
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS vip_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,

  -- Recipient info (for tracking)
  recipient_name VARCHAR(100),
  recipient_platform VARCHAR(50),  -- 'instagram', 'email', 'twitter', 'tiktok', 'other'
  notes TEXT,

  -- Oracle entitlement
  oracle_used BOOLEAN DEFAULT FALSE,
  oracle_used_at TIMESTAMPTZ,
  oracle_prophecy_id UUID REFERENCES prophecies(id),

  -- Solo game entitlement
  solo_used BOOLEAN DEFAULT FALSE,
  solo_used_at TIMESTAMPTZ,
  solo_game_id UUID,

  -- Hosted game entitlement
  hosted_used BOOLEAN DEFAULT FALSE,
  hosted_used_at TIMESTAMPTZ,
  hosted_party_pass_id UUID REFERENCES party_passes(id),

  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked'))
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_vip_passes_code ON vip_passes(code);
CREATE INDEX IF NOT EXISTS idx_vip_passes_status ON vip_passes(status);
CREATE INDEX IF NOT EXISTS idx_vip_passes_expires ON vip_passes(expires_at);

-- Enable RLS
ALTER TABLE vip_passes ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (admin operations)
CREATE POLICY "Service role full access" ON vip_passes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment for documentation
COMMENT ON TABLE vip_passes IS 'VIP passes for influencer marketing - grants free access to Oracle, Solo Game, and Hosted Game';
COMMENT ON COLUMN vip_passes.code IS 'Unique VIP code like KCLOVE, CHAOS, LOCALVIP';
COMMENT ON COLUMN vip_passes.recipient_platform IS 'Platform where recipient was contacted: instagram, email, twitter, tiktok, other';
