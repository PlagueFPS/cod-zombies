import type { MetadataRoute } from "next"
import { getServerUrl } from "@/utils/server-functions"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/newsletter/**", "/admin", "/admin/**"],
		},
		sitemap: `${getServerUrl()}/sitemap.xml`,
	}
}
