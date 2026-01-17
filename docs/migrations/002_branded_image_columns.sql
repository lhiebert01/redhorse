-- Migration: Add branded image columns to prophecies table
-- Date: January 17, 2026
-- Purpose: Store branded image URLs with edition/certificate info baked in

-- Add new columns for branded images
ALTER TABLE prophecies
ADD COLUMN IF NOT EXISTS branded_image_url TEXT,
ADD COLUMN IF NOT EXISTS branded_image_storage_path TEXT;

-- Add comment for documentation
COMMENT ON COLUMN prophecies.branded_image_url IS 'Public URL of branded image with edition badge, certificate, and maker mark baked in';
COMMENT ON COLUMN prophecies.branded_image_storage_path IS 'Storage path for branded image (e.g., {id}-branded.png)';

-- Create index for querying by zodiac sign and edition number (for SuperAdmin)
CREATE INDEX IF NOT EXISTS idx_prophecies_zodiac_edition
ON prophecies (zodiac_sign, zodiac_element, edition_number)
WHERE status = 'completed';

-- Create index for querying by focus mode
CREATE INDEX IF NOT EXISTS idx_prophecies_focus_mode
ON prophecies (focus_mode, zodiac_sign)
WHERE status = 'completed';
