import { defineConfig, devices } from "@playwright/test"
import { Predicate } from "effect"

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4173)

const host = "127.0.0.1"

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`

const testEnv = {
	LINEAR_API_KEY: "playwright-linear-api-key",
	LINEAR_TEAM_ID: "playwright-linear-team-id",
	E2E_MOCK_EMAIL: "success",
	RESEND_API_KEY: "playwright-resend-api-key",
	RESEND_AUDIENCE_ID: "playwright-resend-audience-id",
}

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!(Predicate.isNotNullish(process.env.CI) && Predicate.isTruthy(process.env.CI)),
	retries: Predicate.isNotNullish(process.env.CI) && Predicate.isTruthy(process.env.CI) ? 2 : 0,
	workers:
		Predicate.isNotNullish(process.env.CI) && Predicate.isTruthy(process.env.CI) ? 1 : undefined,
	reporter:
		Predicate.isNotNullish(process.env.CI) && Predicate.isTruthy(process.env.CI)
			? "github"
			: "list",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	webServer: {
		command: `bun run dev -- --host ${host} --port ${port}`,
		env: testEnv,
		reuseExistingServer: !(
			Predicate.isNotNullish(process.env.CI) && Predicate.isTruthy(process.env.CI)
		),
		timeout: 120_000,
		url: baseURL,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
})
