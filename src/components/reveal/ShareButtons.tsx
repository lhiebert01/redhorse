'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';

interface ShareButtonsProps {
  prophecy: Prophecy;
}

export default function ShareButtons({ prophecy }: ShareButtonsProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const siteUrl = 'https://redhorseoracle.com';

  // Get shareable image URL (watermarked version)
  const shareableImageUrl = prophecy.shareable_image_url || '';

  // Get text content with fallbacks
  const zodiacInfo = prophecy.zodiac_element && prophecy.zodiac_sign
    ? `${prophecy.zodiac_element} ${prophecy.zodiac_sign}`
    : prophecy.zodiac_sign || 'my zodiac';

  const mainText = prophecy.main_text || 'My Fire Horse Prophecy';

  // Get mode emoji
  const getModeEmoji = (mode: string | null | undefined): string => {
    switch (mode?.toLowerCase()) {
      case 'wealth': return '🎲💰';
      case 'power': return '⚔️👑';
      case 'love': return '❤️💕';
      case 'shield': return '🛡️✨';
      default: return '🔥🐴';
    }
  };

  const modeEmoji = getModeEmoji(prophecy.focus_mode);

  // Full viral message for copy
  const fullMessage = shareableImageUrl
    ? `🔥 I just got my Authenticated Limited Edition Fire Horse Oracle! 🐴

━━━━━━━━━━━━━━━━━━━━━━
📜 MY FIRE HORSE PROPHECY
━━━━━━━━━━━━━━━━━━━━━━

✨ I'm a ${zodiacInfo} ${modeEmoji}

💬 My Oracle Prophecy:
"${mainText}"

🎨 VIEW MY TALISMAN:
${shareableImageUrl}

━━━━━━━━━━━━━━━━━━━━━━
🐎 Year of the Fire Horse 2026
   Only happens once every 60 years!
   • Last: 1966
   • NOW: 2026
   • Next: 2086 (will you even be alive?)
━━━━━━━━━━━━━━━━━━━━━━

🎯 Get YOUR Fire Horse Oracle:
${siteUrl}

#FireHorse2026 #ChineseZodiac #${prophecy.zodiac_sign || 'Zodiac'} #AI #LimitedEdition`
    : `🔥 I just got my Authenticated Limited Edition Fire Horse Oracle! 🐴

━━━━━━━━━━━━━━━━━━━━━━
📜 MY FIRE HORSE PROPHECY
━━━━━━━━━━━━━━━━━━━━━━

✨ I'm a ${zodiacInfo} ${modeEmoji}

💬 My Oracle Prophecy:
"${mainText}"

━━━━━━━━━━━━━━━━━━━━━━
🐎 Year of the Fire Horse 2026
   Only happens once every 60 years!
   • Last: 1966
   • NOW: 2026
   • Next: 2086 (will you even be alive?)
━━━━━━━━━━━━━━━━━━━━━━

🎯 Get YOUR Fire Horse Oracle:
${siteUrl}

#FireHorse2026 #ChineseZodiac #${prophecy.zodiac_sign || 'Zodiac'} #AI #LimitedEdition`;

  // Twitter/X share text (shorter for character limit)
  const twitterText = shareableImageUrl
    ? `🔥 I'm a ${zodiacInfo}! ${modeEmoji}

My Fire Horse Oracle: "${mainText}"

🎨 ${shareableImageUrl}

🐴 Fire Horse = once every 60 yrs!
Get yours: ${siteUrl}

#FireHorse2026 #ChineseZodiac`
    : `🔥 I'm a ${zodiacInfo}! ${modeEmoji}

My Fire Horse Oracle: "${mainText}"

🐴 Fire Horse = once every 60 yrs!
Get yours: ${siteUrl}

#FireHorse2026 #ChineseZodiac`;

  // Copy to clipboard
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 5000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 5000);
    }
  };

  // Copy then open LinkedIn
  const handleLinkedIn = async () => {
    await handleCopyMessage();
    window.open('https://www.linkedin.com/feed/', '_blank');
  };

  // Copy then open Facebook
  const handleFacebook = async () => {
    await handleCopyMessage();
    window.open('https://www.facebook.com/', '_blank');
  };

  // Open Twitter with pre-filled text
  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(url, 'twitter-share', 'width=550,height=450');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="text-center">
        <p className="text-purple-300 text-lg font-bold mb-1">
          📣 Share Your Oracle!
        </p>
        <p className="text-gray-400 text-sm">
          Click to copy your post, then paste into your social app
        </p>
      </div>

      {/* Copy Status Message */}
      {shareStatus === 'copied' && (
        <div className="bg-green-900/50 border border-green-500 rounded-xl p-3 animate-pulse">
          <p className="text-green-300 text-sm font-bold text-center">
            ✅ Copied! Now paste (Ctrl+V / Cmd+V) into your social app
          </p>
        </div>
      )}

      {/* 3 Share Buttons */}
      <div className="flex flex-col gap-3">
        {/* X/Twitter */}
        <button
          onClick={handleTwitter}
          className="flex items-center justify-center gap-3 bg-black hover:bg-gray-900 border-2 border-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02]"
        >
          <span className="text-xl font-bold">𝕏</span>
          <span>Share on X (Twitter)</span>
        </button>

        {/* LinkedIn - Copy first, then open */}
        <button
          onClick={handleLinkedIn}
          className="flex items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#004182] border-2 border-[#0A66C2] text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02]"
        >
          <span className="text-xl font-bold">in</span>
          <span>Copy & Share on LinkedIn</span>
        </button>

        {/* Facebook - Copy first, then open */}
        <button
          onClick={handleFacebook}
          className="flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] border-2 border-[#1877F2] text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02]"
        >
          <span className="text-xl font-bold">f</span>
          <span>Copy & Share on Facebook</span>
        </button>
      </div>

      {/* Help text */}
      <p className="text-center text-xs text-gray-500">
        📌 LinkedIn & Facebook: We copy your post first, then open the app. Just paste!
      </p>
    </div>
  );
}
