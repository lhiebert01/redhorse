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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Back Link */}
        <div className="text-center mb-6">
          <a href="/" className="text-fire-gold hover:text-yellow-300 text-sm">
            ← Back to Home
          </a>
        </div>

        {/* SECTION 1: The Teaser Question */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-fire-gold text-glow-gold mb-6">
            Were You Born in the Year of the...
          </h1>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {ZODIAC_ANIMALS.map((animal) => (
              <span
                key={animal.name}
                className="bg-black/60 border border-fire-gold/40 px-4 py-2 rounded-full text-white hover:border-fire-gold hover:scale-105 transition-all cursor-default"
              >
                <span className="mr-2">{animal.emoji}</span>
                <span className="font-bold text-fire-gold">{animal.name}</span>
                <span className="text-gray-400 ml-1">{animal.chinese}</span>
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm">
            Find your birth year below to discover your zodiac animal
          </p>
        </section>

        {/* SECTION 2: Master Zodiac Chart */}
        <section className="mb-12">
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/zodiac/Fire-Horse-2026-Chart.jpeg"
              alt="Year of the Fire Horse 2026 - All 12 Zodiac Animals"
              className="w-full max-w-2xl rounded-2xl border-2 border-fire-gold/50 shadow-2xl"
            />
          </div>
        </section>

        {/* SECTION 3: Zodiac Year Finder */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-fire-gold text-center mb-6">
            Find Your Chinese Zodiac Animal
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ZODIAC_ANIMALS.map((animal) => (
              <div
                key={animal.name}
                className="bg-black/70 border border-fire-gold/30 rounded-xl p-4 hover:border-fire-gold transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/zodiac/${animal.name.toLowerCase()}.jpeg`}
                    alt={animal.name}
                    className="w-12 h-12 rounded-full border border-fire-gold/50 object-cover"
                  />
                  <div>
                    <span className="text-fire-gold font-bold">{animal.name}</span>
                    <span className="text-white ml-1">{animal.chinese}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {animal.years}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: The Marketing Pitch */}
        <section className="mb-12 text-center">
          <div className="bg-gradient-to-r from-red-950/80 via-black/80 to-red-950/80 border-2 border-fire-gold rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              2026 is the Year of the <span className="text-fire-gold">Fire Horse</span>
            </h2>
            <p className="text-xl text-fire-gold font-bold mb-4">
              A Once-in-60-Year Opportunity
            </p>
            <p className="text-gray-200 text-lg mb-6">
              The Fire Horse returns only once every 60 years. Its blazing energy can ignite
              your <span className="text-yellow-400 font-bold">wealth</span>,
              amplify your <span className="text-red-400 font-bold">power</span>,
              transform your <span className="text-pink-400 font-bold">love life</span>, or
              strengthen your <span className="text-blue-400 font-bold">protection</span>.
            </p>
            <p className="text-white text-lg font-semibold">
              Which blessing will YOU seek from the Fire Horse Oracle?
            </p>
          </div>
        </section>

        {/* SECTION 5: The Four Modes with Stripe Graphic */}
        <section className="mb-12">
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Red-Horse-Oracle-Stripe-Graphic.jpeg"
              alt="Fire Horse Oracle - Four Modes: Wealth, Power, Love, Shield"
              className="w-full max-w-lg rounded-2xl border-2 border-fire-gold/50 shadow-2xl"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
              <span>🎲</span>
              <span className="text-yellow-400 font-bold">Wealth</span>
              <span className="text-gray-400 text-sm">6 Lucky Numbers</span>
            </div>
            <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
              <span>⚔️</span>
              <span className="text-red-500 font-bold">Power</span>
              <span className="text-gray-400 text-sm">3-Word Battle Motto</span>
            </div>
            <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
              <span>❤️</span>
              <span className="text-pink-400 font-bold">Love</span>
              <span className="text-gray-400 text-sm">4-Word Love Decree</span>
            </div>
            <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
              <span>🛡️</span>
              <span className="text-blue-400 font-bold">Shield</span>
              <span className="text-gray-400 text-sm">3-Word Protective Mantra</span>
            </div>
          </div>
        </section>

        {/* SECTION 6: Examples Introduction */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fire-gold text-glow-gold mb-4">
            See What Others Have Received
          </h2>
          <p className="text-white text-lg max-w-2xl mx-auto mb-2">
            Here are examples of people from all 12 zodiac signs who consulted the Fire Horse Oracle.
            Each received a personalized talisman with their unique prophecy.
          </p>
          <p className="text-gray-400 text-sm italic">
            *These are hypothetical examples with fictional names for demonstration purposes.
          </p>
        </section>

        {/* SECTION 7: Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {EXAMPLE_PEOPLE.map((person) => (
            <div
              key={person.id}
              onClick={() => setSelectedPerson(person.id)}
              className="bg-black/70 border border-fire-gold/30 rounded-2xl p-4 cursor-pointer hover:border-fire-gold hover:scale-105 transition-all duration-300"
            >
              {/* Person Header */}
              <div className="flex items-center gap-3 mb-3">
                {/* Zodiac Icon */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/zodiac/${person.zodiac}.jpeg`}
                  alt={person.zodiac}
                  className="w-16 h-16 rounded-full border-2 border-fire-gold/50 object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-fire-gold font-bold text-lg">{person.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {person.element} {person.zodiac.charAt(0).toUpperCase() + person.zodiac.slice(1)} {person.zodiacChinese}
                  </p>
                  <p className="text-gray-500 text-xs">DOB: {person.dob}</p>
                </div>
              </div>

              {/* Mode Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{MODE_EMOJI[person.mode]}</span>
                <span className={`font-bold ${MODE_COLOR[person.mode]}`}>
                  {person.mode.charAt(0).toUpperCase() + person.mode.slice(1)} Mode
                </span>
              </div>

              {/* Main Text / Prophecy */}
              <div className="bg-red-950/50 rounded-lg p-2 mb-2">
                <p className="text-fire-gold font-bold text-center text-sm">
                  {person.mainText}
                </p>
              </div>

              {/* Testimonial Preview */}
              <p className="text-gray-300 text-xs italic line-clamp-2">
                &quot;{person.testimonial.substring(0, 60)}...&quot;
              </p>

              {/* Click to View */}
              <p className="text-fire-gold text-xs mt-3 text-center">
                Click to view talisman →
              </p>
            </div>
          ))}
        </div>

        {/* SECTION 8: Final CTA */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-r from-yellow-900/50 via-red-900/50 to-yellow-900/50 border-2 border-fire-gold rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Receive <span className="text-fire-gold">Your</span> Prophecy?
            </h2>
            <p className="text-gray-200 mb-6">
              The Fire Horse awaits. One payment. One talisman. One destiny revealed.
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
                         text-black font-bold text-xl py-4 px-8 rounded-xl
                         hover:scale-105 active:scale-95 transition-all duration-200
                         shadow-xl shadow-yellow-500/30"
            >
              Get Your Own Prophecy - $8.88
            </a>
          </div>
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
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-black/95 border-2 border-fire-gold rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Fixed Top Right */}
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-3 right-3 z-10 bg-black/80 hover:bg-fire-gold/30 border border-fire-gold text-fire-gold font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all text-xl"
              title="Close (or press Enter)"
            >
              ✕
            </button>

            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* LEFT: Talisman Image */}
              <div className="lg:w-1/2 p-4 lg:p-6 flex items-center justify-center bg-gradient-to-br from-red-950/30 to-black/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedExample.talismanImage}
                  alt={`${selectedExample.name}'s Fire Horse Talisman`}
                  className="w-full max-w-md rounded-xl border-2 border-fire-gold/50 shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/zodiac/Fire-Horse-2026-Chart.jpeg';
                  }}
                />
              </div>

              {/* RIGHT: Sidebar Explainer */}
              <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Example Prophecy</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-fire-gold">{selectedExample.name}</h2>
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
                <div className="bg-black/30 rounded-xl p-4 mb-4 flex-grow">
                  <p className="text-white italic">
                    &quot;{selectedExample.testimonial}&quot;
                  </p>
                  <p className="text-fire-gold text-sm mt-2 text-right">
                    — {selectedExample.name}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedPerson(null)}
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
    </main>
  );
}
