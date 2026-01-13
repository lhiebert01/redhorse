import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Red Horse Oracle | 2026 Fire Horse Prophecy',
  description:
    'Unlock your destiny for the Year of the Fire Horse 2026. AI-generated talismans with lucky numbers, strategic advice, and protective mantras.',
  keywords: ['Fire Horse', '2026', 'Chinese New Year', 'Lucky Numbers', 'AI Oracle', 'Talisman'],
  authors: [{ name: 'Red Horse Oracle' }],
  openGraph: {
    title: 'Red Horse Oracle | 2026 Fire Horse Prophecy',
    description: 'The Fire Horse returns every 60 years. Get your digital talisman for 2026.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Red Horse Oracle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Horse Oracle | 2026',
    description: 'Unlock your Fire Horse prophecy for $8.88',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
