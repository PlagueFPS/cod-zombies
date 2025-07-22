"use server"
import { Effect } from "effect"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { createAction, createRatelimitAction } from "@/lib/action-helpers"
import { Email } from "@/lib/services/Email"
import { requestSubscribe, requestUnsubscribe, sendContactEmail } from "@/usecases/email"
import { submitFeedback } from "@/usecases/feedback"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import {
	ContactFormSchema,
	DraftModeSchema,
	FeedbackFormSchema,
	NewsletterFormSchema,
} from "@/utils/validation-schemas"

export const subscribeToNewsletter = createRatelimitAction(
	NewsletterFormSchema,
	async ({ email }) => {
		return await requestSubscribe(email).pipe(
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

// biome-ignore lint/suspicious/useAwait: server actions must always be marked as async
export const purgeLocalCache = createAction(DraftModeSchema, async ({ pathname }) => {
	if (!IN_DEVELOPMENT) return

	Object.entries(CACHE_KEYS).forEach(([key, value]) => {
		revalidateTag(value.all)
		console.log(`Revalidated: ${key}`)
	})
	redirect(pathname)
})
