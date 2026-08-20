import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
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
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({
			prerender: {
				enabled: true,
			},
		}),
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
