import type { APIResult } from "@/types/data"
import { createServerFn } from "@tanstack/react-start"
import { Effect, Predicate, Schedule } from "effect"
import { sendContactEmail } from "@/data/email.server"
import { runNewsletterRequest } from "@/data/newsletter.server"
import { APIRuntime } from "@/lib/layers"
import { getServerUrl } from "@/utils/request.server"
import { StandardContactFormSchema, StandardNewsletterFormSchema } from "@/utils/validation-schemas"

const e2eEmailResult = (message: string): APIResult | null => {
	if (process.env.E2E_MOCK_EMAIL !== "success") return null

	return { success: true, message }
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
			APIRuntime.runPromise,
		)

		return result
	})
