import "server-only"
import { HttpBody, HttpClient } from "@effect/platform"
import { Effect, Schedule } from "effect"
import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validation-schemas"

interface Input extends FeedbackForm {
	label?: "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
}

export const submitFeedback = (input: Input) =>
	Effect.gen(function* () {
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

		return { success: true, message: "Thank you for submitting! Your submission has been received." }
	}).pipe(Effect.withLogSpan("submit_feedback"))
