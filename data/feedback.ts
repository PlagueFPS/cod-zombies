import type { FeedbackFormValues } from "@/utils/validation-schemas"
import { Effect } from "effect"
import { createIssue } from "@/lib/linear"

export const submitFeedback = Effect.fnUntraced(function* (input: FeedbackFormValues) {
	yield* createIssue(input)
	return {
		success: true,
		message: "Thank you for submitting! Your submission has been received.",
	}
}, Effect.withLogSpan("submit_feedback"))
