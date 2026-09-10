import { getRequestUrl } from "@tanstack/react-start/server"
import { resolvePublicOrigin } from "@/utils/public-origin"

/** Resolves the public origin for absolute URLs (Open Graph, sitemap, emails). */
export const getServerUrl = () =>
	resolvePublicOrigin(getRequestUrl({ xForwardedHost: true, xForwardedProto: true }))
