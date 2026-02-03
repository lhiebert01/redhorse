'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Prophecy } from '@/types/prophecy';
import ShareButtons from './ShareButtons';
import {
  ZODIAC_CHINESE,
  ELEMENT_CHINESE,
  ZodiacAnimal,
  ZodiacElement,
} from '@/constants/zodiac-data';

interface TalismanDisplayProps {
  prophecy: Prophecy;
}

export default function TalismanDisplay({ prophecy }: TalismanDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDownloadingRaw, setIsDownloadingRaw] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const talismanRef = useRef<HTMLDivElement>(null);

  const animal = prophecy.zodiac_sign as ZodiacAnimal;
  const element = prophecy.zodiac_element as ZodiacElement;
  const animalChinese = animal ? ZODIAC_CHINESE[animal] : '';
  const elementChinese = element ? ELEMENT_CHINESE[element] : '';

  // Download the screen capture (exactly what user sees)
  const handleSaveTalisman = async () => {
    if (!talismanRef.current) return;
    setIsCapturing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(talismanRef.current, {
        backgroundColor: '#0a0000',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const images = clonedDoc.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            images[i].style.opacity = '1';
          }
        }
      });

      const elementName = element ? `${element.toLowerCase()}-` : '';
      const animalName = animal ? animal.toLowerCase() : 'unknown';
      const filename = `fire-horse-2026-${elementName}${animalName}-talisman.png`;

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Screenshot failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Download the raw AI-generated image
  const handleDownloadRawImage = async () => {
    if (!prophecy.image_url) return;
    setIsDownloadingRaw(true);

    try {
      const response = await fetch(prophecy.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const elementName = element ? `${element.toLowerCase()}-` : '';
      const animalName = animal ? animal.toLowerCase() : 'unknown';
      a.download = `fire-horse-2026-${elementName}${animalName}-raw-image.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Raw image download failed:', error);
    } finally {
      setIsDownloadingRaw(false);
    }
  };

  // Download the Digital Art Card
  const handleDownloadCard = async () => {
    if (!animal || !element) return;
    setIsDownloadingCard(true);

    try {
      const cardUrl = `/assets/zodiac-badges/${element.toLowerCase()}-${animal.toLowerCase()}.jpeg`;
      const response = await fetch(cardUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fire-horse-2026-${element.toLowerCase()}-${animal.toLowerCase()}-card.jpeg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Card download failed:', error);
    } finally {
      setIsDownloadingCard(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg w-full space-y-6">
      {/* ========== TALISMAN SECTION ========== */}
      <div
        ref={talismanRef}
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
        <p className="text-red-400 text-sm mb-2">The Oracle has spoken</p>

        {/* Edition Badge */}
        {prophecy.edition_number && prophecy.total_editions && (
          <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-full px-6 pt-1 pb-2.5 mb-4 flex items-center justify-center">
            <p className="text-black text-xs font-bold tracking-wide leading-none">
              ✦ LIMITED EDITION #{prophecy.edition_number} of {prophecy.total_editions} ✦
            </p>
          </div>
        )}

        {/* Talisman Image */}
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
                  setImageLoaded(true);
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

      {/* ========== DOWNLOAD BUTTONS ========== */}
      <div className="w-full space-y-3">
        <p className="text-fire-gold text-sm font-semibold text-center">Download Your Oracle</p>

        {/* Save Talisman (Screen Capture) */}
        <button
          onClick={handleSaveTalisman}
          disabled={isCapturing}
          className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold py-4 px-6 rounded-xl
                     hover:scale-[1.02] active:scale-98 transition-all
                     flex items-center justify-center gap-2 disabled:opacity-50 border-2 border-yellow-400"
        >
          <span>{isCapturing ? '...' : '📥'}</span>
          {isCapturing ? 'Capturing...' : 'Save Complete Talisman'}
        </button>

        {/* Download Raw Image */}
        <button
          onClick={handleDownloadRawImage}
          disabled={isDownloadingRaw || !prophecy.image_url}
          className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-xl
                     active:scale-95 transition-all
                     flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{isDownloadingRaw ? '...' : '🖼️'}</span>
          {isDownloadingRaw ? 'Downloading...' : 'Download Raw AI Image'}
        </button>
      </div>

      {/* ========== SHARE SECTION ========== */}
      <div className="w-full bg-gradient-to-r from-purple-950 via-black to-purple-950 border-2 border-purple-500/70 rounded-2xl p-5">
        <p className="text-purple-300 text-sm font-semibold text-center mb-1">📣 Share Your Oracle</p>
        <p className="text-gray-400 text-xs text-center mb-2">Share a watermarked preview with friends</p>
        <p className="text-yellow-500 text-[10px] text-center mb-4">
          🔒 Your authenticated certificate version stays private
        </p>
        <ShareButtons prophecy={prophecy} />
      </div>

      {/* ========== DIGITAL ART CARD SECTION ========== */}
      {animal && element && (
        <div className="w-full">
          {/* Glowing border effect */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-fire-gold to-green-500 rounded-3xl opacity-70"></div>

            <div className="relative bg-gradient-to-b from-green-950 via-black to-green-950 border-4 border-green-400 rounded-2xl p-6">
              {/* FREE Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 via-green-400 to-green-500 text-black font-black text-sm px-6 py-2 rounded-full border-2 border-green-200 shadow-lg">
                  ★ BONUS DIGITAL ART CARD ★
                </div>
              </div>

              <div className="pt-6 space-y-4">
                {/* Header */}
                <div className="text-center">
                  <p className="text-green-400 text-xs uppercase tracking-[0.2em] mb-1">
                    Your Collectible Zodiac Card
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    {element} {animal}
                  </h2>
                  <p className="text-3xl mt-1">
                    {elementChinese}{animalChinese}
                  </p>
                </div>

                {/* Digital Art Card - Full Resolution */}
                <div className="relative mx-auto max-w-sm">
                  <div className="rounded-xl overflow-hidden border-2 border-green-500/50 shadow-lg shadow-green-500/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/zodiac-badges/${element.toLowerCase()}-${animal.toLowerCase()}.jpeg`}
                      alt={`${element} ${animal} Digital Art Card`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Download Card Button */}
                <button
                  onClick={handleDownloadCard}
                  disabled={isDownloadingCard}
                  className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-black font-bold py-3 px-6 rounded-xl
                             hover:scale-[1.02] active:scale-95 transition-all
                             flex items-center justify-center gap-2 disabled:opacity-50 border-2 border-green-400"
                >
                  <span>{isDownloadingCard ? '...' : '📥'}</span>
                  {isDownloadingCard ? 'Downloading...' : 'Download Digital Art Card'}
                </button>

                {/* Card Info */}
                <div className="text-center text-xs text-gray-400">
                  <p>High-resolution collectible card featuring your {element} {animal}</p>
                  <p className="text-green-400 mt-1">Included FREE with your Oracle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== PRIVACY SECTION ========== */}
      <div className="w-full bg-green-900/30 border-2 border-green-500/50 rounded-2xl p-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🛡️</span>
          <h3 className="text-green-400 text-lg font-bold">Privacy by Design</h3>
        </div>
        <p className="text-white text-center text-sm leading-relaxed">
          Your Oracle was generated by <span className="text-fire-gold font-bold">Gemini 3 Pro AI</span>.
          <br />
          <span className="text-green-400 font-semibold">No personal information collected, stored, or displayed.</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <span className="bg-green-900/50 border border-green-700 text-green-300 text-[10px] px-2 py-1 rounded">✓ ZERO DATA STORED</span>
          <span className="bg-green-900/50 border border-green-700 text-green-300 text-[10px] px-2 py-1 rounded">✓ NO TRACKING</span>
          <span className="bg-green-900/50 border border-green-700 text-green-300 text-[10px] px-2 py-1 rounded">✓ SAFE TO SHARE</span>
        </div>
      </div>

      {/* ========== HIDDEN FOR NOW - CHARITABLE GIVING THANK YOU ==========
          To re-enable: Remove this comment block
          Future: Change to 8.88% of net proceeds instead of 20%

      <div className="w-full bg-gradient-to-br from-purple-950/40 via-black/60 to-blue-950/40 border border-purple-500/40 rounded-2xl p-5">
        <div className="text-center">
          <span className="text-3xl">👁️</span>
          <h3 className="text-purple-300 text-lg font-bold mt-2 mb-3">
            Thank You — Your Oracle Gives Back
          </h3>

          <div className="bg-black/40 rounded-lg p-3 mb-4 border-l-2 border-purple-400">
            <p className="text-gray-300 text-sm italic">
              &quot;In ancient Greece, the blind seer <span className="text-purple-300 font-semibold">Tiresias</span> possessed the greatest vision of all.&quot;
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
            <p className="text-white text-sm font-bold mb-1">
              🤍 8.88% of net proceeds supports
            </p>
            <p className="text-purple-300 text-lg font-bold mb-2">
              American Foundation for the Blind
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sight — the ability to see, to envision, to experience a bright future.
              <span className="text-purple-300 font-semibold"> Something many of us take for granted.</span>
            </p>
            <p className="text-fire-gold text-xs mt-2 italic">
              Your Oracle just built positive karma for 2026. Thank you.
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <span className="bg-purple-900/50 border border-purple-500/50 text-purple-300 text-xs px-3 py-1.5 rounded-full">
              🤖 AI for Good
            </span>
            <span className="bg-purple-900/50 border border-purple-500/50 text-purple-300 text-xs px-3 py-1.5 rounded-full">
              💜 You Made a Difference
            </span>
          </div>
        </div>
      </div>
      END HIDDEN SECTION */}
    </div>
  );
}
