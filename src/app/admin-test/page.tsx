'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import GeneratingState from '@/components/reveal/GeneratingState';
import { getChineseZodiac } from '@/lib/zodiac/calculator';

const FOCUS_MODES = [
  { id: 'wealth', name: 'Wealth Mode', description: '6 Lucky Numbers (XX-XX-XX-XX-XX-XX)' },
  { id: 'power', name: 'Power Mode', description: '3-Word Strategic Motto (e.g., STRIKE THE NORTH)' },
  { id: 'love', name: 'Love Mode', description: '4-Word Love Phrase (e.g., LOVE FINDS YOU WORTHY)' },
  { id: 'shield', name: 'Shield Mode', description: '3-Word Protective Mantra (e.g., FIRE SHIELDS ME)' },
];

// Zodiac data
const ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'] as const;
const ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'] as const;

const ANIMAL_EMOJI: Record<string, string> = {
  rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇', dragon: '🐲', snake: '🐍',
  horse: '🐴', goat: '🐐', monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐷'
};

const ELEMENT_EMOJI: Record<string, string> = {
  wood: '🌳', fire: '🔥', earth: '🌍', metal: '⚙️', water: '💧'
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: 'border-green-500 bg-green-500/10',
  fire: 'border-red-500 bg-red-500/10',
  earth: 'border-amber-600 bg-amber-600/10',
  metal: 'border-gray-400 bg-gray-400/10',
  water: 'border-blue-500 bg-blue-500/10'
};

// Shared authentication key with SuperAdmin
const AUTH_STORAGE_KEY = 'superadmin_authenticated';

