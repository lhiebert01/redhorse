import type { Metadata } from 'next';
import './globals.css';

// Hardcoded to ensure correct OG image URLs - env var was causing issues
const siteUrl = 'https://redhorse-omega.vercel.app';

export const metadata: Metadata = {
  title: 'Red Horse Oracle | Year of the Fire Horse 2026',
  description:
    'The Fire Horse returns every 60 years. Unlock your destiny with AI-generated sacred talismans featuring lucky numbers, strategic battle mottos, love decrees, and protective mantras. $8.88',
  keywords: [
    'Fire Horse 2026',
    'Chinese Zodiac',
    'Lucky Numbers',
    'AI Oracle',
    'Digital Talisman',
    'Year of the Horse',
    'Chinese New Year 2026',
    'Fortune Telling',
    'Prophecy',
  ],
  authors: [{ name: 'Red Horse Oracle' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Red Horse Oracle | Year of the Fire Horse 2026',
    description:
      'The Fire Horse returns every 60 years. Chaos is coming. Do not guess your destiny. Get your sacred digital talisman for $8.88',
    type: 'website',
    locale: 'en_US',
    siteName: 'Red Horse Oracle',
    images: [
      {
        url: '/assets/Year-of-Horse-Hero-Image2.jpeg',
        width: 1200,
        height: 630,
        alt: 'Year of the Fire Horse 2026 - Chinese Zodiac Oracle with 12 Animals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Horse Oracle | Fire Horse 2026',
    description: 'The Fire Horse returns every 60 years. Unlock your sacred prophecy for $8.88',
    images: ['/assets/Year-of-Horse-Hero-Image2.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
