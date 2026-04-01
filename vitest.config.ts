import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	test: {
		globals: true,
		include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		setupFiles: ["./vitest.setup.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
})
