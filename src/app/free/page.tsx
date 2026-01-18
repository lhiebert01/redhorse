'use client';

import { useState } from 'react';
import { getChineseZodiac } from '@/lib/zodiac/calculator';
import {
  ZodiacAnimal,
  ZodiacElement,
  ZODIAC_CHINESE,
  ELEMENT_CHINESE,
} from '@/constants/zodiac-data';
import { PRODUCT_MODES } from '@/constants/modes';
import { EDITION_CONFIG, getDaysRemaining } from '@/constants/editions';
import {
  getForecast,
  getFireHorseRelationDescription,
  ZodiacElement as ForecastElement,
  ZodiacAnimalType,
} from '@/constants/zodiac-forecasts';

export default function FreeReadingPage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    animal: ZodiacAnimal;
    element: ZodiacElement;
  } | null>(null);
  const [showPriceExplainer, setShowPriceExplainer] = useState(false);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const zodiac = getChineseZodiac(birthDate);
    if (zodiac) {
      setResult({
        animal: zodiac.animal as ZodiacAnimal,
        element: zodiac.element as ZodiacElement,
      });

      // Track free oracle generation (non-blocking, fire-and-forget)
      // No PII sent - only zodiac sign and element
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zodiacSign: zodiac.animal,
          zodiacElement: zodiac.element,
          type: 'free'
        })
      }).catch(() => {
        // Silently ignore errors - analytics shouldn't affect user experience
      });
    }
  };

  // Get the accurate forecast for this specific element + animal combination
  const forecast = result
    ? getForecast(result.element as ForecastElement, result.animal as ZodiacAnimalType)
    : null;

  const getTaglineColor = (tagline: string) => {
    if (tagline.includes('Ally')) return 'text-green-400';
    if (tagline.includes('Catalyst')) return 'text-fire-gold';
    if (tagline.includes('Harm')) return 'text-red-400';
    return 'text-gray-300';
  };

  const getTaglineBg = (tagline: string) => {
    if (tagline.includes('Ally')) return 'bg-green-900/30 border-green-700/50';
    if (tagline.includes('Catalyst')) return 'bg-yellow-900/30 border-yellow-700/50';
    if (tagline.includes('Harm')) return 'bg-red-900/30 border-red-700/50';
    return 'bg-gray-900/30 border-gray-700/50';
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
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">🛡️</span>
                  <h2 className="text-green-400 text-xl font-bold">100% PII-FREE</h2>
                </div>
                <p className="text-gray-400 text-xs">(No Personally Identifiable Information Collected)</p>
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
            {/* BIG HERO TITLE - Make it OBVIOUS this is their FREE Oracle */}
            <div className="bg-gradient-to-r from-fire-gold via-yellow-500 to-fire-gold rounded-2xl p-1">
              <div className="bg-black rounded-xl p-6 text-center">
                <p className="text-fire-gold text-xs uppercase tracking-[0.25em] mb-2">
                  Your Personalized Reading is Ready
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  HERE IS YOUR <span className="text-fire-gold">FREE</span> ORACLE
                  <br />
                  <span className="text-lg md:text-xl text-gray-300">for the Year of the Fire Horse 2026</span>
                </h1>
                <div className="mt-4 inline-block bg-fire-gold/20 border-2 border-fire-gold rounded-xl px-6 py-3">
                  <p className="text-fire-gold text-lg font-bold">
                    You are a {result.element} {result.animal}
                  </p>
                  <p className="text-3xl mt-1">
                    {ELEMENT_CHINESE[result.element]}{ZODIAC_CHINESE[result.animal]}
                  </p>
                </div>
              </div>
            </div>

            {/* ========== SHARE CTA - Right at the top ========== */}
            <div className="bg-gradient-to-r from-purple-950 via-black to-purple-950 border-2 border-purple-500/70 rounded-2xl p-5 text-center">
              {/* Urgency CTA */}
              <div className="mb-4">
                <p className="text-white text-lg font-bold mb-1">
                  🔥 Don&apos;t Miss Out on the <span className="text-fire-gold">Limited Edition Oracle</span> for 2026!
                </p>
                <a
                  href={paymentLink}
                  className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-base py-3 px-6 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-yellow-500/30 border-2 border-yellow-400"
                >
                  GET YOURS NOW — $8.88
                </a>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-purple-700/50"></div>
                <span className="text-purple-400 text-xs uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-purple-700/50"></div>
              </div>

              {/* Share Section */}
              <p className="text-purple-300 text-base font-semibold mb-1">
                📣 Share This — Please!
              </p>
              <p className="text-red-400 text-sm font-bold mb-4">
                Supplies won&apos;t last. Only 888 per zodiac sign.
              </p>

              {/* Share Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=I%20just%20discovered%20I%27m%20a%20${result.element}%20${result.animal}%20in%20the%20Year%20of%20the%20Fire%20Horse%202026!%20%F0%9F%94%A5%F0%9F%90%B4%20Find%20YOUR%20zodiac%20destiny%3A&url=https://redhorse-omega.vercel.app/free`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black hover:bg-gray-900 border border-gray-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-lg">𝕏</span>
                  <span className="text-sm">Share on X</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://redhorse-omega.vercel.app/free&quote=I%27m%20a%20${result.element}%20${result.animal}%20in%20the%20Year%20of%20the%20Fire%20Horse%202026!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-lg">f</span>
                  <span className="text-sm">Share on Facebook</span>
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `I'm a ${result.element} ${result.animal} - Fire Horse 2026`,
                        text: `I just discovered my Chinese zodiac destiny for 2026! I'm a ${result.element} ${result.animal}. Find YOUR zodiac sign:`,
                        url: 'https://redhorse-omega.vercel.app/free'
                      });
                    } else {
                      navigator.clipboard.writeText('https://redhorse-omega.vercel.app/free');
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-lg">📤</span>
                  <span className="text-sm">Share Link</span>
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-3">
                Help a friend discover their 2026 destiny before it&apos;s too late
              </p>
            </div>

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

            {/* ========== YOUR FREE ORACLE CARD - THE MAIN EVENT ========== */}
            {forecast && (
              <div className="relative">
                {/* Animated glowing border effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-3xl blur-md opacity-80 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-fire-gold to-green-500 rounded-3xl opacity-90"></div>

                <div className="relative bg-gradient-to-b from-green-950 via-black to-green-950 border-4 border-green-400 rounded-2xl p-6 shadow-2xl shadow-green-500/30">
                  {/* FREE Badge - Larger and more prominent */}
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 via-green-400 to-green-500 text-black font-black text-base px-8 py-2.5 rounded-full border-3 border-green-200 shadow-xl shadow-green-500/50">
                      ★ YOUR FREE ORACLE ★
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 text-green-500 text-2xl opacity-50">✦</div>
                  <div className="absolute top-2 right-2 text-green-500 text-2xl opacity-50">✦</div>
                  <div className="absolute bottom-2 left-2 text-green-500 text-2xl opacity-50">✦</div>
                  <div className="absolute bottom-2 right-2 text-green-500 text-2xl opacity-50">✦</div>

                  <div className="pt-6 space-y-5">
                    {/* Section Header */}
                    <div className="text-center">
                      <p className="text-green-400 text-xs uppercase tracking-[0.25em] mb-1">
                        2026 Fire Horse Forecast
                      </p>
                      <h2 className="text-xl md:text-2xl font-bold text-white">
                        Your {result.element} {result.animal} × Fire Horse Prophecy
                      </h2>
                    </div>

                    {/* Large Zodiac Badge Preview - Watermarked */}
                    <div className="relative mx-auto max-w-xs">
                      <div className="relative rounded-xl overflow-hidden border-2 border-green-500/50 shadow-lg shadow-green-500/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/assets/zodiac-badges/${result.element.toLowerCase()}-${result.animal.toLowerCase()}.jpeg`}
                          alt={`${result.element} ${result.animal} Zodiac Card`}
                          className="w-full h-auto opacity-80 blur-[1px]"
                        />
                        {/* Watermark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 flex flex-col items-center justify-center">
                          <p className="text-white/80 text-lg font-bold tracking-wider">PREVIEW</p>
                          <p className="text-green-400/90 text-xs mt-1">Full resolution with purchase</p>
                        </div>
                        {/* FREE watermark diagonal */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <p className="text-white/20 text-5xl font-black rotate-[-25deg] tracking-widest">
                            FREE PREVIEW
                          </p>
                        </div>
                      </div>
                      <p className="text-center text-green-400 text-xs mt-2">
                        Your {result.element} {result.animal} Digital Art Card
                      </p>
                    </div>

                    {/* Tagline with colored background */}
                    <div className={`${getTaglineBg(forecast.tagline)} border-2 rounded-xl p-4`}>
                      <p className={`text-xl font-bold text-center mb-2 ${getTaglineColor(forecast.tagline)}`}>
                        {forecast.tagline}
                      </p>
                      <p className="text-gray-300 text-sm text-center">
                        {getFireHorseRelationDescription(forecast.tagline)}
                      </p>
                    </div>

                    {/* Characteristics */}
                    <div className="bg-black/40 border border-green-700/40 rounded-xl p-4">
                      <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-2">
                        {result.element} {result.animal} Characteristics
                      </p>
                      <p className="text-gray-200 text-sm leading-relaxed text-center">
                        {forecast.characteristics}
                      </p>
                    </div>

                    {/* The FREE Forecast Content */}
                    <div className="bg-black/60 border-2 border-green-600/50 rounded-xl p-5">
                      <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-3">
                        Your 2026 Forecast Preview
                      </p>
                      <p className="text-white text-lg leading-relaxed mb-3">
                        {forecast.forecast.split('.').slice(0, 2).join('.') + '.'}
                      </p>
                      <p className="text-green-500 text-xs text-center font-semibold">
                        [Preview - 2 of {forecast.forecast.split('.').length - 1} sentences shown]
                      </p>
                    </div>

                    {/* Oracle Wisdom Quote */}
                    <div className="bg-fire-gold/10 border border-fire-gold/40 rounded-xl p-4">
                      <p className="text-fire-gold text-lg italic text-center">
                        &ldquo;{forecast.oracleWisdom}&rdquo;
                      </p>
                      <p className="text-gray-500 text-xs text-center mt-2">— Oracle Wisdom for {result.element} {result.animal}</p>
                    </div>

                    {/* Core Strengths in the FREE card */}
                    <div>
                      <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-3">
                        Your {result.element} {result.animal} Core Strengths
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {forecast.coreStrengths.map((strength) => (
                          <span
                            key={strength}
                            className="bg-green-900/50 border border-green-500/50 text-green-300 text-sm px-4 py-1.5 rounded-full font-medium"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* This is what you got FREE label */}
                  <div className="border-t-2 border-green-600/50 mt-5 pt-4 text-center">
                    <p className="text-green-300 text-base font-bold">
                      ✓ This is your FREE {result.element} {result.animal} Oracle for 2026
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Scroll down to unlock the complete authenticated oracle
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ========== IMMEDIATE CTA - Want the Full Oracle? ========== */}
            <div className="bg-gradient-to-r from-red-950 via-black to-red-950 border-2 border-fire-gold rounded-2xl p-6 text-center">
              <p className="text-fire-gold text-xs uppercase tracking-[0.2em] mb-2">
                Ready for More?
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Would You Like an<br />
                <span className="text-fire-gold">Authenticated Limited Edition</span><br />
                Complete Oracle?
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Your FREE preview shows just the beginning. The complete {result.element} {result.animal} × Fire Horse Oracle includes:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4 max-w-sm mx-auto">
                <div className="bg-black/50 border border-fire-gold/30 rounded-lg p-2">
                  <span className="text-lg">🎲</span>
                  <p className="text-fire-gold text-xs font-semibold">6 Lucky Numbers</p>
                </div>
                <div className="bg-black/50 border border-fire-gold/30 rounded-lg p-2">
                  <span className="text-lg">⚔️</span>
                  <p className="text-fire-gold text-xs font-semibold">Power Motto</p>
                </div>
                <div className="bg-black/50 border border-fire-gold/30 rounded-lg p-2">
                  <span className="text-lg">❤️</span>
                  <p className="text-fire-gold text-xs font-semibold">Love Decree</p>
                </div>
                <div className="bg-black/50 border border-fire-gold/30 rounded-lg p-2">
                  <span className="text-lg">🛡️</span>
                  <p className="text-fire-gold text-xs font-semibold">Shield Mantra</p>
                </div>
              </div>
              <p className="text-white text-sm font-semibold mb-4">
                + AI-Generated Talisman Art + Full Prophecy + Zodiac Card Download
              </p>
              <a
                href={paymentLink}
                className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-lg py-4 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-yellow-500/30 border-2 border-yellow-400"
              >
                🔥 YES! GET MY COMPLETE ORACLE — $8.88
              </a>
              <p className="text-gray-500 text-xs mt-3">
                One-time payment • Instant delivery • Privacy by design
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
            <div className="bg-gradient-to-b from-red-950/80 via-red-900/60 to-black border-2 border-red-500/70 rounded-2xl p-6 text-center space-y-5">
              {/* Urgency Warning - Time-based */}
              <div className="bg-red-900/80 border border-red-500 rounded-lg px-4 py-2 inline-block">
                <p className="text-red-200 text-xs font-bold uppercase tracking-wider">
                  ⏰ {result.element.toUpperCase()} {result.animal.toUpperCase()} EDITION CLOSES {EDITION_CONFIG[result.animal].closingDateDisplay.toUpperCase()} ⏰
                </p>
              </div>

              <div>
                <p className="text-red-400 text-sm uppercase tracking-widest mb-3">
                  The Fire Horse Demands Courage
                </p>
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-relaxed">
                  Will YOU Claim Your Authentic
                  <br />
                  <span className="text-fire-gold">{result.element} {result.animal}</span> × Fire Horse Oracle?
                </h3>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                Only <span className="text-fire-gold font-bold">888</span> of each oracle type will EVER be minted for {result.element} {result.animal}.
              </p>
              <p className="text-red-400 font-semibold">
                Each one numbered. Each one unique. Each one YOURS.
              </p>

              {/* Countdown Context */}
              <div className="bg-black/70 border border-fire-gold/50 rounded-xl p-4 space-y-2">
                <p className="text-fire-gold text-sm font-bold">
                  🔥 {result.element} {result.animal} Edition Closes: {EDITION_CONFIG[result.animal].closingDateDisplay}
                </p>
                <p className="text-gray-400 text-sm">
                  After this date, <span className="text-red-400 font-bold">NO MORE {result.animal} Oracles</span> will be minted for Fire Horse 2026.
                </p>
                <p className="text-gray-500 text-xs">
                  Next Fire Horse year: <span className="text-red-400">2086</span> — Will you even be alive?
                </p>
              </div>

              <p className="text-white text-base font-semibold italic">
                &ldquo;Fortune favors the bold. The Fire Horse respects COURAGE.&rdquo;
              </p>

              <div className="bg-black/50 border border-gray-700 rounded-xl p-4 space-y-2">
                <p className="text-gray-400 text-xs uppercase tracking-widest">The Question Is:</p>
                <p className="text-white text-xl font-bold leading-relaxed">
                  Are you someone who <span className="text-red-400">ACTS</span>?
                </p>
                <p className="text-white text-xl font-bold">
                  Or someone who <span className="text-gray-500">lets opportunity pass?</span>
                </p>
              </div>

              <p className="text-white text-sm font-semibold leading-relaxed">
                Only {EDITION_CONFIG[result.animal].totalSlots} of each mode (Wealth, Power, Love, Shield) will EVER be minted for {result.element} {result.animal}.
              </p>
              <p className="text-fire-gold text-sm font-bold">
                Will you claim yours?
              </p>
            </div>

            {/* Sample Talisman Preview */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-red-900/20 border border-fire-gold/50 rounded-2xl p-6">
              <p className="text-fire-gold text-base uppercase tracking-widest mb-6 text-center font-semibold">
                Your {result.element} {result.animal} × Fire Horse Oracle Awaits
              </p>

              <div className="relative w-full max-w-sm mx-auto mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/examples/${result.animal.toLowerCase()}.png`}
                  alt={`${result.element} ${result.animal} Oracle Example`}
                  className="w-full h-auto rounded-xl border border-fire-gold/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl flex items-end justify-center pb-6">
                  <p className="text-white text-sm font-semibold">
                    Sample {result.element} {result.animal} × Fire Horse Oracle
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-center text-base mb-8 leading-relaxed">
                Your unique AI-generated {result.element} {result.animal} talisman
                <br />
                for the Year of the Fire Horse
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

        {/* Footer */}
        <footer className="text-center text-sm text-white font-bold mt-8 pb-8">
          <p>
            Strictly for entertainment purposes only. AI-generated artwork.
            <br />
            Not financial, legal, or gambling advice.
          </p>
          <p className="mt-2">© 2026 PIGENAI LLC. All Rights Reserved.</p>
          <p className="text-fire-gold text-xs mt-1">
            Red Horse Oracle™ • Patent Pending • 18+
          </p>
        </footer>
      </div>
    </main>
  );
}
