import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import rsc from "@vitejs/plugin-rsc"
import { defineConfig } from "vite"
import { remarkMdxMeta } from "./src/lib/remark-mdx-meta"

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

export default defineConfig({
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
	/**
	 * TanStack Start names its Node-ish environments `ssr` and `rsc` (see
	 * `@tanstack/start-plugin-core` constants). Those pipelines load cheerio /
	 * html parsing and webhook helpers — match optimizeDeps to those envs so we
	 * don't widen the client pre-bundle.
	 */
	environments: {
		ssr: {
			optimizeDeps: {
				include: depsWithBrokenSourcemaps,
			},
		},
		rsc: {
			optimizeDeps: {
				include: depsWithBrokenSourcemaps,
			},
		},
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	plugins: [
		devtools(),
		// We use RSCs as child components of the SSR'd page to keep heavy markdown processing off the client
		// this config allows a single worker to run in both environments properly to resolve a page
		cloudflare({ viteEnvironment: { name: "ssr", childEnvironments: ["rsc"] } }),
		tanstackStart({
			prerender: {
				enabled: true,
			},
			rsc: {
				enabled: true,
			},
		}),
		rsc(),
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
		tailwindcss(),
		{
			enforce: "pre",
			...mdx({
				jsxImportSource: "react",
				remarkPlugins: [remarkMdxMeta],
			}),
		},
	],
})
