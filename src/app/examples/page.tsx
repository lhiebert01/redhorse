'use client';

import { useState } from 'react';
import { EXAMPLE_PEOPLE, MODE_EMOJI, MODE_COLOR } from '@/constants/examples';

// Zodiac data organized by element groups
const ZODIAC_ANIMALS = [
  { name: 'Rat', chinese: '鼠', years: '1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020', emoji: '🐀' },
  { name: 'Ox', chinese: '牛', years: '1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021', emoji: '🐂' },
  { name: 'Tiger', chinese: '虎', years: '1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022', emoji: '🐅' },
  { name: 'Rabbit', chinese: '兔', years: '1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023', emoji: '🐇' },
  { name: 'Dragon', chinese: '龙', years: '1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024', emoji: '🐉' },
  { name: 'Snake', chinese: '蛇', years: '1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025', emoji: '🐍' },
  { name: 'Horse', chinese: '马', years: '1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026', emoji: '🐴' },
  { name: 'Goat', chinese: '羊', years: '1943, 1955, 1967, 1979, 1991, 2003, 2015', emoji: '🐐' },
  { name: 'Monkey', chinese: '猴', years: '1944, 1956, 1968, 1980, 1992, 2004, 2016', emoji: '🐵' },
  { name: 'Rooster', chinese: '鸡', years: '1945, 1957, 1969, 1981, 1993, 2005, 2017', emoji: '🐓' },
  { name: 'Dog', chinese: '狗', years: '1946, 1958, 1970, 1982, 1994, 2006, 2018', emoji: '🐕' },
  { name: 'Pig', chinese: '猪', years: '1947, 1959, 1971, 1983, 1995, 2007, 2019', emoji: '🐖' },
];

