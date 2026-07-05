import type { APIResult } from "@/types/data"
import { createServerFn } from "@tanstack/react-start"
import { Effect, Schedule } from "effect"
import { requestSubscribe, requestUnsubscribe, sendContactEmail } from "@/data/email.server"
import { APIRuntime } from "@/lib/layers"
import { StandardContactFormSchema, StandardNewsletterFormSchema } from "@/utils/validation-schemas"

const e2eEmailResult = (message: string): APIResult | null => {
	if (process.env.E2E_MOCK_EMAIL !== "success") return null
	return { success: true, message }
}

export const unsubscribeFromNewsletter = createServerFn({ method: "POST" })
	.validator(StandardNewsletterFormSchema)
	.handler(async ({ data }) => {
		const mockedResult = e2eEmailResult(`Confirmation sent to ${data.email}.`)
		if (mockedResult) return mockedResult

		const result: APIResult = await requestUnsubscribe(data.email).pipe(
			Effect.retry({
				while: error => error._tag === "ResendError",
				times: 3,
				schedule: Schedule.fixed("200 millis"),
			}),
			Effect.timeout("10 seconds"),
			Effect.tapCause(cause => Effect.logError(cause)),
			Effect.catchTags({
				ContactNotFoundError: error =>
					Effect.succeed({
						success: false,
						message: error.message,
					}),
			}),
			Effect.catch(_error =>
				Effect.succeed({
					success: false,
					message:
						"Unsubscribe request failed due to a technical issue on our end. Please try again.",
				}),
			),
			APIRuntime.runPromise,
		)

		return result
	})

export const subscribeToNewsletter = createServerFn({ method: "POST" })
	.validator(StandardNewsletterFormSchema)
	.handler(async ({ data }) => {
		const mockedResult = e2eEmailResult(`Confirmation sent to ${data.email}.`)
		if (mockedResult) return mockedResult

		const result: APIResult = await requestSubscribe(data.email).pipe(
			Effect.retry({
				while: error => error._tag === "ResendError",
				times: 3,
				schedule: Schedule.fixed("200 millis"),
			}),
			Effect.timeout("10 seconds"),
			Effect.tapCause(cause => Effect.logError(cause)),
			Effect.catchTags({
				ContactExistsError: error =>
					Effect.succeed({
						success: false,
						message: error.message,
					}),
			}),
			Effect.catch(_error =>
				Effect.succeed({
					success: false,
					message:
						"Subscribe request failed due to a technical issue on our end. Please try again.",
				}),
			),
			APIRuntime.runPromise,
		)

		return result
	})

export const submitContactForm = createServerFn({ method: "POST" })
	.validator(StandardContactFormSchema)
	.handler(async ({ data }) => {
		const mockedResult = e2eEmailResult(`Feedback received from ${data.email}.`)
		if (mockedResult) return mockedResult

		const result: APIResult = await sendContactEmail(data).pipe(
			Effect.retry({
				while: error => error._tag === "ResendError",
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
