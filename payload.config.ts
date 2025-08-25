import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { Redacted } from "effect"
import { buildConfig } from "payload"
import { env } from "./env"

export default buildConfig({
	serverURL: env.NEXT_PUBLIC_WEBSITE_URL,
	editor: lexicalEditor(),
	collections: [],
	secret: Redacted.value(env.PAYLOAD_SECRET),
	db: sqliteAdapter({
		client: {
			url: Redacted.value(env.DATABASE_URL),
			authToken: Redacted.value(env.DATABASE_TOKEN),
		},
	}),
})
