'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  const shareText = `🐎🔥 The Fire Horse Oracle revealed my 2026 destiny: "${prophecy.main_text}" Get yours at RedHorseOracle.com #FireHorse2026 #YearOfTheHorse`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Direct link to the talisman image in Supabase Storage
  const talismanImageUrl = prophecy.image_url || '';

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

  // Share the direct talisman image URL
  const handleShareTalismanImage = async () => {
    if (!talismanImageUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${prophecy.zodiac_element} ${prophecy.zodiac_sign} × Fire Horse Talisman`,
          text: `🔥 My authenticated ${prophecy.zodiac_element} ${prophecy.zodiac_sign} Oracle - Edition #${prophecy.edition_number} of ${prophecy.total_editions}. View my talisman:`,
          url: talismanImageUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
        // Fallback to copy
        handleCopyImageUrl();
      }
    } else {
      handleCopyImageUrl();
    }
  };

  const handleCopyImageUrl = async () => {
    if (!talismanImageUrl) return;
    try {
      const imageShareText = `🔥 My ${prophecy.zodiac_element} ${prophecy.zodiac_sign} × Fire Horse Oracle - Edition #${prophecy.edition_number} of ${prophecy.total_editions}\n\nView my authenticated talisman:\n${talismanImageUrl}\n\nGet yours at RedHorseOracle.com`;
      await navigator.clipboard.writeText(imageShareText);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Share talisman image on Twitter with direct image link
  const handleTwitterShareImage = () => {
    const imageText = `🔥 My ${prophecy.zodiac_element} ${prophecy.zodiac_sign} × Fire Horse Oracle - Edition #${prophecy.edition_number}/${prophecy.total_editions}\n\n"${prophecy.main_text}"\n\n#FireHorse2026 #ChineseZodiac`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(imageText)}&url=${encodeURIComponent(talismanImageUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Row 1: Share Page */}
      <div className="flex gap-2">
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

      {/* Row 2: Share Talisman Image */}
      {talismanImageUrl && (
        <div className="flex gap-2">
          <button
            onClick={handleShareTalismanImage}
            className="flex-1 bg-gradient-to-r from-fire-gold/80 to-yellow-600/80 text-black font-bold py-3 px-6 rounded-xl
                       hover:from-fire-gold hover:to-yellow-500 active:scale-95 transition-all
                       flex items-center justify-center gap-2"
          >
            <span>{imageCopied ? '✓' : '🖼️'}</span>
            {imageCopied ? 'Link Copied!' : 'Share Talisman Image'}
          </button>

          {/* Twitter/X with Image */}
          <button
            onClick={handleTwitterShareImage}
            className="bg-fire-gold text-black font-bold py-3 px-4 rounded-xl
                       hover:bg-yellow-400 active:scale-95 transition-all"
            title="Share Talisman on X"
          >
            𝕏
          </button>
        </div>
      )}
    </div>
  );
}
