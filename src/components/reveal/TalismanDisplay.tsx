'use client';

import { useState } from 'react';
import { Prophecy } from '@/types/prophecy';
import ShareButtons from './ShareButtons';

interface TalismanDisplayProps {
  prophecy: Prophecy;
}

export default function TalismanDisplay({ prophecy }: TalismanDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Download the BRANDED image (with certificate) - this is the owner's authenticated copy
  const handleDownload = async () => {
    // Use branded image (with cert) for owner download, fallback to raw image
    const downloadUrl = prophecy.branded_image_url || prophecy.image_url;
    if (!downloadUrl) return;

    setIsDownloading(true);

    try {
      // Build filename with certificate ID
      const elementName = prophecy.zodiac_element ? `${prophecy.zodiac_element.toLowerCase()}-` : '';
      const animalName = prophecy.zodiac_sign ? prophecy.zodiac_sign.toLowerCase() : 'unknown';
      const certId = prophecy.id.slice(0, 8).toUpperCase();
      const filename = `fire-horse-2026-${elementName}${animalName}-CERT-${certId}.png`;

      // Fetch and download the branded image
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Mark as downloaded
      setHasDownloaded(true);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md w-full">
      {/* Talisman Card Display */}
      <div
        className="flex flex-col items-center w-full p-6 rounded-2xl relative"
        style={{ backgroundColor: '#0a0000' }}
      >
        {/* Maker's Mark - Top Right Corner */}
        <div className="absolute top-4 right-4">
          <div className="w-14 h-14 border-2 border-fire-gold/60 rounded-full flex items-center justify-center bg-black/80 rotate-12">
            <div className="text-center">
              <p className="text-fire-gold text-[6px] font-bold leading-tight">RED HORSE</p>
              <p className="text-red-500 text-sm leading-none">馬</p>
              <p className="text-fire-gold text-[5px]">2026</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-fire-gold text-glow-gold">
          YOUR 2026 DECREE
        </h1>
        <p className="text-red-400 text-sm mb-4">The Oracle has spoken</p>

        {/* Talisman Image - Show BRANDED image (with Limited Edition + Certificate baked in) */}
        <div className="relative border-4 border-fire-gold rounded-2xl overflow-hidden shadow-2xl glow-gold bg-black">
          {(prophecy.branded_image_url || prophecy.image_url) ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <div className="animate-pulse text-fire-gold">Loading talisman...</div>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prophecy.branded_image_url ?? prophecy.image_url ?? undefined}
                alt="Your Fire Horse Talisman"
                crossOrigin="anonymous"
                className={`w-full max-w-[400px] h-auto transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error('Image failed to load');
                  setImageLoaded(true); // Show anyway
                }}
              />
            </>
          ) : (
            <div className="w-[400px] aspect-[9/16] bg-gradient-to-b from-red-950 to-black flex items-center justify-center">
              <p className="text-red-600">Image unavailable</p>
            </div>
          )}
        </div>

        {/* Prophecy Details */}
        <div className="mt-6 w-full space-y-4">
          {/* Main Text */}
          {prophecy.main_text && (
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-fire-gold text-glow-gold">
                {prophecy.main_text}
              </p>
            </div>
          )}

          {/* Zodiac Info */}
          {prophecy.zodiac_sign && (
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {prophecy.zodiac_sign} {prophecy.zodiac_element && `(${prophecy.zodiac_element})`} •{' '}
                {prophecy.fire_horse_relation}
              </p>
            </div>
          )}

          {/* Full Reading */}
          {prophecy.full_reading && (
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4">
              <p className="text-red-200 text-sm leading-relaxed italic">
                &quot;{prophecy.full_reading}&quot;
              </p>
            </div>
          )}

          {/* Authenticity Certificate Footer */}
          <div className="border-t border-fire-gold/30 pt-4 mt-4 w-full">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-fire-gold">🔥</span>
                <span className="text-gray-500">AUTHENTIC • VERIFIED • {prophecy.zodiac_sign?.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-[10px]">Minted by</p>
                <p className="text-fire-gold font-bold">redhorseoracle.com</p>
              </div>
            </div>
            {prophecy.edition_number && (
              <p className="text-center text-white text-xs font-bold mt-3">
                Certificate #{prophecy.id.slice(0, 8).toUpperCase()} • Year of the Fire Horse 2026
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Important Notice for Owner */}
      <div className="w-full mt-4 bg-gradient-to-r from-yellow-900/30 to-red-900/30 border border-fire-gold/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <p className="text-fire-gold font-bold text-sm">Your Authenticated Certificate</p>
            <p className="text-gray-300 text-xs mt-1">
              Download your official talisman with Certificate #{prophecy.id.slice(0, 8).toUpperCase()} now.
              This authenticated version is exclusively yours and proves ownership of Edition #{prophecy.edition_number}.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Outside capturable area */}
      <div className="flex flex-col gap-3 pt-4 w-full">
        {/* Download Button - Primary CTA for authenticated image */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full font-bold py-4 px-6 rounded-xl
                     hover:scale-[1.02] active:scale-98 transition-all
                     flex items-center justify-center gap-2 disabled:opacity-50
                     ${hasDownloaded
                       ? 'bg-green-600 text-white'
                       : 'bg-fire-gold text-black'}`}
        >
          <span>{isDownloading ? '⏳' : hasDownloaded ? '✓' : '📥'}</span>
          {isDownloading
            ? 'Downloading...'
            : hasDownloaded
              ? 'Downloaded! (Click to save again)'
              : 'Download Authenticated Talisman'}
        </button>

        {!hasDownloaded && (
          <p className="text-center text-yellow-500 text-xs">
            ⚠️ Save your certificate now - this is your proof of ownership
          </p>
        )}

        {/* Share Buttons */}
        <div className="border-t border-fire-gold/20 pt-4 mt-2">
          <ShareButtons prophecy={prophecy} />
        </div>
      </div>
    </div>
  );
}
