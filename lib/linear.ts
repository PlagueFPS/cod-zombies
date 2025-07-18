import "server-only"
import type { TFeedbackForm } from "@/utils/validation-schemas"
import { LinearClient } from "@linear/sdk"
import { Effect } from "effect"
import { env } from "@/env"
import {
	LinearCreateIssueError,
	LinearGetIssueLabelsError,
	LinearGetTeamError,
} from "@/types/errors"

const linear = new LinearClient({ apiKey: env.LINEAR_API_KEY })

export const createIssue = Effect.fnUntraced(function* ({ title, feedback, label }: TFeedbackForm) {
	const team = yield* Effect.tryPromise({
		try: () => linear.team("CODZG"),
		catch: error => new LinearGetTeamError({ message: "Failed to get team", cause: error }),
	})
	const labels = yield* Effect.tryPromise({
		try: () => linear.issueLabels(),
		catch: error =>
			new LinearGetIssueLabelsError({ message: "Failed to get issue labels", cause: error }),
	})

	const issueLabel = labels.nodes.find(node => node.name === label)
	const priority = 0

	const { success, issueId } = yield* Effect.tryPromise({
		try: () =>
			linear.createIssue({
				teamId: team.id,
				title: title ?? "Website Feedback",
				description: feedback,
				priority,
				labelIds: issueLabel ? [issueLabel.id] : undefined,
			}),
		catch: error => new LinearCreateIssueError({ message: "Failed to create issue", cause: error }),
	})

	if (!success || !issueId)
		return yield* new LinearCreateIssueError({ message: "Failed to create issue" })

	yield* Effect.log(`Issue created: ${issueId}`)
	return success
}, Effect.withLogSpan("create_issue"))
