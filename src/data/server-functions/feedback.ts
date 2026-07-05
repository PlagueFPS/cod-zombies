import type { APIResult } from "@/types/data"
import { createServerFn } from "@tanstack/react-start"
import { Effect, Schedule } from "effect"
import { submitFeedback } from "@/data/feedback.server"
import { IssueTracker } from "@/lib/services/issue-tracker"
import { StandardFeedbackFormSchema } from "@/utils/validation-schemas"

export const submitFeedbackForm = createServerFn({ method: "POST" })
	.validator(StandardFeedbackFormSchema)
	.handler(async ({ data }) => {
		const result: APIResult = await submitFeedback(data).pipe(
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

		return result
	})
