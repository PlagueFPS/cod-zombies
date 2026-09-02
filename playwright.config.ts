import { defineConfig, devices } from "@playwright/test"

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
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	webServer: {
		command: `bun run dev -- --host ${host} --port ${port}`,
		env: testEnv,
		reuseExistingServer: !process.env.CI,
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
