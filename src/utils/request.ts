import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"
import { resolvePublicOrigin } from "@/utils/public-origin"

/** Resolves the public origin for absolute URLs (Open Graph, sitemap, emails). */
export const getServerUrl = createIsomorphicFn()
	.server(() => resolvePublicOrigin(getRequestUrl({ xForwardedHost: true, xForwardedProto: true })))
	.client(() => window.location.origin)
