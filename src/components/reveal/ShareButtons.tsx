'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Share the WATERMARKED shareable image (no certificate number)
  // Falls back to raw image if shareable not available
  const shareableImageUrl = prophecy.shareable_image_url || prophecy.image_url || '';

  const shareText = `My Fire Horse Oracle for 2026: "${prophecy.main_text}" - Get yours at RedHorseOracle.com`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableImageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableImageUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableImageUrl)}`;
    window.open(liUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareableImageUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Native share (works on mobile for SMS/iMessage, WhatsApp, etc.)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Fire Horse Oracle 2026',
          text: shareText,
          url: shareableImageUrl,
        });
      } catch (error) {
        // User cancelled or error - fallback to copy
        console.log('Native share cancelled, copying link');
        handleCopyLink();
      }
    } else {
      // Fallback for desktop without native share
      handleCopyLink();
    }
  };

  if (!shareableImageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Social Share Row */}
      <div className="flex gap-2 w-full">
        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="flex-1 bg-[#1877F2] text-white font-bold py-3 px-3 rounded-xl
                     hover:bg-[#166FE5] active:scale-95 transition-all
                     flex items-center justify-center gap-1"
          title="Share on Facebook"
        >
          <span className="text-lg">f</span>
          <span className="hidden sm:inline text-sm">Facebook</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className="flex-1 bg-[#0A66C2] text-white font-bold py-3 px-3 rounded-xl
                     hover:bg-[#095196] active:scale-95 transition-all
                     flex items-center justify-center gap-1"
          title="Share on LinkedIn"
        >
          <span className="text-lg">in</span>
          <span className="hidden sm:inline text-sm">LinkedIn</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className="flex-1 bg-black border border-gray-600 text-white font-bold py-3 px-3 rounded-xl
                     hover:bg-gray-900 active:scale-95 transition-all
                     flex items-center justify-center"
          title="Share on X"
        >
          <span className="text-lg">𝕏</span>
        </button>

        {/* SMS/iMessage/Native Share */}
        <button
          onClick={handleNativeShare}
          className="flex-1 bg-green-600 text-white font-bold py-3 px-3 rounded-xl
                     hover:bg-green-500 active:scale-95 transition-all
                     flex items-center justify-center gap-1"
          title="Share via SMS/Messages"
        >
          <span className="text-lg">📤</span>
          <span className="hidden sm:inline text-sm">Share</span>
        </button>
      </div>

      {/* Copy Link Button */}
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
