import type { Metadata } from 'next';

const siteUrl = 'https://redhorseoracle.com';

export const metadata: Metadata = {
  title: 'FREE 2026 Reading | Red Horse Oracle',
  description:
    'Get your FREE Chinese Zodiac reading for the Year of the Fire Horse 2026. Discover your zodiac animal, element, and 2026 forecast. No email required. Privacy by Design.',
  openGraph: {
    title: 'FREE 2026 Fire Horse Reading',
    description:
      'What does the Fire Horse reveal about YOUR 2026? Get your FREE Chinese Zodiac reading. No email required.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Red Horse Oracle',
    url: `${siteUrl}/free`,
    images: [
      {
        url: '/assets/og-free-reading.jpeg',
        width: 1200,
        height: 630,
        alt: 'FREE 2026 Fire Horse Reading - Red Horse Oracle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREE 2026 Fire Horse Reading',
    description: 'What does the Fire Horse reveal about YOUR 2026? Get your FREE reading. No email required.',
    images: ['/assets/og-free-reading.jpeg'],
    creator: '@redhorseoracle',
  },
};

export default function FreeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
