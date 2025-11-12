import "server-only"
import type { FeedbackFormValues } from "@/utils/validation-schemas"
import { LinearClient } from "@linear/sdk"
import { Effect, Redacted } from "effect"
import { env } from "@/env"
import {
	LinearCreateIssueError,
	LinearGetIssueLabelsError,
	LinearGetTeamError,
} from "@/types/errors"

const linear = new LinearClient({ apiKey: Redacted.value(env.LINEAR_API_KEY) })

export const createIssue = Effect.fnUntraced(function* ({
	title,
	feedback,
	label,
}: FeedbackFormValues) {
	const team = yield* Effect.tryPromise({
		try: () => linear.team("CODZG"),
		catch: error => new LinearGetTeamError({ message: "Failed to get team", cause: error }),
	})
	const labels = yield* Effect.tryPromise({
		try: () => linear.issueLabels(),
		catch: error =>
			new LinearGetIssueLabelsError({ message: "Failed to get issue labels", cause: error }),
	})

	const issueLabels = labels.nodes
		.map(node => {
			// return the match issue id and always assign the User Feedback label
			if (node.name === label) return node.id
			if (label !== "User Feedback" && node.name === "User Feedback") return node.id
			return null
		})
		.filter(id => id !== null)
	let priority = 0

	switch (label) {
		case "Bug":
			priority = 2
			break
		case "Improvement":
			priority = 3
			break
		default:
			priority = 4
			break
	}

	const { success, issueId } = yield* Effect.tryPromise({
		try: () =>
			linear.createIssue({
				teamId: team.id,
				title: title ?? "Website Feedback",
				description: feedback,
				priority,
				labelIds: issueLabels,
				assigneeId: Redacted.value(env.LINEAR_DEFAULT_ASSIGNEE_ID),
			}),
		catch: error => new LinearCreateIssueError({ message: "Failed to create issue", cause: error }),
	})

	if (!success || !issueId)
		return yield* new LinearCreateIssueError({ message: "Failed to create issue" })

	yield* Effect.log(`Issue created: ${issueId}`)
	return success
}, Effect.withLogSpan("create_issue"))
