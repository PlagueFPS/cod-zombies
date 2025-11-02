import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: "./tests/setup.ts",
		alias: [
			{ find: "@", replacement: path.resolve(__dirname, ".") },
			{ find: "@/*", replacement: path.resolve(__dirname, "./*") },
		],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
			"@/*": path.resolve(__dirname, "./*"),
		},
	},
})
