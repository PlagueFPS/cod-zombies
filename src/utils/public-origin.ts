import { pipe, String as Str } from "effect"
import { SITE_ORIGIN } from "@/utils/constants"

/**
 * Hosts that cannot be fetched by social crawlers. TanStack Start prerender
 * (via Vite preview on `port: 0`) and some Cloudflare Workers internals expose
 * origins like `http://127.0.0.1:35889`. Those get baked into prerendered HTML
 * and then served as Workers static assets, which is why Open Graph previews
 * show a loopback image URL in production.
 */
export const isLoopbackHost = (hostname: string) => {
	const host = pipe(hostname, Str.replace(/^\[|\]$/g, ""), Str.toLowerCase)

	if (host === "localhost" || Str.endsWith(".localhost")(host)) return true

	if (host === "::1" || host === "0.0.0.0") return true

	if (Str.startsWith("127.")(host)) return true

	if (Str.startsWith("::ffff:127.")(host)) return true

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
