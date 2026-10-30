import type { APIResult } from "@/types/data"
import { Effect } from "effect"
import { newsletterRequest } from "@/data/email.server"
import { NewsletterRuntime } from "@/lib/layers"
import { NEWSLETTER_ACKNOWLEDGEMENT } from "@/utils/newsletter"

export const runNewsletterRequest = async (
	action: "subscribe" | "unsubscribe",
	email: string,
	serverUrl: string,
): Promise<APIResult> => {
	if (process.env.E2E_MOCK_EMAIL === "success") return NEWSLETTER_ACKNOWLEDGEMENT

	try {
		await NewsletterRuntime.runPromise(newsletterRequest(action, email, serverUrl))
	} catch {
		await Effect.runPromise(Effect.logError("Newsletter request failed"))
	}

	return NEWSLETTER_ACKNOWLEDGEMENT
}
