"use server"
import { Effect } from "effect"
import { createRatelimitAction } from "@/lib/action-helpers"
import { Email } from "@/lib/services/emails"
import { requestSubscribe, requestUnsubscribe, sendContactEmail } from "@/usecases/email"
import { submitFeedback } from "@/usecases/feedback"
import {
	ContactFormSchema,
	FeedbackFormSchema,
	NewsletterFormSchema,
} from "@/utils/validation-schemas"

export const subscribeToNewsletter = createRatelimitAction(
	NewsletterFormSchema,
	async ({ email }) => {
		return await requestSubscribe(email).pipe(
			Effect.withLogSpan("subscribe_to_newsletter_action"),
			Effect.timeout("10 seconds"),
			Effect.tapError(Effect.logError),
			Effect.catchTags({
				ContactExistsError: error =>
					Effect.succeed({
						success: false,
						message: error.message,
					}),
			}),
			Effect.catchAll(_error =>
				Effect.succeed({
					success: false,
					message:
						"Subscribe request failed due to a technical issue on our end. Please try again.",
				}),
			),
			Effect.provide(Email.Default),
			Effect.runPromise,
		)
	},
)

export const unsubscribeFromNewsletter = createRatelimitAction(
	NewsletterFormSchema,
	async ({ email }) => {
		return await requestUnsubscribe(email).pipe(
			Effect.withLogSpan("unsubscribe_from_newsletter_action"),
			Effect.timeout("10 seconds"),
			Effect.tapError(Effect.logError),
			Effect.catchTags({
				ContactNotFoundError: error =>
					Effect.succeed({
						success: false,
						message: error.message,
					}),
			}),
			Effect.catchAll(_error =>
				Effect.succeed({
					success: false,
					message:
						"Unsubscribe request failed due to a technical issue on our end. Please try again.",
				}),
			),
			Effect.provide(Email.Default),
			Effect.runPromise,
		)
	},
)

export const submitFeedbackForm = createRatelimitAction(FeedbackFormSchema, async parsedInput => {
	return await submitFeedback(parsedInput).pipe(
		Effect.withLogSpan("submit_feedback_form_action"),
		Effect.timeout("10 seconds"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error =>
			Effect.succeed({
				success: false,
				message:
					"Feedback submission failed due to a technical issue on our end. Please try again.",
			}),
		),
		Effect.runPromise,
	)
})

export const submitContactForm = createRatelimitAction(ContactFormSchema, async parsedInput => {
	return await sendContactEmail(parsedInput).pipe(
		Effect.withLogSpan("submit_contact_form_action"),
		Effect.timeout("10 seconds"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error =>
			Effect.succeed({
				success: false,
				message:
					"Contact form submission failed due to a technical issue on our end. Please try again.",
			}),
		),
		Effect.provide(Email.Default),
		Effect.runPromise,
	)
})
