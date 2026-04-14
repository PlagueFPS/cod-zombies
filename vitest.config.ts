import tsconfigpaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		exclude: ["tests/e2e/**"],
		globals: true,
		include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		setupFiles: ["./vitest.setup.ts"],
	},
	plugins: [tsconfigpaths()],
})
