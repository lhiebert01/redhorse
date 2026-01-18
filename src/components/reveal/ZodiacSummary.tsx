'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import {
  ZodiacAnimal,
  ZodiacElement,
  ZODIAC_ANIMALS,
  ZODIAC_ELEMENTS,
  ZODIAC_CHINESE,
  ELEMENT_CHINESE,
  ZODIAC_PROFILES,
  FIRE_HORSE_RELATIONS,
} from '@/constants/zodiac-data';

interface ZodiacSummaryProps {
  zodiacSign: string;
  zodiacElement?: string | null;
}

// Helper to normalize and validate zodiac sign
function normalizeZodiacSign(sign: string): ZodiacAnimal | null {
  if (!sign) return null;
  const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  return ZODIAC_ANIMALS.includes(normalized as ZodiacAnimal) ? (normalized as ZodiacAnimal) : null;
}

// Helper to normalize and validate element
function normalizeElement(element: string | null | undefined): ZodiacElement | null {
  if (!element) return null;
  const normalized = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  return ZODIAC_ELEMENTS.includes(normalized as ZodiacElement) ? (normalized as ZodiacElement) : null;
}

export default function ZodiacSummary({ zodiacSign, zodiacElement }: ZodiacSummaryProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const forecastRef = useRef<HTMLDivElement>(null);

  // Validate and normalize zodiac sign
  const animal = normalizeZodiacSign(zodiacSign);
  const element = normalizeElement(zodiacElement);

  // Return null if invalid zodiac sign
  if (!animal) {
    console.warn('ZodiacSummary: Invalid zodiac sign:', zodiacSign);
    return null;
  }

  const profile = ZODIAC_PROFILES[animal];
  const relation = FIRE_HORSE_RELATIONS[animal];
  const animalChinese = ZODIAC_CHINESE[animal] || '';
  const elementChinese = element ? (ELEMENT_CHINESE[element] || '') : '';

  // Safety check
  if (!profile || !relation) {
    console.warn('ZodiacSummary: No profile or relation for:', animal);
    return null;
  }

  // Download handler for zodiac forecast
  const handleDownloadForecast = async () => {
    if (!forecastRef.current) return;

    setIsCapturing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(forecastRef.current, {
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

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const elementName = element ? `${element.toLowerCase()}-` : '';
        a.download = `fire-horse-2026-${elementName}${animal.toLowerCase()}-forecast.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Forecast screenshot failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Get compatibility color
  const getCompatibilityColor = () => {
    switch (relation.compatibility) {
      case 'ally':
        return 'text-green-400';
      case 'special':
        return 'text-fire-gold';
      case 'clash':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCompatibilityBg = () => {
    switch (relation.compatibility) {
      case 'ally':
        return 'bg-green-900/20 border-green-800/50';
      case 'special':
        return 'bg-yellow-900/20 border-yellow-800/50';
      case 'clash':
        return 'bg-red-900/20 border-red-800/50';
      default:
        return 'bg-gray-900/20 border-gray-800/50';
    }
  };

  return (
    <div className="w-full max-w-md mt-8 space-y-6">
      {/* Capturable Forecast Section */}
      <div ref={forecastRef} className="p-4 rounded-2xl space-y-6" style={{ backgroundColor: '#0a0000' }}>
        {/* Section Header */}
        <div className="text-center space-y-1">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Powered by Gemini 3 Pro AI</p>
          <h2 className="text-2xl font-bold text-fire-gold text-glow-gold">
            YOUR ZODIAC FORECAST
          </h2>
          <p className="text-red-400 text-sm">Year of the Fire Horse 2026</p>
        </div>

        {/* Zodiac Card */}
        <div className="bg-black/60 backdrop-blur-sm border border-fire-gold/30 rounded-2xl p-6 space-y-5">
        {/* Animal Image and Title */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-fire-gold shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/zodiac/${animal.toLowerCase()}.jpeg`}
              alt={`${animal} zodiac`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-fire-gold">
              {element ? `${element} ${animal}` : animal}
            </h3>
            <p className="text-2xl text-red-300">
              {elementChinese}{animalChinese}
            </p>
            <p className={`text-sm ${getCompatibilityColor()}`}>
              {relation.relation}
            </p>
          </div>
        </div>

        {/* Strengths */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Core Strengths</p>
          <div className="flex flex-wrap gap-2">
            {profile.strengths.map((strength) => (
              <span
                key={strength}
                className="bg-fire-gold/10 border border-fire-gold/30 text-fire-gold text-xs px-3 py-1 rounded-full"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        {/* Characteristics */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Characteristics</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {profile.characteristics}
          </p>
        </div>

        {/* 2026 Forecast */}
        <div className={`${getCompatibilityBg()} border rounded-xl p-4`}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            2026 Fire Horse Forecast
          </p>
          <p className="text-gray-200 text-sm leading-relaxed">
            {profile.forecast2026}
          </p>
        </div>

        {/* Fire Horse Wisdom */}
        <div className="border-t border-fire-gold/20 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Oracle Wisdom</p>
          <p className="text-fire-gold text-sm italic">
            &quot;{relation.advice}&quot;
          </p>
        </div>
      </div>

        {/* Branding Footer in Capturable Area */}
        <div className="text-center text-xs text-gray-600 pt-2">
          <p>redhorseoracle.com • Year of the Fire Horse 2026</p>
        </div>
      </div>

      {/* Save Zodiac Forecast Button - Outside capturable area */}
      <button
        onClick={handleDownloadForecast}
        disabled={isCapturing}
        className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white font-bold py-3 px-6 rounded-xl
                   hover:scale-105 active:scale-95 transition-transform
                   flex items-center justify-center gap-2 disabled:opacity-50
                   border border-fire-gold/30"
      >
        <span>{isCapturing ? '...' : '📜'}</span>
        {isCapturing ? 'Capturing...' : 'Save Zodiac Forecast'}
      </button>

      {/* Privacy Notice */}
      <div className="bg-green-900/30 border border-green-600/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🛡️</span>
          <p className="text-green-400 text-lg font-bold uppercase tracking-wider">
            Privacy by Design
          </p>
        </div>
        <div className="text-center space-y-3">
          <p
            className="text-base leading-relaxed font-medium"
            style={{ color: '#ffffff', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
          >
            Your Oracle was generated by <span className="text-fire-gold font-bold">Gemini 3 Pro AI</span>.
          </p>
          <p
            className="text-base font-bold"
            style={{ color: '#ffffff', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}
          >
            No personal information collected, stored, or displayed.
          </p>
          <ul className="text-base space-y-2 mt-4 text-left max-w-sm mx-auto" style={{ color: '#f0f0f0' }}>
            <li><span className="text-green-400 font-bold">✓</span> Your birth date was used only to calculate your zodiac sign</li>
            <li><span className="text-green-400 font-bold">✓</span> Your birth date was <span className="text-green-400 font-bold">immediately discarded</span> - never stored</li>
            <li><span className="text-green-400 font-bold">✓</span> No names, birthdays, or personal info appear on this Oracle</li>
            <li><span className="text-green-400 font-bold">✓</span> Safe to download and share publicly</li>
          </ul>
        </div>
        <p
          className="text-base italic text-center font-medium mt-4"
          style={{ color: '#e5e5e5', textShadow: '0 0 8px rgba(255,255,255,0.2)' }}
        >
          The FIRST, ONLY, and BEST Google Gemini 3 Pro app with COMPLETE Privacy by Design.
        </p>
      </div>
    </div>
  );
}
