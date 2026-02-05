import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.redhorseoracle.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin-test',
          '/superadmin',
          '/superadmin/',
          '/preview-loading',
          '/collections-grid',
        ],
      },
      // Explicitly allow AI crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin-test', '/superadmin'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin-test', '/superadmin'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
        disallow: ['/api/', '/admin-test', '/superadmin'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin-test', '/superadmin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
