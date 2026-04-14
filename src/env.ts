import { createEnv } from "@t3-oss/env-core"
import { Schema } from "effect"

export const env = createEnv({
	server: {
		RESEND_API_KEY: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		RESEND_AUDIENCE_ID: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		HASH_SALT: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		LINEAR_API_KEY: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		LINEAR_WORKSPACE: Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString)),
		LINEAR_USER_FEEDBACK_LABEL: Schema.toStandardSchemaV1(
			Schema.RedactedFromValue(Schema.NonEmptyString),
		),
		LINEAR_DEFAULT_ASSIGNEE_ID: Schema.toStandardSchemaV1(
			Schema.RedactedFromValue(Schema.NonEmptyString),
		),
	},
	clientPrefix: "VITE_",
	client: {
		VITE_VERCEL_ENV: Schema.toStandardSchemaV1(
			Schema.Literals(["development", "preview", "production"]),
		),
		VITE_VERCEL_URL: Schema.toStandardSchemaV1(Schema.NonEmptyString),
		VITE_VERCEL_PROJECT_PRODUCTION_URL: Schema.toStandardSchemaV1(Schema.NonEmptyString),
	},
	runtimeEnv: {
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
		HASH_SALT: process.env.HASH_SALT,
		LINEAR_API_KEY: process.env.LINEAR_API_KEY,
		LINEAR_WORKSPACE: process.env.LINEAR_WORKSPACE,
		LINEAR_USER_FEEDBACK_LABEL: process.env.LINEAR_USER_FEEDBACK_LABEL,
		LINEAR_DEFAULT_ASSIGNEE_ID: process.env.LINEAR_DEFAULT_ASSIGNEE_ID,
		VITE_VERCEL_ENV: import.meta.env.VERCEL_ENV,
		VITE_VERCEL_URL: import.meta.env.VERCEL_URL,
		VITE_VERCEL_PROJECT_PRODUCTION_URL: import.meta.env.VERCEL_PROJECT_PRODUCTION_URL,
	},
	emptyStringAsUndefined: true,
})
