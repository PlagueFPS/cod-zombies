import "server-only"
import type { TFeedbackForm } from "@/utils/validation-schemas"
import { LinearClient } from "@linear/sdk"
import { Effect, Match } from "effect"
import { env } from "@/env"
import { LinearCreateIssueError, LinearGetTeamError } from "@/types/errors"

const linear = new LinearClient({ apiKey: env.LINEAR_API_KEY })

export const createIssue = Effect.fnUntraced(function* ({ title, feedback, label }: TFeedbackForm) {
	const team = yield* Effect.tryPromise({
		try: () => linear.team("CODZG"),
		catch: error => new LinearGetTeamError({ message: "Failed to get team", cause: error }),
	})
	let priority = 0

	Match.value(label).pipe(
		Match.when("issue", () => {
			priority = 3
		}),
		Match.when("complaint", () => {
			priority = 4
		}),
		Match.orElse(() => {
			priority = 0
		}),
	)

	const { success, issueId } = yield* Effect.tryPromise({
		try: () =>
			linear.createIssue({
				teamId: team.id,
				title: title ?? "Website Feedback",
				description: feedback,
				priority,
			}),
		catch: error => new LinearCreateIssueError({ message: "Failed to create issue", cause: error }),
	})

	if (!success || !issueId)
		return yield* new LinearCreateIssueError({ message: "Failed to create issue" })

	yield* Effect.log(`Created issue: ${issueId}`)
	return success
}, Effect.withLogSpan("create_issue"))
