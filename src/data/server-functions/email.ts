import type { APIResult } from "@/types/data"
import { createServerFn } from "@tanstack/react-start"
import { Effect, Layer, Predicate, Schedule } from "effect"
import {
	newsletterAcknowledgements,
	newsletterRequest,
	sendContactEmail,
} from "@/data/email.server"
import { emailLayer } from "@/lib/services/emails"
import { newsletterTokensLayer } from "@/lib/services/newsletter-tokens"
import { getServerUrl } from "@/utils/request.server"
import { StandardContactFormSchema, StandardNewsletterFormSchema } from "@/utils/validation-schemas"

const e2eEmailResult = (message: string): APIResult | null => {
	if (process.env.E2E_MOCK_EMAIL !== "success") return null

	return { success: true, message }
}

export const runNewsletterRequest = async (
	action: "subscribe" | "unsubscribe",
	email: string,
	serverUrl: string,
): Promise<APIResult> => {
	if (process.env.E2E_MOCK_EMAIL === "success") return newsletterAcknowledgements[action]

	return await newsletterRequest(action, email, serverUrl).pipe(
		Effect.provide(Layer.merge(emailLayer, newsletterTokensLayer)),
		Effect.catchCause(cause => Effect.logError("Newsletter request failed", cause)),
		Effect.as(newsletterAcknowledgements[action]),
		Effect.runPromise,
	)
}

export const unsubscribeFromNewsletter = createServerFn({ method: "POST" })
	.validator(StandardNewsletterFormSchema)
	.handler(({ data }) => runNewsletterRequest("unsubscribe", data.email, getServerUrl()))

export const subscribeToNewsletter = createServerFn({ method: "POST" })
	.validator(StandardNewsletterFormSchema)
	.handler(({ data }) => runNewsletterRequest("subscribe", data.email, getServerUrl()))

export const submitContactForm = createServerFn({ method: "POST" })
	.validator(StandardContactFormSchema)
	.handler(async ({ data }) => {
		const mockedResult = e2eEmailResult(`Feedback received from ${data.email}.`)

		if (Predicate.isNotNullish(mockedResult) && Predicate.isTruthy(mockedResult))
			return mockedResult

		const result: APIResult = await sendContactEmail(data).pipe(
			Effect.retry({
				while: Predicate.isTagged("ResendError"),
				times: 3,
				schedule: Schedule.fixed("200 millis"),
			}),
			Effect.timeout("10 seconds"),
			Effect.tapCause(cause => Effect.logError(cause)),
			Effect.catchTags({
				TimeoutError: _error =>
					Effect.succeed({
						success: false,
						message: "Contact form submission took too long to execute. Please try again.",
					}),
			}),
			Effect.catch(_error =>
				Effect.succeed({
					success: false,
					message:
						"Contact form submission failed due to a technical issue on our end. Please try again.",
				}),
			),
			Effect.provide(emailLayer),
			Effect.runPromise,
		)

		return result
	})
