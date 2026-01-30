'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Confetti, BouncingHorse } from './Celebration';

interface PartyEndScreenProps {
  nickname: string;
  zodiacSign?: string;
  zodiacElement?: string;
  partyCode: string;
  totalPoints?: number;
  rank?: number;
  isHost?: boolean;
}

export default function PartyEndScreen({
  nickname,
  zodiacSign,
  zodiacElement,
  partyCode,
  totalPoints = 0,
  rank,
  isHost = false,
}: PartyEndScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate social share text
  const shareText = `🔥🐴 I just played Fire Horse Trivia at party ${partyCode}!

${rank ? `🏆 I placed #${rank}` : ''}${totalPoints ? ` with ${totalPoints} points!` : ''}
${zodiacSign ? `\n✨ I'm a ${zodiacElement} ${zodiacSign}!` : ''}

🎮 It's the Year of the Fire Horse 2026 - only happens every 60 years!

🔮 Get your personalized Limited Edition Oracle at:
👉 redhorseoracle.com

#FireHorse2026 #ChineseZodiac #YearOfTheHorse`;

  const copyShareText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if zodiac card exists
  const hasZodiacCard = zodiacSign && zodiacElement;
  const zodiacCardUrl = hasZodiacCard
    ? `/assets/zodiac-badges/${zodiacElement?.toLowerCase()}-${zodiacSign?.toLowerCase()}.jpeg`
    : null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-red-950/50 to-black z-50 overflow-y-auto">
      {/* Confetti Animation */}
      {showConfetti && <Confetti count={150} />}

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Bouncing Horse */}
        <BouncingHorse />

        {/* Thank You Message */}
        <div className="text-center mt-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-400">Thank You</span>
            <span className="text-white">, {nickname}!</span>
          </h1>

          <div className="bg-gradient-to-r from-red-900/50 via-orange-900/50 to-yellow-900/50 rounded-2xl p-6 mb-6 border border-yellow-600/30">
            <p className="text-xl text-white mb-4">
              We wish you <span className="text-yellow-400 font-bold">Luck</span>,{' '}
              <span className="text-red-400 font-bold">Power</span>,{' '}
              <span className="text-pink-400 font-bold">Love</span>, and{' '}
              <span className="text-blue-400 font-bold">Protection</span>
            </p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
              in the Year of the Fire Horse 2026! 🐴🔥
            </p>
          </div>

          {/* Score Display */}
          {(rank || totalPoints > 0) && (
            <div className="bg-yellow-900/30 rounded-xl p-4 mb-6 border border-yellow-600/30">
              <div className="flex justify-center gap-8">
                {rank && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </div>
                    <div className="text-sm text-gray-400">Your Rank</div>
                  </div>
                )}
                {totalPoints > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
                    <div className="text-sm text-gray-400">Points Earned</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zodiac Card Section */}
          {hasZodiacCard && zodiacCardUrl && (
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 mb-6 border border-purple-500/30">
              <h2 className="text-xl font-bold text-purple-300 mb-4">
                🎁 Your Special Gift: {zodiacElement} {zodiacSign} Card
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={zodiacCardUrl}
                    alt={`${zodiacElement} ${zodiacSign}`}
                    className="w-48 h-48 object-cover rounded-xl shadow-lg border-2 border-purple-400/50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    FREE!
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-gray-300 mb-3">
                    As a thank you for playing, download your personalized{' '}
                    <span className="text-purple-300 font-bold">{zodiacElement} {zodiacSign}</span> digital card!
                  </p>
                  <a
                    href={zodiacCardUrl}
                    download={`${zodiacElement}-${zodiacSign}-2026.jpeg`}
                    className="inline-block bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    📥 Download Your Card
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Red Horse Oracle Promotion */}
          <div className="bg-gradient-to-r from-red-900/60 to-orange-900/60 rounded-2xl p-6 mb-6 border-2 border-red-500/50">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">
              🔮 Boost Your Fortune in 2026!
            </h2>
            <p className="text-gray-200 mb-4">
              The <span className="text-red-400 font-bold">Red Horse Oracle</span> would love to create your{' '}
              <span className="text-yellow-400 font-bold">Limited Edition Authenticated Signed Digital Art</span>{' '}
              for your sign!
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Every good deed you do, the Red Horse Oracle sees as part of your Oracle.
              Sharing this game with friends boosts your good luck in the Year of the Fire Horse! 🍀
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-red-500/30"
            >
              🐴 Get Your Oracle — $8.88
            </Link>
          </div>

          {/* Social Share Section */}
          <div className="bg-gray-900/70 rounded-2xl p-6 mb-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">
              📣 Share & Boost Your Luck!
            </h3>
            <div className="bg-black/50 rounded-xl p-4 mb-4 text-left">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                {shareText}
              </pre>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={copyShareText}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy Text'}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black hover:bg-gray-800 rounded-xl font-bold border border-gray-600"
              >
                𝕏 Share
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://redhorseoracle.com/party`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-800 hover:bg-blue-700 rounded-xl font-bold"
              >
                Facebook
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 rounded-xl font-bold text-lg transition-all"
            >
              🏠 Visit Red Horse Oracle
            </Link>
            <Link
              href="/party"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg transition-all"
            >
              🎮 Back to Party Home
            </Link>
          </div>

          {/* Final Thank You */}
          <p className="mt-8 text-gray-400 text-sm">
            Thank you for celebrating the Year of the Fire Horse with us! 🐴🔥<br />
            May fortune smile upon you in 2026!
          </p>
        </div>
      </div>
    </div>
  );
}
