import { createFileRoute } from "@tanstack/react-router"
import { getServerUrl } from "@/utils/request.server"

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: async () => {
				const serverUrl = getServerUrl()
				const robots = `
User-agent: *
Allow: /
Allow: /cdn-cgi/image/
Disallow: /newsletter/**
Disallow: /cdn-cgi/

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
