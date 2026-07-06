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
	GITHUB_TOKEN: "test-github-token",
	GITHUB_REPO_OWNER: "test-owner",
	GITHUB_REPO_NAME: "test-repo",
	GITHUB_USER_FEEDBACK_LABEL: "User Feedback",
})

vi.mock("@/utils/request", () => ({
	getServerUrl: () => "http://localhost:3000",
}))

vi.mock("@/utils/request.server", () => ({
	getServerUrl: () => "http://localhost:3000",
}))
