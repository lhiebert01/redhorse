'use client';

import { useState } from 'react';
import { getChineseZodiac } from '@/lib/zodiac/calculator';
import { validateBirthDate, extractBirthYear, MIN_BIRTH_YEAR, MAX_BIRTH_YEAR } from '@/lib/validation/date-validator';
import {
  ZodiacAnimal,
  ZodiacElement,
  ZODIAC_CHINESE,
  ELEMENT_CHINESE,
} from '@/constants/zodiac-data';
import { PRODUCT_MODES } from '@/constants/modes';
import {
  getForecast,
  getFireHorseRelationDescription,
  ZodiacElement as ForecastElement,
  ZodiacAnimalType,
} from '@/constants/zodiac-forecasts';
import { getZodiacFunFacts, getElementColors } from '@/constants/zodiac-fun-facts';

export default function FreeReadingPage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    animal: ZodiacAnimal;
    element: ZodiacElement;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  // Get fun facts for the result
  const funFacts = result ? getZodiacFunFacts(result.element, result.animal) : null;
  const elementColors = result ? getElementColors(result.element) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!birthDate) {
      setValidationError('Please enter your birth date.');
      return;
    }

    // Validate the birth date range (1910-2027)
    const validation = validateBirthDate(birthDate);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Invalid date');
      return;
    }

    const zodiac = getChineseZodiac(birthDate);
    if (zodiac) {
      setResult({
        animal: zodiac.animal as ZodiacAnimal,
        element: zodiac.element as ZodiacElement,
      });

      // Track free oracle generation (non-blocking)
      const birthYear = extractBirthYear(birthDate);
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zodiacSign: zodiac.animal,
          zodiacElement: zodiac.element,
          birthYear: birthYear,
          type: 'free'
        })
      }).catch(() => {});
    }
  };

  // Get the forecast
  const forecast = result
    ? getForecast(result.element as ForecastElement, result.animal as ZodiacAnimalType)
    : null;

  // Get only first sentence of forecast for FREE preview
  const getFirstSentence = (text: string) => {
    const match = text.match(/^[^.!?]+[.!?]/);
    return match ? match[0] : text.substring(0, 80) + '...';
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-950 to-black py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-400 text-xl uppercase tracking-widest mb-2 font-bold">
            Free 2026 Preview
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-fire-gold mb-3">
            Discover Your Chinese Zodiac
          </h1>
          <p className="text-gray-300">
            The Fire Horse returns only once every 60 years.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {!result ? (
          <>
            {/* Birth Date Input Form */}
            <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center">
                  <label className="block text-fire-gold text-lg font-semibold mb-2">
                    Enter Your Birth Date
                  </label>
                  <p className="text-gray-400 text-sm mb-4">
                    Calculated locally - never stored
                  </p>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(e.target.value);
                      setValidationError(null);
                    }}
                    min={`${MIN_BIRTH_YEAR}-01-01`}
                    max={`${MAX_BIRTH_YEAR}-12-31`}
                    className={`w-full max-w-xs mx-auto block bg-black border-2 rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none ${
                      validationError
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-fire-gold/50 focus:border-fire-gold'
                    }`}
                    required
                  />
                  {validationError && (
                    <p className="mt-3 text-red-400 text-sm">{validationError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-xl py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  REVEAL MY ZODIAC
                </button>
                <p className="text-center text-gray-500 text-xs">
                  100% free • No email required • Privacy by design
                </p>
              </form>
            </div>
          </>
        ) : (
          /* ========== RESULTS SECTION - CONVERSION OPTIMIZED ========== */
          <div className="space-y-6">

            {/* Your Zodiac Identity - The Hook */}
            <div className="bg-gradient-to-r from-fire-gold/20 via-red-900/20 to-fire-gold/20 border-2 border-fire-gold rounded-2xl p-6 text-center">
              <p className="text-fire-gold text-xs uppercase tracking-widest mb-2">
                Your Chinese Zodiac Revealed
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                You are a {result.element} {result.animal}
              </h2>
              <p className="text-4xl mb-3">
                {ELEMENT_CHINESE[result.element]}{ZODIAC_CHINESE[result.animal]}
              </p>
              <p className="text-gray-300 text-sm">
                Born in a {result.element} {result.animal} year — {funFacts?.years.join(' or ')}
              </p>
            </div>

            {/* Celebrity Quote - Keeps them engaged */}
            {funFacts && (
              <div className="bg-gradient-to-br from-purple-950/40 to-black border border-purple-500/50 rounded-xl p-4 text-center">
                <p className="text-white text-lg italic mb-2">
                  &ldquo;{funFacts.quote}&rdquo;
                </p>
                <p className="text-purple-400 text-sm font-semibold">
                  — {funFacts.quoteAuthor}
                </p>
                <p className="text-gray-500 text-xs">
                  Famous {result.element} {result.animal}
                </p>
              </div>
            )}

            {/* ========== TEASER: Your Zodiac Card (BLURRED) ========== */}
            <div className="relative">
              <p className="text-fire-gold text-sm font-semibold text-center mb-2">
                Your {result.element} {result.animal} Digital Art Card
              </p>
              <div className="relative rounded-xl overflow-hidden border-2 border-fire-gold/50">
                {/* Blurred Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/zodiac-badges-free/${result.element.toLowerCase()}-${result.animal.toLowerCase()}.jpeg`}
                  alt={`${result.element} ${result.animal}`}
                  className="w-full h-auto blur-lg scale-105"
                />
                {/* Unlock Overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <span className="text-5xl mb-3">🔒</span>
                  <p className="text-white text-lg font-bold mb-1">Full Image Locked</p>
                  <p className="text-gray-300 text-sm mb-3">Unlock with your Complete Oracle</p>
                  <a
                    href={paymentLink}
                    className="bg-fire-gold hover:bg-yellow-400 text-black font-bold text-sm px-6 py-2 rounded-lg transition-all hover:scale-105"
                  >
                    UNLOCK — $8.88
                  </a>
                </div>
              </div>
            </div>

            {/* ========== PARTIAL FORECAST (First Sentence Only) ========== */}
            {forecast && (
              <div className="bg-gradient-to-b from-green-950/40 to-black border border-green-500/50 rounded-xl p-5">
                <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-3">
                  2026 Fire Horse Preview
                </p>

                {/* First sentence only */}
                <p className="text-white text-base leading-relaxed mb-3">
                  {getFirstSentence(forecast.forecast)}
                </p>

                {/* Blurred remaining text */}
                <div className="relative">
                  <p className="text-white text-base leading-relaxed blur-sm select-none">
                    The Fire Horse energy will amplify your natural abilities. This year brings opportunities for growth and transformation. Your element alignment creates unique advantages...
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/80 border border-fire-gold/50 rounded-lg px-4 py-2">
                      <p className="text-fire-gold text-sm font-bold">
                        🔒 Full Forecast in Complete Oracle
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== FAMOUS PEOPLE (Show 1, Tease Others) ========== */}
            {funFacts && (
              <div className="bg-gradient-to-br from-yellow-950/30 to-black border border-yellow-500/40 rounded-xl p-5">
                <p className="text-yellow-400 text-xs uppercase tracking-widest text-center mb-3">
                  Famous {result.element} {result.animal}
                </p>

                {/* Show only first celebrity */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-3">
                  <p className="text-yellow-300 font-bold">{funFacts.famousPeople[0].name}</p>
                  <p className="text-gray-400 text-sm">{funFacts.famousPeople[0].description}</p>
                </div>

                {/* Teaser for more */}
                <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-sm">
                    <span className="text-yellow-400 font-bold">+{funFacts.famousPeople.length - 1} more</span> famous {result.element} {result.animal}s
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Unlock in Complete Oracle</p>
                </div>
              </div>
            )}

            {/* ========== YOUR PROPHECY (BLURRED TEASE) ========== */}
            <div className="relative bg-gradient-to-b from-red-950 via-black to-red-950 border-2 border-fire-gold rounded-2xl p-6 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/assets/Year-of-the-Horse-2026-v2.jpeg')] bg-cover bg-center blur-sm"></div>
              </div>

              <div className="relative z-10 text-center">
                <p className="text-fire-gold text-xs uppercase tracking-widest mb-2">
                  Your Personal Prophecy
                </p>
                <h3 className="text-2xl font-bold text-white mb-4">
                  What the Fire Horse Reveals for YOU
                </h3>

                {/* Blurred Prophecy */}
                <div className="bg-black/60 rounded-xl p-6 mb-4">
                  <p className="text-3xl md:text-4xl font-bold text-fire-gold blur-md select-none mb-2">
                    STRIKE THE DAWN
                  </p>
                  <p className="text-white blur-sm select-none text-sm">
                    Your {result.element} {result.animal} destiny awaits. The Fire Horse has a message specifically for you...
                  </p>
                </div>

                {/* Unlock CTA */}
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm">
                    Your unique {result.element} {result.animal} × Fire Horse prophecy is ready
                  </p>
                  <a
                    href={paymentLink}
                    className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-lg py-3 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/30 border-2 border-yellow-400"
                  >
                    🔓 REVEAL MY PROPHECY — $8.88
                  </a>
                </div>
              </div>
            </div>

            {/* ========== AI TALISMAN PREVIEW (BLURRED) ========== */}
            <div className="bg-gradient-to-b from-purple-950/50 to-black border border-purple-500/50 rounded-2xl p-5">
              <p className="text-purple-400 text-xs uppercase tracking-widest text-center mb-3">
                Your AI-Generated Talisman
              </p>

              <div className="relative rounded-xl overflow-hidden border border-purple-500/30 mb-4">
                {/* Use example talisman as preview, heavily blurred */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/examples/${result.animal.toLowerCase()}.png`}
                  alt="Talisman Preview"
                  className="w-full h-auto blur-xl scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col items-center justify-center">
                  <span className="text-6xl mb-2">🎨</span>
                  <p className="text-white text-lg font-bold">One-of-a-Kind AI Artwork</p>
                  <p className="text-gray-300 text-sm mb-1">Featuring YOUR {result.element} {result.animal}</p>
                  <p className="text-purple-400 text-xs">× Fire Horse 2026</p>
                </div>
              </div>

              <p className="text-gray-400 text-xs text-center">
                Each talisman is uniquely generated by Google Gemini AI — no two are alike
              </p>
            </div>

            {/* ========== WHAT YOU GET (Clear Value Prop) ========== */}
            <div className="bg-black/60 border border-fire-gold/50 rounded-2xl p-5">
              <p className="text-fire-gold text-sm font-bold text-center mb-4">
                Your Complete Oracle Includes:
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center">
                  <span className="text-2xl">🖼️</span>
                  <p className="text-white text-sm font-semibold">HD Zodiac Card</p>
                  <p className="text-gray-500 text-xs">Downloadable</p>
                </div>
                <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center">
                  <span className="text-2xl">🎨</span>
                  <p className="text-white text-sm font-semibold">AI Talisman Art</p>
                  <p className="text-gray-500 text-xs">Unique to you</p>
                </div>
                <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center">
                  <span className="text-2xl">📜</span>
                  <p className="text-white text-sm font-semibold">Full Prophecy</p>
                  <p className="text-gray-500 text-xs">Personalized</p>
                </div>
                <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center">
                  <span className="text-2xl">✨</span>
                  <p className="text-white text-sm font-semibold">Edition Certificate</p>
                  <p className="text-gray-500 text-xs">#X of 888</p>
                </div>
              </div>

              {/* Choose Your Path */}
              <p className="text-gray-400 text-xs text-center mb-3">Choose your oracle focus:</p>
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {Object.values(PRODUCT_MODES).map((mode) => (
                  <span key={mode.id} className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1 rounded-full">
                    {mode.emoji} {mode.name}
                  </span>
                ))}
              </div>
            </div>

            {/* ========== MAIN CTA ========== */}
            <div className="bg-gradient-to-r from-yellow-900/30 via-red-900/30 to-yellow-900/30 border-2 border-fire-gold rounded-2xl p-6 text-center">
              <p className="text-white text-lg font-bold mb-2">
                Ready to unlock your complete {result.element} {result.animal} Oracle?
              </p>
              <p className="text-gray-400 text-sm mb-4">
                One-time payment • Instant delivery • Privacy by design
              </p>

              <a
                href={paymentLink}
                className="block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-xl py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/30 border-2 border-yellow-400 mb-3"
              >
                🔥 GET MY COMPLETE ORACLE — $8.88
              </a>

              <p className="text-gray-500 text-xs">
                Limited to 888 editions per zodiac • Fire Horse year ends Feb 2027
              </p>
            </div>

            {/* See Examples Link */}
            <div className="text-center">
              <a
                href="/examples"
                className="text-fire-gold hover:text-yellow-300 font-semibold underline underline-offset-4"
              >
                👁️ See Example Oracles from All 12 Zodiac Signs
              </a>
            </div>

            {/* Privacy Note - Brief */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
              <p className="text-green-400 text-sm font-semibold mb-1">
                🛡️ Privacy by Design
              </p>
              <p className="text-gray-400 text-xs">
                Your birth date was calculated locally and immediately discarded. Zero data stored.
              </p>
            </div>

            {/* Try Again */}
            <div className="text-center space-y-3">
              <button
                onClick={() => {
                  setResult(null);
                  setBirthDate('');
                }}
                className="text-gray-400 hover:text-white underline text-sm"
              >
                Try a different birth date
              </button>

              <a
                href="/"
                className="block text-fire-gold hover:text-yellow-300 font-semibold"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 mt-12 pb-8">
          <p>For entertainment purposes only. AI-generated artwork.</p>
          <p className="mt-1">© 2026 PIGENAI LLC. All Rights Reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-fire-gold underline">Terms</a>
            <a href="/privacy" className="hover:text-fire-gold underline">Privacy</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
