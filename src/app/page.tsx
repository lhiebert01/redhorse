'use client';

import { useState, useEffect, useRef } from 'react';
import { PRODUCT_MODES } from '@/constants/modes';

// Background images to rotate through - alternating main with grids
const BACKGROUND_IMAGES = [
  '/assets/Fire-Horse-2026-Chart-v2.jpeg',  // Main
  '/assets/marketing-grid-1.jpg',            // Grid 1
  '/assets/Fire-Horse-2026-Chart-v2.jpeg',  // Main
  '/assets/marketing-grid-3.jpg',            // Grid 3
];

// Timing constants (in milliseconds)
const FADE_DURATION = 3000;      // 3 seconds for smooth fade
const DISPLAY_DURATION = 12000;  // 12 seconds showing each image
const TOTAL_CYCLE = FADE_DURATION + DISPLAY_DURATION; // 15 seconds total per image

export default function Home() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate background images with consistent timing
  useEffect(() => {
    const startRotation = () => {
      intervalRef.current = setInterval(() => {
        // Start fade out
        setIsFading(true);

        // After fade completes, switch to next image and fade in
        timeoutRef.current = setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
          setIsFading(false);
        }, FADE_DURATION);
      }, TOTAL_CYCLE);
    };

    startRotation();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // Empty dependency - only runs once on mount

  return (
    <main className="min-h-screen bg-fire-gradient relative overflow-hidden">
      {/* Single Background Layer with fade transition */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGES[activeIndex]})`,
          backgroundSize: 'contain',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          opacity: isFading ? 0 : 0.30,
          transition: `opacity ${FADE_DURATION}ms ease-in-out`,
        }}
      />

      {/* Admin Test Button - Gear Icon */}
      <a
        href="/admin-test"
        className="absolute top-4 right-4 p-3 text-gray-400 hover:text-fire-gold transition-all duration-300 opacity-50 hover:opacity-100 hover:rotate-90 z-20"
        title="Admin Test"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </a>

      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center min-h-screen relative z-10">
        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-fire-gold tracking-tighter text-glow-gold text-center mt-4 mb-3">
          RED HORSE
          <br />
          ORACLE<sup className="text-lg align-super">™</sup>
        </h1>

        {/* Tagline */}
        <div className="text-center mb-4">
          <p className="text-red-300 text-4xl md:text-5xl font-bold tracking-wider mb-1">
            丙午年
          </p>
          <p className="text-fire-gold text-xl md:text-2xl font-semibold tracking-wide">
            Year of the Fire Horse 2026
          </p>
        </div>

        {/* Value Prop Badge */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fire-gold/50 rounded-xl px-5 py-5 mb-6">
          <p className="text-center text-white text-lg md:text-xl font-bold mb-1">
            🔥 World&apos;s First
          </p>
          <p className="text-center text-fire-gold text-xl md:text-2xl font-bold mb-1">
            Authenticated Limited Edition
          </p>
          <p className="text-center text-white text-lg md:text-xl font-bold mb-3">
            AI Zodiac Oracle
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1.5 rounded">✦ NUMBERED EDITIONS</span>
            <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1.5 rounded">🖼️ VERIFIABLE ART</span>
            <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1.5 rounded">📜 PROVENANCE</span>
          </div>
          <p className="text-center text-green-400 text-sm font-semibold">
            🛡️ Zero Personal Data Stored • Privacy by Design • Maker&apos;s Mark Authenticated
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-sm mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/Year-of-the-Horse-2026-v2.jpeg"
            alt="Year of the Fire Horse 2026 - Talisman of Divine Protection"
            className="w-full h-auto rounded-2xl border-2 border-fire-gold/50 shadow-2xl shadow-red-900/50"
          />
        </div>

        {/* Product Card */}
        <div className="w-full border-glow bg-black/80 backdrop-blur-sm p-6 rounded-2xl space-y-5 mb-6">
          {/* Section Header */}
          <div className="text-center">
            <p className="text-fire-gold font-bold text-lg">Choose Your Path</p>
            <p className="text-gray-400 text-xs">Select one mode at checkout</p>
          </div>

          {/* Product Modes */}
          <div className="space-y-3">
            {Object.values(PRODUCT_MODES).map((mode) => (
              <div
                key={mode.id}
                className="bg-red-950/40 border border-red-900/30 rounded-xl p-3 hover:border-fire-gold/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{mode.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-fire-gold text-sm">{mode.name}</span>
                    </div>
                    <p className="text-white text-sm font-semibold">
                      {mode.description}
                    </p>
                    <p className="text-gray-500 text-xs italic">
                      e.g., &quot;{mode.example}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-red-900/50" />

          {/* Price Display */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">One-time payment</p>
            <p className="text-4xl font-bold text-fire-gold text-glow-gold">$8.88</p>
            <p className="text-gray-500 text-xs mt-1">The number of fortune</p>
          </div>

          {/* Free Reading CTA - Primary */}
          <a
            href="/free"
            className="block w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600
                       text-white font-bold text-xl py-4 rounded-xl text-center
                       hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-xl shadow-green-500/30 border-2 border-green-400"
          >
            🔮 FREE: DISCOVER YOUR 2026 DESTINY
          </a>
          <p className="text-center text-gray-400 text-xs -mt-2">
            See your zodiac forecast instantly - no payment required
          </p>

          {/* Divider with Call to Action */}
          <div className="text-center py-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 border-t border-fire-gold/30" />
              <span className="text-fire-gold text-xs">✦</span>
              <div className="flex-1 border-t border-fire-gold/30" />
            </div>
            <p className="text-white font-bold text-base md:text-lg leading-snug">
              Ready for your real, complete, authenticated
              <br />
              <span className="text-fire-gold">Limited Edition Red Horse Oracle?</span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Take a chance. Get your true prophecy.
            </p>
          </div>

          {/* Paid CTA Button */}
          <a
            href={paymentLink}
            className="block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
                       text-black font-bold text-xl py-4 rounded-xl text-center
                       hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-xl shadow-yellow-500/30 glow-gold"
          >
            🔥 GET MY ORACLE - $8.88
          </a>

          {/* Trust Badges */}
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span>🔒 Secure</span>
            <span>⚡ Instant</span>
            <span>🎨 AI Art</span>
          </div>

          {/* See Examples Link */}
          <a
            href="/examples"
            className="block text-center text-fire-gold hover:text-yellow-300 font-semibold underline underline-offset-4"
          >
            👁️ See Examples from All 12 Zodiac Signs
          </a>
        </div>

        {/* Privacy by Design Notice - KEY DIFFERENTIATOR */}
        <div className="w-full bg-green-900/30 border border-green-500/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="text-green-400 font-bold text-sm mb-2">
                The ONLY Red Horse Oracle with COMPLETE Privacy by Design
              </p>
              <p className="text-white text-sm leading-relaxed">
                <strong>Zero data stored.</strong> Your birth date calculates your zodiac and is{' '}
                <span className="text-green-400 font-semibold">immediately discarded</span>. No names, birthdays, or personal data ever stored.
              </p>
              <a
                href="/privacy"
                className="inline-block mt-3 bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                LEARN MORE →
              </a>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-6 bg-black/40 backdrop-blur-sm border border-red-900/50 rounded-xl p-4">
          <p className="text-red-300 text-xl md:text-2xl italic font-medium">
            &quot;The Oracle revealed my path. I won $500 the next day.&quot;
          </p>
          <p className="text-gray-400 text-sm mt-2">— Fire Horse Believer (Fictional)</p>
        </div>

        {/* Footer / Disclaimer */}
        <footer className="text-center text-sm text-white font-bold max-w-sm">
          <p>
            Strictly for entertainment purposes only. AI-generated artwork.
            <br />
            Not financial, legal, or gambling advice.
          </p>
          <p className="mt-2">© 2026 PIGENAI LLC. All Rights Reserved.</p>
          <p className="text-fire-gold text-xs mt-1">
            Red Horse Oracle™ • Patent Pending • 18+
          </p>
          <div className="mt-3 space-x-4">
            <a href="/terms" className="hover:text-fire-gold underline">
              Terms
            </a>
            <a href="/privacy" className="hover:text-fire-gold underline">
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
