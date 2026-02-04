'use client';

import { useState, useEffect, useRef } from 'react';
import { PRODUCT_MODES } from '@/constants/modes';

// Celebrity Quotes for ticker - Fire Horse celebrities + Beyoncé "bet on yourself"
const FIRE_HORSE_TICKER_TEXT = '🔥 "I don\'t like to gamble, but if there\'s one thing I\'m willing to bet on, it\'s myself." — Beyoncé  •  🐴 "I\'m going to follow my path. I\'m going to run my race." — Halle Berry (Fire Horse, 1966)  •  🔥 "I only have to follow my heart." — Janet Jackson (Fire Horse, 1966)  •  🐴 "I was always willful. I\'ll do it my way." — Robin Wright (Fire Horse, 1966)  •  ✨ Fire Horse 2026 — Once every 60 years!  •  ';

// Background images to rotate through - alternating main with grids
const BACKGROUND_IMAGES = [
  { src: '/assets/Fire-Horse-2026-Chart-v2.jpeg', isMain: true },   // Main
  { src: '/assets/marketing-grid-1.jpg', isMain: false },            // Grid 1
  { src: '/assets/Fire-Horse-2026-Chart-v2.jpeg', isMain: true },   // Main
  { src: '/assets/marketing-grid-3.jpg', isMain: false },            // Grid 3
];

// Timing constants (in milliseconds)
const FADE_DURATION = 4000;           // 4 seconds for extra smooth fade
const MAIN_DISPLAY_DURATION = 18000;  // 18 seconds for main chart
const GRID_DISPLAY_DURATION = 12000;  // 12 seconds for grid images

// Super Bowl date calculation
const SUPER_BOWL_DATE = new Date('2026-02-08T23:59:59');

