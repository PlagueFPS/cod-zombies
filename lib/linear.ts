import "server-only"
import type { TFeedbackForm } from "@/utils/validation-schemas"
import { LinearClient } from "@linear/sdk"
import { Effect, Option, Redacted } from "effect"
import { env } from "@/env"
import {
	LinearCreateIssueError,
	LinearGetTeamError,
} from "@/types/errors"

const linear = new LinearClient({ apiKey: Redacted.value(env.LINEAR_API_KEY) })

export const createIssue = Effect.fnUntraced(function* ({ title, feedback, email }: TFeedbackForm) {
	const team = yield* Effect.tryPromise({
		try: () => linear.team("CODZG"),
		catch: error => new LinearGetTeamError({ message: "Failed to get team", cause: error }),
	})

	const description = Option.match(Option.fromNullable(email), {
		onNone: () => `Feedback: ${feedback}`,
		onSome: email => `Feedback: ${feedback}\nContact Email: ${email}`,
	})

	const { success, issueId } = yield* Effect.tryPromise({
		try: () =>
			linear.createIssue({
				teamId: team.id,
				title: title ?? "Website Feedback",
				description,
				// "User Feedback" label id
				labelIds: ["c5154d91-ffed-4d2d-afe8-1e4777a3a908"],
				assigneeId: Redacted.value(env.LINEAR_DEFAULT_ASSIGNEE_ID),
			}),
		catch: error => new LinearCreateIssueError({ message: "Failed to create issue", cause: error }),
	})

	if (!success || !issueId)
		return yield* new LinearCreateIssueError({ message: "Failed to create issue" })

	yield* Effect.log(`Issue created: ${issueId}`)
	return success
}, Effect.withLogSpan("create_issue"))
