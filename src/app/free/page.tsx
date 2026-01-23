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

  // Get first 2-3 sentences of forecast for FREE preview
  const getPreviewSentences = (text: string) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    // Return first 2 sentences, or first 3 if they're short
    const preview = sentences.slice(0, 2).join(' ');
    return preview || text.substring(0, 120) + '...';
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

            {/* Privacy by Design Section */}
            <div className="bg-gradient-to-r from-green-950/40 via-black to-green-950/40 border border-green-500/50 rounded-2xl p-5 mt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-green-400 text-lg font-bold">Privacy by Design</h3>
              </div>

              <p className="text-white text-center text-sm mb-4">
                The <span className="text-green-400 font-bold">ONLY</span> Red Horse Oracle with
                <span className="text-green-400 font-bold"> COMPLETE Privacy by Design</span>
              </p>

              {/* Checkmarks */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-sm">
                <span className="text-green-400">✓ No Payment</span>
                <span className="text-green-400">✓ No Personal Info</span>
                <span className="text-green-400">✓ No Login</span>
                <span className="text-green-400">✓ No Email</span>
              </div>

              <div className="bg-black/40 rounded-xl p-4 mb-4">
                <p className="text-gray-300 text-sm text-center leading-relaxed">
                  <span className="text-green-400 font-bold">Zero data stored.</span> Your birth date calculates your zodiac
                  and is <span className="text-red-400 font-semibold">immediately discarded</span>.
                  No names, birthdays, or personal data ever stored.
                </p>
              </div>

              <div className="text-center">
                <a
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold"
                >
                  LEARN MORE →
                </a>
              </div>
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

            {/* ========== YOUR CARD - LARGE SHOWCASE ========== */}
            <div className="bg-gradient-to-b from-yellow-950/30 via-black to-yellow-950/20 border-2 border-fire-gold rounded-2xl p-4 md:p-6">
              <p className="text-fire-gold text-xs uppercase tracking-widest text-center mb-2">
                🏆 Your Collectible Digital Art Card
              </p>
              <p className="text-white text-xl md:text-2xl font-bold text-center mb-4">
                {result.element} {result.animal}
              </p>

              {/* LARGE Card - Their specific card */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-fire-gold shadow-2xl shadow-fire-gold/30 mb-4">
                {/* Full quality image from main badges folder */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/zodiac-badges/${result.element.toLowerCase()}-${result.animal.toLowerCase()}.jpeg`}
                  alt={`${result.element} ${result.animal} Digital Art Card`}
                  className="w-full h-auto"
                />
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/20 rounded-2xl px-6 py-3">
                    <p className="text-white/40 text-3xl md:text-5xl font-bold tracking-wider rotate-[-15deg] select-none">
                      PREVIEW
                    </p>
                  </div>
                </div>
                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-fire-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                  YOUR CARD
                </div>
                {/* Bottom Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-fire-gold font-bold text-xl">
                        {result.element} {result.animal}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {ELEMENT_CHINESE[result.element]}{ZODIAC_CHINESE[result.animal]} • {funFacts?.years.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-bold">HD Download</p>
                      <p className="text-green-400 text-xs">Included FREE</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* This is YOURS message */}
              <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 mb-4 text-center">
                <p className="text-green-400 font-bold text-lg mb-1">
                  ✓ This Card is YOURS
                </p>
                <p className="text-gray-300 text-sm">
                  HD download included when you get your Complete Oracle.
                  <br />
                  <span className="text-gray-500">One of 60 unique designs in the collection.</span>
                </p>
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                <div className="bg-fire-gold/10 rounded-lg p-2 border border-fire-gold/30">
                  <p className="text-fire-gold font-bold text-lg">12</p>
                  <p className="text-gray-400">Animals</p>
                </div>
                <div className="bg-fire-gold/10 rounded-lg p-2 border border-fire-gold/30">
                  <p className="text-fire-gold font-bold text-lg">5</p>
                  <p className="text-gray-400">Elements</p>
                </div>
                <div className="bg-fire-gold/10 rounded-lg p-2 border border-fire-gold/30">
                  <p className="text-fire-gold font-bold text-lg">60</p>
                  <p className="text-gray-400">Unique Cards</p>
                </div>
              </div>

              <div className="text-center">
                <a
                  href={paymentLink}
                  className="inline-block bg-gradient-to-r from-yellow-600 via-fire-gold to-yellow-600 text-black font-bold text-lg py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-xl shadow-fire-gold/30"
                >
                  🎨 GET MY {result.element.toUpperCase()} {result.animal.toUpperCase()} CARD — $8.88
                </a>
              </div>
            </div>

            {/* ========== PARTIAL FORECAST (2 Sentences) ========== */}
            {forecast && (
              <div className="bg-gradient-to-b from-green-950/40 to-black border border-green-500/50 rounded-xl p-5">
                <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-3">
                  Your 2026 Fire Horse Preview
                </p>

                {/* First 2 sentences */}
                <p className="text-white text-base leading-relaxed mb-3">
                  {getPreviewSentences(forecast.forecast)}
                </p>

                {/* Teaser for more */}
                <div className="bg-black/60 border border-fire-gold/30 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-sm mb-1">
                    Your complete {result.element} {result.animal} × Fire Horse forecast continues...
                  </p>
                  <p className="text-fire-gold text-sm font-semibold">
                    🔓 Unlock full forecast in your Complete Oracle
                  </p>
                </div>
              </div>
            )}

            {/* ========== FAMOUS PEOPLE (Show 2, Tease Others) ========== */}
            {funFacts && (
              <div className="bg-gradient-to-br from-yellow-950/30 to-black border border-yellow-500/40 rounded-xl p-5">
                <p className="text-yellow-400 text-xs uppercase tracking-widest text-center mb-3">
                  ⭐ Famous {result.element} {result.animal}s ⭐
                </p>

                {/* Show first 2 celebrities */}
                <div className="space-y-2 mb-3">
                  {funFacts.famousPeople.slice(0, 2).map((person, idx) => (
                    <div key={idx} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
                      <span className="text-yellow-400 font-bold text-lg">{idx + 1}</span>
                      <div>
                        <p className="text-yellow-300 font-bold">{person.name}</p>
                        <p className="text-gray-400 text-sm">{person.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Teaser for more */}
                {funFacts.famousPeople.length > 2 && (
                  <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-sm">
                      <span className="text-yellow-400 font-bold">+{funFacts.famousPeople.length - 2} more</span> famous {result.element} {result.animal}s in Complete Oracle
                    </p>
                  </div>
                )}

                <p className="text-center text-gray-500 text-xs mt-3">
                  You share your zodiac with these legends!
                </p>
              </div>
            )}

            {/* ========== THE HOOK - FOMO & SCARCITY ========== */}
            <div className="bg-gradient-to-b from-red-900 via-red-950 to-black border-2 border-red-500 rounded-2xl p-5 relative overflow-hidden">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 animate-pulse"></div>

              <div className="relative z-10">
                <p className="text-red-400 text-xs uppercase tracking-widest text-center mb-2 font-bold">
                  ⚠️ ONCE EVERY 60 YEARS ⚠️
                </p>

                <h3 className="text-white text-xl md:text-2xl font-bold text-center mb-3">
                  The Fire Horse Window is Closing
                </h3>

                {/* Timeline */}
                <div className="flex justify-center items-center gap-2 text-sm mb-4">
                  <span className="text-gray-500">1966</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-fire-gold font-bold text-lg px-3 py-1 bg-fire-gold/20 rounded-lg border border-fire-gold">2026</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-500">2086</span>
                </div>

                <p className="text-center text-red-300 text-sm font-semibold mb-4">
                  Will you even be ALIVE in 2086?
                </p>

                {/* Scarcity Counter */}
                <div className="bg-black/60 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-fire-gold">888</p>
                      <p className="text-gray-400 text-xs">Max {result.animal} Oracles</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-400">390</p>
                      <p className="text-gray-400 text-xs">Days Remaining</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-xs text-center">
                  When they&apos;re gone, they&apos;re gone. No reprints. No exceptions.
                </p>
              </div>
            </div>

            {/* ========== BET ON YOURSELF ========== */}
            <div className="bg-gradient-to-br from-orange-950/50 via-black to-yellow-950/30 border border-orange-500/40 rounded-2xl p-5">
              <div className="text-center mb-4">
                <p className="text-5xl mb-2">🎰</p>
                <p className="text-white text-xl md:text-2xl font-bold italic leading-relaxed">
                  &ldquo;I don&apos;t like to gamble, but if there&apos;s one thing I&apos;m willing to bet on, it&apos;s myself.&rdquo;
                </p>
                <p className="text-orange-300 text-sm font-semibold mt-2">— Beyoncé</p>
              </div>

              {/* Fire Horse Quotes */}
              <div className="space-y-2 mb-4">
                <div className="bg-black/40 rounded-lg p-3 border-l-2 border-fire-gold">
                  <p className="text-gray-300 text-sm italic">&ldquo;I&apos;m going to follow my path. I&apos;m going to run my race.&rdquo;</p>
                  <p className="text-fire-gold text-xs mt-1">— Halle Berry <span className="text-gray-500">(Fire Horse, 1966)</span></p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border-l-2 border-fire-gold">
                  <p className="text-gray-300 text-sm italic">&ldquo;I only have to follow my heart.&rdquo;</p>
                  <p className="text-fire-gold text-xs mt-1">— Janet Jackson <span className="text-gray-500">(Fire Horse, 1966)</span></p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-fire-gold font-bold text-lg mb-1">
                  What&apos;s YOUR Fire Horse moment?
                </p>
                <p className="text-gray-400 text-sm">
                  $8.88 to bet on yourself. That&apos;s less than a coffee.
                </p>
              </div>
            </div>

            {/* ========== DON'T BE A ZOMBIE FREE USER ========== */}
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-600 rounded-2xl p-5">
              <div className="text-center mb-4">
                <p className="text-4xl mb-2">🧟 vs 🔥</p>
                <h3 className="text-white text-lg font-bold">
                  Two Types of People See This Page
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Zombie Column */}
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <p className="text-gray-400 text-center font-bold mb-2">🧟 The Zombie</p>
                  <ul className="text-gray-500 text-xs space-y-1">
                    <li>• Takes the free thing</li>
                    <li>• Never commits</li>
                    <li>• Waits for "someday"</li>
                    <li>• Forgets by tomorrow</li>
                    <li>• Same life, same year</li>
                  </ul>
                </div>

                {/* Fire Column */}
                <div className="bg-fire-gold/10 rounded-xl p-3 border border-fire-gold/50">
                  <p className="text-fire-gold text-center font-bold mb-2">🔥 The Fire</p>
                  <ul className="text-fire-gold/80 text-xs space-y-1">
                    <li>• Bets on themselves</li>
                    <li>• Takes action NOW</li>
                    <li>• Owns something rare</li>
                    <li>• Joins the movement</li>
                    <li>• Makes 2026 count</li>
                  </ul>
                </div>
              </div>

              <p className="text-center text-white text-sm font-semibold">
                Which one are you?
              </p>
            </div>

            {/* ========== PROSPER VS BORING ========== */}
            <div className="bg-gradient-to-r from-fire-gold/20 via-black to-fire-gold/20 border-2 border-fire-gold rounded-2xl p-6 text-center">
              <p className="text-fire-gold text-xs uppercase tracking-widest mb-3">
                💡 Here&apos;s the Truth
              </p>

              <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                Most People Don&apos;t Do Anything.
              </h3>

              <p className="text-gray-300 text-base mb-4">
                They scroll. They browse. They think <span className="italic">&ldquo;maybe later.&rdquo;</span>
                <br />
                They close the tab and forget.
              </p>

              <div className="bg-black/60 rounded-xl p-4 mb-4">
                <p className="text-fire-gold text-lg md:text-xl font-bold mb-2">
                  Guess what?
                </p>
                <p className="text-white text-xl md:text-2xl font-bold">
                  The ones who <span className="text-green-400">TAKE ACTION</span>...
                  <span className="text-fire-gold"> PROSPER.</span>
                </p>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Same information. Same opportunity. Different results.
                <br />
                The only difference? <span className="text-white font-bold">They clicked the button.</span>
              </p>

              <div className="border-t border-fire-gold/30 pt-4">
                <p className="text-white text-lg font-bold mb-2">
                  Do you want to <span className="text-green-400">PROSPER</span>?
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Or stay <span className="text-gray-600">boring</span>?
                </p>

                <a
                  href={paymentLink}
                  className="inline-block bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white font-bold text-lg py-3 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/30 border-2 border-green-400"
                >
                  🚀 I CHOOSE TO PROSPER — $8.88
                </a>
              </div>
            </div>

            {/* ========== JOIN THE COMMUNITY ========== */}
            <div className="bg-gradient-to-br from-green-950/40 via-black to-green-950/20 border border-green-500/40 rounded-2xl p-5">
              <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-3">
                🛡️ More Than an Oracle
              </p>

              <h3 className="text-white text-lg font-bold text-center mb-3">
                Join the Privacy by Design Movement
              </h3>

              <p className="text-gray-300 text-sm text-center mb-4">
                Every purchase supports building a future where <span className="text-green-400 font-bold">your data stays YOURS</span>.
                We&apos;re proving AI can be personal WITHOUT being invasive.
              </p>

              <div className="bg-black/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center gap-4 text-center">
                  <div>
                    <p className="text-green-400 text-2xl font-bold">0</p>
                    <p className="text-gray-500 text-xs">Data Points<br/>Stored</p>
                  </div>
                  <div className="text-gray-600 text-2xl">|</div>
                  <div>
                    <p className="text-green-400 text-2xl font-bold">100%</p>
                    <p className="text-gray-500 text-xs">Privacy<br/>Guaranteed</p>
                  </div>
                  <div className="text-gray-600 text-2xl">|</div>
                  <div>
                    <p className="text-fire-gold text-2xl font-bold">1st</p>
                    <p className="text-gray-500 text-xs">Privacy-First<br/>AI Oracle</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-xs text-center">
                Your $8.88 says: <span className="text-green-400">&ldquo;I believe in a better way.&rdquo;</span>
              </p>
            </div>

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

            {/* ========== THE FORGING EXPERIENCE TEASER ========== */}
            <div className="bg-gradient-to-b from-orange-950/50 via-black to-red-950/50 border-2 border-orange-500/50 rounded-2xl p-5 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/10 to-orange-500/5 animate-pulse"></div>

              <div className="relative z-10">
                <p className="text-orange-400 text-xs uppercase tracking-widest text-center mb-2">
                  ✨ The Forging Experience ✨
                </p>
                <p className="text-white text-lg font-bold text-center mb-4">
                  Watch Your Oracle Come to Life
                </p>

                {/* Bouncing Pony Preview */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    {/* Fire frame */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/loading/fire-frame.png"
                      alt="Fire Frame"
                      className="absolute inset-0 w-full h-full animate-spin"
                      style={{ animationDuration: '20s' }}
                    />
                    {/* Bouncing horse */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/loading/fire-horse-bouncing-3.png"
                      alt="Fire Horse"
                      className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-contain animate-bounce"
                      style={{ animationDuration: '2s' }}
                    />
                  </div>
                </div>

                {/* Mystical Messages Preview */}
                <div className="bg-black/60 rounded-xl p-4 mb-4">
                  <p className="text-gray-400 text-xs text-center mb-2">Experience messages like:</p>
                  <div className="space-y-2 text-center">
                    <p className="text-orange-300 text-sm italic">&ldquo;Forging your destiny in fire...&rdquo;</p>
                    <p className="text-red-300 text-sm italic">&ldquo;The Oracle consults the stars...&rdquo;</p>
                    <p className="text-yellow-300 text-sm italic">&ldquo;Your talisman crystallizes...&rdquo;</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm text-center mb-3">
                  30-60 seconds of <span className="text-orange-400 font-bold">pure magic</span> as Google Gemini 3 Pro
                  creates your one-of-a-kind talisman in real-time.
                </p>

                <p className="text-gray-500 text-xs text-center">
                  🔥 An experience you&apos;ll want to watch (and share!)
                </p>
              </div>
            </div>

            {/* ========== AI TALISMAN - REAL EXAMPLE ========== */}
            <div className="bg-gradient-to-b from-purple-950/50 to-black border-2 border-purple-500/50 rounded-2xl p-5">
              <p className="text-purple-400 text-xs uppercase tracking-widest text-center mb-2">
                🎨 One-of-a-Kind AI Artwork
              </p>
              <p className="text-white text-lg font-bold text-center mb-4">
                This is What You&apos;ll Get
              </p>

              {/* Real Example - Clear with watermark */}
              <div className="relative rounded-xl overflow-hidden border-2 border-fire-gold/50 mb-4">
                {/* Show actual example talisman - CLEAR to show quality */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/examples/dragon.png"
                  alt="Example Fire Dragon Talisman"
                  className="w-full h-auto"
                />
                {/* Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-white/30 text-3xl md:text-4xl font-bold tracking-wider rotate-[-20deg] select-none">
                    EXAMPLE
                  </p>
                </div>
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4">
                  <p className="text-fire-gold font-bold text-center">
                    🐉 Fire Dragon × Fire Horse 2026
                  </p>
                  <p className="text-gray-400 text-xs text-center">
                    Actual AI-generated talisman (yours will be unique)
                  </p>
                </div>
              </div>

              {/* What makes it special */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-purple-900/30 rounded-lg p-2">
                  <p className="text-purple-400 text-lg">🤖</p>
                  <p className="text-white text-xs font-bold">Gemini 3 Pro</p>
                  <p className="text-gray-500 text-[10px]">Latest AI</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-2">
                  <p className="text-purple-400 text-lg">🎨</p>
                  <p className="text-white text-xs font-bold">Unique Art</p>
                  <p className="text-gray-500 text-[10px]">No two alike</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-2">
                  <p className="text-purple-400 text-lg">📜</p>
                  <p className="text-white text-xs font-bold">Prophecy</p>
                  <p className="text-gray-500 text-[10px]">Personalized</p>
                </div>
              </div>

              <div className="bg-fire-gold/10 border border-fire-gold/30 rounded-lg p-3 text-center">
                <p className="text-white text-sm mb-2">
                  Your <span className="text-fire-gold font-bold">{result.element} {result.animal}</span> talisman is waiting to be created
                </p>
                <a
                  href={paymentLink}
                  className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-2 px-6 rounded-lg transition-all hover:scale-105"
                >
                  CREATE MY TALISMAN — $8.88
                </a>
              </div>
            </div>

            {/* ========== FREE vs PAID COMPARISON ========== */}
            <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-700 rounded-2xl p-5">
              <p className="text-white text-sm font-bold text-center mb-4">
                FREE Preview vs Complete Oracle
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* FREE Column */}
                <div className="space-y-2">
                  <p className="text-green-400 font-bold text-center mb-2">✓ FREE</p>
                  <div className="bg-green-900/20 rounded p-2 text-gray-300">Zodiac revealed</div>
                  <div className="bg-green-900/20 rounded p-2 text-gray-300">2 famous people</div>
                  <div className="bg-green-900/20 rounded p-2 text-gray-300">Forecast preview</div>
                  <div className="bg-green-900/20 rounded p-2 text-gray-300">Card preview</div>
                </div>

                {/* PAID Column */}
                <div className="space-y-2">
                  <p className="text-fire-gold font-bold text-center mb-2">🔥 $8.88</p>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">HD Zodiac Card ↓</div>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">All celebrities</div>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">Full Forecast</div>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">AI Talisman Art</div>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">Lucky #s / Motto</div>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">Edition Certificate</div>
                  <div className="bg-fire-gold/20 rounded p-2 text-fire-gold">#X of 888</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <a
                  href={paymentLink}
                  className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-sm py-2 px-6 rounded-xl hover:scale-105 transition-all"
                >
                  UPGRADE TO COMPLETE — $8.88
                </a>
              </div>
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
