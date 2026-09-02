import { vi } from "vitest"

declare global {
	// React: opt-in for `act()` in custom test runners (Vitest + happy-dom/jsdom).
	// oxlint-disable-next-line no-var
	var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

/** Tell React this is a test environment that supports `act()` (avoids stderr warnings). */
globalThis.IS_REACT_ACT_ENVIRONMENT = true

Object.assign(process.env, {
	RESEND_API_KEY: "test-key",
	RESEND_AUDIENCE_ID: "test-audience",
	LINEAR_API_KEY: "test-linear-api-key",
	LINEAR_TEAM_ID: "test-linear-team-id",
})

vi.mock("@/utils/request", () => ({
	getServerUrl: () => "http://localhost:3000",
}))

vi.mock("@/utils/request.server", () => ({
	getServerUrl: () => "http://localhost:3000",
}))
