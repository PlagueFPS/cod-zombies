import type { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/utils/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${WEBSITE_URL}/sitemap.xml`
  }
}