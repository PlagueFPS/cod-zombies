"use server"
import { FetchHttpClient } from "@effect/platform"
import { Effect } from "effect"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { createAction } from "@/lib/action-helpers"
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

export const subscribeToNewsletter = createAction(NewsletterFormSchema, async ({ email }) => {
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
				message: "Subscribe request failed due to a technical issue on our end. Please try again.",
			}),
		),
		Effect.provide(Email.Default),
		Effect.runPromise,
	)
})

export const unsubscribeFromNewsletter = createAction(NewsletterFormSchema, async ({ email }) => {
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
				message: "Unsubscribe request failed due to a technical issue on our end. Please try again.",
			}),
		),
		Effect.provide(Email.Default),
		Effect.runPromise,
	)
})

export const submitFeedbackForm = createAction(FeedbackFormSchema, async parsedInput => {
	return await submitFeedback(parsedInput).pipe(
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error =>
			Effect.succeed({
				success: false,
				message: "Feedback submission failed due to a technical issue on our end. Please try again.",
			}),
		),
		Effect.provide(FetchHttpClient.layer),
		Effect.runPromise,
	)
})

export const submitContactForm = createAction(ContactFormSchema, async parsedInput => {
	return await sendContactEmail(parsedInput).pipe(
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error =>
			Effect.succeed({
				success: false,
				message: "Contact form submission failed due to a technical issue on our end. Please try again.",
			}),
		),
		Effect.provide(Email.Default),
		Effect.runPromise,
	)
})

export const purgeLocalCache = createAction(DraftModeSchema, async ({ pathname }) => {
	if (!IN_DEVELOPMENT) return

	Object.entries(CACHE_KEYS).forEach(([key, value]) => {
		console.log(`Revalidating ${key}`)
		revalidateTag(value.all)
	})
	redirect(pathname)
})
