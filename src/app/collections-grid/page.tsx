'use client';

import { useState, useEffect } from 'react';

// Zodiac animals in traditional order
const ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'] as const;

export default function CollectionsGridPage() {
  const [layout, setLayout] = useState<'4x3' | '3x4' | '6x2' | '2x6'>('4x3');
  const [showControls, setShowControls] = useState(true);
  const [gap, setGap] = useState<'none' | 'small' | 'medium'>('small');
  const [background, setBackground] = useState<'black' | 'gradient' | 'transparent'>('black');
  const [scale, setScale] = useState<'100' | '90' | '80' | '70'>('100');

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setShowControls(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gridClasses = {
    '4x3': 'grid-cols-4',
    '3x4': 'grid-cols-3',
    '6x2': 'grid-cols-6',
    '2x6': 'grid-cols-2',
  };

  const gapClasses = {
    'none': 'gap-0',
    'small': 'gap-1',
    'medium': 'gap-3',
  };

  const bgClasses = {
    'black': 'bg-black',
    'gradient': 'bg-gradient-to-br from-red-950 via-black to-red-950',
    'transparent': 'bg-transparent',
  };

  const scaleClasses = {
    '100': 'scale-100',
    '90': 'scale-90',
    '80': 'scale-80',
    '70': 'scale-[0.7]',
  };

  return (
    <div className={`min-h-screen ${bgClasses[background]} relative overflow-hidden`}>
      {/* Controls Panel */}
      {showControls && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-black/95 border-2 border-fire-gold rounded-xl p-4 max-w-3xl mx-auto shadow-2xl">
          <h2 className="text-fire-gold text-center font-bold mb-4">Screenshot Settings</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Layout */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-bold">LAYOUT</p>
              <div className="flex flex-wrap gap-1">
                {(['4x3', '3x4', '6x2', '2x6'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayout(l)}
                    className={`px-3 py-2 rounded text-sm font-bold transition-all ${
                      layout === l ? 'bg-fire-gold text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Gap */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-bold">GAP</p>
              <div className="flex flex-wrap gap-1">
                {(['none', 'small', 'medium'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGap(g)}
                    className={`px-3 py-2 rounded text-sm font-bold transition-all ${
                      gap === g ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-bold">SCALE</p>
              <div className="flex flex-wrap gap-1">
                {(['100', '90', '80', '70'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`px-3 py-2 rounded text-sm font-bold transition-all ${
                      scale === s ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-bold">BACKGROUND</p>
              <div className="flex flex-wrap gap-1">
                {(['black', 'gradient', 'transparent'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBackground(b)}
                    className={`px-2 py-2 rounded text-xs font-bold transition-all ${
                      background === b ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => setShowControls(false)}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all"
            >
              HIDE CONTROLS FOR SCREENSHOT
            </button>
            <p className="text-gray-500 text-xs mt-2">
              Press <span className="text-fire-gold font-bold">H</span> to toggle controls
            </p>
          </div>
        </div>
      )}

      {/* Hidden controls toggle hint */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 right-4 z-50 bg-black/70 text-fire-gold px-4 py-2 rounded-lg text-sm font-bold opacity-50 hover:opacity-100 transition-all border border-fire-gold/50"
        >
          Press H for Controls
        </button>
      )}

      {/* The Grid - WIDE aspect ratio for collection tiles */}
      <div className={`p-4 ${showControls ? 'pt-56' : 'pt-4'} flex items-center justify-center min-h-screen`}>
        <div className={`${scaleClasses[scale]} transition-transform origin-center`}>
          <div className={`grid ${gridClasses[layout]} ${gapClasses[gap]} max-w-7xl mx-auto`}>
            {ANIMALS.map((animal) => (
              <div key={animal} className="aspect-[5/3]">
                <img
                  src={`/assets/zodiac-badges/${animal}-collection.jpeg`}
                  alt={`${animal} collection`}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back link */}
      {showControls && (
        <div className="fixed bottom-4 left-4">
          <a
            href="/admin-test?tab=collections"
            className="text-gray-500 hover:text-fire-gold text-sm"
          >
            ← Back to Admin
          </a>
        </div>
      )}
    </div>
  );
}
