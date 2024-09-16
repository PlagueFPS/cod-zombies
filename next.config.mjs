/** @type {import('next').NextConfig} */
import createJiti from "jiti"
import { fileURLToPath } from "url";
const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build. Jiti used to import .ts files
jiti("./env/client")
jiti("./env/server")

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
