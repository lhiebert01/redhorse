'use client';

import { useState, useEffect } from 'react';

// Zodiac animals in traditional order
const ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'] as const;

export default function CollectionsGridPage() {
  const [columns, setColumns] = useState<1 | 2 | 3 | 4>(2);
  const [showControls, setShowControls] = useState(true);
  const [gap, setGap] = useState<0 | 4 | 8 | 16>(4);
  const [background, setBackground] = useState<'black' | 'gradient' | 'transparent'>('black');
  const [imageScale, setImageScale] = useState<100 | 90 | 80 | 70 | 60>(100);

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

  const bgClasses: Record<string, string> = {
    'black': 'bg-black',
    'gradient': 'bg-gradient-to-br from-red-950 via-black to-red-950',
    'transparent': 'bg-transparent',
  };

  return (
    <div className={`min-h-screen ${bgClasses[background]} relative`}>
      {/* CONTROLS PANEL - Always at top */}
      {showControls && (
        <div className="sticky top-0 z-50 bg-black border-b-4 border-fire-gold p-4 shadow-2xl">
          <h2 className="text-fire-gold text-center font-bold text-xl mb-4">
            COLLECTION GRID CONTROLS
          </h2>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Columns */}
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-fire-gold text-sm mb-2 font-bold text-center">COLUMNS</p>
              <div className="flex justify-center gap-2">
                {([1, 2, 3, 4] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColumns(c)}
                    className={`w-10 h-10 rounded-lg text-lg font-bold transition-all ${
                      columns === c
                        ? 'bg-fire-gold text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Gap */}
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-purple-400 text-sm mb-2 font-bold text-center">GAP (px)</p>
              <div className="flex justify-center gap-2">
                {([0, 4, 8, 16] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGap(g)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      gap === g
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-green-400 text-sm mb-2 font-bold text-center">SCALE %</p>
              <div className="flex justify-center gap-1">
                {([100, 90, 80, 70, 60] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setImageScale(s)}
                    className={`px-2 h-10 rounded-lg text-xs font-bold transition-all ${
                      imageScale === s
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-blue-400 text-sm mb-2 font-bold text-center">BACKGROUND</p>
              <div className="flex justify-center gap-2">
                {(['black', 'gradient', 'transparent'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBackground(b)}
                    className={`px-2 h-10 rounded-lg text-xs font-bold transition-all ${
                      background === b
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {b.slice(0, 5)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setShowControls(false)}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all text-lg"
            >
              HIDE CONTROLS FOR SCREENSHOT
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Press <span className="text-fire-gold font-bold">H</span> to toggle •
              Current: {columns} columns, {gap}px gap, {imageScale}% scale
            </p>
          </div>
        </div>
      )}

      {/* Show controls button when hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 right-4 z-50 bg-fire-gold text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition-all"
        >
          Show Controls (H)
        </button>
      )}

      {/* THE GRID - Natural image dimensions, very wide */}
      <div className="p-4">
        <div
          className="mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
            maxWidth: '100%',
            transform: `scale(${imageScale / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {ANIMALS.map((animal) => (
            <div key={animal}>
              <img
                src={`/assets/zodiac-badges/${animal}-collection.jpeg`}
                alt={`${animal} collection - all 5 elements`}
                className="w-full h-auto"
                style={{ display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Back link */}
      {showControls && (
        <div className="fixed bottom-4 left-4 z-50">
          <a
            href="/admin-test?tab=collections"
            className="bg-gray-800 text-fire-gold px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back to Admin
          </a>
        </div>
      )}
    </div>
  );
}
