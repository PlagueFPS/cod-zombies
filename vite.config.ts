import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { String as Str } from "effect"
import { defineConfig } from "vite"
import { remarkMdxMeta } from "./src/lib/remark-mdx-meta"
import { SITE_ORIGIN } from "./src/utils/constants"

const siteOrigin = new URL(SITE_ORIGIN)

/**
 * Published maps reference paths outside the package or omit sources; Vite then
 * warns and spends time resolving them on demand. Pre-bundling folds these into
 * `.vite/deps` once at startup.
 */
const depsWithBrokenSourcemaps = [
	"domutils",
	"entities",
	"htmlparser2",
	"html-to-text",
	"standardwebhooks",
]

export default defineConfig(({ command }) => ({
	server: {
		port: 3000,
	},
	preview: {
		port: 3000,
		host: "127.0.0.1",
	},
	resolve: {
		tsconfigPaths: true,
	},
	ssr: {
		noExternal: ["embla-carousel-react", "react-lite-youtube-embed"],
	},
	environments: {
		ssr: {
			optimizeDeps: {
				include: depsWithBrokenSourcemaps,
				// TanStack Devtools is Solid-based; Cloudflare's worker conditions
				// resolve solid-js/web to server.js, which does not export `use`.
				exclude: [
					"solid-js",
					"solid-js/web",
					"@tanstack/devtools",
					"@tanstack/devtools-ui",
					"@tanstack/react-devtools",
				],
			},
		},
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	plugins: [
		devtools(),
		cloudflare({
			viteEnvironment: { name: "ssr" },
			config:
				command === "serve" && process.env.E2E_MOCK_EMAIL === "success"
					? config => ({ ...config, vars: { ...config.vars, E2E_MOCK_EMAIL: "success" } })
					: undefined,
		}),
		tanstackStart({
			prerender: {
				enabled: true,
				// Vite preview binds 127.0.0.1:0 during prerender; forwarded host
				// headers keep og:image / canonical URLs on the public origin.
				headers: {
					"x-forwarded-host": siteOrigin.host,
					"x-forwarded-proto": Str.replace(":", "")(siteOrigin.protocol),
				},
			},
		}),
		react({ compiler: true }),
		tailwindcss(),
		{
			enforce: "pre",
			...mdx({
				jsxImportSource: "react",
				remarkPlugins: [remarkMdxMeta],
			}),
		},
	],
}))
