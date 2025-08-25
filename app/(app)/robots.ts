import type { MetadataRoute } from "next"
import { env } from "@/env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/newsletter/**'
      ]
    },
    sitemap: `${env.NEXT_PUBLIC_WEBSITE_URL}/sitemap.xml`
  }
}