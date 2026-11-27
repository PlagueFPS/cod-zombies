import { afterEach, expect, test, vi } from "vite-plus/test"
import { newsletterAcknowledgements } from "@/data/email.server"
import { runNewsletterRequest } from "@/data/server-functions/email"

afterEach(() => vi.unstubAllEnvs())

test("layer acquisition fails closed with a generic public acknowledgement", async () => {
	vi.stubEnv("NEWSLETTER_TOKEN_SECRET", "invalid")
	vi.stubEnv("E2E_MOCK_EMAIL", "")
	expect(
		await runNewsletterRequest("subscribe", "reader@example.com", "https://example.com"),
	).toEqual(newsletterAcknowledgements.subscribe)
	expect(
		await runNewsletterRequest("unsubscribe", "reader@example.com", "https://example.com"),
	).toEqual(newsletterAcknowledgements.unsubscribe)
})
