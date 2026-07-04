import { getRequestUrl } from "@tanstack/react-start/server"

/** Resolves the current request origin (scheme + host + port). */
export const getServerUrl = () =>
	getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin
