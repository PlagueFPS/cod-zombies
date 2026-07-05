import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"

/** Resolves the current request origin (scheme + host + port). */
export const getServerUrl = createIsomorphicFn()
	.server(() => getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin)
	.client(() => window.location.origin)
