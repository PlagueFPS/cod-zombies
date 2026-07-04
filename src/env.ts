import { createValidatedEnv } from "@/env.schema"

export type { AppEnv } from "@/env.schema"

export const env = createValidatedEnv({
	RESEND_API_KEY: process.env.RESEND_API_KEY,
	RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
	HASH_SALT: process.env.HASH_SALT,
	LINEAR_API_KEY: process.env.LINEAR_API_KEY,
	LINEAR_WORKSPACE: process.env.LINEAR_WORKSPACE,
	LINEAR_USER_FEEDBACK_LABEL: process.env.LINEAR_USER_FEEDBACK_LABEL,
	LINEAR_DEFAULT_ASSIGNEE_ID: process.env.LINEAR_DEFAULT_ASSIGNEE_ID,
})
