/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Redirect Vercel URL to custom domain
  async redirects() {
    // Only redirect if on Vercel deployment URL (not custom domain)
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'redhorse-omega.vercel.app',
          },
        ],
        destination: 'https://www.redhorseoracle.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
