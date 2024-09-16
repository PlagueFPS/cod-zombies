import type { MetadataRoute } from "next";
import { clientEnv } from "@/env/client";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${clientEnv.NEXT_PUBLIC_WEBSITE_URL}/sitemap.xml`
  }
}