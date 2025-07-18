import "server-only"
import type { TFeedbackForm } from "@/utils/validation-schemas"
import { Effect } from "effect"
import { createIssue } from "@/lib/linear"

export const submitFeedback = Effect.fnUntraced(function* (input: TFeedbackForm) {
	yield* createIssue(input)
	return {
		success: true,
		message: "Thank you for submitting! Your submission has been received.",
	}
}, Effect.withLogSpan("submit_feedback"))
