import { HotkeysProvider } from "@tanstack/react-hotkeys"
import { QueryClient } from "@tanstack/react-query"
import { createRouter, stringifySearchWith } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { DefaultError } from "@/components/default-error"
import { DefaultNotFound } from "@/components/default-not-found"
import { ThemeProvider } from "@/contexts/theme-provider"
import { routeTree } from "@/routeTree.gen"
import { getServerUrl } from "@/utils/request"

/**
 * Removes keys from a search object that would serialize to noise in the URL.
 *
 * TanStack Router's default `stringifySearch` skips `undefined`/`null` but
 * still runs `JSON.stringify` on empty arrays, producing `key=%5B%5D`. Our
 * route schemas in `src/utils/validation-schemas.ts` use
 * `Schema.withDecodingDefaultKey(() => [], { encodingStrategy: "omit" })` on
 * multi-value params. The `"omit"` strategy only applies when the schema is
 * used as an encoder — TanStack only uses it for `validateSearch` (decode),
 * so those decoded `[]` defaults leak back into every `search: prev => ({
 * ...prev, ... })` navigation.
 *
 * Stripping `undefined`, `null`, and empty arrays here applies the intended
 * "omit" behavior globally, for every route, in one place — so call sites
 * can spread `prev` freely without leaking empty-array defaults to the URL.
 */
function pruneEmptySearch(search: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {}
	for (const key in search) {
		const value = search[key]
		if (value === undefined || value === null) continue
		if (Array.isArray(value) && value.length === 0) continue
		out[key] = value
	}
	return out
}

const baseStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse)
const stringifySearch = (search: Record<string, unknown>) =>
	baseStringifySearch(pruneEmptySearch(search))

export function getRouter() {
	const serverUrl = getServerUrl()
	const queryClient = new QueryClient()

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultStructuralSharing: true,
		defaultErrorComponent: DefaultError,
		defaultNotFoundComponent: DefaultNotFound,
		defaultPreload: "intent",
		stringifySearch,
		context: {
			serverUrl,
			queryClient,
		},
		Wrap: ({ children }) => (
			<HotkeysProvider>
				<ThemeProvider>{children}</ThemeProvider>
			</HotkeysProvider>
		),
	})

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		wrapQueryClient: true,
	})

	return router
}