export default function ExamplesPage() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const selectedExample = selectedPerson !== null
    ? EXAMPLE_PEOPLE.find(p => p.id === selectedPerson)
    : null;

  return (
    <main className="min-h-screen bg-fire-gradient relative overflow-hidden">
      {/* Background Watermark */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/Year-of-Horse-Hero-Image3.jpeg)',
          backgroundSize: '105%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.55,
          filter: 'blur(1px)',
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Back Link */}
        <div className="text-center mb-4">
          <a href="/" className="text-fire-gold hover:text-yellow-300 text-sm">
            ← Back to Home
          </a>
        </div>

        {/* SECTION 1: BIG HERO - Once in 60 Years */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-fire-gold text-glow-gold mb-4">
            2026 is the Year of the
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-white text-glow-gold mb-4">
            Fire Horse 火马年
          </h2>
          <p className="text-2xl md:text-3xl text-fire-gold font-bold mb-4">
            A Once-in-60-Year Opportunity
          </p>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            The Fire Horse returns only once every 60 years. Its blazing energy can ignite your
            <span className="text-yellow-400 font-bold"> wealth</span>,
            amplify your <span className="text-red-400 font-bold">power</span>,
            transform your <span className="text-pink-400 font-bold">love life</span>, or
            strengthen your <span className="text-blue-400 font-bold">protection</span>.
          </p>
        </section>

        {/* SECTION 2: $8.88 CTA with Stripe Graphic */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Red-Horse-Oracle-Stripe-Graphic.jpeg"
              alt="Fire Horse Oracle - Four Modes: Wealth, Power, Love, Shield - $8.88"
              className="w-full max-w-sm rounded-2xl border-2 border-fire-gold/50 shadow-2xl"
            />
            <div className="text-center md:text-left">
              <p className="text-white text-xl mb-2">Choose Your Path:</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="bg-black/60 px-3 py-1 rounded-full text-yellow-400 text-sm">🎲 Wealth</span>
                <span className="bg-black/60 px-3 py-1 rounded-full text-red-500 text-sm">⚔️ Power</span>
                <span className="bg-black/60 px-3 py-1 rounded-full text-pink-400 text-sm">❤️ Love</span>
                <span className="bg-black/60 px-3 py-1 rounded-full text-blue-400 text-sm">🛡️ Shield</span>
              </div>
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
                           text-black font-bold text-xl py-4 px-8 rounded-xl
                           hover:scale-105 active:scale-95 transition-all duration-200
                           shadow-xl shadow-yellow-500/30"
              >
                Get Your Prophecy - $8.88
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3: EXAMPLES - See What Others Have Received */}
        <section className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-fire-gold text-glow-gold text-center mb-2">
            See What Others Have Received
          </h2>
          <p className="text-gray-300 text-center mb-4">
            Example prophecies from all 12 zodiac signs. Click any card to see the full talisman.
          </p>

          {/* Privacy Notice for Examples */}
          <a
            href="/privacy"
            className="block max-w-2xl mx-auto bg-green-900/20 border border-green-700/50 rounded-xl p-4 mb-6 hover:border-green-500 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-green-400 font-bold text-sm">Privacy by Design - Illustrative Examples Only</p>
                <p className="text-gray-400 text-xs mt-1">
                  These examples show <strong className="text-white">fictional names</strong> for illustration purposes only.
                  <strong className="text-green-400"> Your real Oracle will never display any names, birth dates, or personal information.</strong> We collect no PII - your birth date is used only to calculate your zodiac sign and is immediately discarded.
                </p>
                <p className="text-gray-500 text-xs mt-1 underline">Learn more about our Privacy by Design →</p>
              </div>
            </div>
          </a>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAMPLE_PEOPLE.map((person) => (
              <div
                key={person.id}
                className="bg-black/70 border border-fire-gold/30 rounded-2xl p-4 hover:border-fire-gold transition-all duration-300"
              >
                {/* Person Header */}
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/zodiac/${person.zodiac}.jpeg`}
                    alt={person.zodiac}
                    className="w-14 h-14 rounded-full border-2 border-fire-gold/50 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-fire-gold font-bold">{person.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {person.element} {person.zodiac.charAt(0).toUpperCase() + person.zodiac.slice(1)} {person.zodiacChinese}
                    </p>
                  </div>
                  <span className="text-2xl">{MODE_EMOJI[person.mode]}</span>
                </div>

                {/* Prophecy */}
                <div className="bg-red-950/50 rounded-lg p-2 mb-3">
                  <p className="text-fire-gold font-bold text-center">
                    {person.mainText}
                  </p>
                </div>

                {/* Mode Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${MODE_COLOR[person.mode]}`}>
                    {person.mode.charAt(0).toUpperCase() + person.mode.slice(1)} Mode
                  </span>
                </div>

                {/* CLICK TO EXPAND Button */}
                <button
                  onClick={() => setSelectedPerson(person.id)}
                  className="w-full bg-gradient-to-r from-fire-gold/20 to-yellow-600/20 hover:from-fire-gold/40 hover:to-yellow-600/40 border-2 border-fire-gold text-fire-gold font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <span className="text-lg">🔍</span>
                  <span>CLICK TO EXPAND</span>
                  <span className="text-lg">→</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Find Your Zodiac Sign */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-fire-gold text-center mb-2">
            What&apos;s Your Chinese Zodiac Sign?
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Find your birth year to discover your zodiac animal
          </p>

          {/* Master Chart */}
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/zodiac/Fire-Horse-2026-Chart.jpeg"
              alt="Year of the Fire Horse 2026 - All 12 Zodiac Animals"
              className="w-full max-w-xl rounded-2xl border-2 border-fire-gold/50 shadow-2xl"
            />
          </div>

          {/* Zodiac Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ZODIAC_ANIMALS.map((animal) => (
              <div
                key={animal.name}
                className="bg-black/70 border border-fire-gold/30 rounded-xl p-3 hover:border-fire-gold transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/zodiac/${animal.name.toLowerCase()}.jpeg`}
                    alt={animal.name}
                    className="w-10 h-10 rounded-full border border-fire-gold/50 object-cover"
                  />
                  <div>
                    <span className="text-fire-gold font-bold text-sm">{animal.name}</span>
                    <span className="text-white ml-1 text-sm">{animal.chinese}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {animal.years}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mb-8">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
                       text-black font-bold text-xl py-4 px-8 rounded-xl
                       hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-xl shadow-yellow-500/30"
          >
            Get Your Own Prophecy - $8.88
          </a>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-white font-bold">
          <p>
            Strictly for entertainment purposes only. AI-generated artwork.
            <br />
            Not financial, legal, or gambling advice.
          </p>
          <p className="mt-2">© 2026 Red Horse Oracle. 18+.</p>
        </footer>
      </div>

      {/* Modal for viewing talisman with sidebar */}
      {selectedExample && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/90"
          onClick={() => { setSelectedPerson(null); setShowFullImage(false); }}
        >
          <div
            className="bg-black/95 border-2 border-fire-gold rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Fixed Top Right */}
            <button
              onClick={() => { setSelectedPerson(null); setShowFullImage(false); }}
              className="absolute top-3 right-3 z-10 bg-black/80 hover:bg-fire-gold/30 border border-fire-gold text-fire-gold font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all text-xl"
              title="Close (or press Enter)"
            >
              ✕
            </button>

            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* LEFT: Talisman Image - Clickable for Full Size */}
              <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col items-center justify-center bg-gradient-to-br from-red-950/30 to-black/50">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setShowFullImage(true)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedExample.talismanImage}
                    alt={`${selectedExample.name}'s Fire Horse Talisman`}
                    className="w-full max-w-md rounded-xl border-2 border-fire-gold/50 shadow-2xl group-hover:border-fire-gold transition-all"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/zodiac/Fire-Horse-2026-Chart.jpeg';
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-all bg-black/80 text-fire-gold font-bold px-4 py-2 rounded-xl border border-fire-gold">
                      🔍 VIEW FULL SIZE
                    </span>
                  </div>
                </div>
                {/* Explicit Button to View Full Size */}
                <button
                  onClick={() => setShowFullImage(true)}
                  className="mt-3 bg-gradient-to-r from-fire-gold/20 to-yellow-600/20 hover:from-fire-gold/40 hover:to-yellow-600/40 border border-fire-gold text-fire-gold font-bold py-2 px-6 rounded-xl transition-all flex items-center gap-2"
                >
                  <span>🔍</span>
                  <span>VIEW FULL SIZE IMAGE</span>
                </button>
                <p className="text-gray-500 text-xs mt-1 text-center">
                  See the complete high-resolution artwork
                </p>
              </div>

              {/* RIGHT: Sidebar Explainer */}
              <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Personalized Fire Horse Oracle</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-fire-gold">{selectedExample.name}&apos;s Talisman</h2>
                </div>

                {/* Value Proposition */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 border border-fire-gold/50 rounded-xl p-4 mb-4">
                  <p className="text-white text-sm leading-relaxed">
                    <span className="text-fire-gold font-bold">Masterpiece Chinese Zodiac Artwork</span> — Each talisman is a
                    <span className="text-yellow-400 font-bold"> one-of-a-kind</span>, personalized image created specifically for
                    the recipient&apos;s birthday and Chinese zodiac sign as it relates to the
                    <span className="text-fire-gold font-bold"> Year of the Fire Horse 2026</span>.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-black/50 text-gray-300 text-xs px-2 py-1 rounded-full">📥 Download</span>
                    <span className="bg-black/50 text-gray-300 text-xs px-2 py-1 rounded-full">🔗 Share</span>
                    <span className="bg-black/50 text-gray-300 text-xs px-2 py-1 rounded-full">🖨️ Print</span>
                    <span className="bg-black/50 text-gray-300 text-xs px-2 py-1 rounded-full">✨ Unique</span>
                  </div>
                </div>

                {/* Zodiac Info with Image */}
                <div className="bg-red-950/40 rounded-xl p-4 mb-4">
                  <p className="text-gray-300 text-sm mb-3">Born in the Year of the...</p>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/zodiac/${selectedExample.zodiac}.jpeg`}
                      alt={selectedExample.zodiac}
                      className="w-20 h-20 rounded-xl border-2 border-fire-gold object-cover"
                    />
                    <div>
                      <p className="text-fire-gold font-bold text-2xl">
                        {selectedExample.zodiac.charAt(0).toUpperCase() + selectedExample.zodiac.slice(1)} {selectedExample.zodiacChinese}
                      </p>
                      <p className="text-gray-400">
                        {selectedExample.element} Element
                      </p>
                      <p className="text-gray-500 text-sm">
                        DOB: {selectedExample.dob} (Age {selectedExample.age})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mode Explanation */}
                <div className="bg-black/50 border border-fire-gold/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{MODE_EMOJI[selectedExample.mode]}</span>
                    <div>
                      <p className={`font-bold text-xl ${MODE_COLOR[selectedExample.mode]}`}>
                        {selectedExample.mode.charAt(0).toUpperCase() + selectedExample.mode.slice(1)} Mode
                      </p>
                      <p className="text-gray-400 text-sm">{selectedExample.modeLabel}</p>
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {selectedExample.mode === 'wealth' && (
                      <>This talisman reveals <span className="text-yellow-400 font-bold">6 Lucky Numbers</span> channeled by the Fire Horse for {selectedExample.name}&apos;s fortune in 2026.</>
                    )}
                    {selectedExample.mode === 'power' && (
                      <>This talisman bestows a <span className="text-red-400 font-bold">3-Word Strategic Battle Motto</span> from the Fire Horse to fuel {selectedExample.name}&apos;s ambitions.</>
                    )}
                    {selectedExample.mode === 'love' && (
                      <>This talisman delivers a <span className="text-pink-400 font-bold">4-Word Love Decree</span> from the Fire Horse to guide {selectedExample.name}&apos;s heart.</>
                    )}
                    {selectedExample.mode === 'shield' && (
                      <>This talisman grants a <span className="text-blue-400 font-bold">3-Word Protective Mantra</span> from the Fire Horse to shield {selectedExample.name} from harm.</>
                    )}
                  </p>
                </div>

                {/* The Prophecy */}
                <div className="bg-gradient-to-r from-red-950/60 to-red-900/40 border border-fire-gold rounded-xl p-4 mb-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">The Prophecy</p>
                  <p className="text-fire-gold font-bold text-xl md:text-2xl text-center">
                    {selectedExample.mainText}
                  </p>
                </div>

                {/* Testimonial */}
                <div className="bg-black/30 rounded-xl p-4 mb-4">
                  <p className="text-white italic text-sm">
                    &quot;{selectedExample.testimonial}&quot;
                  </p>
                  <p className="text-fire-gold text-sm mt-2 text-right">
                    — {selectedExample.name}
                  </p>
                </div>

                {/* Privacy Notice in Modal */}
                <a
                  href="/privacy"
                  className="block bg-green-900/20 border border-green-700/50 rounded-xl p-3 mb-4 hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>🛡️</span>
                    <p className="text-green-400 font-bold text-xs">Privacy by Design</p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-white">This is an illustrative example.</strong> Names shown are fictional.
                    Your real Oracle will contain <strong className="text-green-400">no names, no birth dates, no PII</strong>.
                    Generated by Gemini 3 Pro AI. <span className="underline">Learn more →</span>
                  </p>
                </a>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setSelectedPerson(null); setShowFullImage(false); }}
                    className="flex-1 bg-transparent border-2 border-fire-gold text-fire-gold font-bold py-3 px-4 rounded-xl hover:bg-fire-gold/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>←</span> See More Examples
                  </button>
                  <a
                    href="/"
                    className="flex-1 bg-fire-gold text-black font-bold py-3 px-4 rounded-xl hover:scale-105 transition-transform text-center"
                  >
                    Get Your Own Prophecy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Image Lightbox */}
      {showFullImage && selectedExample && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95"
          onClick={() => setShowFullImage(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 z-10 bg-fire-gold hover:bg-yellow-400 text-black font-bold w-12 h-12 rounded-full flex items-center justify-center transition-all text-2xl shadow-lg"
          >
            ✕
          </button>

          {/* Back Button */}
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 left-4 z-10 bg-black/80 hover:bg-fire-gold/30 border border-fire-gold text-fire-gold font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
          >
            <span>←</span> Back
          </button>

          {/* Full Size Image */}
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedExample.talismanImage}
              alt={`${selectedExample.name}'s Fire Horse Talisman - Full Size`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl border-2 border-fire-gold shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/zodiac/Fire-Horse-2026-Chart.jpeg';
              }}
            />
            <p className="text-fire-gold font-bold mt-4 text-center text-lg">
              {selectedExample.name}&apos;s Fire Horse Talisman
            </p>
            <p className="text-gray-400 text-sm text-center">
              Click anywhere or press the X to close
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
