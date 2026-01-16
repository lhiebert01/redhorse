import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://redhorseoracle.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin-test'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
