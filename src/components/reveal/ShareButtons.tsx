'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string>('');

  const siteUrl = 'https://redhorseoracle.com';

  // Get shareable image URL (watermarked version)
  const shareableImageUrl = prophecy.shareable_image_url || '';

  // Get text content with fallbacks
  const zodiacInfo = prophecy.zodiac_element && prophecy.zodiac_sign
    ? `${prophecy.zodiac_element} ${prophecy.zodiac_sign}`
    : prophecy.zodiac_sign || 'my zodiac';

  const mainText = prophecy.main_text || 'My Fire Horse Prophecy';

  // Base share content
  const shareText = `My ${zodiacInfo} prophecy: "${mainText}" - Year of the Fire Horse (once every 60 years!)`;

  // Full message for copy - includes image URL if available
  const fullMessage = shareableImageUrl
    ? `Check out my Fire Horse Oracle talisman for 2026!

My ${zodiacInfo} prophecy: "${mainText}"

VIEW MY TALISMAN: ${shareableImageUrl}

Year of the Fire Horse = once every 60 YEARS!

Get your own LIMITED EDITION talisman: ${siteUrl}`
    : `Check out my Fire Horse Oracle for 2026!

My ${zodiacInfo} prophecy: "${mainText}"

Year of the Fire Horse = once every 60 YEARS!

Get your own LIMITED EDITION talisman: ${siteUrl}`;

  // =====================================================
  // COPY TO CLIPBOARD - Most reliable method
  // =====================================================
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setShareStatus('Copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShareStatus('');
      }, 3000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setShareStatus('Copied!');
      setTimeout(() => {
        setCopied(false);
        setShareStatus('');
      }, 3000);
    }
  };

  // =====================================================
  // PLATFORM-SPECIFIC SHARE LINKS
  // =====================================================

  // Twitter/X - WORKS: Supports pre-filled text with URLs
  const openTwitter = () => {
    const tweetText = shareableImageUrl
      ? `${shareText}\n\nSee my talisman: ${shareableImageUrl}\n\nGet yours: ${siteUrl}`
      : `${shareText}\n\nGet yours: ${siteUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, 'twitter-share', 'width=550,height=450');
  };

  // LinkedIn - Share talisman image URL directly
  const openLinkedIn = () => {
    // LinkedIn only supports URL sharing, so we share the talisman image
    // Users should use Copy Message for full text on LinkedIn
    const linkedInUrl = shareableImageUrl || siteUrl;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedInUrl)}`,
      'linkedin-share',
      'width=550,height=450'
    );
  };

  // WhatsApp - WORKS: Supports pre-filled text
  const openWhatsApp = () => {
    const waText = shareableImageUrl
      ? `${shareText}\n\nView my talisman: ${shareableImageUrl}\n\nGet yours: ${siteUrl}`
      : `${shareText}\n\nGet yours: ${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank');
  };

  // Telegram - WORKS: Supports pre-filled text
  const openTelegram = () => {
    const tgText = shareableImageUrl
      ? `${shareText}\n\nView my talisman: ${shareableImageUrl}\n\nGet yours: ${siteUrl}`
      : `${shareText}\n\nGet yours: ${siteUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(tgText)}`, '_blank');
  };

  // Email (Gmail) - WORKS: Opens default mail client with pre-filled content
  const openEmail = () => {
    const subject = `Check out my Fire Horse Oracle talisman for 2026!`;
    const body = fullMessage;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Facebook - Link only (FB doesn't support pre-filled text)
  const openFacebook = () => {
    const fbUrl = shareableImageUrl || siteUrl;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fbUrl)}`, 'facebook-share', 'width=550,height=450');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Status message */}
      {shareStatus && (
        <div className="bg-green-600 text-white text-center py-2 px-4 rounded-lg font-bold animate-pulse">
          {shareStatus}
        </div>
      )}

      {/* PRIMARY: COPY MESSAGE - Most reliable across all platforms */}
      <button
        onClick={handleCopyMessage}
        className={`w-full font-bold py-4 px-6 rounded-xl
                   flex items-center justify-center gap-3 transition-all
                   ${copied
                     ? 'bg-green-600 text-white border-2 border-green-400'
                     : 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black border-2 border-yellow-400 hover:scale-[1.02] active:scale-95'}`}
      >
        <span className="text-xl">{copied ? 'COPIED!' : 'COPY MESSAGE + TALISMAN LINK'}</span>
      </button>
      <p className="text-center text-xs text-gray-400 -mt-2">
        Best method - paste into any app including LinkedIn posts
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-2">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-xs">quick share buttons</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      {/* PLATFORM BUTTONS - 6 buttons in 2 rows */}
      <div className="grid grid-cols-3 gap-2">
        {/* Twitter/X - WORKS */}
        <button
          onClick={openTwitter}
          className="bg-black border-2 border-gray-600 text-white font-bold py-3 rounded-xl
                     hover:bg-gray-800 hover:border-gray-400 active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on X/Twitter - includes full text!"
        >
          <span className="text-lg font-bold">X</span>
          <span className="text-[9px] text-green-400">Works!</span>
        </button>

        {/* LinkedIn - NEW */}
        <button
          onClick={openLinkedIn}
          className="bg-[#0A66C2] border-2 border-[#0A66C2] text-white font-bold py-3 rounded-xl
                     hover:bg-[#004182] active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on LinkedIn - shares talisman link"
        >
          <span className="text-lg font-bold">in</span>
          <span className="text-[9px] text-blue-200">LinkedIn</span>
        </button>

        {/* WhatsApp - WORKS */}
        <button
          onClick={openWhatsApp}
          className="bg-[#25D366] border-2 border-[#25D366] text-white font-bold py-3 rounded-xl
                     hover:bg-[#20BD5A] active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on WhatsApp - includes full text!"
        >
          <span className="text-lg">WA</span>
          <span className="text-[9px] text-green-100">Works!</span>
        </button>

        {/* Telegram - WORKS */}
        <button
          onClick={openTelegram}
          className="bg-[#0088cc] border-2 border-[#0088cc] text-white font-bold py-3 rounded-xl
                     hover:bg-[#006699] active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on Telegram - includes full text!"
        >
          <span className="text-lg">TG</span>
          <span className="text-[9px] text-blue-200">Works!</span>
        </button>

        {/* Email - WORKS (Gmail) */}
        <button
          onClick={openEmail}
          className="bg-gray-700 border-2 border-gray-600 text-white font-bold py-3 rounded-xl
                     hover:bg-gray-600 active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share via Email - opens mail app"
        >
          <span className="text-lg">@</span>
          <span className="text-[9px] text-gray-300">Email</span>
        </button>

        {/* Facebook - Link only */}
        <button
          onClick={openFacebook}
          className="bg-[#1877F2] border-2 border-[#1877F2] text-white font-bold py-3 rounded-xl
                     hover:bg-[#166FE5] active:scale-95 transition-all
                     flex flex-col items-center justify-center opacity-70"
          title="Share on Facebook - link only, no text"
        >
          <span className="text-lg">f</span>
          <span className="text-[9px] text-blue-200">Link only</span>
        </button>
      </div>

      {/* Help text */}
      <p className="text-center text-[10px] text-gray-500 mt-1">
        X, WhatsApp, Telegram include your prophecy text. LinkedIn/Facebook share talisman link only.
      </p>
    </div>
  );
}
