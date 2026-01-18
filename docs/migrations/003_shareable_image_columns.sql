-- Migration: Add shareable image columns to prophecies table
-- Date: January 17, 2026
-- Purpose: Store watermarked shareable images (NO certificate) separate from owner images (WITH certificate)
--
-- IMPORTANT: Two image versions for each prophecy:
-- 1. branded_image_url - Owner version WITH certificate number (for DOWNLOAD only)
-- 2. shareable_image_url - Watermarked version WITHOUT certificate (for SHARING)
--
-- This prevents unauthorized copying while allowing users to share their oracles.

-- Add new columns for shareable images
ALTER TABLE prophecies
ADD COLUMN IF NOT EXISTS shareable_image_url TEXT,
ADD COLUMN IF NOT EXISTS shareable_image_storage_path TEXT;

-- Add comments for documentation
COMMENT ON COLUMN prophecies.branded_image_url IS 'Owner version: has edition badge, certificate number, and maker mark. For DOWNLOAD only by the purchaser.';
COMMENT ON COLUMN prophecies.shareable_image_url IS 'Shareable version: has edition badge (no cert), watermark overlay, and CTA. For SOCIAL SHARING.';
COMMENT ON COLUMN prophecies.shareable_image_storage_path IS 'Storage path for shareable image (e.g., {id}-shareable.png)';

-- Update existing comment on branded_image_url to clarify purpose
COMMENT ON COLUMN prophecies.branded_image_storage_path IS 'Storage path for owner/branded image (e.g., {id}-branded.png)';
