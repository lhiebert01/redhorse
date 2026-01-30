'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

interface CelebrationProps {
  type: 'confetti' | 'fireworks' | 'horse';
  duration?: number; // How long to show (ms)
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  '#FF6B6B', // Red
  '#FFD93D', // Gold
  '#FF8C42', // Orange
  '#4ECDC4', // Teal
  '#A66CFF', // Purple
  '#6BCB77', // Green
  '#FF61A6', // Pink
];

export function Confetti({ count = 100 }: { count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        size: 8 + Math.random() * 8,
      });
    }
    setPieces(newPieces);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

export function BouncingHorse({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Bouncing Horse Animation */}
      <div className="relative">
        {/* Fire glow effect */}
        <div className="absolute inset-0 animate-pulse">
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-red-500/30 via-orange-500/30 to-yellow-500/30 blur-2xl" />
        </div>

        {/* Horse emoji with bounce */}
        <div className="text-[120px] animate-bounce-slow relative z-10">
          🐴
        </div>

        {/* Fire effects around horse */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-4xl animate-flicker">
          🔥🔥🔥
        </div>
      </div>

      {message && (
        <p className="mt-6 text-xl text-center text-yellow-300 font-bold max-w-md animate-fade-in">
          {message}
        </p>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
        }
        .animate-flicker {
          animation: flicker 0.5s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export function Fireworks() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBursts(prev => [
        ...prev.slice(-5), // Keep only last 5 bursts
        {
          id: Date.now(),
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 40,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        }
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute animate-firework"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`,
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-particle"
              style={{
                backgroundColor: burst.color,
                transform: `rotate(${i * 30}deg) translateY(-40px)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes firework {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-firework {
          animation: firework 1.5s ease-out forwards;
        }
        @keyframes particle {
          0% { transform: rotate(var(--rotation)) translateY(0); opacity: 1; }
          100% { transform: rotate(var(--rotation)) translateY(-80px); opacity: 0; }
        }
        .animate-particle {
          animation: particle 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function Celebration({ type, duration = 5000, onComplete }: CelebrationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  if (!show) return null;

  switch (type) {
    case 'confetti':
      return <Confetti />;
    case 'fireworks':
      return <Fireworks />;
    case 'horse':
      return <BouncingHorse />;
    default:
      return <Confetti />;
  }
}
