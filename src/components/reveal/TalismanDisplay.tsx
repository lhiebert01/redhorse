'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Prophecy } from '@/types/prophecy';
import ShareButtons from './ShareButtons';

interface TalismanDisplayProps {
  prophecy: Prophecy;
}

export default function TalismanDisplay({ prophecy }: TalismanDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const talismanRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!talismanRef.current) return;

    setIsCapturing(true);

    try {
      // Wait a moment for any rendering to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use html2canvas to capture the full talisman card
      const canvas = await html2canvas(talismanRef.current, {
        backgroundColor: '#0a0000',
        scale: 2, // Higher quality
        useCORS: true, // Allow cross-origin images
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure images are fully loaded in the clone
          const images = clonedDoc.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            images[i].style.opacity = '1';
          }
        }
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fire-horse-talisman-2026-${prophecy.id.slice(0, 8)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Screenshot failed:', error);
      // Fallback to just downloading the image
      if (prophecy.image_url) {
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
        } catch (fallbackError) {
          console.error('Fallback download failed:', fallbackError);
        }
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md w-full">
      {/* Capturable Talisman Card */}
      <div
        ref={talismanRef}
        className="flex flex-col items-center w-full p-6 rounded-2xl"
        style={{ backgroundColor: '#0a0000' }}
      >
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-fire-gold text-glow-gold">
          YOUR 2026 DECREE
        </h1>
        <p className="text-red-400 text-sm mb-6">The Oracle has spoken</p>

        {/* Talisman Image - Using regular img for html2canvas compatibility */}
        <div className="relative border-4 border-fire-gold rounded-2xl overflow-hidden shadow-2xl glow-gold bg-black">
          {prophecy.image_url ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <div className="animate-pulse text-fire-gold">Loading talisman...</div>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prophecy.image_url}
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
        </div>
      </div>

      {/* Action Buttons - Outside capturable area */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full">
        <button
          onClick={handleDownload}
          disabled={isCapturing}
          className="flex-1 bg-fire-gold text-black font-bold py-3 px-6 rounded-xl
                     hover:scale-105 active:scale-95 transition-transform
                     flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{isCapturing ? '...' : '📥'}</span>
          {isCapturing ? 'Capturing...' : 'Save Talisman'}
        </button>

        <ShareButtons prophecy={prophecy} />
      </div>
    </div>
  );
}
