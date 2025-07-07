import "server-only"
import type { TFeedbackForm } from "@/utils/validation-schemas"
import { HttpBody, HttpClient } from "@effect/platform"
import { Effect, Schedule } from "effect"
import { env } from "@/env"

interface Input extends TFeedbackForm {
	label?: "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
}

export const submitFeedback = Effect.fn("submitFeedback")(function* (input: Input) {
	const httpClient = (yield* HttpClient.HttpClient).pipe(
		HttpClient.retryTransient({
			times: 5,
			schedule: Schedule.exponential("200 millis"),
		}),
		HttpClient.filterStatusOk,
	)
	const { title, label, feedback } = input
	yield* httpClient.post("https://projectplannerai.com/api/feedback", {
		headers: {
			"Content-Type": "application/json",
		},
		body: yield* HttpBody.json({
			projectId: env.PROJECT_PLANNER_ID,
			title: title ?? "Website Feedback",
			label: label ?? "other",
			feedback,
		}),
	})

	return {
		success: true,
		message: "Thank you for submitting! Your submission has been received.",
	}
})
