import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

// Production domain
const siteUrl = 'https://redhorseoracle.com';

// Google Analytics Measurement ID - Add yours from GA4
// Supports both variable names for flexibility
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: 'Red Horse Oracle | AI-Powered Fire Horse Prophecy 2026',
  description:
    'The world\'s first Google Gemini 3 Pro zodiac app with COMPLETE Privacy by Design. Get personalized lucky numbers, power mottos, love decrees, or protective mantras. Fire Horse returns every 60 years. $8.88',
  keywords: [
    'Fire Horse 2026',
    'Chinese Zodiac 2026',
    'Lucky Numbers',
    'AI Oracle',
    'Google Gemini',
    'Privacy by Design',
    'Year of the Horse',
    'Chinese New Year 2026',
    'Fortune Telling',
    'Prophecy',
    'Digital Talisman',
    'Zodiac Forecast',
  ],
  authors: [{ name: 'Red Horse Oracle' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Red Horse Oracle | AI Fire Horse Prophecy 2026',
    description:
      'World\'s first Google Gemini 3 Pro zodiac app with COMPLETE Privacy by Design. Fire Horse returns every 60 years. Get your sacred prophecy for $8.88',
    type: 'website',
    locale: 'en_US',
    siteName: 'Red Horse Oracle',
    url: siteUrl,
    images: [
      {
        url: '/assets/Fire-Horse-2026-Chart-v3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Year of the Fire Horse 2026 - All 12 Chinese Zodiac Animals - AI Oracle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Horse Oracle | AI Fire Horse 2026',
    description: 'World\'s first Gemini 3 Pro zodiac app with Privacy by Design. Fire Horse returns every 60 years. $8.88',
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
    // Add Google Search Console verification when you have it
    // google: 'your-google-verification-code',
  },
};

// Structured Data (JSON-LD) for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Red Horse Oracle',
  description: 'AI-powered Chinese zodiac prophecy generator for the Year of the Fire Horse 2026',
  url: siteUrl,
  applicationCategory: 'Entertainment',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '8.88',
    priceCurrency: 'USD',
    description: 'Personalized Fire Horse prophecy with AI-generated talisman artwork',
  },
  creator: {
    '@type': 'Organization',
    name: 'Red Horse Oracle',
    url: siteUrl,
  },
  featureList: [
    'Google Gemini 3 Pro AI',
    'Privacy by Design',
    'Lucky Numbers Generation',
    'Power Mottos',
    'Love Decrees',
    'Protective Mantras',
    'Chinese Zodiac Forecasts',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">
        {children}

        {/* Google Analytics - Using Next.js Script component with afterInteractive */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