function getDaysUntilSuperBowl(): number {
  const now = new Date();
  const diffTime = SUPER_BOWL_DATE.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function shouldShowSuperBowlBanner(): boolean {
  const now = new Date();
  // Hide after Feb 8, 2026 (show through game day, hide Feb 9+)
  const hideAfter = new Date('2026-02-09T00:00:00');
  return now < hideAfter;
}

export default function Home() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showWhyPrice, setShowWhyPrice] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [daysUntilSuperBowl, setDaysUntilSuperBowl] = useState<number>(getDaysUntilSuperBowl());
  const [showSuperBowlBanner, setShowSuperBowlBanner] = useState<boolean>(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  // Rotate background images with consistent timing
  useEffect(() => {
    const scheduleNextTransition = (index: number) => {
      const currentImage = BACKGROUND_IMAGES[index];
      const displayDuration = currentImage.isMain ? MAIN_DISPLAY_DURATION : GRID_DISPLAY_DURATION;
      const totalCycle = FADE_DURATION + displayDuration;

      cycleTimeoutRef.current = setTimeout(() => {
        // Start fade out
        setIsFading(true);

        // After fade completes, switch to next image and fade in
        timeoutRef.current = setTimeout(() => {
          const nextIndex = (index + 1) % BACKGROUND_IMAGES.length;
          setActiveIndex(nextIndex);
          setIsFading(false);
          // Schedule next transition
          scheduleNextTransition(nextIndex);
        }, FADE_DURATION);
      }, totalCycle);
    };

    // Start the rotation cycle
    scheduleNextTransition(0);

    return () => {
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // Empty dependency - only runs once on mount

  // Update Super Bowl countdown on mount
  useEffect(() => {
    setDaysUntilSuperBowl(getDaysUntilSuperBowl());
    setShowSuperBowlBanner(shouldShowSuperBowlBanner());

    // Update every hour
    const interval = setInterval(() => {
      setDaysUntilSuperBowl(getDaysUntilSuperBowl());
      setShowSuperBowlBanner(shouldShowSuperBowlBanner());
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-fire-gradient relative overflow-hidden">
      {/* Single Background Layer with fade transition */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGES[activeIndex].src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          opacity: isFading ? 0 : 0.30,
          transition: `opacity ${FADE_DURATION}ms ease-in-out`,
        }}
      />

      {/* Fire Horse Quote Ticker - Smooth infinite scroll with fade edges */}
      <div className="fixed bottom-2 left-0 right-0 z-0 pointer-events-none overflow-hidden marquee-container">
        <div className="marquee-track flex whitespace-nowrap py-3">
          <span className="marquee-content text-3xl md:text-4xl font-semibold text-fire-gold/30 px-8">
            {FIRE_HORSE_TICKER_TEXT}
          </span>
          <span className="marquee-content text-3xl md:text-4xl font-semibold text-fire-gold/30 px-8">
            {FIRE_HORSE_TICKER_TEXT}
          </span>
        </div>
      </div>

      {/* Smooth marquee animation with fade edges */}
      <style jsx>{`
        .marquee-container {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .marquee-track {
          animation: scroll 25s linear infinite;
          width: max-content;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

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

      {/* Top Left Buttons - Install App, VIP Pass & Partner */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowInstallModal(true)}
          className="bg-fire-gold/90 hover:bg-fire-gold text-black font-bold text-xs px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1.5 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Install App
        </button>
        <span className="text-gray-600 hidden sm:inline">|</span>
        <a
          href="/vip"
          className="bg-fire-gold/10 hover:bg-fire-gold/20 border border-fire-gold/30 hover:border-fire-gold text-fire-gold text-sm px-3 py-1.5 rounded-lg transition-all duration-300"
          title="VIP Pass Entry"
        >
          🎫 VIP Pass?
        </a>
        <span className="text-gray-600 hidden sm:inline">|</span>
        <a
          href="/partner"
          className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500 text-purple-400 text-sm px-3 py-1.5 rounded-lg transition-all duration-300"
          title="Become an Influencer/Partner"
        >
          🌟 Partner with Us?
        </a>
      </div>

      {/* Install App Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-fire-gold rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📲</span>
                <h3 className="text-fire-gold text-xl font-bold">Install Red Horse Oracle</h3>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-6 text-center">
              Add Red Horse Oracle to your home screen for the best experience — just like a native app!
            </p>

            {/* iPhone Instructions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl"></span>
                <h4 className="text-white font-bold text-lg">iPhone / iPad</h4>
              </div>
              <ol className="text-gray-300 text-sm space-y-2">
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">1.</span>
                  <span>Open <strong className="text-white">Safari</strong> browser</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">2.</span>
                  <span>Go to <strong className="text-fire-gold">redhorseoracle.com</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">3.</span>
                  <span>Tap the <strong className="text-white">Share</strong> button <span className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">⬆️</span></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">4.</span>
                  <span>Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">5.</span>
                  <span>Tap <strong className="text-white">Add</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">6.</span>
                  <span>Find the 🐴 icon on your home screen!</span>
                </li>
              </ol>
            </div>

            {/* Android Instructions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🤖</span>
                <h4 className="text-white font-bold text-lg">Android</h4>
              </div>
              <ol className="text-gray-300 text-sm space-y-2">
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">1.</span>
                  <span>Open <strong className="text-white">Chrome</strong> browser</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">2.</span>
                  <span>Go to <strong className="text-fire-gold">redhorseoracle.com</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">3.</span>
                  <span>Tap the <strong className="text-white">3 dots</strong> menu <span className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">⋮</span></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">4.</span>
                  <span>Tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong> or <strong className="text-white">&quot;Install App&quot;</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">5.</span>
                  <span>Tap <strong className="text-white">Add</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-fire-gold font-bold">6.</span>
                  <span>Find the 🐴 icon on your home screen!</span>
                </li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="bg-fire-gold/10 border border-fire-gold/30 rounded-xl p-3 mb-4">
              <p className="text-fire-gold text-sm font-bold text-center mb-2">Why Install?</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-black/50 text-white px-2 py-1 rounded">✓ Full Screen</span>
                <span className="bg-black/50 text-white px-2 py-1 rounded">✓ Faster Loading</span>
                <span className="bg-black/50 text-white px-2 py-1 rounded">✓ App Icon</span>
                <span className="bg-black/50 text-white px-2 py-1 rounded">✓ No Browser Bar</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full bg-fire-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* CNY 2026 Promo Banner - Sticky */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-b-2 border-fire-gold/50 py-2 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <span className="text-fire-gold font-bold text-sm sm:text-base animate-pulse">
            🔥 2026 IS HERE — TAKE ACTION! 🐴
          </span>
          <div className="flex gap-3">
            <a href="/party" className="bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full transition-colors animate-bounce">
              🎉 HOST A PARTY!
            </a>
            <a href="/free" className="bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full transition-colors">
              🔮 GET YOUR ORACLE
            </a>
          </div>
        </div>
      </div>

      {/* Added pb-12 to ensure footer isn't covered by fixed ticker */}
      <div className="max-w-lg mx-auto px-4 py-8 pb-12 flex flex-col items-center min-h-screen relative z-10">
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
            🔥 World&apos;s First 🔥
          </p>
          <p className="text-center text-fire-gold text-xl md:text-2xl font-bold mb-1">
            Authenticated Limited Edition
          </p>
          <p className="text-center text-white text-lg md:text-xl font-bold mb-3">
            AI Zodiac Oracle
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1.5 rounded">✦ NUMBERED</span>
            <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1.5 rounded">🖼️ VERIFIED</span>
            <span className="bg-green-900/50 border border-green-500/50 text-green-400 text-xs px-3 py-1.5 rounded">🛡️ PRIVATE</span>
          </div>
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

        {/* Once-in-60-Year Opportunity Card */}
        <div className="w-full bg-gradient-to-b from-red-950/80 to-black/80 backdrop-blur-sm border border-fire-gold/40 rounded-2xl p-5 mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Fire Horse <span className="text-fire-gold">火马年</span>
          </h2>
          <p className="text-xl md:text-2xl text-fire-gold font-bold mb-3">
            A Once-in-60-Year Opportunity
          </p>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            The Fire Horse returns only once every 60 years. Its blazing energy can ignite your
            <span className="text-yellow-400 font-bold"> wealth</span>,
            amplify your <span className="text-red-400 font-bold">power</span>,
            transform your <span className="text-pink-400 font-bold">love life</span>, or
            strengthen your <span className="text-blue-400 font-bold">protection</span>.
          </p>
        </div>

        {/* 🏈 SUPER BOWL TIE-IN - Auto-hides after Feb 8, 2026 */}
        {showSuperBowlBanner && (
          <div className="w-full bg-gradient-to-r from-blue-900/60 via-red-900/60 to-green-900/60 border-2 border-yellow-500 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🏈</span>
              <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {daysUntilSuperBowl <= 0
                  ? '🏈 SUPER BOWL LX TODAY!'
                  : daysUntilSuperBowl === 1
                    ? 'SUPER BOWL LX TOMORROW!'
                    : `SUPER BOWL LX IN ${daysUntilSuperBowl} DAYS!`}
              </span>
              <span className="text-2xl">🐴</span>
            </div>
            <p className="text-center text-white font-bold text-lg mb-1">
              <span className="text-blue-400">Patriots</span>
              <span className="mx-2">vs</span>
              <span className="text-green-400">Seahawks</span>
              <span className="mx-2">—</span>
              <span className="text-yellow-300">Feb 8</span>
            </p>
            <p className="text-center text-yellow-300 text-sm mb-3">
              🔥 Get Your Lucky Numbers Before Kickoff! 🎲
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={paymentLink}
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm text-center hover:scale-105 transition-transform"
              >
                🎲 Get Lucky Numbers — $8.88
              </a>
              <a
                href="/party"
                className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm text-center hover:scale-105 transition-transform"
              >
                🎉 Host Pre-Game Trivia
              </a>
            </div>
          </div>
        )}

        {/* Product Card */}
        <div className="w-full border-glow bg-black/80 backdrop-blur-sm p-6 rounded-2xl space-y-5 mb-6">

          {/* ========== SECTION 1: FREE ORACLE ========== */}
          <div className="bg-gradient-to-br from-green-950/50 to-black border-2 border-green-500/50 rounded-2xl p-5">
            <div className="text-center mb-4">
              <span className="text-4xl">🔮</span>
              <h3 className="text-green-400 text-xl font-bold mt-2">START HERE — IT&apos;S FREE!</h3>
            </div>

            {/* Free Reading CTA */}
            <a
              href="/free"
              className="block w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600
                         text-white font-bold text-lg md:text-xl py-4 rounded-xl text-center
                         hover:scale-105 active:scale-95 transition-all duration-200
                         shadow-xl shadow-green-500/30 border-2 border-green-400"
            >
              GET YOUR FREE RED HORSE ORACLE READING NOW
            </a>

            {/* Clear messaging about what FREE means */}
            <div className="mt-3 text-center">
              <p className="text-white font-bold text-sm">
                ✓ No Payment &nbsp; ✓ No Personal Info &nbsp; ✓ No Login &nbsp; ✓ No Email
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Discover your Chinese Zodiac sign and 2026 Fire Horse forecast instantly
              </p>
            </div>
          </div>

          {/* ========== OR DIVIDER ========== */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fire-gold/50 to-transparent" />
            <div className="bg-fire-gold/20 border border-fire-gold/50 rounded-full px-4 py-1">
              <span className="text-fire-gold font-bold text-sm">OR</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fire-gold/50 to-transparent" />
          </div>

          {/* ========== SECTION 2: PAID ORACLE ========== */}
          <div className="bg-gradient-to-br from-red-950/50 to-black border-2 border-fire-gold/50 rounded-2xl p-5">
            <div className="text-center mb-4">
              <p className="text-3xl">🔥🔥</p>
              <h3 className="text-fire-gold text-xl font-bold mt-2">THE LIMITED EDITION — COMPLETE ORACLE</h3>
            </div>

            {/* Oracle Preview Image */}
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/Year-of-the-Horse-2026-v2.jpeg"
                alt="Your Limited Edition Oracle"
                className="w-40 h-auto rounded-xl border-2 border-fire-gold/50 shadow-lg shadow-red-900/50 opacity-90"
              />
            </div>

            {/* Paid CTA Button */}
            <a
              href={paymentLink}
              className="block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
                         text-black font-bold text-xl py-4 rounded-xl text-center
                         hover:scale-105 active:scale-95 transition-all duration-200
                         shadow-xl shadow-yellow-500/30 glow-gold border-2 border-yellow-400"
            >
              GET MY ORACLE — $8.88
            </a>

            {/* Privacy badges - same as FREE but without "No Payment" */}
            <p className="text-white font-bold text-sm text-center mt-3 mb-3">
              ✓ No Personal Info &nbsp; ✓ No Login &nbsp; ✓ No Email
            </p>

            {/* 4 Paths - compact inline */}
            <div className="flex justify-center gap-3 text-sm">
              {Object.values(PRODUCT_MODES).map((mode) => (
                <span key={mode.id} className="text-fire-gold">{mode.emoji} {mode.name}</span>
              ))}
            </div>

            {/* Why $8.88 Button */}
            <button
              onClick={() => setShowWhyPrice(!showWhyPrice)}
              className="mt-4 mx-auto block bg-green-700 hover:bg-green-600 text-white font-bold text-sm
                         px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              💰 Why $8.88?
              <span className={`transition-transform duration-300 ${showWhyPrice ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Expandable Why $8.88 Explanation */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showWhyPrice ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              <div className="bg-green-950/60 border border-green-500/30 rounded-xl p-3 text-left">
                <p className="text-white text-sm leading-relaxed">
                  <strong>8</strong> = <strong>&quot;發&quot; (fā)</strong> = <em>prosperity</em>. Three 8s = <strong>triple fortune</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* See Examples Link */}
          <a
            href="/examples"
            className="block text-center text-fire-gold hover:text-yellow-300 font-semibold underline underline-offset-4"
          >
            👁️ See Examples from All 12 Zodiac Signs
          </a>
        </div>

        {/* Party Trivia Game Promo - CNY 2026 */}
        <div className="w-full bg-gradient-to-br from-red-950/80 via-purple-950/80 to-blue-950/80 backdrop-blur-sm border-2 border-fire-gold rounded-2xl p-5 mb-6 relative overflow-hidden">
          {/* Animated sparkles background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 text-2xl animate-pulse">✨</div>
            <div className="absolute top-8 right-6 text-xl animate-pulse" style={{animationDelay: '0.5s'}}>🎆</div>
            <div className="absolute bottom-4 left-8 text-xl animate-pulse" style={{animationDelay: '1s'}}>🎇</div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-4">
              <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3 animate-bounce">
                🔥 DON&apos;T BE PASSIVE IN 2026! 🔥
              </div>
              <h3 className="text-fire-gold text-3xl font-bold">
                COME ON PEOPLE — LET&apos;S GO!
              </h3>
              <p className="text-white text-2xl font-bold mt-2">
                🎉 Fire Horse Trivia Night! 🐴
              </p>
              <p className="text-red-400 text-lg font-semibold mt-1 italic">
                The Fire Horse demands ACTION — not watching from the sidelines!
              </p>
            </div>

            <div className="bg-black/60 rounded-xl p-4 mb-4 border border-fire-gold/30">
              <p className="text-white text-lg text-center leading-relaxed mb-3">
                <span className="text-fire-gold font-bold text-xl">BE THE HOST EVERYONE REMEMBERS!</span>
                <br/>
                <span className="text-yellow-400">400 epic questions</span> • Chinese Zodiac • Fire Horse legends • CNY traditions
                <br/>
                <span className="text-red-300 font-semibold">This is YOUR year to CELEBRATE!</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm font-bold">
                <span className="bg-red-600/80 text-white px-3 py-1.5 rounded-lg">🔥 2-20 Players</span>
                <span className="bg-yellow-600/80 text-black px-3 py-1.5 rounded-lg">⚡ Live Battles</span>
                <span className="bg-green-600/80 text-white px-3 py-1.5 rounded-lg">🏆 Glory & Bragging Rights</span>
              </div>
            </div>

            <a
              href="/party"
              className="block w-full bg-gradient-to-r from-red-600 via-fire-gold to-red-600
                         text-black font-bold text-xl py-4 rounded-xl text-center
                         hover:scale-105 active:scale-95 transition-all duration-200
                         shadow-xl shadow-fire-gold/40 border-2 border-yellow-400 animate-pulse"
            >
              🔥 YES! I&apos;M READY TO HOST! 🔥
            </a>

            <p className="text-white text-base text-center mt-3 font-bold">
              Family • Friends • Office • Zoom — BRING THE FIRE! 🐴
            </p>

            {/* Social Share Ask */}
            <div className="mt-4 pt-4 border-t border-fire-gold/30 text-center">
              <p className="text-white text-sm font-bold mb-2">
                📣 Know someone who&apos;d love this? Share it!
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="https://twitter.com/intent/tweet?text=🐴%20Host%20your%20own%20Fire%20Horse%20Trivia%20Party%20for%20CNY%202026!%20400%20questions%20about%20Chinese%20Zodiac%20%26%20Fire%20Horse%20legends!%20🎉&url=https://redhorseoracle.com/party"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  𝕏 Share
                </a>
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://redhorseoracle.com/party"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://www.linkedin.com/shareArticle?mini=true&url=https://redhorseoracle.com/party&title=Fire%20Horse%20Trivia%20Party%20Game"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
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

        {/* HIDDEN FOR NOW - Charitable Giving - AI for Good
            To re-enable: Remove this comment block
            Future: Change to 8.88% of net proceeds instead of 20%

        <div className="w-full bg-gradient-to-br from-purple-950/40 via-black/60 to-blue-950/40 backdrop-blur-sm border border-purple-500/40 rounded-xl p-5 mb-6">
          <div className="text-center mb-4">
            <span className="text-3xl">👁️</span>
            <h3 className="text-purple-300 text-lg font-bold mt-2">
              The Oracle&apos;s Gift
            </h3>
          </div>

          <div className="bg-black/40 rounded-lg p-3 mb-4 border-l-2 border-purple-400">
            <p className="text-gray-300 text-sm italic leading-relaxed">
              &quot;In ancient Greece, the blind seer <span className="text-purple-300 font-semibold">Tiresias</span> saw further than any mortal. The Greeks believed those without physical sight possessed the greatest <span className="text-fire-gold font-semibold">inner vision</span>.&quot;
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-center">
            <p className="text-white text-sm font-bold mb-2">
              🤍 8.88% of Net Proceeds Supports
            </p>
            <p className="text-purple-300 text-lg font-bold mb-1">
              American Foundation for the Blind
            </p>
            <p className="text-gray-400 text-xs mb-3">
              Founded 1921 • Helen Keller, Co-Founder
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-2">
              Sight is the most precious gift. Even if you&apos;re skeptical about your own future,
              <span className="text-purple-300 font-semibold"> you&apos;ll know your action today helps another human being.</span>
            </p>
            <p className="text-fire-gold text-sm italic font-semibold">
              What better way to build positive karma for 2026?
            </p>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <span className="bg-purple-900/50 border border-purple-500/50 text-purple-300 text-xs px-3 py-1.5 rounded-full">
              🤖 AI for Good
            </span>
            <span className="bg-purple-900/50 border border-purple-500/50 text-purple-300 text-xs px-3 py-1.5 rounded-full">
              💜 Charitable Partner
            </span>
          </div>
        </div>
        END HIDDEN SECTION */}

        {/* Social Proof */}
        <div className="text-center mb-6 bg-black/40 backdrop-blur-sm border border-red-900/50 rounded-xl p-4">
          <p className="text-red-300 text-xl md:text-2xl italic font-medium">
            &quot;The Fire Horse only comes once every 60 years. I wasn&apos;t going to miss my chance.&quot;
          </p>
          <p className="text-gray-400 text-sm mt-2">— Early Believer, January 2026</p>
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
