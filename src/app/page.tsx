'use client';

import { PRODUCT_MODES } from '@/constants/modes';

export default function Home() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  return (
    <main className="min-h-screen bg-fire-gradient relative overflow-hidden">
      {/* Background Watermark - Faded Fire Horse */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/hero-fire-horse.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.25,
          filter: 'blur(1px)',
        }}
      />
      {/* Gradient overlay to blend watermark */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Admin Test Button - Gear Icon */}
      <a
        href="/admin-test"
        className="absolute top-4 right-4 p-3 text-gray-400 hover:text-fire-gold transition-all duration-300 opacity-50 hover:opacity-100 hover:rotate-90 z-20"
        title="Admin Test"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </a>

      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center min-h-screen relative z-10">
        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-fire-gold tracking-tighter text-glow-gold text-center mt-4 mb-4">
          RED HORSE
          <br />
          ORACLE
        </h1>

        {/* Hero Image */}
        <div className="relative w-full max-w-sm mb-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 rounded-2xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-fire-horse.jpg"
            alt="Year of the Fire Horse 2026 - Sacred Talisman"
            className="w-full h-auto rounded-2xl border-2 border-fire-gold/50 shadow-2xl shadow-red-900/50"
          />
          <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
            <p className="text-white text-sm font-semibold drop-shadow-lg">
              The Fire Horse returns once every 60 years.
            </p>
            <p className="text-red-400 text-xs drop-shadow-lg">
              Chaos is coming. Do not guess your destiny.
            </p>
          </div>
        </div>

        {/* Product Card */}
        <div className="w-full border-glow bg-black/80 backdrop-blur-sm p-6 rounded-2xl space-y-5 mb-6">
          {/* Section Header */}
          <div className="text-center">
            <p className="text-fire-gold font-bold text-lg">Choose Your Path</p>
            <p className="text-gray-400 text-xs">Select one mode at checkout</p>
          </div>

          {/* Product Modes */}
          <div className="space-y-3">
            {Object.values(PRODUCT_MODES).map((mode) => (
              <div
                key={mode.id}
                className="bg-red-950/40 border border-red-900/30 rounded-xl p-3 hover:border-fire-gold/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{mode.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-fire-gold text-sm">{mode.name}</span>
                    </div>
                    <p className="text-white text-sm font-semibold">
                      {mode.description}
                    </p>
                    <p className="text-gray-500 text-xs italic">
                      e.g., &quot;{mode.example}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-red-900/50" />

          {/* Price Display */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">One-time payment</p>
            <p className="text-4xl font-bold text-fire-gold text-glow-gold">$8.88</p>
            <p className="text-gray-500 text-xs mt-1">The number of fortune</p>
          </div>

          {/* CTA Button */}
          <a
            href={paymentLink}
            className="block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600
                       text-black font-bold text-xl py-4 rounded-xl text-center
                       hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-xl shadow-yellow-500/30 glow-gold"
          >
            UNLOCK YOUR PROPHECY
          </a>

          {/* Trust Badges */}
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span>🔒 Secure</span>
            <span>⚡ Instant</span>
            <span>🎨 AI Art</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-6">
          <p className="text-red-400 text-sm italic">
            &quot;The Oracle revealed my path. I won $500 the next day.&quot;
          </p>
          <p className="text-gray-600 text-xs mt-1">— Fire Horse Believer</p>
        </div>

        {/* Footer / Disclaimer */}
        <footer className="text-center text-xs text-gray-600 max-w-sm">
          <p>
            Strictly for entertainment purposes only. AI-generated artwork.
            <br />
            Not financial, legal, or gambling advice.
          </p>
          <p className="mt-2">© 2026 Red Horse Oracle. 18+.</p>
          <div className="mt-3 space-x-4">
            <a href="/terms" className="hover:text-gray-400 underline">
              Terms
            </a>
            <a href="/privacy" className="hover:text-gray-400 underline">
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
