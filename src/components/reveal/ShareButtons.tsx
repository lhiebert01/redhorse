'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';
import ShareModal from './ShareModal';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Share URL is just the homepage - NOT the reveal page
  // We don't want to expose the authenticated reveal page to others
  const shareUrl = 'https://redhorseoracle.com';

  // Simple share text - just promotes the app, no reveal URL
  const shareText = `🐴🔥 I just got my Fire Horse Oracle for 2026!

My prophecy: "${prophecy.main_text}"

The Fire Horse returns only once every 60 years. Will 2026 be YOUR year?

Get yours → ${shareUrl}

#FireHorse2026 #YearOfTheHorse #LimitedEdition`;

  // Shorter text for Twitter (280 char limit)
  const twitterText = `🐴🔥 My Fire Horse Oracle: "${prophecy.main_text}"

Fire Horse returns once every 60 years. Get yours!

#FireHorse2026`;

  // Use SHAREABLE image (watermarked, no cert) for sharing
  // Falls back to raw image if shareable not available
  const shareableImageUrl = prophecy.shareable_image_url || prophecy.image_url;

  // Share App Link (text only, no image)
  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fire Horse Oracle 2026',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error - fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Share Image (watermarked image + short text)
  const handleShareImage = async () => {
    if (!shareableImageUrl) return;

    // Try native share with image if supported
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(shareableImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'fire-horse-oracle-2026.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Fire Horse Oracle',
            text: `🐴🔥 My Fire Horse Oracle: "${prophecy.main_text}" - Get yours at redhorseoracle.com`,
            files: [file],
          });
          return;
        }
      } catch {
        console.log('Native image share not available, copying URL');
      }
    }

    // Fallback: copy image URL
    try {
      await navigator.clipboard.writeText(shareableImageUrl);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (error) {
      console.error('Copy image URL failed:', error);
    }
  };

  // Twitter share (text only - Twitter handles image preview from URL)
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {/* PRIMARY: Create Social Media Post Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500
                     text-white font-bold py-4 px-6 rounded-xl
                     hover:from-purple-500 hover:via-pink-400 hover:to-red-400
                     hover:scale-[1.02] active:scale-95 transition-all
                     flex items-center justify-center gap-2 shadow-lg"
        >
          <span>🚀</span>
          Create Social Media Post
        </button>

        {/* Quick Share Row: Simple Share + Twitter */}
        <div className="flex gap-2 w-full">
          {/* Share App Link (text/link only) */}
          <button
            onClick={handleShareApp}
            className="flex-1 bg-red-900 text-white font-bold py-3 px-6 rounded-xl
                       hover:bg-red-800 active:scale-95 transition-all
                       flex items-center justify-center gap-2"
          >
            <span>{copied ? '✓' : '🔗'}</span>
            {copied ? 'Copied!' : 'Quick Share'}
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

        {/* Share Image (watermarked) */}
        {shareableImageUrl && (
          <button
            onClick={handleShareImage}
            className="w-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700
                       text-black font-bold py-3 px-6 rounded-xl
                       hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600
                       active:scale-95 transition-all
                       flex items-center justify-center gap-2"
          >
            <span>{imageCopied ? '✓' : '🖼️'}</span>
            {imageCopied ? 'Image URL Copied!' : 'Share Talisman Image'}
          </button>
        )}

        {/* Note about watermark */}
        <p className="text-gray-500 text-[10px] text-center">
          Shared images include watermark • Your certificate stays private
        </p>
      </div>

      {/* Share Modal */}
      <ShareModal
        prophecy={prophecy}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}
