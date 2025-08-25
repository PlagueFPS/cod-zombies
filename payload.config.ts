import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { Redacted } from "effect"
import { buildConfig } from "payload"
import { env } from "./env"

export default buildConfig({
	serverURL: env.NEXT_PUBLIC_WEBSITE_URL,
	routes: {
		api: "/api/payload",
	},
	folders: {
		debug: true,
	},
	upload: {
		debug: true,
		safeFileNames: true,
		limits: {
			fileSize: 1_000_000, // 1MB
		},
	},
	editor: lexicalEditor(),
	collections: [],
	secret: Redacted.value(env.PAYLOAD_SECRET),
	db: sqliteAdapter({
		client: {
			url: Redacted.value(env.DATABASE_URL),
			authToken: Redacted.value(env.DATABASE_TOKEN),
		},
		migrationDir: "./data/db/migrations",
	}),
})
