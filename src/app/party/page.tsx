'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PASS_CONFIGS, PassType } from '@/types/party';

export default function PartyLandingPage() {
  const [selectedPass, setSelectedPass] = useState<PassType>('weekend');
  const [partyCode, setPartyCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleHostClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/party/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass_type: selectedPass }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partyCode.length === 6) {
      window.location.href = `/party/join?code=${partyCode.toUpperCase()}`;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/Fire-Horse-2026-Chart-v2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-sm text-gray-400 hover:text-white">
              ← Back to Red Horse Oracle
            </span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-red-500">Fire Horse</span>{' '}
            <span className="text-yellow-400">Trivia</span>
          </h1>

          <p className="text-lg text-gray-300">
            Multiplayer online trivia for your Chinese New Year (CNY) 2026 Party!
          </p>

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="bg-red-900/50 px-3 py-1 rounded-full">
              🔥 400 Questions
            </span>
            <span className="bg-yellow-900/50 px-3 py-1 rounded-full">
              🐴 Zodiac Lore
            </span>
            <span className="bg-blue-900/50 px-3 py-1 rounded-full">
              👥 Up to 20 Players
            </span>
          </div>
        </div>

        {/* Two Paths: Host or Join */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* HOST A PARTY */}
          <div className="bg-gradient-to-b from-red-900/30 to-black border-2 border-red-500 rounded-2xl p-6">
            <div className="text-center mb-6">
              <span className="text-5xl">🎉</span>
              <h2 className="text-2xl font-bold mt-2 text-red-400">
                HOST A PARTY
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Purchase a pass, get your party code
              </p>
            </div>

            {/* Step 1: Pass Selection */}
            <div className="mb-2">
              <span className="text-xs font-bold text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                STEP 1
              </span>
              <span className="text-xs text-gray-400 ml-2">Select your pass</span>
            </div>
            <div className="space-y-3 mb-6">
              {(Object.keys(PASS_CONFIGS) as PassType[]).map((type) => {
                const pass = PASS_CONFIGS[type];
                const isSelected = selectedPass === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedPass(type)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-900/30 ring-2 ring-yellow-400/50'
                        : 'border-gray-700 hover:border-gray-500 bg-black/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {/* Selection indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-gray-500'
                        }`}>
                          {isSelected && <span className="text-black text-xs">✓</span>}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{pass.name}</div>
                          <div className="text-sm text-gray-400">
                            {pass.description}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          isSelected ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        {pass.priceDisplay}
                      </div>
                    </div>
                    {type === 'weekend' && (
                      <span className="inline-block mt-2 ml-8 text-xs bg-green-600 px-2 py-0.5 rounded">
                        MOST POPULAR
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step 2: Purchase */}
            <div className="mb-2">
              <span className="text-xs font-bold text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                STEP 2
              </span>
              <span className="text-xs text-gray-400 ml-2">Complete purchase</span>
            </div>
            <button
              onClick={handleHostClick}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg hover:shadow-red-500/30'
              }`}
            >
              {isLoading ? 'Starting checkout...' : `HOST MY PARTY — ${PASS_CONFIGS[selectedPass].priceDisplay} →`}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              Powered by Stripe • Secure checkout
            </p>
          </div>

          {/* JOIN A PARTY */}
          <div className="bg-gradient-to-b from-blue-900/30 to-black border-2 border-blue-500 rounded-2xl p-6">
            <div className="text-center mb-6">
              <span className="text-5xl">🎮</span>
              <h2 className="text-2xl font-bold mt-2 text-blue-400">
                JOIN A PARTY
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Free to play! Just enter the party code
              </p>
            </div>

            {!showJoinForm ? (
              <div className="flex flex-col items-center justify-center h-[280px]">
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  ENTER PARTY CODE →
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  No account needed • No payment required
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Party Code (6 characters)
                  </label>
                  <input
                    type="text"
                    value={partyCode}
                    onChange={(e) =>
                      setPartyCode(e.target.value.toUpperCase().slice(0, 6))
                    }
                    placeholder="FIRE88"
                    className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-xl text-center text-3xl font-mono tracking-widest focus:border-blue-400 focus:outline-none"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={partyCode.length !== 6}
                  className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                    partyCode.length === 6
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg hover:shadow-blue-500/30'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  JOIN PARTY →
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowJoinForm(false);
                    setPartyCode('');
                  }}
                  className="w-full py-2 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900/50 rounded-2xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎟️</div>
              <div className="font-bold">1. Host Buys Pass</div>
              <div className="text-sm text-gray-400">
                Choose Day, Weekend, or Festival
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <div className="font-bold">2. Share Code</div>
              <div className="text-sm text-gray-400">
                Guests join with 6-digit code
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏁</div>
              <div className="font-bold">3. Host Starts</div>
              <div className="text-sm text-gray-400">
                Everyone answers on their phone
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-bold">4. Compete!</div>
              <div className="text-sm text-gray-400">
                Fastest correct answers win!
              </div>
            </div>
          </div>
        </div>

        {/* Sample Questions */}
        <div className="bg-gray-900/50 rounded-2xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Sample Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 mb-1">
                Fire Horse & Great Race
              </div>
              <div className="font-medium">
                What element is the Horse in 2026?
              </div>
              <div className="text-yellow-400 text-sm mt-2">Answer: Fire 🔥</div>
            </div>

            <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 mb-1">
                CNY Traditions & Food
              </div>
              <div className="font-medium">
                Which food is avoided during CNY because it resembles paper money burned for the dead?
              </div>
              <div className="text-yellow-400 text-sm mt-2">
                Answer: Tofu 🥢
              </div>
            </div>

            <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Pop Culture</div>
              <div className="font-medium">
                Which Fire Horse celebrity starred in &quot;Catwoman&quot; (2004)?
              </div>
              <div className="text-yellow-400 text-sm mt-2">
                Answer: Halle Berry 🎬
              </div>
            </div>

            <div className="bg-black/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 mb-1">
                Zodiac Logic Puzzles
              </div>
              <div className="font-medium">
                If a Fire Horse year was 1966, when is the NEXT Fire Horse year?
              </div>
              <div className="text-yellow-400 text-sm mt-2">
                Answer: 2026 🐴
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            400 questions across 16 categories!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold">Real-Time Sync</div>
            <div className="text-sm text-gray-400">
              All players see questions simultaneously
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-bold">Speed Bonuses</div>
            <div className="text-sm text-gray-400">
              Faster answers = more points
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🐲</div>
            <div className="font-bold">Zodiac Leaderboards</div>
            <div className="text-sm text-gray-400">
              See how your sign ranks!
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pb-8">
          <p className="mb-2">
            Part of{' '}
            <Link href="/" className="text-red-400 hover:underline">
              Red Horse Oracle
            </Link>{' '}
            • Year of the Fire Horse 2026
          </p>
          <p>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            {' • '}
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
