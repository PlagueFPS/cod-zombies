import type { NextConfig } from "next";
import "./env"

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    pprFallbacks: true,
    after: true,
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
