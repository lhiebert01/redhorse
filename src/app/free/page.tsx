'use client';

import { useState } from 'react';
import { calculateChineseZodiac } from '@/lib/zodiac/calculator';
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
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const zodiac = calculateChineseZodiac(birthDate);
    if (zodiac) {
      setResult({
        animal: zodiac.animal as ZodiacAnimal,
        element: zodiac.element as ZodiacElement,
      });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !result) return;

    // Store email in Supabase (simple insert)
    try {
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          zodiac_sign: result.animal,
          zodiac_element: result.element,
        }),
      });
      if (response.ok) {
        setEmailSubmitted(true);
      }
    } catch (error) {
      console.error('Email capture error:', error);
      setEmailSubmitted(true); // Still show success to user
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
          /* Birth Date Input Form */
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <label className="block text-fire-gold text-lg font-semibold mb-2">
                  Enter Your Birth Date
                </label>
                <p className="text-gray-400 text-sm mb-4">
                  Used only to calculate your zodiac sign - never stored
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

            {/* Sample Talisman Preview */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-red-900/20 border border-fire-gold/50 rounded-2xl p-6">
              <p className="text-fire-gold text-sm uppercase tracking-widest mb-3 text-center">
                Your Personalized Oracle Awaits
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
                className="block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-xl py-4 rounded-xl text-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-yellow-500/30"
              >
                GET MY ORACLE - $8.88
              </a>
              <p className="text-center text-gray-400 text-xs mt-2">
                One-time payment. Instant delivery. Privacy by design.
              </p>
            </div>

            {/* Email Capture for Non-Converters */}
            {!emailSubmitted ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <p className="text-gray-300 text-center mb-4">
                  Not ready yet? Save your reading for later.
                </p>
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-fire-gold focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-fire-gold text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Save
                  </button>
                </form>
                <p className="text-gray-500 text-xs text-center mt-2">
                  We&apos;ll send you a reminder before Chinese New Year.
                </p>
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-6 text-center">
                <p className="text-green-400 font-semibold">
                  Saved! We&apos;ll remind you before Chinese New Year 2026.
                </p>
              </div>
            )}

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
