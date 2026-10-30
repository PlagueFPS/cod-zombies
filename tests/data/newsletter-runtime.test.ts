import { afterEach, expect, test, vi } from "vitest"
import { runNewsletterRequest } from "@/data/server-functions/email"

afterEach(() => vi.unstubAllEnvs())

test("layer acquisition fails closed with a generic public acknowledgement", async () => {
	vi.stubEnv("NEWSLETTER_TOKEN_SECRET", "invalid")
	vi.stubEnv("E2E_MOCK_EMAIL", "")
	expect(
		await runNewsletterRequest("subscribe", "reader@example.com", "https://example.com"),
	).toEqual({
		success: true,
		message:
			"If this email isn't already subscribed a verification link will be sent to your inbox.",
	})
	expect(
		await runNewsletterRequest("unsubscribe", "reader@example.com", "https://example.com"),
	).toEqual({
		success: true,
		message: "If this email is already subscribed a verification link will be sent to your inbox.",
	})
})
