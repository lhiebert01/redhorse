'use client';

import { useState, useEffect } from 'react';
import { ZODIAC_YEARS, ELEMENT_COLORS, ZodiacYear } from '@/constants/future-years';

interface ReservationCounts {
  [year: number]: number;
}

export default function FutureReservations() {
  const [selectedYear, setSelectedYear] = useState<ZodiacYear | null>(null);
  const [email, setEmail] = useState('');
  const [preferredMode, setPreferredMode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [counts, setCounts] = useState<ReservationCounts>({});
  const [showAll, setShowAll] = useState(false);

  // Fetch reservation counts on mount
  useEffect(() => {
    fetch('/api/reserve')
      .then(res => res.json())
      .then(data => {
        if (data.counts) {
          setCounts(data.counts);
        }
      })
      .catch(() => {
        // Silently fail - counts are optional
      });
  }, []);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYear || !email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          zodiacYear: selectedYear.year,
          preferredMode: preferredMode || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setCounts(prev => ({
          ...prev,
          [selectedYear.year]: (prev[selectedYear.year] || 0) + 1,
        }));
        setEmail('');
        setPreferredMode('');
        // Close modal after 3 seconds
        setTimeout(() => {
          setSelectedYear(null);
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reserve' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show first 3 years + Fire Dragon, or all if expanded
  const visibleYears = showAll
    ? ZODIAC_YEARS.filter(y => !y.isCurrent)
    : [
        ...ZODIAC_YEARS.filter(y => y.year >= 2027 && y.year <= 2029),
        ZODIAC_YEARS.find(y => y.year === 2036)!, // Fire Dragon highlight
      ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-fire-gold text-sm uppercase tracking-widest mb-2">
          Reserve Your Future Oracle
        </p>
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          12 Years of Zodiac Oracles
        </h2>
        <p className="text-gray-400 text-sm">
          Be first to know when your year opens. Limited to 888 editions each.
        </p>
      </div>

      {/* Year Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {visibleYears.map((year) => {
          const colors = ELEMENT_COLORS[year.element];
          const reservationCount = counts[year.year] || 0;

          return (
            <button
              key={year.year}
              onClick={() => setSelectedYear(year)}
              disabled={year.isActive}
              className={`
                ${colors.bg} ${colors.border} border-2 rounded-xl p-3
                hover:scale-105 transition-all duration-200
                ${year.isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-opacity-100'}
                ${year.year === 2036 ? 'ring-2 ring-fire-gold ring-offset-2 ring-offset-black' : ''}
              `}
            >
              <div className="text-center">
                <span className="text-3xl">{year.emoji}</span>
                <p className={`${colors.text} font-bold text-lg`}>{year.year}</p>
                <p className="text-white text-xs font-semibold">
                  {year.element} {year.animal}
                </p>
                <p className="text-gray-500 text-[10px]">{year.animalChinese}</p>
                {year.isActive ? (
                  <span className="inline-block mt-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    LIVE NOW
                  </span>
                ) : reservationCount > 0 ? (
                  <span className="inline-block mt-1 bg-fire-gold/20 text-fire-gold text-[10px] px-2 py-0.5 rounded-full">
                    {reservationCount} reserved
                  </span>
                ) : (
                  <span className="inline-block mt-1 bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full">
                    Reserve spot
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Show All / Show Less Toggle */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-fire-gold hover:text-yellow-300 text-sm underline underline-offset-4"
        >
          {showAll ? '← Show fewer years' : `Show all 11 future years →`}
        </button>
      </div>

      {/* Fire Dragon Highlight */}
      {!showAll && (
        <div className="bg-gradient-to-r from-red-900/50 via-yellow-900/30 to-red-900/50 border-2 border-fire-gold rounded-xl p-4 text-center mb-6">
          <p className="text-fire-gold text-xs uppercase tracking-widest mb-1">
            ⭐ Most Anticipated ⭐
          </p>
          <p className="text-white text-xl font-bold">
            🐉 Fire Dragon 2036 — THE BIG ONE
          </p>
          <p className="text-gray-300 text-sm mt-1">
            The most powerful zodiac combination. Dragon + Fire = Imperial majesty.
            <br />
            <span className="text-fire-gold">Reserve your spot 10 years early.</span>
          </p>
        </div>
      )}

      {/* Reservation Modal */}
      {selectedYear && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedYear(null);
            setMessage(null);
          }}
        >
          <div
            className={`
              ${ELEMENT_COLORS[selectedYear.element].bg}
              ${ELEMENT_COLORS[selectedYear.element].border}
              border-2 rounded-2xl p-6 max-w-md w-full
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedYear(null);
                setMessage(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Year Info */}
            <div className="text-center mb-6">
              <span className="text-5xl">{selectedYear.emoji}</span>
              <h3 className={`${ELEMENT_COLORS[selectedYear.element].text} text-2xl font-bold mt-2`}>
                {selectedYear.brandName}
              </h3>
              <p className="text-white text-lg">
                {selectedYear.element} {selectedYear.animal} {selectedYear.year}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {selectedYear.description}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Chinese New Year: {selectedYear.cnyDate}
              </p>
            </div>

            {/* Success/Error Message */}
            {message && (
              <div className={`
                mb-4 p-3 rounded-lg text-center
                ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}
              `}>
                {message.text}
              </div>
            )}

            {/* Reservation Form */}
            {!message?.type || message.type !== 'success' ? (
              <form onSubmit={handleReserve} className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">
                    Email (for notification only)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-fire-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-1">
                    Preferred Mode (optional)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'wealth', emoji: '🎲', label: 'Wealth' },
                      { id: 'power', emoji: '⚔️', label: 'Power' },
                      { id: 'love', emoji: '❤️', label: 'Love' },
                      { id: 'shield', emoji: '🛡️', label: 'Shield' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPreferredMode(preferredMode === mode.id ? '' : mode.id)}
                        className={`
                          p-2 rounded-lg text-center border transition-all
                          ${preferredMode === mode.id
                            ? 'bg-fire-gold/20 border-fire-gold text-white'
                            : 'bg-black/30 border-gray-700 text-gray-400 hover:border-gray-500'
                          }
                        `}
                      >
                        <span className="text-lg">{mode.emoji}</span>
                        <p className="text-[10px]">{mode.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg transition-all
                    ${isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-fire-gold via-yellow-500 to-fire-gold text-black hover:scale-105'
                    }
                  `}
                >
                  {isSubmitting ? 'Reserving...' : `Reserve My ${selectedYear.year} Oracle`}
                </button>

                <p className="text-gray-500 text-xs text-center">
                  🛡️ Privacy: We only store your email to notify you when {selectedYear.year} opens.
                  <br />
                  No spam. No selling data. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-green-400 text-lg font-bold">🎉 You&apos;re in!</p>
                <p className="text-gray-300 text-sm mt-2">
                  We&apos;ll email you when the {selectedYear.element} {selectedYear.animal} Oracle opens.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Note */}
      <div className="text-center text-gray-500 text-xs mt-4">
        <span className="text-green-400">🛡️</span> Reservations are non-binding.
        We only use your email to notify you when your year opens.
      </div>
    </div>
  );
}
