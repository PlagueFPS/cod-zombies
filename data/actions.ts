"use server"
import { Effect, Schedule } from "effect"
import { requestSubscribe, requestUnsubscribe, sendContactEmail } from "@/data/email"
import { submitFeedback } from "@/data/feedback"
import { createAction } from "@/lib/action-helpers"
import { APIRuntime } from "@/lib/layers"
import { IssueTracker } from "@/lib/services/issue-tracker"
import {
	ContactFormSchema,
	FeedbackFormSchema,
	NewsletterFormSchema,
} from "@/utils/validation-schemas"

export const subscribeToNewsletter = createAction(NewsletterFormSchema, async ({ email }) => {
	return await requestSubscribe(email).pipe(
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
				message: "Subscribe request failed due to a technical issue on our end. Please try again.",
			}),
		),
		APIRuntime.runPromise,
	)
})

export const unsubscribeFromNewsletter = createAction(NewsletterFormSchema, async ({ email }) => {
	return await requestUnsubscribe(email).pipe(
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
})

export const submitFeedbackForm = createAction(FeedbackFormSchema, async parsedInput => {
	return await submitFeedback(parsedInput).pipe(
		Effect.retry({
			while: error => error._tag === "CreateIssueError",
			times: 3,
			schedule: Schedule.fixed("200 millis"),
		}),
		Effect.timeout("10 seconds"),
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			CreateIssueError: _error =>
				Effect.succeed({
					success: false,
					message: "We were unable to collect your feedback! Please try again.",
				}),
			TimeoutError: _error =>
				Effect.succeed({
					success: false,
					message: "Feedback submission took too long to execute. Please try again.",
				}),
		}),
		Effect.satisfiesErrorType<never>(),
		Effect.provide(IssueTracker.layer),
		Effect.runPromise,
	)
})

export const submitContactForm = createAction(ContactFormSchema, async parsedInput => {
	return await sendContactEmail(parsedInput).pipe(
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
})
