'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  // Direct link to view THIS specific oracle (watermarked version will show immediately)
  const oracleViewUrl = `https://redhorseoracle.com/reveal?session_id=${prophecy.stripe_session_id}`;

  // Marketing-focused share text with strong CTA
  const shareText = `🐎🔥 My Fire Horse Oracle for 2026: "${prophecy.main_text}"

🔥 See my ${prophecy.zodiac_element} ${prophecy.zodiac_sign} prophecy! Limited Edition #${prophecy.edition_number} of 888.

The Year of the Fire Horse only comes every 60 years!

👉 View my oracle: ${oracleViewUrl}

Will 2026 be YOUR year to bet on yourself? To improve your luck and become Healthy, Wealthy, and Wise? Or will you keep the status quo and do nothing?

This is your once-in-60-years opportunity. 🐴🔥

Get YOUR personalized prophecy → RedHorseOracle.com

#FireHorse2026 #YearOfTheHorse #ChineseZodiac #LimitedEdition #BetOnYourself`;

  // Share URL points to this specific oracle
  const shareUrl = oracleViewUrl;

  // Use SHAREABLE image (watermarked, no cert) for sharing
  // Falls back to branded, then raw if shareable not available
  const shareableImageUrl = prophecy.shareable_image_url || prophecy.branded_image_url || prophecy.image_url;

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

  const handleShareImage = async () => {
    if (!shareableImageUrl) return;

    // Try native share with image if supported
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(shareableImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'fire-horse-talisman.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Fire Horse Talisman',
            text: shareText,
            files: [file],
          });
          return;
        }
      } catch (error) {
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

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col gap-2 w-full">
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

      {/* Share Talisman Image - Only show if branded image is available */}
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
    </div>
  );
}
