import type { NextConfig } from "next";
import "./env"

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      hmrRefreshes: true,
      fullUrl: true,
    }
  },
  experimental: {
    ppr: true,
    serverComponentsHmrCache: true,
    streamingMetadata: true,
  },
  images: {
    formats:['image/avif','image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `images.ctfassets.net`,
        pathname: `/${process.env.CONTENTFUL_SPACE_ID}/**`,
      }
    ],
    minimumCacheTTL: 31536000, // 1 year in seconds
  },
  async redirects() {
    return [
      {
        source: '/black-ops-1',
        destination: '/?game=black-ops-1',
        permanent: true,
      },
      {
        source: '/black-ops-2',
        destination: '/?game=black-ops-2',
        permanent: true,
      },
      {
        source: '/black-ops-3',
        destination: '/?game=black-ops-3',
        permanent: true,
      },
      {
        source: '/black-ops-4',
        destination: '/?game=black-ops-4',
        permanent: true,
      },
      {
        source: '/black-ops-cold-war',
        destination: '/?game=black-ops-cold-war',
        permanent: true,
      },
      {
        source: '/black-ops-6',
        destination: '/?game=black-ops-6',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
