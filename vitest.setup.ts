import { Redacted } from "effect"
import { vi } from "vitest"

vi.mock("@/env", () => ({
	env: {
		RESEND_API_KEY: Redacted.make("test-key"),
		RESEND_AUDIENCE_ID: Redacted.make("test-audience"),
		HASH_SALT: Redacted.make("test-salt"),
		LINEAR_API_KEY: Redacted.make("test-linear-key"),
		LINEAR_WORKSPACE: Redacted.make("test-workspace"),
		LINEAR_USER_FEEDBACK_LABEL: Redacted.make("test-user-feedback-label"),
		LINEAR_DEFAULT_ASSIGNEE_ID: Redacted.make("test-assignee"),
		VERCEL_ENV: Redacted.make("development"),
		VERCEL_URL: Redacted.make("localhost:3000"),
		VERCEL_PROJECT_PRODUCTION_URL: Redacted.make("localhost:3000"),
	},
}))
