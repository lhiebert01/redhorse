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

export function Confetti({ count = 100, durationMultiplier = 1 }: { count?: number; durationMultiplier?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 5 * durationMultiplier, // Spread out start times more
        duration: (6 + Math.random() * 4) * durationMultiplier, // 6-10s base, multiplied
        size: 8 + Math.random() * 8,
      });
    }
    setPieces(newPieces);
  }, [count, durationMultiplier]);

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

// Rotating messages for PLAYERS - cute and fun!
const PARTY_COMPLETE_MESSAGES = [
  '🐴 When the pony dances, luck follows!',
  '✨ The Fire Horse winks at you! 😉',
  '🔥 RedHorseOracle.com celebrates with you!',
  '🎉 You made the Fire Horse proud!',
  '⭐ The Oracle whispers: "You are amazing!"',
  '🐴 Clip-clop! The pony stamps approval!',
  '🔥 Share the magic with your friends!',
  '✨ Fortune favors the brave trivia player!',
  '🌟 The Fire Horse gallops with joy for YOU!',
  '🎊 RedHorseOracle.com appreciates you!',
];

// Rotating messages for HOSTS - appreciation and encouragement!
const HOST_COMPLETE_MESSAGES = [
  '🎉 You are doing a GREAT job hosting!',
  '✨ RedHorseOracle.com celebrates with you!',
  '🐴 The Fire Horse thanks you for hosting!',
  '🔥 Great party! Your guests love it!',
  '⭐ As a host, you bring people together!',
  '🎊 Share this party with more friends!',
  '🐴 Clip-clop! The pony salutes YOU, host!',
  '✨ RedHorseOracle.com appreciates YOU!',
  '🔥 Hosting is a gift — thank you!',
  '🌟 The Oracle sees a legendary host!',
];

interface BouncingHorseProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showRotatingMessages?: boolean;
  showShareButton?: boolean;
  shareText?: string;
  partyCode?: string;
  showFrame?: boolean; // Show golden ring frame like payment processing
  isHost?: boolean; // Use host-specific messages
}

export function BouncingHorse({
  message,
  size = 'large',
  showRotatingMessages = false,
  showShareButton = false,
  shareText,
  partyCode,
  showFrame = false,
  isHost = false,
}: BouncingHorseProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Size classes for simple mode
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-36 h-36',
    large: 'w-48 h-48',
  };

  // Size classes for frame mode
  const frameSizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  const glowSizes = {
    small: 'w-32 h-32',
    medium: 'w-44 h-44',
    large: 'w-56 h-56',
  };

  // Select message array based on isHost
  const messages = isHost ? HOST_COMPLETE_MESSAGES : PARTY_COMPLETE_MESSAGES;

  // Randomly rotate messages every 2.5 seconds for variety
  useEffect(() => {
    if (!showRotatingMessages) return;

    // Start with a random message
    setMessageIndex(Math.floor(Math.random() * messages.length));

    const interval = setInterval(() => {
      // Pick a random message (different from current)
      setMessageIndex((prev) => {
        let next = Math.floor(Math.random() * messages.length);
        // Ensure we don't show the same message twice in a row
        while (next === prev && messages.length > 1) {
          next = Math.floor(Math.random() * messages.length);
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [showRotatingMessages, messages.length]);

  // Default share text
  const defaultShareText = `🔥🐴 Just played Fire Horse Trivia! Join the fun at redhorseoracle.com/party ${partyCode ? `\n\nParty Code: ${partyCode}` : ''}\n\n2026 is the Year of the Fire Horse — only happens every 60 years! 🔥`;
  const textToShare = shareText || defaultShareText;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Bouncing Horse Animation */}
      {showFrame ? (
        // Version with golden ring frame (like payment processing)
        <div className={`relative ${frameSizeClasses[size]}`}>
          {/* Glow effect behind everything */}
          <div
            className="absolute inset-2 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 165, 0, 0.5) 0%, rgba(255, 69, 0, 0.3) 50%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Fire Frame - slowly rotating */}
          <div className="absolute inset-0 animate-spin-slow">
            <img
              src="/assets/loading/fire-frame.png"
              alt=""
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.6))',
              }}
            />
          </div>

          {/* Bouncing Fire Horse - centered inside frame */}
          <div className="absolute inset-6 animate-bounce-slow">
            <img
              src="/assets/loading/fire-horse-bouncing-3.png"
              alt="Fire Horse"
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 50px rgba(255, 69, 0, 0.6))',
              }}
            />
          </div>
        </div>
      ) : (
        // Simple version without frame
        <div className="relative">
          {/* Fire glow effect */}
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className={`${glowSizes[size]} rounded-full bg-gradient-to-r from-red-500/40 via-orange-500/40 to-yellow-500/40 blur-2xl`} />
          </div>

          {/* Fire Horse Image with bounce */}
          <div className="animate-bounce-slow relative z-10">
            <img
              src="/assets/loading/fire-horse-bouncing-3.png"
              alt="Fire Horse"
              className={`${sizeClasses[size]} object-contain drop-shadow-[0_0_25px_rgba(255,100,0,0.6)]`}
            />
          </div>

          {/* Fire effects around horse */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-3xl animate-flicker">
            🔥🔥🔥
          </div>
        </div>
      )}

      {/* Static message */}
      {message && !showRotatingMessages && (
        <p className="mt-6 text-xl text-center text-yellow-300 font-bold max-w-md animate-fade-in">
          {message}
        </p>
      )}

      {/* Rotating messages */}
      {showRotatingMessages && (
        <p
          className="mt-6 text-xl text-center font-bold max-w-md animate-message-change"
          style={{
            background: 'linear-gradient(to right, #FFD700, #FF6B00, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(255, 165, 0, 0.4)',
          }}
        >
          {messages[messageIndex]}
        </p>
      )}

      {/* Share Button */}
      {showShareButton && (
        <div className="mt-6">
          <button
            onClick={handleShare}
            className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
            }`}
          >
            {copied ? '✓ Copied! Share with Friends!' : '📤 Share with Friends'}
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Copy invite text to share on social media
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.15); }
        }
        .animate-flicker {
          animation: flicker 0.4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        @keyframes message-change {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-message-change {
          animation: message-change 2.5s ease-in-out infinite;
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
