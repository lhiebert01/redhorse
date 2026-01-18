'use client';

import { useState, useEffect } from 'react';
import { Prophecy } from '@/types/prophecy';
import {
  SharePlatform,
  ShareAngle,
  SHARE_TEMPLATES,
  PLATFORM_CONFIGS,
  generateShareText,
  getShareUrl,
  getRecommendedTemplate,
  SHARE_URL,
} from '@/constants/social-templates';

interface ShareModalProps {
  prophecy: Prophecy;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ prophecy, isOpen, onClose }: ShareModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SharePlatform>('copy');
  const [selectedAngle, setSelectedAngle] = useState<ShareAngle>('action');
  const [copied, setCopied] = useState(false);
  const [showLinkNote, setShowLinkNote] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setShowLinkNote(false);
    }
  }, [isOpen]);

  // Update recommended angle when platform changes
  useEffect(() => {
    const recommended = getRecommendedTemplate(selectedPlatform);
    setSelectedAngle(recommended.id);
  }, [selectedPlatform]);

  if (!isOpen) return null;

  const template = SHARE_TEMPLATES.find(t => t.id === selectedAngle) || SHARE_TEMPLATES[0];
  const platformConfig = PLATFORM_CONFIGS[selectedPlatform];

  const { text, linkNote } = generateShareText(template, selectedPlatform, {
    mainText: prophecy.main_text || 'My Fire Horse Prophecy',
    zodiacSign: prophecy.zodiac_sign || 'Unknown',
    zodiacElement: prophecy.zodiac_element || 'Fire',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowLinkNote(!!linkNote);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShare = () => {
    const shareUrl = getShareUrl(selectedPlatform, text, template.headline);

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=500');
    } else {
      handleCopy();
    }
  };

  const platforms: SharePlatform[] = [
    'twitter',
    'facebook',
    'linkedin',
    'instagram',
    'tiktok',
    'reddit',
    'discord',
    'copy',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-red-950 to-black border-2 border-fire-gold/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-fire-gold/30">
          <h2 className="text-xl font-bold text-fire-gold">Share Your Oracle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Platform Selection */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Select Platform:</p>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => {
                const config = PLATFORM_CONFIGS[platform];
                const isSelected = selectedPlatform === platform;
                return (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-fire-gold text-black'
                        : 'bg-red-900/50 text-gray-300 hover:bg-red-800/50'
                      }`}
                  >
                    <span className="mr-1">{config.emoji}</span>
                    {config.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template/Angle Selection */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Choose Your Angle:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {SHARE_TEMPLATES.map(tmpl => {
                const isSelected = selectedAngle === tmpl.id;
                const isRecommended = platformConfig.recommendedAngle === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedAngle(tmpl.id)}
                    className={`p-3 rounded-lg text-left transition-all relative
                      ${isSelected
                        ? 'bg-fire-gold/20 border-2 border-fire-gold'
                        : 'bg-red-900/30 border border-red-800/50 hover:border-fire-gold/50'
                      }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                        BEST
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span>{tmpl.emoji}</span>
                      <span className="font-bold text-white text-sm">{tmpl.name}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{tmpl.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Preview:</p>
              <span className="text-gray-500 text-xs">
                {text.length} chars
                {platformConfig.maxLength && ` / ${platformConfig.maxLength} max`}
              </span>
            </div>
            <div className="bg-black/50 border border-red-900/50 rounded-xl p-4 max-h-64 overflow-y-auto">
              <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {text}
              </pre>
            </div>
          </div>

          {/* Link Note */}
          {showLinkNote && linkNote && (
            <div className="mb-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
              <p className="text-yellow-300 text-sm">{linkNote}</p>
            </div>
          )}

          {/* Pro Tip */}
          {!platformConfig.linkInCaption && (
            <div className="mb-4 bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                <span className="font-bold">💡 Pro Tip:</span> {platformConfig.name} penalizes
                posts with links. Post this text first, then add the link ({SHARE_URL}) in the
                first comment for better reach!
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-fire-gold/30 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2
              ${copied
                ? 'bg-green-600 text-white'
                : 'bg-red-800 text-white hover:bg-red-700'
              }`}
          >
            <span>{copied ? '✓' : '📋'}</span>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          {platformConfig.shareMethod === 'url' && (
            <button
              onClick={handleShare}
              className="flex-1 bg-fire-gold text-black font-bold py-3 px-4 rounded-xl
                       hover:scale-[1.02] active:scale-95 transition-all
                       flex items-center justify-center gap-2"
            >
              <span>{platformConfig.emoji}</span>
              Share to {platformConfig.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
