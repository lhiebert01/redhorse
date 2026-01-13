'use client';

import { PRODUCT_MODES } from '@/constants/modes';

export default function Home() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  return (
    <main className="min-h-screen bg-fire-gradient">
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-fire-gold tracking-tighter text-glow-gold">
            RED HORSE
            <br />
            ORACLE
          </h1>

          <p className="text-white text-lg opacity-90 leading-relaxed">
            The Fire Horse returns once every 60 years.
            <br />
            <span className="text-red-400">Chaos is coming.</span>
            <br />
            <span className="font-bold text-fire-gold text-glow-gold">
              Do not guess your destiny.
            </span>
          </p>
        </div>

        {/* Product Card */}
        <div className="w-full border-glow bg-black/60 backdrop-blur-sm p-8 rounded-2xl space-y-6 mb-8">
          {/* Product Modes */}
          <div className="space-y-4">
            {Object.values(PRODUCT_MODES).map((mode) => (
              <div
                key={mode.id}
                className="flex items-center gap-4 text-red-200 hover:text-white transition-colors"
              >
                <span className="text-3xl">{mode.emoji}</span>
                <div>
                  <span className="font-bold text-fire-gold">{mode.tagline}:</span>
                  <span className="ml-2 text-sm">{mode.description}</span>
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
          <div className="flex justify-center gap-6 text-xs text-gray-500">
            <span>🔒 Secure Payment</span>
            <span>⚡ Instant Delivery</span>
            <span>🎨 AI Generated</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-8">
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
          <div className="mt-4 space-x-4">
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
