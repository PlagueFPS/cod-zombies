import { afterEach, expect, test, vi } from "vitest"
import { runNewsletterRequest } from "@/data/newsletter.server"
import { NEWSLETTER_ACKNOWLEDGEMENT } from "@/utils/newsletter"

afterEach(() => vi.unstubAllEnvs())

test("runtime acquisition fails closed with a generic public acknowledgement", async () => {
	vi.stubEnv("NEWSLETTER_TOKEN_SECRET", "invalid")
	vi.stubEnv("E2E_MOCK_EMAIL", "")
	expect(
		await runNewsletterRequest("subscribe", "reader@example.com", "https://example.com"),
	).toEqual(NEWSLETTER_ACKNOWLEDGEMENT)
	expect(
		await runNewsletterRequest("unsubscribe", "reader@example.com", "https://example.com"),
	).toEqual(NEWSLETTER_ACKNOWLEDGEMENT)
})
