'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Summoning the Oracle...',
  'Reading the flames...',
  'Calculating your destiny...',
  'Consulting the Fire Horse...',
  'Burning your prophecy into existence...',
  'Aligning the celestial energies...',
  'The Oracle speaks...',
];

export default function GeneratingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Animated Fire Horse Silhouette */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-red-900 to-transparent rounded-full animate-pulse opacity-50" />
        <div className="absolute inset-2 bg-gradient-to-t from-orange-600 to-transparent rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-4 bg-gradient-to-t from-yellow-500 to-transparent rounded-full animate-pulse opacity-20" style={{ animationDelay: '1s' }} />

        {/* Fire emoji as placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
          🐎
        </div>
      </div>

      {/* Loading Message */}
      <p className="text-red-600 text-xl font-serif animate-pulse text-center">
        {MESSAGES[messageIndex]}
      </p>

      {/* Progress Indicator */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-red-800 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Subtext */}
      <p className="mt-8 text-gray-600 text-sm text-center max-w-xs">
        Your personalized talisman is being crafted by the Oracle.
        <br />
        This typically takes 30-60 seconds.
      </p>
    </div>
  );
}
