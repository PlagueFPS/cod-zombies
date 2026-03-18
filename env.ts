import { createEnv } from "@t3-oss/env-nextjs"
import { Schema } from "effect"

export const env = createEnv({
	server: {
		RESEND_API_KEY: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		RESEND_AUDIENCE_ID: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		HASH_SALT: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		LINEAR_API_KEY: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		LINEAR_DEFAULT_ASSIGNEE_ID: Schema.toStandardSchemaV1(
			Schema.RedactedFromValue(Schema.NonEmptyString),
		),
		VERCEL_ENV: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		VERCEL_URL: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		VERCEL_PROJECT_PRODUCTION_URL: Schema.toStandardSchemaV1(
			Schema.RedactedFromValue(Schema.NonEmptyString),
		),
	},
	experimental__runtimeEnv: {},
})
