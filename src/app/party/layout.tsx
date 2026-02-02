import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fire Horse Trivia Party Game | CNY 2026',
  description: 'Host your own Fire Horse Trivia party for Chinese New Year 2026! 400 expert questions, up to 20 players, live leaderboards. The Fire Horse returns once every 60 years - LEADERS WILL HOST IT!',
  openGraph: {
    title: 'Fire Horse Trivia - The Perfect CNY 2026 Party Game',
    description: 'The Fire Horse returns once every 60 years. Most people will scroll past it. LEADERS WILL HOST IT. 400 questions, 20 players, live scoring!',
    images: [
      {
        url: 'https://redhorseoracle.com/assets/party-marketing/FireHorse-Party-Hero-OG-Image1.jpeg',
        width: 1200,
        height: 630,
        alt: 'Fire Horse Trivia Party Game - CNY 2026',
      },
    ],
    type: 'website',
    siteName: 'Red Horse Oracle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fire Horse Trivia - CNY 2026 Party Game',
    description: 'Host your own Fire Horse Trivia party! 400 questions, 20 players, live leaderboards. The Fire Horse returns once every 60 years!',
    images: ['https://redhorseoracle.com/assets/party-marketing/FireHorse-Party-Hero-OG-Image1.jpeg'],
  },
};

export default function PartyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
