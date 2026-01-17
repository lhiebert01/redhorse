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

export default function GeneratingState({ zodiacSign, zodiacElement, focusMode }: GeneratingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showModeMessage, setShowModeMessage] = useState(false);

  // Combine general messages with mode-specific ones
  const modeKey = focusMode?.toLowerCase();
  const allMessages = modeKey && MODE_MESSAGES[modeKey]
    ? [...MESSAGES, ...MODE_MESSAGES[modeKey]]
    : MESSAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % allMessages.length);
      setShowModeMessage(Math.random() > 0.5);
    }, 2500);

    return () => clearInterval(interval);
  }, [allMessages.length]);

  // Get zodiac image path
  const zodiacImagePath = zodiacSign
    ? `/assets/zodiac/${zodiacSign.toLowerCase()}.jpeg`
    : null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background with subtle branding */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/Year-of-Horse-Hero-Image3.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          filter: 'blur(3px)',
        }}
      />
      {/* Dark gradient overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black via-black/80 to-black" />

      {/* Fire particles effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
              background: `radial-gradient(circle, ${
                ['#ff6b35', '#f7c331', '#ff4500', '#ffd700'][Math.floor(Math.random() * 4)]
              }, transparent)`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide text-center"
          style={{
            textShadow: '0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 69, 0, 0.6), 0 0 60px rgba(255, 0, 0, 0.4)',
          }}
        >
          CRAFTING YOUR ORACLE
        </h1>

        {/* Zodiac info if available */}
        {zodiacSign && (
          <p
            className="text-xl md:text-2xl font-semibold mb-6 text-center"
            style={{
              color: '#ffd700',
              textShadow: '0 0 15px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 165, 0, 0.5)',
            }}
          >
            {zodiacElement && `${zodiacElement} `}{zodiacSign} × Fire Horse
          </p>
        )}

        {/* Bouncing Fire Horse with enhanced effects */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8">
          {/* Outer fire glow rings */}
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 69, 0, 0.4) 0%, rgba(255, 0, 0, 0.2) 50%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'scale(1.5)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 165, 0, 0.5) 0%, rgba(255, 69, 0, 0.3) 40%, transparent 60%)',
              filter: 'blur(15px)',
              animationDelay: '0.3s',
              transform: 'scale(1.3)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.3) 30%, transparent 50%)',
              filter: 'blur(10px)',
              animationDelay: '0.6s',
              transform: 'scale(1.1)',
            }}
          />

          {/* Fire Horse Image with bounce and glow */}
          <div
            className="absolute inset-0 flex items-center justify-center animate-bounce-slow"
          >
            <div
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-fire-gold"
              style={{
                boxShadow: '0 0 30px rgba(255, 165, 0, 0.8), 0 0 60px rgba(255, 69, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.3)',
              }}
            >
              <Image
                src="/assets/zodiac/horse.jpeg"
                alt="Fire Horse"
                fill
                className="object-cover"
                style={{
                  filter: 'saturate(1.3) brightness(1.1)',
                }}
              />
              {/* Fire overlay on horse */}
              <div
                className="absolute inset-0 animate-flicker"
                style={{
                  background: 'linear-gradient(to top, rgba(255, 69, 0, 0.3), transparent 60%)',
                }}
              />
            </div>
          </div>

          {/* Fire emoji accents */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</div>
          <div className="absolute top-1/4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🔥</div>
          <div className="absolute top-1/4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🔥</div>
        </div>

        {/* Zodiac Sign Display */}
        {zodiacSign && zodiacImagePath && (
          <div className="flex items-center gap-4 mb-6">
            <div
              className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-fire-gold/60"
              style={{
                boxShadow: '0 0 20px rgba(255, 165, 0, 0.5)',
              }}
            >
              <Image
                src={zodiacImagePath}
                alt={zodiacSign}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-white text-sm uppercase tracking-widest opacity-80">Your Sign</p>
              <p
                className="text-2xl md:text-3xl font-bold"
                style={{
                  color: '#ffd700',
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                }}
              >
                {zodiacSign}
              </p>
            </div>
          </div>
        )}

        {/* Loading Message - BIGGER & BRIGHTER */}
        <p
          className="text-2xl md:text-3xl font-bold text-center mb-4 min-h-[2.5rem]"
          style={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 69, 0, 0.4)',
          }}
        >
          {allMessages[messageIndex]}
        </p>

        {/* Progress Indicator - Bigger & Brighter */}
        <div className="mt-4 flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full animate-bounce"
              style={{
                backgroundColor: '#ffd700',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.5)',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Subtext - Brighter */}
        <p
          className="mt-8 text-lg md:text-xl text-center max-w-md"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        >
          Your personalized Fire Horse talisman is being crafted.
        </p>
        <p
          className="mt-2 text-base md:text-lg text-center"
          style={{
            color: 'rgba(255, 215, 0, 0.8)',
          }}
        >
          This typically takes 30-60 seconds.
        </p>

        {/* Fun fact or tip */}
        <div
          className="mt-8 px-6 py-3 rounded-xl border border-fire-gold/30 max-w-sm"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <p className="text-sm text-center text-white/70">
            <span className="text-fire-gold">Did you know?</span> The Fire Horse year occurs only once every 60 years. The last was 1966, the next will be 2086.
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 50}px);
            opacity: 0;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes flicker {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .animate-flicker {
          animation: flicker 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
