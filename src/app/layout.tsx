import type { Metadata } from 'next';
import './globals.css';

// Production domain
const siteUrl = 'https://redhorseoracle.com';

export const metadata: Metadata = {
  title: 'Red Horse Oracle | Year of the Fire Horse 2026 | AI Zodiac Prophecy',
  description:
    'Red Horse Oracle: World\'s first Google Gemini 3 Pro Chinese Zodiac app with Privacy by Design. Get your authenticated 888 Limited Edition Fire Horse prophecy for CNY 2026. Lucky numbers, power mottos, love decrees & protective mantras. The Fire Horse returns only once every 60 years (1966→2026→2086). $8.88',
  keywords: [
    'Fire Horse 2026',
    'Year of the Fire Horse',
    'Year of the Fire Horse 2026',
    'Chinese Zodiac 2026',
    'Chinese New Year 2026',
    'CNY 2026',
    'Lucky Numbers',
    'AI Oracle',
    'Google Gemini 3 Pro',
    'Gemini 3 Pro',
    'Privacy by Design',
    'Year of the Horse',
    'Fortune Telling',
    'Prophecy',
    'Digital Talisman',
    'Zodiac Forecast',
    'Red Horse Oracle',
    'Fire Horse Oracle',
    '888 Limited Edition',
    'Authenticated Oracle',
    'Chinese Zodiac AI',
    'Fire Horse Prophecy',
    'Lunar New Year 2026',
    '丙午年',
  ],
  authors: [{ name: 'Red Horse Oracle' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Red Horse Oracle | Year of the Fire Horse 2026 | Google Gemini 3 Pro AI',
    description:
      'Get your authenticated 888 Limited Edition Fire Horse prophecy! World\'s first Google Gemini 3 Pro Chinese Zodiac app with Privacy by Design. CNY 2026 - Fire Horse returns only once every 60 years. $8.88',
    type: 'website',
    locale: 'en_US',
    siteName: 'Red Horse Oracle',
    url: siteUrl,
    images: [
      {
        url: '/assets/Fire-Horse-2026-Chart-v3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Year of the Fire Horse 2026 - Red Horse Oracle - Chinese Zodiac AI Prophecy - Google Gemini 3 Pro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Horse Oracle | Year of the Fire Horse 2026 🔥🐴',
    description: 'Authenticated 888 Limited Edition AI Prophecy! Google Gemini 3 Pro + Privacy by Design. Fire Horse returns only every 60 years. CNY 2026. $8.88',
    images: ['/assets/Fire-Horse-2026-Chart-v3.jpeg'],
    creator: '@redhorseoracle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'google57e03e227b2e0f31',
  },
};

// Structured Data (JSON-LD) for SEO and AI Agents
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Red Horse Oracle',
  alternateName: ['Fire Horse Oracle', 'Red Horse Oracle 2026', 'Fire Horse Prophecy'],
  description: 'Red Horse Oracle is the world\'s first Google Gemini 3 Pro powered Chinese Zodiac prophecy app with complete Privacy by Design. Get your authenticated 888 Limited Edition Fire Horse prophecy for the Year of the Fire Horse 2026 (CNY 2026). Features include personalized lucky numbers, power mottos, love decrees, and protective mantras. The Fire Horse returns only once every 60 years (1966→2026→2086).',
  url: siteUrl,
  applicationCategory: 'Entertainment',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '8.88',
    priceCurrency: 'USD',
    description: 'Authenticated 888 Limited Edition Fire Horse prophecy with AI-generated talisman artwork',
    availability: 'https://schema.org/LimitedAvailability',
  },
  creator: {
    '@type': 'Organization',
    name: 'Red Horse Oracle',
    url: siteUrl,
  },
  featureList: [
    'Google Gemini 3 Pro AI Image Generation',
    'Privacy by Design - Zero PII Stored',
    'Authenticated 888 Limited Edition Oracles',
    'Lucky Numbers Generation',
    'Power Mottos',
    'Love Decrees',
    'Protective Mantras',
    'Chinese Zodiac Forecasts',
    'Year of the Fire Horse 2026',
    'CNY 2026 Celebrations',
  ],
  keywords: 'Fire Horse 2026, Year of the Fire Horse, Chinese Zodiac 2026, CNY 2026, Google Gemini 3 Pro, Privacy by Design, 888 Limited Edition, Red Horse Oracle, AI Oracle, Chinese New Year 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Red Horse Oracle" />
        <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png" />

        {/* Google Analytics 4 - Raw script tags for maximum compatibility */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EV6LX78YP1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EV6LX78YP1');
            `,
          }}
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(error) {
                    console.log('SW registration failed: ', error);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
