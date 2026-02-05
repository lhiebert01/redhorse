import type { Metadata } from 'next';

const siteUrl = 'https://redhorseoracle.com';

export const metadata: Metadata = {
  title: 'Fire Horse Trivia | CNY 2026 Party Game | Red Horse Oracle',
  description:
    'Fire Horse Trivia: The ultimate Chinese New Year 2026 party game! 400 expert questions powered by Google Gemini 3 Pro with Privacy by Design. Host up to 20 players with live leaderboards. The Fire Horse returns only once every 60 years. Authenticated 888 Limited Edition. From $2.88.',
  keywords: [
    'Fire Horse Trivia',
    'Fire Horse Trivia Game',
    'CNY 2026 Party Game',
    'Chinese New Year 2026 Game',
    'Year of the Fire Horse 2026',
    'Fire Horse 2026',
    'Chinese Zodiac Trivia',
    'Google Gemini 3 Pro',
    'Privacy by Design',
    '888 Limited Edition',
    'Red Horse Oracle',
    'Party Trivia Game',
    'Lunar New Year 2026',
    'CNY Party Game',
    'Fire Horse Party',
    'Chinese New Year Trivia',
  ],
  openGraph: {
    title: 'Fire Horse Trivia | The Ultimate CNY 2026 Party Game 🔥🐴',
    description:
      '400 expert questions, up to 20 players, live leaderboards! Google Gemini 3 Pro powered with Privacy by Design. The Fire Horse returns only once every 60 years. Host the party everyone remembers!',
    images: [
      {
        url: `${siteUrl}/assets/party-marketing/FireHorse-Party-Hero-OG-Image1.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Fire Horse Trivia - CNY 2026 Party Game - Red Horse Oracle',
      },
    ],
    type: 'website',
    siteName: 'Red Horse Oracle',
    url: `${siteUrl}/party`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fire Horse Trivia | CNY 2026 Party Game 🎉🐴',
    description:
      '400 questions, 20 players, live leaderboards! Google Gemini 3 Pro + Privacy by Design. Fire Horse returns only every 60 years. From $2.88!',
    images: [`${siteUrl}/assets/party-marketing/FireHorse-Party-Hero-OG-Image1.jpeg`],
  },
  alternates: {
    canonical: `${siteUrl}/party`,
  },
};

// Structured Data for Party Game (JSON-LD)
const partyStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Game',
  name: 'Fire Horse Trivia',
  alternateName: ['Fire Horse Trivia Game', 'CNY 2026 Trivia', 'Red Horse Oracle Trivia'],
  description:
    'Fire Horse Trivia is the ultimate Chinese New Year 2026 party game from Red Horse Oracle. Features 400 expert questions about Chinese Zodiac, Fire Horse legends, and CNY traditions. Powered by Google Gemini 3 Pro with complete Privacy by Design. Host up to 20 players with live leaderboards and real-time scoring.',
  url: `${siteUrl}/party`,
  gameItem: {
    '@type': 'Thing',
    name: 'Trivia Questions',
    description: '400 expert questions about Chinese Zodiac, Fire Horse, and CNY traditions',
  },
  numberOfPlayers: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 20,
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Solo Play',
      price: '2.88',
      priceCurrency: 'USD',
      description: 'Play Fire Horse Trivia solo - 5 games, 20 questions each',
    },
    {
      '@type': 'Offer',
      name: 'Day Pass',
      price: '4.88',
      priceCurrency: 'USD',
      description: 'Host Fire Horse Trivia parties for 24 hours',
    },
    {
      '@type': 'Offer',
      name: 'Weekend Pass',
      price: '8.88',
      priceCurrency: 'USD',
      description: 'Host Fire Horse Trivia parties for 48 hours',
    },
  ],
  author: {
    '@type': 'Organization',
    name: 'Red Horse Oracle',
    url: siteUrl,
  },
  keywords:
    'Fire Horse Trivia, CNY 2026 Party Game, Chinese New Year 2026, Year of the Fire Horse, Google Gemini 3 Pro, Privacy by Design, 888 Limited Edition, Chinese Zodiac Trivia',
};

export default function PartyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(partyStructuredData) }}
      />
      {children}
    </>
  );
}