// Collections Overview - All 12 in one view with full controls
function CollectionsOverview() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [columns, setColumns] = useState<1 | 2 | 3 | 4>(2);
  const [gap, setGap] = useState<0 | 4 | 8 | 16>(8);
  const [scale, setScale] = useState<100 | 80 | 60 | 50>(80);

  return (
    <div className="space-y-4">
      {/* CONTROLS PANEL */}
      <div className="bg-black/80 border-2 border-fire-gold rounded-xl p-4">
        <h3 className="text-fire-gold text-center font-bold mb-4">COLLECTION GRID CONTROLS</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Columns */}
          <div className="bg-gray-900 rounded-lg p-3">
            <p className="text-fire-gold text-xs mb-2 font-bold text-center">COLUMNS</p>
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
          <div className="bg-gray-900 rounded-lg p-3">
            <p className="text-purple-400 text-xs mb-2 font-bold text-center">GAP (pixels)</p>
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
          <div className="bg-gray-900 rounded-lg p-3">
            <p className="text-green-400 text-xs mb-2 font-bold text-center">SCALE %</p>
            <div className="flex justify-center gap-2">
              {([100, 80, 60, 50] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-3 h-10 rounded-lg text-sm font-bold transition-all ${
                    scale === s
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-3">
          Current: {columns} column{columns > 1 ? 's' : ''}, {gap}px gap, {scale}% scale
        </p>
      </div>

      {/* All 12 Collections Grid - Natural image dimensions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          transform: `scale(${scale / 100})`,
          transformOrigin: 'top center',
        }}
      >
        {ANIMALS.map((animal) => (
          <div
            key={animal}
            onClick={() => setSelectedCard(`${animal}-collection`)}
            className="cursor-pointer rounded-lg overflow-hidden border-2 border-purple-500 bg-purple-500/10 transition-all hover:border-fire-gold hover:shadow-xl hover:shadow-fire-gold/30"
          >
            <img
              src={`/assets/zodiac-badges/${animal}-collection.jpeg`}
              alt={`${animal} collection - all 5 elements`}
              className="w-full h-auto block"
            />
            <div className="bg-black/80 p-2 text-center">
              <p className="text-white text-sm font-bold">
                {ANIMAL_EMOJI[animal]} {animal.charAt(0).toUpperCase() + animal.slice(1)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute -top-12 right-0 text-white hover:text-fire-gold text-lg font-bold"
            >
              ✕ Close
            </button>
            <img
              src={`/assets/zodiac-badges/${selectedCard}.jpeg`}
              alt={selectedCard}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-center">
              <p className="text-fire-gold text-xl font-bold">
                📚 {selectedCard.replace('-collection', '').charAt(0).toUpperCase() + selectedCard.replace('-collection', '').slice(1)} Collection - All 5 Elements
              </p>
            </div>
            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = ANIMALS.indexOf(selectedCard.replace('-collection', '') as typeof ANIMALS[number]);
                  if (idx > 0) setSelectedCard(`${ANIMALS[idx - 1]}-collection`);
                }}
                className="bg-fire-gold/20 hover:bg-fire-gold/40 text-fire-gold px-4 py-2 rounded-lg"
              >
                ← Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = ANIMALS.indexOf(selectedCard.replace('-collection', '') as typeof ANIMALS[number]);
                  if (idx < ANIMALS.length - 1) setSelectedCard(`${ANIMALS[idx + 1]}-collection`);
                }}
                className="bg-fire-gold/20 hover:bg-fire-gold/40 text-fire-gold px-4 py-2 rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Gallery Component
function CardGallery() {
  const [filterAnimal, setFilterAnimal] = useState<string>('all');
  const [filterElement, setFilterElement] = useState<string>('all');
  const [showCollections, setShowCollections] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Build list of cards based on filters
  const getCards = () => {
    const cards: { name: string; element: string; animal: string; isCollection: boolean }[] = [];

    // Individual cards (element-animal)
    for (const element of ELEMENTS) {
      for (const animal of ANIMALS) {
        if (filterAnimal !== 'all' && animal !== filterAnimal) continue;
        if (filterElement !== 'all' && element !== filterElement) continue;
        cards.push({
          name: `${element}-${animal}`,
          element,
          animal,
          isCollection: false
        });
      }
    }

    // Collection panels (animal-collection)
    if (showCollections) {
      for (const animal of ANIMALS) {
        if (filterAnimal !== 'all' && animal !== filterAnimal) continue;
        if (filterElement !== 'all') continue; // Collections don't have elements
        cards.push({
          name: `${animal}-collection`,
          element: 'collection',
          animal,
          isCollection: true
        });
      }
    }

    return cards;
  };

  const cards = getCards();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black/50 border border-fire-gold/30 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Animal Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">Filter by Animal</label>
            <select
              value={filterAnimal}
              onChange={(e) => setFilterAnimal(e.target.value)}
              className="w-full bg-black border border-red-900/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fire-gold"
            >
              <option value="all">All Animals (12)</option>
              {ANIMALS.map((animal) => (
                <option key={animal} value={animal}>
                  {ANIMAL_EMOJI[animal]} {animal.charAt(0).toUpperCase() + animal.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Element Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">Filter by Element</label>
            <select
              value={filterElement}
              onChange={(e) => setFilterElement(e.target.value)}
              className="w-full bg-black border border-red-900/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fire-gold"
            >
              <option value="all">All Elements (5)</option>
              {ELEMENTS.map((element) => (
                <option key={element} value={element}>
                  {ELEMENT_EMOJI[element]} {element.charAt(0).toUpperCase() + element.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Collection Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Show Collections</label>
            <button
              onClick={() => setShowCollections(!showCollections)}
              className={`w-12 h-6 rounded-full transition-colors ${
                showCollections ? 'bg-fire-gold' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  showCollections ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs text-gray-400">
          <span>Showing: <span className="text-fire-gold font-bold">{cards.length}</span> cards</span>
          <span>•</span>
          <span>Individual: <span className="text-white">{cards.filter(c => !c.isCollection).length}</span></span>
          <span>•</span>
          <span>Collections: <span className="text-white">{cards.filter(c => c.isCollection).length}</span></span>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div
            key={card.name}
            onClick={() => setSelectedCard(card.name)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-xl hover:shadow-fire-gold/20 ${
              card.isCollection
                ? 'border-purple-500 bg-purple-500/10'
                : ELEMENT_COLORS[card.element]
            }`}
          >
            <div className="aspect-[3/4] relative">
              <img
                src={`/assets/zodiac-badges/${card.name}.jpeg`}
                alt={card.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay with name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
                <p className="text-white text-xs font-bold truncate">
                  {card.isCollection ? (
                    <>📚 {card.animal.charAt(0).toUpperCase() + card.animal.slice(1)} Collection</>
                  ) : (
                    <>
                      {ELEMENT_EMOJI[card.element]} {card.element.charAt(0).toUpperCase() + card.element.slice(1)}{' '}
                      {ANIMAL_EMOJI[card.animal]} {card.animal.charAt(0).toUpperCase() + card.animal.slice(1)}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>No cards match your filters</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute -top-12 right-0 text-white hover:text-fire-gold text-lg font-bold"
            >
              ✕ Close
            </button>

            {/* Image */}
            <img
              src={`/assets/zodiac-badges/${selectedCard}.jpeg`}
              alt={selectedCard}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Card name */}
            <div className="mt-4 text-center">
              <p className="text-fire-gold text-xl font-bold">
                {selectedCard.includes('collection') ? (
                  <>📚 {selectedCard.replace('-collection', '').charAt(0).toUpperCase() + selectedCard.replace('-collection', '').slice(1)} Collection</>
                ) : (
                  selectedCard.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                )}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                /assets/zodiac-badges/{selectedCard}.jpeg
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = cards.findIndex(c => c.name === selectedCard);
                  if (idx > 0) setSelectedCard(cards[idx - 1].name);
                }}
                className="bg-fire-gold/20 hover:bg-fire-gold/40 text-fire-gold px-4 py-2 rounded-lg"
              >
                ← Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = cards.findIndex(c => c.name === selectedCard);
                  if (idx < cards.length - 1) setSelectedCard(cards[idx + 1].name);
                }}
                className="bg-fire-gold/20 hover:bg-fire-gold/40 text-fire-gold px-4 py-2 rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skipPin = searchParams.get('skip_pin') === 'true';
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'gallery' ? 'gallery' : tabParam === 'collections' ? 'collections' : 'test';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'test' | 'gallery' | 'collections'>(initialTab);

  const [birthDate, setBirthDate] = useState('');
  const [focusMode, setFocusMode] = useState('wealth');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatingZodiac, setGeneratingZodiac] = useState<{sign: string, element: string} | null>(null);

  // Check sessionStorage on mount OR auto-authenticate if skip_pin
  useEffect(() => {
    if (skipPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, [skipPin]);

  // Auto-format date input (MM/DD/YYYY)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Auto-format with slashes
    if (numbers.length <= 2) {
      value = numbers;
    } else if (numbers.length <= 4) {
      value = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      value = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }

    setBirthDate(value);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '142857') {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setPinError('');
    } else {
      setPinError('Invalid PIN');
      setPin('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Calculate zodiac to show in generating state
    try {
      const zodiac = getChineseZodiac(birthDate);
      setGeneratingZodiac({ sign: zodiac.animal, element: zodiac.element });
    } catch {
      setGeneratingZodiac(null);
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/admin-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: '142857',
          birthDate,
          focusMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      // Redirect to reveal page with the session ID and admin flag
      // Use the production domain for shareable URLs
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://redhorseoracle.com';
      window.location.href = `${baseUrl}/reveal?session_id=${data.sessionId}&from=admin`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGenerating(false);
      setGeneratingZodiac(null);
    }
  };

  // Show bouncing pony animation while generating
  if (isGenerating) {
    return (
      <GeneratingState
        zodiacSign={generatingZodiac?.sign}
        zodiacElement={generatingZodiac?.element}
        focusMode={focusMode}
      />
    );
  }

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-fire-gold text-center mb-2">
            Admin Access
          </h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            Enter your PIN to access the test console
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="w-full bg-black border border-red-900/50 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-fire-gold"
                maxLength={6}
                autoFocus
              />
              {pinError && (
                <p className="text-red-500 text-sm text-center mt-2">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-fire-gold text-black font-bold py-3 px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Unlock
            </button>
          </form>

          <a
            href="/"
            className="block text-center text-gray-500 text-sm mt-6 hover:text-gray-300"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Admin Console with Tabs
  return (
    <div className="min-h-screen bg-fire-gradient p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🔧</span>
            <h1 className="text-2xl font-bold text-fire-gold">Admin Console</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Test prophecy generation and browse digital art cards
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('test')}
            className={`px-5 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'test'
                ? 'bg-fire-gold text-black'
                : 'bg-black/50 text-gray-400 hover:text-white border border-fire-gold/30'
            }`}
          >
            ✨ Test Console
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-5 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'collections'
                ? 'bg-purple-500 text-white'
                : 'bg-black/50 text-gray-400 hover:text-white border border-purple-500/30'
            }`}
          >
            📚 All 12 Collections
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-fire-gold text-black'
                : 'bg-black/50 text-gray-400 hover:text-white border border-fire-gold/30'
            }`}
          >
            🎴 Full Gallery
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'collections' ? (
          /* Collections Overview Tab */
          <CollectionsOverview />
        ) : activeTab === 'test' ? (
          /* Test Console Tab */
          <div className="flex justify-center">
            <div className="bg-black/80 border border-fire-gold/30 rounded-2xl p-8 max-w-md w-full">
              <p className="text-gray-400 text-center text-sm mb-8">
                Generate prophecies without payment for testing
              </p>

              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Birth Date */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={birthDate}
                    onChange={handleDateChange}
                    placeholder="MM/DD/YYYY"
                    className="w-full bg-black border border-red-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fire-gold"
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Just type numbers - slashes auto-added
                  </p>
                </div>

                {/* Focus Mode */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Oracle Mode
                  </label>
                  <select
                    value={focusMode}
                    onChange={(e) => setFocusMode(e.target.value)}
                    className="w-full bg-black border border-red-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fire-gold appearance-none cursor-pointer"
                  >
                    {FOCUS_MODES.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.name} - {mode.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-900/30 border border-red-500 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-fire-gold text-black font-bold py-4 px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">🔥</span>
                      Generating Prophecy...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Generate Test Prophecy
                    </>
                  )}
                </button>
              </form>

              {isGenerating && (
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm animate-pulse">
                    This may take 30-60 seconds while AI generates your talisman...
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Gallery Tab */
          <CardGallery />
        )}

        {/* Footer Links */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <a
            href="/superadmin"
            className="text-fire-gold text-sm hover:text-yellow-400 font-medium"
          >
            📊 SuperAdmin Dashboard
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="/collections-grid"
            className="text-purple-400 text-sm hover:text-purple-300 font-medium"
          >
            📸 Collections Screenshot
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="/examples"
            className="text-gray-400 text-sm hover:text-gray-300"
          >
            🎨 Examples Page
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="/"
            className="text-gray-500 text-sm hover:text-gray-300"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="animate-spin text-4xl">🔥</div>
      <p className="text-gray-400 mt-4">Loading...</p>
    </div>
  );
}

export default function AdminTestPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminTestContent />
    </Suspense>
  );
}
