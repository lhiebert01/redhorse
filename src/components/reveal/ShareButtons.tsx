'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `🐎🔥 The Fire Horse Oracle revealed my 2026 destiny: "${prophecy.main_text}" Get yours at RedHorseOracle.com #FireHorse2026 #YearOfTheHorse`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Fire Horse Prophecy',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex gap-2 w-full">
      {/* Native Share (Mobile) or Copy (Desktop) */}
      <button
        onClick={handleNativeShare}
        className="flex-1 bg-red-900 text-white font-bold py-3 px-6 rounded-xl
                   hover:bg-red-800 active:scale-95 transition-all
                   flex items-center justify-center gap-2"
      >
        <span>{copied ? '✓' : '🔗'}</span>
        {copied ? 'Copied!' : 'Share Page'}
      </button>

      {/* Twitter/X */}
      <button
        onClick={handleTwitterShare}
        className="bg-black border border-gray-700 text-white font-bold py-3 px-4 rounded-xl
                   hover:bg-gray-900 active:scale-95 transition-all"
        title="Share on X"
      >
        𝕏
      </button>
    </div>
  );
}
