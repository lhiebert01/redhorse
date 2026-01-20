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
import { getZodiacFunFacts, getElementColors } from '@/constants/zodiac-fun-facts';

export default function FreeReadingPage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    animal: ZodiacAnimal;
    element: ZodiacElement;
  } | null>(null);
  const [showPriceExplainer, setShowPriceExplainer] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared'>('idle');
  const [showShareModal, setShowShareModal] = useState(false);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  // Get fun facts for the result
  const funFacts = result ? getZodiacFunFacts(result.element, result.animal) : null;
  const elementColors = result ? getElementColors(result.element) : null;

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

  // Generate viral share content for social media
  const generateShareContent = () => {
    if (!result || !funFacts || !forecast) return '';

    // Get one celebrity with description
    const celeb = funFacts.famousPeople[0];

    // Create a concise, viral share text
    const shareText = `🔥 I just discovered I'm a ${result.element} ${result.animal}! ${funFacts.emoji}

✨ My 2026 Mantra: "${funFacts.mantra}"

💡 Fun Fact: ${funFacts.funFact.split('.')[0]}.

⭐ Famous ${result.element} ${result.animal}: ${celeb.name} (${celeb.description})

🐴 2026 is the Year of the Fire Horse — only happens once every 60 years!

👉 Get YOUR FREE Oracle: redhorseoracle.com/free

#FireHorse2026 #ChineseZodiac #${result.animal}`;

    return shareText;
  };

  // Copy share text to clipboard
  const handleCopyShareText = async () => {
    const text = generateShareContent();

    try {
      await navigator.clipboard.writeText(text);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 5000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 5000);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-950 to-black py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-400 text-2xl md:text-3xl uppercase tracking-widest mb-3 font-bold">
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
            {/* ========== CELEBRITY QUOTE BANNER - TOP OF PAGE ========== */}
            {funFacts && elementColors && (
              <div className={`relative overflow-hidden rounded-2xl border-2 ${elementColors.border}`}>
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${elementColors.gradient} opacity-30`}></div>
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative p-6 text-center">
                  {/* Decorative corners */}
                  <div className="absolute top-3 left-3 text-3xl opacity-30">✦</div>
                  <div className="absolute top-3 right-3 text-3xl opacity-30">✦</div>
                  <div className="absolute bottom-3 left-3 text-3xl opacity-30">✦</div>
                  <div className="absolute bottom-3 right-3 text-3xl opacity-30">✦</div>

                  {/* Quote marks with element color */}
                  <div className={`text-6xl mb-2 ${elementColors.text} opacity-60 font-serif`}>&ldquo;</div>

                  {/* The Quote - Artistic Typography */}
                  <blockquote className="relative">
                    <p className={`text-2xl md:text-3xl font-black leading-relaxed mb-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`}>
                      {funFacts.quote}
                    </p>
                  </blockquote>

                  {/* Closing quote */}
                  <div className={`text-4xl ${elementColors.text} opacity-40 font-serif -mt-2`}>&rdquo;</div>

                  {/* Attribution Line with Description */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`h-px w-16 bg-gradient-to-r ${elementColors.gradient}`}></div>
                      <div className="text-center">
                        <p className={`${elementColors.text} font-bold text-xl`}>
                          — {funFacts.quoteAuthor}
                        </p>
                        <p className="text-gray-400 text-sm italic">
                          {funFacts.quoteAuthorDescription}
                        </p>
                      </div>
                      <div className={`h-px w-16 bg-gradient-to-r ${elementColors.gradient}`}></div>
                    </div>
                  </div>

                  {/* Celebrity Badge */}
                  <div className={`inline-block mt-4 bg-gradient-to-r ${elementColors.gradient} rounded-full px-5 py-2 shadow-lg`}>
                    <p className="text-black text-sm font-bold">
                      {funFacts.emoji} Famous {result.element} {result.animal} {funFacts.emoji}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

              {/* Share Section - Single Button to Open Modal */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-2xl p-5 mb-4">
                <p className="text-purple-300 text-lg font-bold mb-2 text-center">
                  📣 Share Your Zodiac Discovery!
                </p>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Get a ready-to-post message for your social media
                </p>

                {/* Big Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-purple-500/30 border-2 border-purple-400"
                >
                  📋 CREATE MY SHARE POST
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-3">
                Help a friend discover their 2026 destiny before it&apos;s too late
              </p>
            </div>

            {/* ========== SHARE MODAL ========== */}
            {showShareModal && funFacts && forecast && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-purple-950 via-black to-purple-950 border-2 border-purple-500 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/30">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📣</span>
                      <h3 className="text-purple-300 text-xl font-bold">Share Your Discovery!</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowShareModal(false);
                        setShareStatus('idle');
                      }}
                      className="text-gray-400 hover:text-white text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Instructions */}
                  <p className="text-gray-300 text-sm mb-4 text-center">
                    Copy this ready-to-post message, then paste it into X, LinkedIn, Facebook, or any social app!
                  </p>

                  {/* The Share Text - Visible Preview */}
                  <div className="bg-black/60 border-2 border-purple-700/50 rounded-xl p-4 mb-4 font-mono text-sm">
                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                      🔥 I just discovered I&apos;m a {result.element} {result.animal}! {funFacts.emoji}
                      {'\n\n'}
                      ✨ My 2026 Mantra: &ldquo;{funFacts.mantra}&rdquo;
                      {'\n\n'}
                      💡 Fun Fact: {funFacts.funFact.split('.')[0]}.
                      {'\n\n'}
                      ⭐ Famous {result.element} {result.animal}: {funFacts.famousPeople[0].name} ({funFacts.famousPeople[0].description})
                      {'\n\n'}
                      🐴 2026 is the Year of the Fire Horse — only happens once every 60 years!
                      {'\n\n'}
                      👉 Get YOUR FREE Oracle: redhorseoracle.com/free
                      {'\n\n'}
                      #FireHorse2026 #ChineseZodiac #{result.animal}
                    </p>
                  </div>

                  {/* Copy Status */}
                  {shareStatus === 'copied' && (
                    <div className="bg-green-900/50 border border-green-500 rounded-xl p-3 mb-4 animate-pulse">
                      <p className="text-green-300 text-base font-bold text-center">
                        ✅ COPIED! Now paste (Ctrl+V / Cmd+V) into your social app
                      </p>
                    </div>
                  )}

                  {/* Big Copy Button */}
                  <button
                    onClick={handleCopyShareText}
                    className={`w-full font-bold text-xl py-4 px-6 rounded-xl transition-all duration-200 shadow-xl border-2 ${
                      shareStatus === 'copied'
                        ? 'bg-green-600 border-green-400 text-white'
                        : 'bg-gradient-to-r from-fire-gold via-yellow-500 to-fire-gold border-yellow-400 text-black hover:scale-105 active:scale-95'
                    }`}
                  >
                    {shareStatus === 'copied' ? '✅ COPIED TO CLIPBOARD!' : '📋 COPY POST TO CLIPBOARD'}
                  </button>

                  {/* Quick Links */}
                  <div className="mt-4 pt-4 border-t border-purple-700/50">
                    <p className="text-gray-400 text-xs text-center mb-3">After copying, paste into:</p>
                    <div className="flex justify-center gap-3">
                      <a
                        href="https://twitter.com/compose/tweet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black hover:bg-gray-900 border border-gray-600 text-white font-bold text-sm py-2 px-4 rounded-lg transition-colors"
                      >
                        𝕏 Twitter
                      </a>
                      <a
                        href="https://www.linkedin.com/feed/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-sm py-2 px-4 rounded-lg transition-colors"
                      >
                        in LinkedIn
                      </a>
                      <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-sm py-2 px-4 rounded-lg transition-colors"
                      >
                        f Facebook
                      </a>
                    </div>
                  </div>

                  {/* Close */}
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setShareStatus('idle');
                    }}
                    className="mt-4 w-full text-gray-400 hover:text-white text-sm underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Zodiac Identity Card - Using digital card style consistently */}
            <div className="bg-gradient-to-br from-red-950/50 to-black border border-fire-gold/30 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                Your Chinese Zodiac
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-fire-gold shadow-lg shadow-fire-gold/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/zodiac-badges-free/${result.element.toLowerCase()}-${result.animal.toLowerCase()}.jpeg`}
                    alt={`${result.element} ${result.animal}`}
                    className="w-full h-full object-cover scale-125"
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

            {/* ========== COLORFUL FUN FACTS SECTION ========== */}
            {funFacts && elementColors && (
              <div className="space-y-4">
                {/* Section Header */}
                <div className="text-center">
                  <div className={`inline-block ${elementColors.bg} border-2 ${elementColors.border} rounded-full px-6 py-2 mb-2`}>
                    <p className={`${elementColors.text} text-lg font-bold uppercase tracking-wider`}>
                      {funFacts.emoji} {result.element} {result.animal} FUN FACTS {funFacts.emoji}
                    </p>
                  </div>
                </div>

                {/* Mantra Card - Big and Bold */}
                <div className={`relative overflow-hidden rounded-2xl border-2 ${elementColors.border}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${elementColors.gradient} opacity-10`}></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl">🧘</span>
                      <p className={`${elementColors.text} text-sm uppercase tracking-widest font-bold`}>
                        Your {result.element} {result.animal} Mantra
                      </p>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-white text-center leading-relaxed">
                      &ldquo;{funFacts.mantra}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Famous People Card - Grid of Celebrities with Descriptions */}
                <div className="bg-gradient-to-br from-yellow-950/40 to-black border-2 border-yellow-500/50 rounded-2xl p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl">⭐</span>
                    <p className="text-yellow-400 text-sm uppercase tracking-widest font-bold">
                      Famous {result.element} {result.animal}s
                    </p>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="space-y-3">
                    {funFacts.famousPeople.map((person, index) => (
                      <div
                        key={person.name}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl
                          ${index === 0 ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 border border-yellow-500/50' : ''}
                          ${index === 1 ? 'bg-gradient-to-r from-purple-600/20 to-purple-500/10 border border-purple-500/50' : ''}
                          ${index === 2 ? 'bg-gradient-to-r from-pink-600/20 to-pink-500/10 border border-pink-500/50' : ''}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                          ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                          ${index === 1 ? 'bg-purple-500 text-white' : ''}
                          ${index === 2 ? 'bg-pink-500 text-white' : ''}
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-lg ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-purple-400' : 'text-pink-400'}`}>
                            {person.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {person.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs text-center mt-4">
                    You share your {result.element} {result.animal} sign with these legends!
                  </p>
                </div>

                {/* Fun Fact Card - Interesting Info */}
                <div className="bg-gradient-to-br from-cyan-950/40 to-black border-2 border-cyan-500/50 rounded-2xl p-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl">💡</span>
                    <p className="text-cyan-400 text-sm uppercase tracking-widest font-bold">
                      Did You Know?
                    </p>
                  </div>
                  <p className="text-white text-base md:text-lg leading-relaxed text-center">
                    {funFacts.funFact}
                  </p>
                </div>

                {/* Years Born Card */}
                <div className="bg-gradient-to-br from-orange-950/40 to-black border-2 border-orange-500/50 rounded-2xl p-5">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xl">📅</span>
                    <p className="text-orange-400 text-sm uppercase tracking-widest font-bold">
                      {result.element} {result.animal} Years
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    {funFacts.years.map((year) => (
                      <div
                        key={year}
                        className="bg-orange-900/50 border border-orange-500/50 rounded-lg px-4 py-2"
                      >
                        <p className="text-orange-300 text-xl font-bold">{year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

                    {/* Zodiac Digital Art Card - Clear with light watermark */}
                    <div className="relative mx-auto max-w-sm">
                      <p className="text-center text-green-400 text-sm font-semibold mb-2">
                        🔒 Privacy by Design — Your {result.element} {result.animal}
                      </p>
                      <div className="relative rounded-xl overflow-hidden border-2 border-green-500/50 shadow-lg shadow-green-500/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/assets/zodiac-badges-free/${result.element.toLowerCase()}-${result.animal.toLowerCase()}.jpeg`}
                          alt={`${result.element} ${result.animal} Zodiac Card`}
                          className="w-full h-auto"
                        />
                        {/* Light watermark at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-2">
                          <p className="text-white/60 text-[10px] text-center tracking-wide">
                            Free Oracle from redhorseoracle.com
                          </p>
                        </div>
                      </div>
                      <p className="text-center text-gray-400 text-xs mt-2">
                        Your {result.element} {result.animal} Collectible Digital Art Card
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

                    {/* The FREE Forecast Content - Full forecast */}
                    <div className="bg-black/60 border-2 border-green-600/50 rounded-xl p-5">
                      <p className="text-green-400 text-xs uppercase tracking-widest text-center mb-3">
                        Your 2026 {result.element} {result.animal} Forecast
                      </p>
                      <p className="text-white text-base leading-relaxed mb-4">
                        {forecast.forecast}
                      </p>
                      <div className="bg-fire-gold/10 border border-fire-gold/30 rounded-lg p-3 mt-3">
                        <p className="text-fire-gold text-xs text-center font-semibold">
                          ✨ Want a more detailed, personalized reading?
                        </p>
                        <p className="text-gray-400 text-xs text-center mt-1">
                          Get your <span className="text-fire-gold">Authenticated Limited Edition Oracle</span> with one-of-a-kind AI-generated digital art featuring YOUR {result.element} {result.animal} with the Fire Horse.
                        </p>
                      </div>
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
                <p className="text-white text-base font-bold">
                  Next Fire Horse year: <span className="text-red-400">2086</span> — Will you even be alive?
                </p>
              </div>

              <p className="text-white text-base font-semibold italic">
                &ldquo;Fortune favors the bold. The Fire Horse respects COURAGE.&rdquo;
              </p>

              <div className="bg-black/50 border border-gray-700 rounded-xl p-4 space-y-2">
                <p className="text-white text-sm font-bold uppercase tracking-widest">THE QUESTION IS:</p>
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

            {/* Get Your Oracle - Visual Equation + CTA */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-red-900/20 border border-fire-gold/50 rounded-2xl p-6">
              <p className="text-fire-gold text-base uppercase tracking-widest mb-4 text-center font-semibold">
                Get Your {result.element} {result.animal} × Fire Horse Oracle
              </p>

              {/* Visual equation: Your Card + Fire Horse Card = Masterpiece */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                {/* User's Zodiac Card thumbnail - LARGER */}
                <div className="text-center">
                  <div className="relative w-36 rounded-xl overflow-hidden border-2 border-fire-gold/50 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/zodiac-badges-free/${result.element.toLowerCase()}-${result.animal.toLowerCase()}.jpeg`}
                      alt={`${result.element} ${result.animal}`}
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1.5">
                      <p className="text-white/70 text-[8px] text-center">redhorseoracle.com</p>
                    </div>
                  </div>
                  <p className="text-fire-gold text-xs mt-2 font-semibold">Your {result.animal}</p>
                </div>

                {/* Plus sign - LARGER */}
                <div className="text-fire-gold text-4xl font-bold">+</div>

                {/* Fire Horse Card thumbnail - LARGER */}
                <div className="text-center">
                  <div className="relative w-36 rounded-xl overflow-hidden border-2 border-red-500/50 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/zodiac-badges-free/fire-horse.jpeg"
                      alt="Fire Horse 2026"
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1.5">
                      <p className="text-white/70 text-[8px] text-center">redhorseoracle.com</p>
                    </div>
                  </div>
                  <p className="text-red-400 text-xs mt-2 font-semibold">Fire Horse 2026</p>
                </div>

                {/* Equals sign - LARGER */}
                <div className="text-fire-gold text-4xl font-bold">=</div>

                {/* Result - LARGER */}
                <div className="text-center">
                  <p className="text-white text-lg font-bold">Your Unique</p>
                  <p className="text-fire-gold text-2xl font-bold mb-3">Masterpiece</p>
                  <a
                    href="/examples"
                    className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold text-base py-2.5 px-6 rounded-xl transition-all hover:scale-105"
                  >
                    🎨 See Examples
                  </a>
                </div>
              </div>

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
