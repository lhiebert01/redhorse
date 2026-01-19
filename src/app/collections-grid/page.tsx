'use client';

import { useState } from 'react';

// Zodiac animals in traditional order
const ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'] as const;

export default function CollectionsGridPage() {
  const [layout, setLayout] = useState<'4x3' | '3x4' | '6x2' | '2x6'>('4x3');
  const [showControls, setShowControls] = useState(true);
  const [gap, setGap] = useState<'none' | 'small' | 'medium'>('small');
  const [background, setBackground] = useState<'black' | 'gradient' | 'transparent'>('black');

  const gridClasses = {
    '4x3': 'grid-cols-4',
    '3x4': 'grid-cols-3',
    '6x2': 'grid-cols-6',
    '2x6': 'grid-cols-2',
  };

  const gapClasses = {
    'none': 'gap-0',
    'small': 'gap-1',
    'medium': 'gap-2',
  };

  const bgClasses = {
    'black': 'bg-black',
    'gradient': 'bg-gradient-to-br from-red-950 via-black to-red-950',
    'transparent': 'bg-transparent',
  };

  return (
    <div className={`min-h-screen ${bgClasses[background]} relative`}>
      {/* Controls - Toggle visibility for clean screenshot */}
      {showControls && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-black/90 border border-fire-gold/50 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Layout */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Layout:</span>
              {(['4x3', '3x4', '6x2', '2x6'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    layout === l ? 'bg-fire-gold text-black' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Gap */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Gap:</span>
              {(['none', 'small', 'medium'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGap(g)}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    gap === g ? 'bg-fire-gold text-black' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Background */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">BG:</span>
              {(['black', 'gradient', 'transparent'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBackground(b)}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    background === b ? 'bg-fire-gold text-black' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-3">
            <button
              onClick={() => setShowControls(false)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-500"
            >
              Hide Controls for Screenshot
            </button>
          </div>

          <p className="text-center text-gray-500 text-xs mt-2">
            Press H to toggle controls • Right-click → Save Image or use screenshot tool
          </p>
        </div>
      )}

      {/* Hidden controls toggle */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 right-4 z-50 bg-black/50 text-white px-3 py-1 rounded text-sm opacity-30 hover:opacity-100"
        >
          Show Controls (H)
        </button>
      )}

      {/* Keyboard shortcut */}
      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'h' || e.key === 'H') {
            setShowControls(!showControls);
          }
        }}
        className="outline-none"
      >
        {/* The Grid - Clean for screenshot */}
        <div className={`p-4 ${showControls ? 'pt-32' : 'pt-4'}`}>
          <div className={`grid ${gridClasses[layout]} ${gapClasses[gap]} max-w-6xl mx-auto`}>
            {ANIMALS.map((animal) => (
              <div key={animal} className="aspect-[3/4]">
                <img
                  src={`/assets/zodiac-badges/${animal}-collection.jpeg`}
                  alt={`${animal} collection`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="fixed bottom-4 left-4">
        <a
          href="/admin-test?tab=collections"
          className="text-gray-500 hover:text-fire-gold text-sm"
        >
          ← Back to Admin
        </a>
      </div>
    </div>
  );
}
