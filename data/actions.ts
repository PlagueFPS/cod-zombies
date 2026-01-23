"use server"
import { Effect } from "effect"
import { submitFeedback } from "@/data/feedback"
import { createAction } from "@/lib/action-helpers"
import { APIRuntime } from "@/lib/layers"
import {
	ContactFormSchema,
	FeedbackFormSchema
} from "@/utils/validation-schemas"
import { sendContactEmail } from "./email"

export const submitFeedbackForm = createAction(FeedbackFormSchema, async parsedInput => {
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

export const submitContactForm = createAction(ContactFormSchema, async parsedInput => {
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
