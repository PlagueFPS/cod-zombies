import type { NextConfig } from "next";
import "./env"

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      hmrRefreshes: true,
    }
  },
  experimental: {
    ppr: true,
    serverComponentsHmrCache: true,
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
};

export default nextConfig;
