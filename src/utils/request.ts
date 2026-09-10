import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"
import { resolvePublicOrigin } from "@/utils/public-origin"

const TEST_ORIGIN = "http://localhost:3000"

/** Resolves the public origin for absolute URLs (Open Graph, sitemap, emails). */
export const getServerUrl = createIsomorphicFn()
	.server(() =>
		import.meta.env.MODE === "test"
			? TEST_ORIGIN
			: resolvePublicOrigin(getRequestUrl({ xForwardedHost: true, xForwardedProto: true })),
	)
	.client(() => (import.meta.env.MODE === "test" ? TEST_ORIGIN : window.location.origin))
