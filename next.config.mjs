/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: 'incremental'
  },
  images: {
    formats:['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      }
    ],
  },
};

export default nextConfig;
