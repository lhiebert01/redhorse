'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Share the RAW image URL (link to Supabase image)
  const imageUrl = prophecy.image_url || '';

  const shareText = `My Fire Horse Oracle for 2026: "${prophecy.main_text}" - Get yours at RedHorseOracle.com`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleFacebookShare = () => {
    // Facebook share - shares the image URL
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    // LinkedIn share - shares the image URL
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl)}`;
    window.open(liUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    // Twitter/X share - shares text with image URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(imageUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-gray-400 text-xs text-center">Share your Oracle</p>

      <div className="flex gap-2 w-full">
        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="flex-1 bg-[#1877F2] text-white font-bold py-3 px-4 rounded-xl
                     hover:bg-[#166FE5] active:scale-95 transition-all
                     flex items-center justify-center gap-2"
          title="Share on Facebook"
        >
          <span>f</span>
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className="flex-1 bg-[#0A66C2] text-white font-bold py-3 px-4 rounded-xl
                     hover:bg-[#095196] active:scale-95 transition-all
                     flex items-center justify-center gap-2"
          title="Share on LinkedIn"
        >
          <span>in</span>
          <span className="hidden sm:inline">LinkedIn</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className="flex-1 bg-black border border-gray-700 text-white font-bold py-3 px-4 rounded-xl
                     hover:bg-gray-900 active:scale-95 transition-all
                     flex items-center justify-center"
          title="Share on X"
        >
          𝕏
        </button>
      </div>

      {/* Copy Image Link */}
      <button
        onClick={handleCopyLink}
        className="w-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700
                   text-black font-bold py-3 px-6 rounded-xl
                   hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600
                   active:scale-95 transition-all
                   flex items-center justify-center gap-2"
      >
        <span>{copied ? '✓' : '🔗'}</span>
        {copied ? 'Link Copied!' : 'Copy Image Link'}
      </button>
    </div>
  );
}
