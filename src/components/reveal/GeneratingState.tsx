'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GeneratingStateProps {
  zodiacSign?: string | null;
  zodiacElement?: string | null;
  focusMode?: string | null;
}

const MESSAGES = [
  'Summoning the Fire Horse Oracle...',
  'The flames are awakening...',
  'Reading the celestial patterns...',
  'Channeling ancient wisdom...',
  'The Oracle consults the stars...',
  'Forging your destiny in fire...',
  'Sacred energies align...',
  'The prophecy takes form...',
  'Mystical forces converge...',
  'Your talisman crystallizes...',
  'The Fire Horse speaks...',
];

const MODE_MESSAGES: Record<string, string[]> = {
  wealth: ['Counting your fortune...', 'Lucky numbers emerging...', 'Prosperity flows...'],
  power: ['Forging your battle cry...', 'Power words ignite...', 'Victory beckons...'],
  love: ['Hearts align...', 'Love destiny unfolds...', 'Romance awakens...'],
  shield: ['Protection manifests...', 'Sacred shields form...', 'Guardian spirits gather...'],
};

// Ember PNG images with transparency
const EMBER_IMAGES = [
  '/assets/loading/ember1.png',
  '/assets/loading/ember2.png',
  '/assets/loading/ember3.png',
  '/assets/loading/ember4.png',
  '/assets/loading/ember5.png',
  '/assets/loading/ember6.png',
];

export default function GeneratingState({ zodiacSign, zodiacElement, focusMode }: GeneratingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Combine general messages with mode-specific ones
  const modeKey = focusMode?.toLowerCase();
  const allMessages = modeKey && MODE_MESSAGES[modeKey]
    ? [...MESSAGES, ...MODE_MESSAGES[modeKey]]
    : MESSAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % allMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [allMessages.length]);

  // Get zodiac image path
  const zodiacImagePath = zodiacSign
    ? `/assets/zodiac/${zodiacSign.toLowerCase()}.jpeg`
    : null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background - Same as landing page for brand consistency */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/Year-of-Horse-Hero-Image3.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.55,
        }}
      />
      {/* Dark gradient overlay for depth and readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Floating Ember Particles - PNG with transparency - BIGGER, FASTER, DENSER */}
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-ember"
            style={{
              left: `${2 + (i * 5)}%`,
              bottom: '-80px',
              width: '55px',
              height: '75px',
              animationDuration: `${2.5 + Math.random() * 2}s`,
              animationDelay: `${i * 0.25}s`,
              opacity: 0.85,
            }}
          >
            <Image
              src={EMBER_IMAGES[i % EMBER_IMAGES.length]}
              alt=""
              width={55}
              height={75}
              className="object-contain"
              style={{ filter: 'brightness(1.4) drop-shadow(0 0 12px rgba(255, 165, 0, 0.9))' }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-64 md:w-80 h-32 md:h-40 mb-1">
          <Image
            src="/assets/loading/logo-firehorse1.jpeg"
            alt="Red Horse Oracle"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Zodiac info if available */}
        {zodiacSign && (
          <p
            className="text-xl md:text-2xl font-bold mb-2 text-center uppercase tracking-wider"
            style={{
              color: '#ffd700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.6)',
            }}
          >
            {zodiacElement && `${zodiacElement} `}{zodiacSign} × Fire Horse
          </p>
        )}

        {/* Fire Horse with Frame - PNG transparency - 25% BIGGER */}
        <div className="relative w-96 h-96 md:w-[480px] md:h-[480px] mb-2">
          {/* Glow effect behind everything */}
          <div
            className="absolute inset-4 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 165, 0, 0.5) 0%, rgba(255, 69, 0, 0.3) 50%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />

          {/* Fire Frame - slowly rotating */}
          <div className="absolute inset-0 animate-spin-slow">
            <Image
              src="/assets/loading/fire-frame.png"
              alt=""
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.6))',
              }}
            />
          </div>

          {/* Bouncing Fire Horse - centered inside frame */}
          <div className="absolute inset-12 animate-bounce-horse">
            <Image
              src="/assets/loading/fire-horse-bouncing-3.png"
              alt="Fire Horse"
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 50px rgba(255, 69, 0, 0.6))',
              }}
              priority
            />
          </div>
        </div>

        {/* Zodiac Sign Display */}
        {zodiacSign && zodiacImagePath && (
          <div className="flex items-center gap-4 mb-2 bg-black/40 px-6 py-2 rounded-full border border-fire-gold/40">
            <div
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-fire-gold"
              style={{
                boxShadow: '0 0 20px rgba(255, 165, 0, 0.6)',
              }}
            >
              <Image
                src={zodiacImagePath}
                alt={zodiacSign}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest">Generating for</p>
              <p
                className="text-2xl md:text-3xl font-bold"
                style={{
                  color: '#ffd700',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
                }}
              >
                {zodiacSign}
              </p>
            </div>
          </div>
        )}

        {/* Loading Message */}
        <p
          className="text-2xl md:text-3xl font-bold text-center mb-2 min-h-[3rem]"
          style={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 165, 0, 0.7), 0 0 60px rgba(255, 69, 0, 0.5)',
          }}
        >
          {allMessages[messageIndex]}
        </p>

        {/* Progress Indicator */}
        <div className="mt-2 flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full animate-bounce"
              style={{
                backgroundColor: '#ffd700',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.9), 0 0 30px rgba(255, 165, 0, 0.6)',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Subtext */}
        <p
          className="mt-3 text-lg md:text-xl text-center max-w-md font-medium"
          style={{
            color: '#ffffff',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
          }}
        >
          Your personalized Fire Horse talisman is being crafted.
        </p>
        <p
          className="mt-1 text-base md:text-lg text-center font-medium"
          style={{
            color: '#ffd700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          This typically takes 30-60 seconds.
        </p>

        {/* Fun fact */}
        <div
          className="mt-4 px-6 py-3 rounded-xl border border-fire-gold/40 max-w-md"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p className="text-base text-center" style={{ color: '#e5e5e5' }}>
            <span className="text-fire-gold font-bold">Did you know?</span> The Fire Horse year occurs only once every 60 years. The last was 1966, the next will be 2086.
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-ember {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh) translateX(30px) rotate(20deg);
            opacity: 0;
          }
        }
        @keyframes bounce-horse {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.02);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-float-ember {
          animation: float-ember linear infinite;
        }
        .animate-bounce-horse {
          animation: bounce-horse 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
