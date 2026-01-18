-- Migration: Future Year Reservations
-- Purpose: Allow users to reserve their spot for future zodiac year oracles
-- Privacy: Only stores email + zodiac year + mode preference. No PII.

-- Reservations table
CREATE TABLE IF NOT EXISTS future_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Reservation details (minimal data)
  email TEXT NOT NULL,
  zodiac_year INTEGER NOT NULL,  -- 2027, 2028, etc.
  preferred_mode TEXT,           -- wealth, power, love, shield (optional)

  -- Status tracking
  status TEXT DEFAULT 'reserved',  -- reserved, notified, converted, cancelled
  notified_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,

  -- Privacy: No birth date, no name, no PII beyond email
  -- Email is only used for notification when year opens

  -- Constraints
  UNIQUE(email, zodiac_year)  -- One reservation per email per year
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_reservations_year ON future_reservations(zodiac_year);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON future_reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON future_reservations(email);

-- Reservation counts view (for displaying "X people reserved")
CREATE OR REPLACE VIEW reservation_counts AS
SELECT
  zodiac_year,
  COUNT(*) as total_reservations,
  COUNT(*) FILTER (WHERE status = 'reserved') as active_reservations,
  COUNT(*) FILTER (WHERE status = 'converted') as converted
FROM future_reservations
GROUP BY zodiac_year;

-- Comments
COMMENT ON TABLE future_reservations IS 'Stores reservations for future zodiac year oracles. Privacy-first: only email and year stored.';
COMMENT ON COLUMN future_reservations.email IS 'Email for notification only. Not linked to any PII.';
COMMENT ON COLUMN future_reservations.zodiac_year IS 'The year being reserved (2027-2037)';
COMMENT ON COLUMN future_reservations.preferred_mode IS 'Optional: wealth, power, love, or shield';
