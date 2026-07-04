import { createEnv } from "@t3-oss/env-core"
import { Schema } from "effect"

const redactedString = Schema.toStandardSchemaV1(Schema.RedactedFromValue(Schema.NonEmptyString))

export const serverSchema = {
	RESEND_API_KEY: redactedString,
	RESEND_AUDIENCE_ID: redactedString,
	HASH_SALT: redactedString,
	LINEAR_API_KEY: redactedString,
	LINEAR_WORKSPACE: redactedString,
	LINEAR_USER_FEEDBACK_LABEL: redactedString,
	LINEAR_DEFAULT_ASSIGNEE_ID: redactedString,
} as const

export function createValidatedEnv(
	runtimeEnv: Record<string, string | boolean | number | undefined>,
) {
	return createEnv({
		server: serverSchema,
		runtimeEnv,
		emptyStringAsUndefined: true,
	})
}

export type AppEnv = ReturnType<typeof createValidatedEnv>
