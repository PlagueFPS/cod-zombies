import { Redacted } from "effect"
import { vi } from "vitest"

declare global {
	// React: opt-in for `act()` in custom test runners (Vitest + happy-dom/jsdom).
	// oxlint-disable-next-line no-var
	var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

/** Tell React this is a test environment that supports `act()` (avoids stderr warnings). */
globalThis.IS_REACT_ACT_ENVIRONMENT = true

vi.mock("@/env", () => ({
	env: {
		RESEND_API_KEY: Redacted.make("test-key"),
		RESEND_AUDIENCE_ID: Redacted.make("test-audience"),
		HASH_SALT: Redacted.make("test-salt"),
		LINEAR_API_KEY: Redacted.make("test-linear-key"),
		LINEAR_WORKSPACE: Redacted.make("test-workspace"),
		LINEAR_USER_FEEDBACK_LABEL: Redacted.make("test-user-feedback-label"),
		LINEAR_DEFAULT_ASSIGNEE_ID: Redacted.make("test-assignee"),
	},
}))

vi.mock("@/utils/request", () => ({
	getServerUrl: () => "http://localhost:3000",
}))

vi.mock("@/utils/request.server", () => ({
	getServerUrl: () => "http://localhost:3000",
}))
