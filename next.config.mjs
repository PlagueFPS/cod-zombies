/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true
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
