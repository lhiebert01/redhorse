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

export default function FreeReadingPage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    animal: ZodiacAnimal;
    element: ZodiacElement;
  } | null>(null);

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
                <h2 className="text-green-400 text-xl font-bold">ZERO DATA RETAINED</h2>
              </div>
              <p className="text-white text-center text-sm leading-relaxed mb-3">
                The <span className="text-green-400 font-bold">ONLY</span> Red Horse Oracle with{' '}
                <span className="text-green-400 font-bold">COMPLETE Privacy by Design</span>.
                Your birth date is processed <span className="text-green-400 font-semibold">locally in your browser</span>{' '}
                to calculate your zodiac sign and is <span className="text-green-400 font-semibold">immediately discarded</span>.
              </p>
              <p className="text-gray-300 text-center text-xs mb-4">
                No names. No DOB stored. No PII. No tracking. No cookies. Nothing.
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

            {/* Authenticity Seal */}
            <div className="bg-black border-2 border-fire-gold rounded-2xl p-6 text-center relative overflow-hidden">
              {/* Watermark Background */}
              <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                <span className="text-[200px] text-fire-gold">馬</span>
              </div>

              <div className="relative z-10">
                {/* Seal Badge */}
                <div className="inline-block bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-full p-1 mb-4">
                  <div className="bg-black rounded-full px-6 py-3 border-2 border-fire-gold">
                    <p className="text-fire-gold font-bold text-xs tracking-widest">✦ AUTHENTICATED ✦</p>
                  </div>
                </div>

                <h3 className="text-fire-gold text-2xl font-bold mb-2">
                  THE ONLY AUTHENTIC
                </h3>
                <h2 className="text-white text-3xl font-bold mb-3">
                  RED HORSE ORACLE
                </h2>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="bg-red-900/50 border border-red-700 text-red-300 text-xs px-3 py-1 rounded-full">🔥 FIRST</span>
                  <span className="bg-green-900/50 border border-green-700 text-green-300 text-xs px-3 py-1 rounded-full">🛡️ ONLY</span>
                  <span className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-xs px-3 py-1 rounded-full">⭐ BEST</span>
                </div>

                <p className="text-gray-300 text-sm mb-2">
                  Powered by <span className="text-green-400 font-bold">Google Gemini 3 Pro</span>
                </p>
                <p className="text-gray-400 text-xs">
                  Complete Privacy by Design • Zero Data Stored • Museum-Quality AI Art
                </p>
              </div>
            </div>

            {/* Courage Challenge CTA */}
            <div className="bg-gradient-to-br from-red-950 via-red-900 to-black border-2 border-red-500 rounded-2xl p-6 text-center">
              {/* Urgency Warning */}
              <div className="bg-red-900/80 border border-red-500 rounded-lg px-4 py-2 mb-4 inline-block">
                <p className="text-red-200 text-xs font-bold uppercase tracking-wider">
                  ⚠️ LIMITED TIME: This Oracle Closes December 31, 2026 ⚠️
                </p>
              </div>

              <p className="text-red-400 text-sm uppercase tracking-widest mb-2">
                The Fire Horse Demands Courage
              </p>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
                Will YOU Be Bold Enough<br />To Know Your 2026 Destiny?
              </h3>
              <p className="text-gray-300 text-lg mb-4">
                The Fire Horse returns <span className="text-fire-gold font-bold">once every 60 years</span>.
                <br />
                <span className="text-red-400">This is YOUR moment. Your ONE chance until 2086.</span>
              </p>

              {/* Countdown Context */}
              <div className="bg-black/70 border border-fire-gold/50 rounded-xl p-4 mb-4">
                <p className="text-fire-gold text-sm font-bold mb-1">🔥 Year of the Fire Horse: 2026</p>
                <p className="text-gray-400 text-xs">
                  Next Fire Horse year: <span className="text-red-400 font-bold">2086</span> (60 years from now)
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  This app will be <span className="text-red-400">permanently archived</span> after 2026.
                </p>
              </div>

              <p className="text-gray-400 text-sm italic mb-4">
                &ldquo;Fortune favors the bold. The Fire Horse respects COURAGE.&rdquo;
              </p>

              <div className="bg-black/50 border border-gray-700 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">The Question Is:</p>
                <p className="text-white text-xl font-bold">
                  Are you someone who <span className="text-red-400">ACTS</span>?
                  <br />
                  Or someone who <span className="text-gray-500">waits and wonders?</span>
                </p>
              </div>

              <p className="text-gray-500 text-xs">
                Don&apos;t let 2026 pass without YOUR authentic Fire Horse prophecy.
              </p>
            </div>

            {/* Sample Talisman Preview */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-red-900/20 border border-fire-gold/50 rounded-2xl p-6">
              <p className="text-fire-gold text-sm uppercase tracking-widest mb-3 text-center">
                Your REAL, COMPLETE Oracle Awaits
              </p>
              <div className="relative w-full max-w-sm mx-auto mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/examples/${result.animal.toLowerCase()}.png`}
                  alt={`${result.animal} Oracle Example`}
                  className="w-full h-auto rounded-xl border border-fire-gold/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl flex items-end justify-center pb-4">
                  <p className="text-white text-sm font-semibold">
                    Sample {result.animal} Oracle
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-center text-sm mb-6">
                Get YOUR unique AI-generated talisman with personalized prophecy
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
                🔥 I HAVE THE COURAGE - GET MY ORACLE
              </a>
              <p className="text-fire-gold text-center text-lg font-bold mt-2">
                $8.88 <span className="text-gray-400 text-sm font-normal">• The Number of Fortune</span>
              </p>
              <p className="text-center text-gray-400 text-xs mt-1">
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
