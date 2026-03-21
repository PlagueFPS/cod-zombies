import type { TFeedbackForm } from "@/utils/validation-schemas"
import { Effect } from "effect"
import { IssueTracker } from "@/lib/services/issue-tracker"

export const submitFeedback = Effect.fnUntraced(function* (input: TFeedbackForm) {
	const issueTracker = yield* IssueTracker
	yield* issueTracker.createIssue(input)
	return {
		success: true,
		message: "Thank you for submitting! Your submission has been received.",
	}
})
