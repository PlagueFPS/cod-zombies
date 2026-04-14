import { createFileRoute } from "@tanstack/react-router"
import { getServerUrl } from "@/utils/shared-functions"

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: async () => {
				const serverUrl = getServerUrl()
				const robots = `
User-agent: *
Allow: /
Disallow: /newsletter/**

Sitemap: ${serverUrl}/sitemap.xml
				`
				return new Response(robots, {
					headers: {
						"Content-Type": "text/plain",
					},
				})
			},
		},
	},
})
