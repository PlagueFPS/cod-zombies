import { SITE_ORIGIN } from "@/utils/constants"

/**
 * Hosts that cannot be fetched by social crawlers. TanStack Start prerender
 * (via Vite preview on `port: 0`) and some Cloudflare Workers internals expose
 * origins like `http://127.0.0.1:35889`. Those get baked into prerendered HTML
 * and then served as Workers static assets, which is why Open Graph previews
 * show a loopback image URL in production.
 */
export const isLoopbackHost = (hostname: string) => {
	const host = hostname.replace(/^\[|\]$/g, "").toLowerCase()
	if (host === "localhost" || host.endsWith(".localhost")) return true
	if (host === "::1" || host === "0.0.0.0") return true
	if (host.startsWith("127.")) return true
	if (host.startsWith("::ffff:127.")) return true
	return false
}

/**
 * Resolves an origin that is safe to embed in public metadata.
 *
 * @param requestUrl - Origin of the current request (`getRequestUrl()`).
 * @param replaceLoopback - When true (production builds), swap loopback hosts
 *   for {@link SITE_ORIGIN}. Defaults to `import.meta.env.PROD` so local `vite
 *   dev` keeps using the request origin.
 */
export const resolvePublicOrigin = (requestUrl: URL, replaceLoopback = import.meta.env.PROD) => {
	if (replaceLoopback && isLoopbackHost(requestUrl.hostname)) return SITE_ORIGIN
	return requestUrl.origin
}
