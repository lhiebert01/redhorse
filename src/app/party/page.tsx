'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PASS_CONFIGS, PassType } from '@/types/party';

// Filter pass types for different sections
const PARTY_PASS_TYPES: PassType[] = ['day', 'weekend', 'festival'];
const SOLO_PASS = PASS_CONFIGS['solo'];

// Super Bowl date: February 8, 2026
const SUPER_BOWL_YEAR = 2026;
const SUPER_BOWL_MONTH = 1; // February (0-indexed)
const SUPER_BOWL_DAY = 8;

function getDaysUntilSuperBowl(): number {
  const now = new Date();
  // Get today's date at midnight (ignore time)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Super Bowl date at midnight
  const superBowlDate = new Date(SUPER_BOWL_YEAR, SUPER_BOWL_MONTH, SUPER_BOWL_DAY);

  // Calculate difference in days
  const diffTime = superBowlDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays; // 0 = today, 1 = tomorrow, 3 = Feb 5 to Feb 8
}

function shouldShowSuperBowlBanner(): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Hide starting Feb 9, 2026 (day after Super Bowl)
  const hideDate = new Date(SUPER_BOWL_YEAR, SUPER_BOWL_MONTH, SUPER_BOWL_DAY + 1); // Feb 9
  return today < hideDate;
}

export default function PartyLandingPage() {
  const [selectedPass, setSelectedPass] = useState<PassType>('weekend');
  const [daysUntilSuperBowl, setDaysUntilSuperBowl] = useState<number>(getDaysUntilSuperBowl());
  const [showSuperBowlBanner, setShowSuperBowlBanner] = useState<boolean>(true);

  // Update countdown on mount and check if banner should show
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

  // Check for existing solo pass in localStorage
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('solo_pass_code');
      const savedExpires = localStorage.getItem('solo_pass_expires');
      if (savedCode && savedExpires) {
        const expiresAt = new Date(savedExpires);
        if (expiresAt > new Date()) {
          // Pass still valid - verify it's still active via API
          fetch(`/api/party/pass-by-code?code=${encodeURIComponent(savedCode)}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
              if (data && data.is_solo && data.games_remaining > 0 && new Date(data.expires_at) > new Date()) {
                setExistingSoloCode(savedCode);
              } else {
                // Pass exhausted or expired - clear localStorage
                localStorage.removeItem('solo_pass_code');
                localStorage.removeItem('solo_pass_expires');
              }
            })
            .catch(() => {
              // Network error - still show the button based on localStorage
              setExistingSoloCode(savedCode);
            });
        } else {
          // Expired - clean up
          localStorage.removeItem('solo_pass_code');
          localStorage.removeItem('solo_pass_expires');
        }
      }
    } catch {}
  }, []);

  const [partyCode, setPartyCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoloLoading, setIsSoloLoading] = useState(false);
  const [existingSoloCode, setExistingSoloCode] = useState<string | null>(null);

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

  const handleSoloClick = async () => {
    setIsSoloLoading(true);
    try {
      const response = await fetch('/api/party/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass_type: 'solo' }),
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
      setIsSoloLoading(false);
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

      {/* PARTY PROMO BANNER - Blue/Purple theme for distinction */}
      <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-sm border-b-2 border-cyan-400 shadow-lg shadow-purple-900/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Promo Text */}
          <p className="text-center text-white font-black text-2xl sm:text-3xl mb-3 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            🎉 FIRE HORSE TRIVIA — BE THE PARTY LEGEND! 🐴
          </p>

          {/* All Buttons on ONE ROW */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* BACK TO ORACLE */}
            <Link
              href="/"
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              ← ORACLE
            </Link>

            {/* GET YOUR ORACLE */}
            <Link
              href="/free"
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all duration-300 shadow-lg shadow-green-500/30 whitespace-nowrap"
            >
              🔮 GET ORACLE
            </Link>

            <span className="text-cyan-400/50 text-lg hidden sm:inline">|</span>

            {/* VIP PASS */}
            <Link
              href="/vip"
              className="bg-gradient-to-r from-yellow-500 to-fire-gold hover:from-yellow-400 hover:to-yellow-300 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all duration-300 shadow-lg shadow-yellow-500/30 whitespace-nowrap"
            >
              🎫 VIP PASS
            </Link>

            {/* PARTNER */}
            <Link
              href="/partner"
              className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all duration-300 shadow-lg shadow-pink-500/30 whitespace-nowrap"
            >
              🌟 PARTNER
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3 animate-pulse">
            🔥 2026 IS THE YEAR TO CELEBRATE! 🔥
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="text-red-500">Fire Horse</span>{' '}
            <span className="text-yellow-400">TRIVIA!</span>
          </h1>

          <p className="text-xl md:text-2xl text-white font-bold mb-2">
            DON&apos;T JUST WATCH — BE THE PARTY HOST! 🎉
          </p>

          <p className="text-lg text-fire-gold font-semibold">
            The Fire Horse demands ACTION. This is YOUR moment!
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm font-bold">
            <span className="bg-red-600/80 px-4 py-1.5 rounded-full text-white">
              🔥 400 Epic Questions
            </span>
            <span className="bg-yellow-600/80 px-4 py-1.5 rounded-full text-black">
              🐴 Zodiac Battles
            </span>
            <span className="bg-blue-600/80 px-4 py-1.5 rounded-full text-white">
              👥 2-20 Players
            </span>
            <span className="bg-purple-600/80 px-4 py-1.5 rounded-full text-white">
              🎯 Solo Mode
            </span>
          </div>

          {/* Privacy by Design - Subtle Tagline */}
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 text-xs text-green-400/80">
              <span>🔒</span>
              <span className="font-medium">FIRST | ONLY | BEST — Privacy by Design Chinese Zodiac Trivia</span>
            </span>
          </div>
        </div>

        {/* 🏈 SUPER BOWL TIE-IN BANNER - Auto-hides after Feb 8, 2026 */}
        {showSuperBowlBanner && (
          <div className="mb-8 bg-gradient-to-r from-blue-900/60 via-red-900/60 to-green-900/60 border-2 border-yellow-500 rounded-2xl p-5 relative overflow-hidden">
            {/* Football pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/assets/party-marketing/FireHorse-SuperBowl-Party-Image.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl">🏈</span>
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {daysUntilSuperBowl <= 0
                    ? '🏈 SUPER BOWL LX TODAY!'
                    : daysUntilSuperBowl === 1
                      ? '⏰ SUPER BOWL LX TOMORROW — FEB 8!'
                      : `⏰ SUPER BOWL LX IN ${daysUntilSuperBowl} DAYS — FEB 8!`}
                </span>
                <span className="text-3xl">🐴</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-center mb-2">
                <span className="text-blue-400">Patriots</span>
                <span className="text-white mx-2">vs</span>
                <span className="text-green-400">Seahawks</span>
              </h2>

              <p className="text-center text-yellow-300 font-bold text-lg mb-3">
                🔥 Boost Your Super Bowl Luck with Fire Horse Fortune! 🔥
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-black/50 rounded-xl p-3 text-center">
                  <p className="text-white font-bold mb-1">🎲 GET LUCKY NUMBERS</p>
                  <p className="text-gray-300 text-sm mb-2">Your Fire Horse Oracle includes 6 lucky numbers for your Super Bowl bets!</p>
                  <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm hover:scale-105 transition-transform"
                  >
                    Get Oracle — $8.88
                  </Link>
                </div>
                <div className="bg-black/50 rounded-xl p-3 text-center">
                  <p className="text-white font-bold mb-1">🎉 PRE-GAME PARTY</p>
                  <p className="text-gray-300 text-sm mb-2">Host Fire Horse Trivia before kickoff — the ultimate CNY × Super Bowl mashup!</p>
                  <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">
                    ↓ Get Your Pass Below
                  </span>
                </div>
              </div>

              <p className="text-center text-gray-400 text-xs">
                Super Bowl LX (Feb 8) + CNY 2026 (Feb 17) = Fire Horse Fortune! 🐴🏈
              </p>
            </div>
          </div>
        )}

        {/* SOLO PLAY - Featured Option */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-4xl">🎯</span>
                <h2 className="text-2xl font-bold text-purple-300">SOLO PLAY</h2>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">NEW!</span>
              </div>
              <p className="text-gray-300 mb-3">
                Play Fire Horse Trivia by yourself! Test your knowledge of Chinese Zodiac,
                CNY traditions, and Fire Horse lore.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-gray-400">
                <span>✓ 5 Games</span>
                <span>•</span>
                <span>✓ 20 Questions Each</span>
                <span>•</span>
                <span>✓ Timed or Manual</span>
                <span>•</span>
                <span>✓ 24 Hours Access</span>
              </div>
            </div>
            <div className="text-center">
              {existingSoloCode ? (
                <>
                  <div className="text-sm font-bold text-green-400 mb-2">You have an active pass!</div>
                  <a
                    href={`/party/solo/${existingSoloCode}`}
                    className="block px-8 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/30 mb-3"
                  >
                    CONTINUE PLAYING →
                  </a>
                  <button
                    onClick={handleSoloClick}
                    disabled={isSoloLoading}
                    className="text-sm text-gray-400 hover:text-white underline"
                  >
                    {isSoloLoading ? 'Starting...' : 'Buy another pass'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold text-purple-300 mb-2">{SOLO_PASS.priceDisplay}</div>
                  <button
                    onClick={handleSoloClick}
                    disabled={isSoloLoading}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                      isSoloLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/30'
                    }`}
                  >
                    {isSoloLoading ? 'Starting...' : 'PLAY SOLO →'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">OR PLAY WITH FRIENDS</span>
          <div className="flex-1 h-px bg-gray-700"></div>
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
            <div className="mb-4 p-3 bg-green-900/30 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white bg-green-600 px-3 py-1 rounded-lg">
                  STEP 1
                </span>
                <span className="text-lg font-bold text-white">Select your pass</span>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {PARTY_PASS_TYPES.map((type) => {
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
            <div className="mb-4 p-3 bg-green-900/30 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white bg-green-600 px-3 py-1 rounded-lg">
                  STEP 2
                </span>
                <span className="text-lg font-bold text-white">Complete purchase</span>
              </div>
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
              <p className="text-gray-300 text-sm mt-1">
                Free to play! Just enter the party code that your HOST has sent to you or the Invite you received
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
                <p className="text-center text-lg text-white font-bold mt-4">
                  ✓ No account needed • ✓ No payment required
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
        <div className="grid md:grid-cols-4 gap-6 mb-12">
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

          <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-bold">Privacy by Design</div>
            <div className="text-sm text-gray-400">
              Zero data stored or retained
            </div>
          </div>
        </div>

        {/* Personal Oracle Promo */}
        <div className="mt-12 bg-gradient-to-br from-red-950/60 via-black/80 to-yellow-950/60 border-2 border-fire-gold/50 rounded-2xl p-6">
          <div className="text-center mb-4">
            <span className="text-4xl">🔮</span>
            <h3 className="text-fire-gold text-2xl font-bold mt-2">
              Want Your Personal Fire Horse Oracle?
            </h3>
          </div>

          <div className="bg-black/40 rounded-xl p-4 mb-4">
            <p className="text-gray-200 text-sm text-center leading-relaxed mb-3">
              Get a <span className="text-fire-gold font-bold">one-of-a-kind AI-generated talisman</span> personalized for your Chinese Zodiac sign.
              Each oracle is a <span className="text-yellow-400 font-bold">limited edition masterpiece</span> — only 888 per zodiac!
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded">🎲 Lucky Numbers</span>
              <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded">⚔️ Power Mottos</span>
              <span className="bg-pink-900/50 text-pink-300 px-2 py-1 rounded">❤️ Love Decrees</span>
              <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded">🛡️ Protection</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/free"
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 px-6 rounded-xl text-center
                         hover:scale-105 transition-all shadow-lg"
            >
              🔮 FREE Reading First
            </Link>
            <Link
              href="/"
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl text-center
                         hover:scale-105 transition-all shadow-lg"
            >
              ✨ Get Full Oracle — $8.88
            </Link>
          </div>

          <p className="text-gray-500 text-xs text-center mt-3">
            Fire Horse returns only once every 60 years • Next: 2086
          </p>
        </div>

        {/* Social Share Section */}
        <div className="mt-8 bg-gradient-to-r from-red-900/50 via-purple-900/50 to-red-900/50 border border-fire-gold/50 rounded-xl p-5 text-center">
          <p className="text-fire-gold text-lg font-bold mb-2">
            📣 Share the Fun with Friends!
          </p>
          <p className="text-gray-300 text-sm mb-4">
            Know someone who&apos;d love to host a Fire Horse Trivia party?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://twitter.com/intent/tweet?text=🐴%20Host%20your%20own%20Fire%20Horse%20Trivia%20Party%20for%20CNY%202026!%20400%20questions,%20live%20scoring,%20leaderboards!%20🎉&url=https://redhorseoracle.com/party"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-gray-800 text-white font-bold px-5 py-2 rounded-lg transition-colors"
            >
              𝕏 Share on X
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://redhorseoracle.com/party"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-lg transition-colors"
            >
              Share on Facebook
            </a>
            <a
              href="https://api.whatsapp.com/send?text=🐴%20Check%20out%20Fire%20Horse%20Trivia%20for%20CNY%202026!%20Host%20your%20own%20party%20with%20400%20questions!%20https://redhorseoracle.com/party"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2 rounded-lg transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pb-8 mt-8">
          <div className="mb-4 py-3 px-4 bg-green-900/20 border border-green-700/50 rounded-xl inline-block">
            <p className="text-green-400 font-semibold mb-1">
              🔒 PRIVACY BY DESIGN — FIRST | ONLY | BEST
            </p>
            <p className="text-xs text-gray-400">
              No accounts, no emails, no data stored. Your birth year is never linked to you.
            </p>
          </div>
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
