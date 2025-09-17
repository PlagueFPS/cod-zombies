import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./data/db/payload-generated.schema.ts",
	out: "./data/db/migrations",
	dialect: "turso",
	dbCredentials: {
		url: "file:dev.local.db",
	},
})
