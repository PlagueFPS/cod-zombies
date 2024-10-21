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
    after: true,
    serverComponentsHmrCache: true,
  },
  images: {
    formats:['image/avif','image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      }
    ],
    minimumCacheTTL: 31536000, // 1 year in seconds
  },
};

export default nextConfig;
