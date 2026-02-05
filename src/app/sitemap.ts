import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://redhorseoracle.com';
  const currentDate = new Date();

  return [
    // Main Oracle Page
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Free Oracle Reading
    {
      url: `${baseUrl}/free`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // Fire Horse Trivia Party Game
    {
      url: `${baseUrl}/party`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // Examples Gallery
    {
      url: `${baseUrl}/examples`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // VIP Pass
    {
      url: `${baseUrl}/vip`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Partner / Influencer
    {
      url: `${baseUrl}/partner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Privacy Policy
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Terms of Service
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
