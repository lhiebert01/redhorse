'use client';

import GeneratingState from '@/components/reveal/GeneratingState';

/**
 * Preview page to test the loading/generating animation
 * Access at: /preview-loading
 *
 * This page shows the GeneratingState component with sample data
 * so you can see the animation without making a purchase.
 */
export default function PreviewLoadingPage() {
  return (
    <GeneratingState
      zodiacSign="Dragon"
      zodiacElement="Fire"
      focusMode="wealth"
    />
  );
}
