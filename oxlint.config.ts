import {
	effectNative,
	recommended,
	antipattern,
	correctness,
	style,
} from "@effect/tsgo/oxlint-presets"
import { defineConfig } from "oxlint"

export default defineConfig({
	plugins: ["typescript", "unicorn", "oxc", "react", "react-perf", "vitest"],
	extends: [recommended, effectNative, antipattern, correctness, style],
	jsPlugins: [
		{ name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
		{
			name: "anti-slop-effect",
			specifier: "./tools/oxlint/anti-slop/effect/index.ts",
		},
	],
	rules: {
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
		"effecttsgo/unstable-api-usage": "off",
		"effecttsgo/experimental-api-usage": "off",
		// TanStack routes, server functions, React handlers, and Vitest/Playwright must return Promises.
		"effecttsgo/async-function": "off",
		// These helpers are called directly. Function.dual changes one-argument calls when a later parameter is optional.
		"effecttsgo/missing-pipeable-signature": "off",
	},
	overrides: [
		{
			files: ["tests/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"],
			rules: {
				// Tests and CLI scripts are program entry points.
				"effecttsgo/strict-effect-provide": "off",
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
		"tools/oxlint/anti-slop/**",
	],
})
