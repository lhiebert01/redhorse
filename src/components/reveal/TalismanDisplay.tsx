'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Prophecy } from '@/types/prophecy';
import ShareButtons from './ShareButtons';

interface TalismanDisplayProps {
  prophecy: Prophecy;
}

export default function TalismanDisplay({ prophecy }: TalismanDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    if (!prophecy.image_url) return;

    try {
      const response = await fetch(prophecy.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fire-horse-talisman-2026-${prophecy.id.slice(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md w-full">
      {/* Talisman Image */}
      <div className="relative border-4 border-fire-gold rounded-2xl overflow-hidden shadow-2xl glow-gold bg-black">
        {prophecy.image_url ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-pulse text-fire-gold">Loading talisman...</div>
              </div>
            )}
            <Image
              src={prophecy.image_url}
              alt="Your Fire Horse Talisman"
              width={400}
              height={711}
              className={`w-full h-auto transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              priority
            />
          </>
        ) : (
          <div className="w-full aspect-[9/16] bg-gradient-to-b from-red-950 to-black flex items-center justify-center">
            <p className="text-red-600">Image unavailable</p>
          </div>
        )}
      </div>

      {/* Prophecy Details */}
      <div className="mt-8 w-full space-y-4">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleDownload}
            className="flex-1 bg-fire-gold text-black font-bold py-3 px-6 rounded-xl
                       hover:scale-105 active:scale-95 transition-transform
                       flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Save Talisman
          </button>

          <ShareButtons prophecy={prophecy} />
        </div>
      </div>
    </div>
  );
}
