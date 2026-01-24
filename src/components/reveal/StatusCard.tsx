'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { getZodiacFunFacts } from '@/constants/zodiac-fun-facts';

interface StatusCardProps {
  zodiacSign: string;
  zodiacElement: string;
  editionNumber: number;
  totalEditions: number;
  focusMode: string;
}

// Mode emoji and name lookup
const MODE_INFO: Record<string, { emoji: string; name: string }> = {
  wealth: { emoji: '🎲', name: 'WEALTH' },
  power: { emoji: '⚔️', name: 'POWER' },
  love: { emoji: '❤️', name: 'LOVE' },
  shield: { emoji: '🛡️', name: 'SHIELD' },
};

export default function StatusCard({
  zodiacSign,
  zodiacElement,
  editionNumber,
  totalEditions,
  focusMode,
}: StatusCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Get fun facts for celebrity mention
  const funFacts = getZodiacFunFacts(zodiacElement, zodiacSign);
  const celebrities = funFacts?.famousPeople.slice(0, 2).map((p) => p.name) || [];
  const modeInfo = MODE_INFO[focusMode?.toLowerCase()] || MODE_INFO.wealth;

  // Download the status card as image
  const downloadStatusCard = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `fire-horse-2026-${zodiacElement.toLowerCase()}-${zodiacSign.toLowerCase()}-status.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating status card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Generate tweet text
  const getTweetText = () => {
    const celebMention = celebrities.length > 0
      ? `According to the Oracle, my 2026 peers include ${celebrities.join(' and ')}.`
      : '';

    return `I'm ${zodiacElement} ${zodiacSign} #${editionNumber}. ${celebMention}

Who are the other ${totalEditions - 1}? If you're a ${zodiacSign}, get your number at RedHorseOracle.com before the forge closes. 🐴🔥

#RedHorseOracle #FireHorse2026 #PrivacyByDesign`;
  };

  // Copy text to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const text = getTweetText();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-red-950/60 via-black to-red-950/60 border-2 border-fire-gold rounded-2xl p-6">
        <h3 className="text-fire-gold text-xs uppercase tracking-widest text-center mb-2">
          🔥 Claim Your Rank in the 888 🔥
        </h3>
        <p className="text-white text-lg font-bold text-center mb-2">
          Your Viral Status Card
        </p>
        <p className="text-gray-400 text-sm text-center mb-6">
          You are now <span className="text-fire-gold font-bold">1 of only {totalEditions}</span> {zodiacElement} {zodiacSign}s
          to hold this specific 2026 Talisman. Most people are still sleepwalking. Let them know the Fire has arrived.
        </p>

        {/* The Status Card (for screenshot/download) */}
        <div
          ref={cardRef}
          className="relative mx-auto bg-gradient-to-b from-black via-red-950 to-black border-2 border-fire-gold rounded-xl p-6 text-center"
          style={{ aspectRatio: '9/16', maxWidth: '280px' }}
        >
          {/* Top Decorative */}
          <div className="absolute top-4 left-4 text-fire-gold text-xl">🔥</div>
          <div className="absolute top-4 right-4 text-fire-gold text-xl">🔥</div>

          {/* Main Content */}
          <div className="h-full flex flex-col justify-center items-center">
            <p className="text-red-500 text-xs uppercase tracking-widest mb-2">
              2026 Fire Horse Year
            </p>

            <h2 className="text-3xl font-bold text-white mb-1">
              I AM THE FIRE.
            </h2>

            <p className="text-fire-gold text-lg font-bold tracking-wider mb-4">
              {zodiacElement.toUpperCase()} {zodiacSign.toUpperCase()} EDITION
            </p>

            {/* Edition Badge */}
            <div className="bg-black/60 border-2 border-fire-gold rounded-xl px-6 py-3 mb-4">
              <p className="text-fire-gold text-2xl font-bold">
                #{editionNumber} / {totalEditions}
              </p>
            </div>

            {/* Mode Badge */}
            <div className="bg-fire-gold/20 border border-fire-gold/50 rounded-lg px-4 py-2 mb-4">
              <p className="text-fire-gold text-sm font-bold">
                {modeInfo.emoji} {modeInfo.name} MODE
              </p>
            </div>

            {/* Forged By */}
            <p className="text-gray-400 text-xs mb-2">
              Forged by Gemini 3 Pro
            </p>

            {/* Privacy Badge */}
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/50 rounded-full px-4 py-1 mb-4">
              <span className="text-green-400 text-sm">🛡️</span>
              <span className="text-green-400 text-xs font-bold">PRIVACY CERTIFIED</span>
            </div>

            {/* URL */}
            <p className="text-fire-gold text-sm font-bold">
              RedHorseOracle.com
            </p>
          </div>

          {/* Bottom Decorative */}
          <div className="absolute bottom-4 left-4 text-fire-gold text-xl">🐴</div>
          <div className="absolute bottom-4 right-4 text-fire-gold text-xl">🐴</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button
            onClick={downloadStatusCard}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-yellow-600 via-fire-gold to-yellow-600 text-black font-bold py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            {isDownloading ? '⏳ Generating...' : '📥 DOWNLOAD MY STATUS CARD'}
          </button>

          <button
            onClick={shareToTwitter}
            className="w-full bg-black border-2 border-gray-600 hover:border-white text-white font-bold py-3 rounded-xl hover:scale-105 transition-all"
          >
            𝕏 TWEET MY SERIAL NUMBER
          </button>
        </div>

        {/* Tag-a-Legend Viral Hook */}
        <div className="bg-purple-950/40 border border-purple-500/50 rounded-xl p-4 mt-6">
          <p className="text-purple-400 text-xs uppercase tracking-widest text-center mb-2">
            💡 Viral Share Template
          </p>
          <p className="text-white text-sm text-center mb-3 leading-relaxed">
            &ldquo;I&apos;m <span className="text-fire-gold font-bold">{zodiacElement} {zodiacSign} #{editionNumber}</span>.
            {celebrities.length > 0 && (
              <> According to the Oracle, my 2026 peers include <span className="text-purple-300 font-bold">{celebrities.join(' and ')}</span>.</>
            )}
            <br />
            Who are the other {totalEditions - 1}? 🐴🔥&rdquo;
          </p>
          <button
            onClick={() => copyToClipboard(getTweetText(), 'viral')}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
              copiedText === 'viral'
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {copiedText === 'viral' ? '✓ Copied!' : '📋 COPY VIRAL POST'}
          </button>
        </div>

        {/* Why This Works */}
        <div className="grid grid-cols-3 gap-2 mt-6 text-center">
          <div className="bg-black/50 border border-gray-700 rounded-lg p-2">
            <p className="text-fire-gold text-lg">🏆</p>
            <p className="text-white text-[10px] font-bold">SCARCITY</p>
            <p className="text-gray-500 text-[9px]">Early adopter</p>
          </div>
          <div className="bg-black/50 border border-gray-700 rounded-lg p-2">
            <p className="text-fire-gold text-lg">⭐</p>
            <p className="text-white text-[10px] font-bold">CELEBRITY</p>
            <p className="text-gray-500 text-[9px]">Status by proxy</p>
          </div>
          <div className="bg-black/50 border border-gray-700 rounded-lg p-2">
            <p className="text-fire-gold text-lg">🛡️</p>
            <p className="text-white text-[10px] font-bold">PRIVACY</p>
            <p className="text-gray-500 text-[9px]">Tech-savvy flex</p>
          </div>
        </div>
      </div>
    </div>
  );
}
