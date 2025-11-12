"use server"
import { Effect } from "effect"
import { requestSubscribe, requestUnsubscribe, sendContactEmail } from "@/data/email"
import { submitFeedback } from "@/data/feedback"
import { createAction } from "@/lib/action-helpers"
import { APIRuntime } from "@/lib/layers"
import {
	ContactFormValues,
	FeedbackFormValues,
	NewsletterFormValues,
} from "@/utils/validation-schemas"

export const subscribeToNewsletter = createAction(NewsletterFormValues, async ({ email }) => {
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
				message: "Subscribe request failed due to a technical issue on our end. Please try again.",
			}),
		),
		APIRuntime.runPromise,
	)
})

export const unsubscribeFromNewsletter = createAction(NewsletterFormValues, async ({ email }) => {
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
		APIRuntime.runPromise,
	)
})

export const submitFeedbackForm = createAction(FeedbackFormValues, async parsedInput => {
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

export const submitContactForm = createAction(ContactFormValues, async parsedInput => {
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
		APIRuntime.runPromise,
	)
})
