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
  const hasShareableImage = !!prophecy.shareable_image_url;

  // Debug log for troubleshooting
  console.log('[ShareButtons] shareable_image_url:', prophecy.shareable_image_url);
  console.log('[ShareButtons] image_url:', prophecy.image_url);
  console.log('[ShareButtons] using:', shareableImageUrl);

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
    if (!shareableImageUrl) {
      console.error('[ShareButtons] No shareable image URL available');
      alert('No shareable image available. Please try again or contact support.');
      return;
    }

    console.log('[ShareButtons] Attempting to share image:', shareableImageUrl);

    // Try native share with image if supported
    if (navigator.share && navigator.canShare) {
      try {
        console.log('[ShareButtons] Fetching image for native share...');
        const response = await fetch(shareableImageUrl, { mode: 'cors' });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

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
      } catch (err) {
        console.error('[ShareButtons] Native image share failed:', err);
      }
    }

    // Fallback: copy image URL
    try {
      await navigator.clipboard.writeText(shareableImageUrl);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (error) {
      console.error('[ShareButtons] Copy image URL failed:', error);
      // Final fallback: open image in new tab
      window.open(shareableImageUrl, '_blank');
    }
  };

  // Twitter share
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Facebook share
  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  // LinkedIn share
  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  // Email share
  const handleEmailShare = () => {
    const subject = encodeURIComponent('My Fire Horse Oracle 2026');
    const body = encodeURIComponent(`${shareText}\n\nView my talisman image: ${shareableImageUrl || shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Copy image URL directly
  const handleCopyImageUrl = async () => {
    if (!shareableImageUrl) {
      alert('No shareable image URL available');
      return;
    }
    try {
      await navigator.clipboard.writeText(shareableImageUrl);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareableImageUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {/* Share to Social Media - Row 1 */}
        <div className="grid grid-cols-4 gap-2">
          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-2 rounded-xl
                       active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            title="Share on Facebook"
          >
            <span className="text-lg">f</span>
            <span className="text-[10px]">Facebook</span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className="bg-black border border-gray-700 text-white font-bold py-3 px-2 rounded-xl
                       hover:bg-gray-900 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            title="Share on X"
          >
            <span className="text-lg">𝕏</span>
            <span className="text-[10px]">Twitter</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInShare}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-xl
                       active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            title="Share on LinkedIn"
          >
            <span className="text-lg">in</span>
            <span className="text-[10px]">LinkedIn</span>
          </button>

          {/* Email */}
          <button
            onClick={handleEmailShare}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-2 rounded-xl
                       active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            title="Share via Email"
          >
            <span className="text-lg">✉</span>
            <span className="text-[10px]">Email</span>
          </button>
        </div>

        {/* Copy Buttons Row */}
        <div className="flex gap-2">
          {/* Copy Text */}
          <button
            onClick={handleCopy}
            className="flex-1 bg-red-900 text-white font-bold py-3 px-4 rounded-xl
                       hover:bg-red-800 active:scale-95 transition-all
                       flex items-center justify-center gap-2"
          >
            <span>{copied ? '✓' : '📋'}</span>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          {/* Copy Image URL */}
          {shareableImageUrl && (
            <button
              onClick={handleCopyImageUrl}
              className="flex-1 bg-yellow-700 text-black font-bold py-3 px-4 rounded-xl
                         hover:bg-yellow-600 active:scale-95 transition-all
                         flex items-center justify-center gap-2"
            >
              <span>{imageCopied ? '✓' : '🖼️'}</span>
              {imageCopied ? 'Copied!' : 'Copy Image URL'}
            </button>
          )}
        </div>

        {/* Direct Image Link */}
        {shareableImageUrl && (
          <a
            href={shareableImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-fire-gold/20 border border-fire-gold/50 text-fire-gold font-bold py-3 px-4 rounded-xl
                       hover:bg-fire-gold/30 transition-all text-center"
          >
            🔗 Open Shareable Image (Right-click to Save)
          </a>
        )}

        {/* Image URL Display for Copy/Paste */}
        {shareableImageUrl && (
          <div className="bg-black/50 border border-gray-700 rounded-lg p-2">
            <p className="text-gray-400 text-[10px] mb-1">Image URL (copy and paste to share):</p>
            <p className="text-fire-gold text-xs break-all font-mono select-all">{shareableImageUrl}</p>
          </div>
        )}

        {/* Status */}
        <p className="text-gray-500 text-[10px] text-center">
          {hasShareableImage
            ? '✓ Shareable image ready (watermarked, certificate hidden)'
            : '⚠️ Using raw image - watermarked version not available'}
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
