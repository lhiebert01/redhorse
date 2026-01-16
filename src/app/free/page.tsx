'use client';

import { useState } from 'react';
import { getChineseZodiac } from '@/lib/zodiac/calculator';
import {
  ZodiacAnimal,
  ZodiacElement,
  ZODIAC_CHINESE,
  ELEMENT_CHINESE,
  ZODIAC_PROFILES,
  FIRE_HORSE_RELATIONS,
} from '@/constants/zodiac-data';
import { PRODUCT_MODES } from '@/constants/modes';
import { EDITION_CONFIG, getDaysRemaining } from '@/constants/editions';

export default function FreeReadingPage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    animal: ZodiacAnimal;
    element: ZodiacElement;
  } | null>(null);
  const [showPriceExplainer, setShowPriceExplainer] = useState(false);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const zodiac = getChineseZodiac(birthDate);
    if (zodiac) {
      setResult({
        animal: zodiac.animal as ZodiacAnimal,
        element: zodiac.element as ZodiacElement,
      });
    }
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'ally': return 'text-green-400';
      case 'special': return 'text-fire-gold';
      case 'clash': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  const getCompatibilityBg = (compatibility: string) => {
    switch (compatibility) {
      case 'ally': return 'bg-green-900/30 border-green-700/50';
      case 'special': return 'bg-yellow-900/30 border-yellow-700/50';
      case 'clash': return 'bg-red-900/30 border-red-700/50';
      default: return 'bg-gray-900/30 border-gray-700/50';
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-950 to-black py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-400 text-sm uppercase tracking-widest mb-2">
            Free 2026 Reading
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-fire-gold mb-4">
            What Does the Fire Horse<br />Reveal About YOUR 2026?
          </h1>
          <p className="text-gray-300 text-lg">
            The Fire Horse returns only once every 60 years.
            <br />
            <span className="text-white font-semibold">Discover your destiny in 30 seconds.</span>
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!result ? (
          <>
            {/* Privacy Promise - Before Form */}
            <div className="bg-green-900/30 border-2 border-green-500/50 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">🛡️</span>
                <h2 className="text-green-400 text-xl font-bold">100% PII-FREE</h2>
              </div>
              <p className="text-white text-center text-sm leading-relaxed mb-3">
                The <span className="text-green-400 font-bold">ONLY</span> Authenticated Limited Edition Oracle with{' '}
                <span className="text-green-400 font-bold">COMPLETE Privacy by Design</span>.
                Your birth date is processed <span className="text-green-400 font-semibold">locally in your browser</span>{' '}
                and is <span className="text-green-400 font-semibold">immediately discarded</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                <span className="bg-green-900/50 border border-green-700 text-green-300 text-[10px] px-2 py-1 rounded">✓ ZERO DATA STORED</span>
                <span className="bg-green-900/50 border border-green-700 text-green-300 text-[10px] px-2 py-1 rounded">✓ NO TRACKING</span>
                <span className="bg-green-900/50 border border-green-700 text-green-300 text-[10px] px-2 py-1 rounded">✓ NO COOKIES</span>
              </div>
              <p className="text-gray-400 text-center text-xs mb-4">
                Verifiable Digital Art • Provenance Tracked • Maker&apos;s Mark Authenticated
              </p>
              <a
                href="/privacy"
                className="block w-full max-w-xs mx-auto bg-green-600 hover:bg-green-500 text-white font-bold text-base py-3 rounded-xl text-center transition-colors"
              >
                🔒 VIEW OUR PRIVACY POLICY
              </a>
            </div>

            {/* Birth Date Input Form */}
            <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <label className="block text-fire-gold text-lg font-semibold mb-2">
                    Enter Your Birth Date
                  </label>
                  <p className="text-gray-400 text-sm mb-4">
                    Calculated locally in your browser - never sent to any server
                  </p>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full max-w-xs mx-auto block bg-black border-2 border-fire-gold/50 rounded-xl px-4 py-3 text-white text-center text-lg focus:border-fire-gold focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-xl py-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl"
              >
                REVEAL MY 2026 DESTINY
              </button>
              <p className="text-center text-gray-500 text-xs">
                100% free. No credit card required.
              </p>
            </form>
          </div>
          </>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Zodiac Identity Card */}
            <div className="bg-gradient-to-br from-red-950/50 to-black border border-fire-gold/30 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                Your Chinese Zodiac
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-fire-gold">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/zodiac/${result.animal.toLowerCase()}.jpeg`}
                    alt={result.animal}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-fire-gold">
                    {result.element} {result.animal}
                  </h2>
                  <p className="text-4xl text-red-300">
                    {ELEMENT_CHINESE[result.element]}{ZODIAC_CHINESE[result.animal]}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Strengths */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">
                Your Core Strengths
              </p>
              <div className="flex flex-wrap gap-2">
                {ZODIAC_PROFILES[result.animal].strengths.map((strength) => (
                  <span
                    key={strength}
                    className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-sm px-4 py-2 rounded-full"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">
                {result.animal} Characteristics
              </p>
              <p className="text-gray-200 leading-relaxed">
                {ZODIAC_PROFILES[result.animal].characteristics}
              </p>
            </div>

            {/* 2026 Fire Horse Forecast */}
            <div className={`${getCompatibilityBg(FIRE_HORSE_RELATIONS[result.animal].compatibility)} border rounded-xl p-6`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔥</span>
                <p className="text-gray-400 text-sm uppercase tracking-widest">
                  Your 2026 Fire Horse Forecast
                </p>
              </div>
              <p className={`text-lg font-semibold mb-2 ${getCompatibilityColor(FIRE_HORSE_RELATIONS[result.animal].compatibility)}`}>
                {FIRE_HORSE_RELATIONS[result.animal].relation}
              </p>
              <p className="text-gray-200 leading-relaxed mb-4">
                {ZODIAC_PROFILES[result.animal].forecast2026}
              </p>
              <p className="text-fire-gold italic">
                &ldquo;{FIRE_HORSE_RELATIONS[result.animal].advice}&rdquo;
              </p>
            </div>

            {/* Limited Edition Certificate */}
            <div className="bg-gradient-to-br from-black via-gray-950 to-black border-2 border-fire-gold rounded-2xl p-6 relative overflow-hidden">
              {/* Watermark Background - User's zodiac character */}
              <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                <span className="text-[250px] text-fire-gold font-serif">{EDITION_CONFIG[result.animal].chineseChar}</span>
              </div>

              {/* Maker's Mark / Seal - Top Right Corner */}
              <div className="absolute top-3 right-3 opacity-80">
                <div className="w-16 h-16 border-2 border-fire-gold/60 rounded-full flex items-center justify-center bg-black/80 rotate-12">
                  <div className="text-center">
                    <p className="text-fire-gold text-[8px] font-bold leading-tight">RED HORSE</p>
                    <p className="text-red-500 text-lg leading-none">馬</p>
                    <p className="text-fire-gold text-[6px]">2026</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-4">
                  <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-1">Certificate of Authenticity</p>
                  <div className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full px-4 py-1">
                    <p className="text-black font-bold text-xs tracking-widest">✦ LIMITED EDITION ✦</p>
                  </div>
                </div>

                {/* Main Title */}
                <h3 className="text-fire-gold text-xl font-bold text-center mb-1">
                  AUTHENTIC {result.element.toUpperCase()} {result.animal.toUpperCase()} ORACLE
                </h3>
                <p className="text-center text-fire-gold text-xs mb-1">for the Year of the Fire Horse 2026</p>
                <p className="text-center text-4xl mb-3">{EDITION_CONFIG[result.animal].chineseChar}</p>

                {/* Edition Stats - Time-based urgency only */}
                <div className="bg-gradient-to-r from-red-950/50 via-yellow-950/50 to-red-950/50 border border-fire-gold/50 rounded-lg p-4 mb-4 text-center">
                  <p className="text-fire-gold text-3xl font-bold">{getDaysRemaining(result.animal)}</p>
                  <p className="text-white text-sm font-semibold">Days Remaining</p>
                  <p className="text-gray-400 text-xs">Edition closes {EDITION_CONFIG[result.animal].closingDateDisplay}</p>
                  <p className="text-gray-500 text-[10px] mt-1">888 per mode • Numbered & Authenticated</p>
                </div>

                {/* Urgency Alert */}
                <div className="bg-red-900/60 border border-red-500 rounded-lg px-3 py-2 mb-4">
                  <p className="text-red-200 text-xs text-center font-semibold">
                    ⚠️ {result.element} {result.animal} × Fire Horse Edition closes <span className="text-white">{EDITION_CONFIG[result.animal].closingDateDisplay}</span>
                  </p>
                </div>

                {/* What You Get */}
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Your Numbered {result.element} {result.animal} Edition Includes:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-2 py-1 rounded">Unique Edition #</span>
                    <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-2 py-1 rounded">Maker&apos;s Mark</span>
                    <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-2 py-1 rounded">AI Talisman Art</span>
                    <span className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-2 py-1 rounded">Sacred Prophecy</span>
                  </div>
                </div>

                {/* Authenticity Footer */}
                <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🔥</span>
                    <span className="text-gray-500 text-[10px]">FIRST • ONLY • BEST</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-[10px]">Verified by</p>
                    <p className="text-fire-gold text-xs font-bold">redhorseoracle.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courage Challenge CTA */}
            <div className="bg-gradient-to-br from-red-950 via-red-900 to-black border-2 border-red-500 rounded-2xl p-6 text-center">
              {/* Urgency Warning - Time-based */}
              <div className="bg-red-900/80 border border-red-500 rounded-lg px-4 py-2 mb-4 inline-block">
                <p className="text-red-200 text-xs font-bold uppercase tracking-wider">
                  ⏰ {result.element.toUpperCase()} {result.animal.toUpperCase()} EDITION CLOSES {EDITION_CONFIG[result.animal].closingDateDisplay.toUpperCase()} ⏰
                </p>
              </div>

              <p className="text-red-400 text-sm uppercase tracking-widest mb-2">
                The Fire Horse Demands Courage
              </p>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
                Will YOU Claim Your Authentic<br />{result.element} {result.animal} × Fire Horse Oracle?
              </h3>
              <p className="text-gray-300 text-lg mb-4">
                Only <span className="text-fire-gold font-bold">{EDITION_CONFIG[result.animal].totalSlots}</span> of each oracle type will EVER be minted for {result.element} {result.animal}.
                <br />
                <span className="text-gray-400 text-sm">888 Wealth × 888 Power × 888 Love × 888 Shield</span>
                <br />
                <span className="text-red-400">Each one numbered. Each one unique. Each one YOURS.</span>
              </p>

              {/* Countdown Context */}
              <div className="bg-black/70 border border-fire-gold/50 rounded-xl p-4 mb-4">
                <p className="text-fire-gold text-sm font-bold mb-1">🔥 {result.element} {result.animal} Edition Closes: {EDITION_CONFIG[result.animal].closingDateDisplay}</p>
                <p className="text-gray-400 text-xs">
                  After this date, <span className="text-red-400 font-bold">NO MORE {result.animal} Oracles</span> will be minted for Fire Horse 2026.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Next Fire Horse year: <span className="text-red-400">2086</span> — Will you even be alive?
                </p>
              </div>

              <p className="text-white text-base font-semibold italic mb-4">
                &ldquo;Fortune favors the bold. The Fire Horse respects COURAGE.&rdquo;
              </p>

              <div className="bg-black/50 border border-gray-700 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">The Question Is:</p>
                <p className="text-white text-xl font-bold">
                  Are you someone who <span className="text-red-400">ACTS</span>?
                  <br />
                  Or someone who <span className="text-gray-500">lets opportunity pass?</span>
                </p>
              </div>

              <p className="text-white text-sm font-semibold">
                Only {EDITION_CONFIG[result.animal].totalSlots} of each mode (Wealth, Power, Love, Shield) will EVER be minted for {result.element} {result.animal}. Will you claim yours?
              </p>
            </div>

            {/* Sample Talisman Preview */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-red-900/20 border border-fire-gold/50 rounded-2xl p-6">
              <p className="text-fire-gold text-sm uppercase tracking-widest mb-3 text-center">
                Your {result.element} {result.animal} × Fire Horse Oracle Awaits
              </p>
              <div className="relative w-full max-w-sm mx-auto mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/examples/${result.animal.toLowerCase()}.png`}
                  alt={`${result.element} ${result.animal} Oracle Example`}
                  className="w-full h-auto rounded-xl border border-fire-gold/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl flex items-end justify-center pb-4">
                  <p className="text-white text-sm font-semibold">
                    Sample {result.element} {result.animal} × Fire Horse Oracle
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-center text-sm mb-6">
                Your unique AI-generated {result.element} {result.animal} talisman for the Year of the Fire Horse
              </p>

              {/* The Four Paths */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.values(PRODUCT_MODES).map((mode) => (
                  <div
                    key={mode.id}
                    className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center"
                  >
                    <span className="text-2xl">{mode.emoji}</span>
                    <p className="text-fire-gold text-sm font-semibold">{mode.name}</p>
                    <p className="text-gray-400 text-xs">{mode.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href={paymentLink}
                className="block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-xl py-5 rounded-xl text-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-yellow-500/30 border-2 border-yellow-400"
              >
                🔥 I BET ON MYSELF — GET MY ORACLE
              </a>
              <p className="text-fire-gold text-center text-2xl font-bold mt-2">
                $8.88
              </p>

              {/* Interactive Price Explainer */}
              <button
                onClick={() => setShowPriceExplainer(!showPriceExplainer)}
                className="mt-2 mx-auto block bg-red-900/50 hover:bg-red-900/70 border border-fire-gold/50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              >
                {showPriceExplainer ? '✓ Now you know!' : '🤔 Why $8.88? Tap to discover...'}
              </button>

              {showPriceExplainer && (
                <div className="mt-3 bg-black/60 border border-fire-gold/30 rounded-xl p-4 text-center animate-fade-in">
                  <p className="text-fire-gold text-sm font-bold mb-1">
                    The Luckiest Number in Chinese Culture
                  </p>
                  <p className="text-white text-sm">
                    八 (8) sounds like 发 (fā) — meaning <span className="text-fire-gold font-semibold">&ldquo;prosperity&rdquo;</span>
                  </p>
                  <p className="text-gray-300 text-xs mt-2">
                    Triple 8s (888) = Triple Fortune. This is why Chinese gifts, prices, and lucky numbers always feature 8s.
                  </p>
                </div>
              )}

              <p className="text-center text-white text-sm font-semibold mt-3">
                One-time payment. Instant delivery. Authentic prophecy. Privacy by design.
              </p>
              <p className="text-center text-red-400 text-xs mt-2 font-semibold">
                ⏰ Available only until December 31, 2026
              </p>
            </div>

            {/* Privacy Reinforcement - Enhanced */}
            <div className="bg-green-900/30 border-2 border-green-500/50 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">🛡️</span>
                <h3 className="text-green-400 text-xl font-bold">YOUR DATA? ALREADY GONE.</h3>
              </div>
              <p className="text-white text-center text-sm leading-relaxed mb-3">
                Your birth date was processed <span className="text-green-400 font-semibold">locally in your browser</span>{' '}
                and was <span className="text-green-400 font-semibold">immediately discarded</span> after calculating your zodiac sign.
              </p>
              <p className="text-gray-300 text-center text-xs mb-4">
                We are the <span className="text-green-400 font-bold">ONLY</span> Red Horse Oracle with{' '}
                <span className="text-green-400 font-bold">COMPLETE Privacy by Design</span>.
                No data stored. No tracking. No cookies. Nothing retained.
              </p>
              <a
                href="/privacy"
                className="block w-full max-w-xs mx-auto bg-green-600 hover:bg-green-500 text-white font-bold text-base py-3 rounded-xl text-center transition-colors"
              >
                🔒 VIEW OUR PRIVACY POLICY
              </a>
            </div>

            {/* Try Again */}
            <button
              onClick={() => {
                setResult(null);
                setBirthDate('');
              }}
              className="w-full text-gray-400 hover:text-fire-gold underline text-sm"
            >
              Try a different birth date
            </button>
          </div>
        )}

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-500 mb-4">
            <span>🔒 Privacy by Design</span>
            <span>🤖 Gemini 3 Pro AI</span>
            <span>⚡ Instant Delivery</span>
          </div>
          <p className="text-gray-600 text-xs">
            Your birth date is used only to calculate your zodiac sign and is never stored.
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a href="/" className="text-fire-gold hover:underline text-sm">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
