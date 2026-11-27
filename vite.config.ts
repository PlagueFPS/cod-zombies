import { cloudflare } from "@cloudflare/vite-plugin"
import { effectNative, recommended, style } from "@effect/tsgo/oxlint-presets"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { String as Str } from "effect"
import { defineConfig, lazyPlugins } from "vite-plus"
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
	fmt: {
		useTabs: true,
		tabWidth: 2,
		printWidth: 100,
		singleQuote: false,
		jsxSingleQuote: false,
		quoteProps: "as-needed",
		trailingComma: "all",
		semi: false,
		arrowParens: "avoid",
		bracketSameLine: false,
		bracketSpacing: true,
		endOfLine: "lf",
		ignorePatterns: [
			".zed",
			".repos",
			"**/opengraph-manifest.json",
			"**/last-modified.json",
			"**/routeTree.gen.ts",
			"node_modules",
			".agent/**",
			".agents/**",
			".claude/**",
			".codex/**",
			".continue/**",
			".cursor/**",
			".gemini/**",
			".opencode/**",
			".pi/**",
			".roo/**",
			".windsurf/**",
			"tools/oxlint/anti-slop/**",
		],
		sortImports: {
			groups: [
				"type",
				"builtin",
				"external",
				["internal", "subpath"],
				["parent", "sibling", "index"],
				"style",
				"unknown",
			],
			newlinesBetween: false,
		},
		sortTailwindcss: {
			stylesheet: "./src/globals.css",
			functions: ["cn", "clsx", "twMerge"],
		},
	},
	lint: {
		plugins: ["typescript", "unicorn", "oxc", "react", "react-perf", "vitest"],
		extends: [recommended, effectNative, style],
		jsPlugins: [
			{ name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
			{
				name: "anti-slop-effect",
				specifier: "./tools/oxlint/anti-slop/effect/index.ts",
			},
			{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
		],
		rules: {
			"vitest/no-standalone-expect": [
				"warn",
				{ additionalTestBlockFunctions: ["it.prop", "it.effect.prop"] },
			],
			"react/self-closing-comp": ["warn", { component: true, html: true }],
			"react/jsx-key": "warn",
			"react/exhaustive-deps": "warn",
			"react/no-children-prop": "error",
			"react/rules-of-hooks": "error",
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
			"oxc/no-accumulating-spread": "error",
			"anti-slop/no-array-filter-map": "error",
			"anti-slop/no-reduce-accumulator-copy": "error",
			"anti-slop/no-chained-type-assertions": "error",
			"anti-slop/no-conditional-empty-object-spread": "error",
			"anti-slop/no-known-value-widening": "error",
			"anti-slop/no-module-mocking": "error",
			"anti-slop/no-object-parameters": "error",
			"anti-slop/no-reflect-apply": "error",
			"anti-slop/no-reflect-get": "error",
			"anti-slop/no-runtime-typeof": "error",
			"anti-slop/no-shape-in-symbol-names": "error",
			"anti-slop/no-unknown-parameters": "error",
			"anti-slop/no-unknown-returns": "error",
			"anti-slop/no-unknown-type-aliases": "error",
			"anti-slop/no-unsafe-dictionary-type": "error",
			"anti-slop/no-widen-then-assert": "error",
			"anti-slop/require-readable-spacing": "error",
			"anti-slop/require-safety-comment-for-type-assertion": "error",
			"anti-slop-effect/no-manual-effect-error-tag": "error",
			"anti-slop-effect/no-manual-tag-comparison": "error",
			"anti-slop-effect/no-manual-tagged-construction": "error",
			"anti-slop-effect/no-service-constructor-imports": "error",
			"anti-slop-effect/prefer-effect-match": "error",
			"vite-plus/prefer-vite-plus-imports": "error",
			"effecttsgo/unstable-api-usage": "off",
			"effecttsgo/experimental-api-usage": "off",
			// TanStack routes, server functions, React handlers, and Vitest/Playwright must return Promises.
			"effecttsgo/async-function": "off",
			// These helpers are called directly. Function.dual changes one-argument calls when a later parameter is optional.
			"effecttsgo/missing-pipeable-signature": "off",
		},
		overrides: [
			{
				files: [
					"src/hooks/use-local-storage.ts",
					"src/lib/remark-mdx-meta.ts",
					"src/utils/search-params.ts",
				],
				rules: {
					// React, remark, and router parsing callbacks must return synchronously.
					"effecttsgo/schema-sync": "off",
				},
			},
			{
				files: ["tests/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"],
				rules: {
					// Node test and script I/O stays on node:fs, node:path, and node:child_process.
					"effecttsgo/node-builtin-import": "off",
				},
			},
			{
				files: ["src/components/**/*.tsx"],
				rules: {
					// React components log with the global console and use Math.random for skeleton width.
					"effecttsgo/global-console": "off",
					"effecttsgo/global-random": "off",
				},
			},
			{
				files: ["src/hooks/**/*.{ts,tsx}"],
				rules: {
					"effecttsgo/global-console": "off",
				},
			},
			{
				files: ["src/utils/content-meta.ts"],
				rules: {
					"effecttsgo/global-console": "off",
				},
			},
			{
				files: [
					"playwright.config.ts",
					"vitest.setup.ts",
					"tests/**/*.{ts,tsx}",
					"scripts/generate-og-images.tsx",
					"src/components/**/*.{ts,tsx}",
					"src/contexts/**/*.{ts,tsx}",
					"src/data/**/*.{ts,tsx}",
					"src/emails/**/*.{ts,tsx}",
					"src/hooks/**/*.{ts,tsx}",
					"src/routes/**/*.{ts,tsx}",
					"src/utils/**/*.{ts,tsx}",
				],
				rules: {
					// Frontend, Playwright, and tests read process.env directly. Effect services keep Config.
					"effecttsgo/process-env": "off",
				},
			},
		],
		settings: {
			react: {
				version: "19.3",
			},
		},
		options: {
			typeAware: true,
			typeCheck: true,
		},
		env: {
			builtin: true,
		},
		ignorePatterns: [
			".repos",
			"**/last-modified.json",
			"node_modules",
			"dist",
			"out",
			"coverage",
			"**/routeTree.gen.ts",
			".agent/**",
			".agents/**",
			".claude/**",
			".codex/**",
			".continue/**",
			".cursor/**",
			".gemini/**",
			".opencode/**",
			".pi/**",
			".roo/**",
			".windsurf/**",
			"tools/oxlint/anti-slop/**",
		],
	},
	test: {
		exclude: ["tests/e2e/**"],
		globals: true,
		isolate: false,
		include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		setupFiles: ["./vitest.setup.ts"],
	},
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
	plugins: lazyPlugins(() =>
		// oxlint-disable-next-line effecttsgo/process-env -- Vite checks Vitest's env flag before the Effect runtime starts.
		process.env.VITEST === "true"
			? []
			: [
					devtools(),
					cloudflare({
						viteEnvironment: { name: "ssr" },
						config:
							// oxlint-disable-next-line effecttsgo/process-env -- Vite reads the Playwright flag before the Effect runtime starts.
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
	),
}))
