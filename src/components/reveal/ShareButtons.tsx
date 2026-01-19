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

  // Get text content with fallbacks
  const zodiacInfo = prophecy.zodiac_element && prophecy.zodiac_sign
    ? `${prophecy.zodiac_element} ${prophecy.zodiac_sign}`
    : prophecy.zodiac_sign || 'my zodiac';

  const mainText = prophecy.main_text || 'My Fire Horse Prophecy';

  // Base share content
  const shareTitle = `Fire Horse Oracle 2026 - ${zodiacInfo}`;
  const shareText = `My ${zodiacInfo} prophecy: "${mainText}" - Year of the Fire Horse (once every 60 years!) Get yours at`;

  // Full message for copy
  const fullMessage = `Check out my Fire Horse Oracle for 2026!

My ${zodiacInfo} prophecy: "${mainText}"

Year of the Fire Horse = once every 60 YEARS!

Get your own LIMITED EDITION talisman: ${siteUrl}`;

  // =====================================================
  // NATIVE WEB SHARE API (works best on mobile)
  // =====================================================
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: siteUrl,
        });
        setShareStatus('Shared!');
        setTimeout(() => setShareStatus(''), 2000);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback to copy
      handleCopyMessage();
    }
  };

  // =====================================================
  // COPY TO CLIPBOARD
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
    } catch (error) {
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
  // DIRECT PLATFORM LINKS (open in new tab)
  // =====================================================

  // Twitter - using simple format
  const openTwitter = () => {
    const text = `${shareText} ${siteUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, 'twitter-share', 'width=550,height=450');
  };

  // WhatsApp
  const openWhatsApp = () => {
    const text = `${shareText} ${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Telegram
  const openTelegram = () => {
    const text = `${shareText}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Email
  const openEmail = () => {
    const subject = `Check out my Fire Horse Oracle for 2026!`;
    const body = fullMessage;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Facebook (only shares link - platform limitation)
  const openFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`, 'facebook-share', 'width=550,height=450');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Status message */}
      {shareStatus && (
        <div className="bg-green-600 text-white text-center py-2 px-4 rounded-lg font-bold">
          {shareStatus}
        </div>
      )}

      {/* PRIMARY: Native Share Button (best for mobile) */}
      {'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl
                     hover:scale-[1.02] active:scale-95 transition-all
                     flex items-center justify-center gap-3 border-2 border-purple-400"
        >
          <span className="text-xl">SHARE</span>
          <span className="text-sm opacity-80">(includes your prophecy text)</span>
        </button>
      )}

      {/* COPY BUTTON - Most reliable */}
      <button
        onClick={handleCopyMessage}
        className={`w-full font-bold py-4 px-6 rounded-xl
                   flex items-center justify-center gap-3 transition-all
                   ${copied
                     ? 'bg-green-600 text-white border-2 border-green-400'
                     : 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black border-2 border-yellow-400 hover:scale-[1.02] active:scale-95'}`}
      >
        <span className="text-xl">{copied ? 'COPIED!' : 'COPY MESSAGE'}</span>
        <span className="text-sm opacity-80">{copied ? '' : '(paste anywhere)'}</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-xs">or share directly to</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      {/* PLATFORM BUTTONS */}
      <div className="grid grid-cols-5 gap-2">
        {/* Twitter/X */}
        <button
          onClick={openTwitter}
          className="bg-black border border-gray-600 text-white font-bold py-3 rounded-xl
                     hover:bg-gray-800 active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on X/Twitter"
        >
          <span className="text-lg font-bold">X</span>
          <span className="text-[8px] text-gray-400">Twitter</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={openWhatsApp}
          className="bg-[#25D366] text-white font-bold py-3 rounded-xl
                     hover:bg-[#20BD5A] active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on WhatsApp"
        >
          <span className="text-lg">W</span>
          <span className="text-[8px]">WhatsApp</span>
        </button>

        {/* Telegram */}
        <button
          onClick={openTelegram}
          className="bg-[#0088cc] text-white font-bold py-3 rounded-xl
                     hover:bg-[#006699] active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on Telegram"
        >
          <span className="text-lg">T</span>
          <span className="text-[8px]">Telegram</span>
        </button>

        {/* Email */}
        <button
          onClick={openEmail}
          className="bg-gray-600 text-white font-bold py-3 rounded-xl
                     hover:bg-gray-500 active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share via Email"
        >
          <span className="text-lg">@</span>
          <span className="text-[8px]">Email</span>
        </button>

        {/* Facebook */}
        <button
          onClick={openFacebook}
          className="bg-[#1877F2] text-white font-bold py-3 rounded-xl
                     hover:bg-[#166FE5] active:scale-95 transition-all
                     flex flex-col items-center justify-center"
          title="Share on Facebook (link only)"
        >
          <span className="text-lg">f</span>
          <span className="text-[8px]">Facebook</span>
        </button>
      </div>

      {/* Help text */}
      <p className="text-center text-[10px] text-gray-500">
        Tip: Use "COPY MESSAGE" then paste into any app for best results
      </p>
    </div>
  );
}
