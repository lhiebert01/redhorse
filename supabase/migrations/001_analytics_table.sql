-- Oracle Analytics Table
-- Tracks free and paid oracle generations by zodiac sign
-- NO PII - only counters for marketing purposes

CREATE TABLE IF NOT EXISTS oracle_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composite_key TEXT UNIQUE NOT NULL,  -- e.g., "Dog-Earth-free" or "Rat-Metal-paid"
  zodiac_sign TEXT NOT NULL,           -- e.g., "Dog", "Rat", "Horse"
  zodiac_element TEXT NOT NULL,        -- e.g., "Earth", "Metal", "Fire"
  oracle_type TEXT NOT NULL,           -- "free" or "paid"
  count INTEGER DEFAULT 1,             -- Running counter
  last_generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_oracle_analytics_type ON oracle_analytics(oracle_type);
CREATE INDEX IF NOT EXISTS idx_oracle_analytics_sign ON oracle_analytics(zodiac_sign);

-- RLS policies (admin only)
ALTER TABLE oracle_analytics ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role can manage analytics"
  ON oracle_analytics
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Comment for documentation
COMMENT ON TABLE oracle_analytics IS 'Tracks oracle generation counts by zodiac sign. No PII stored.';
