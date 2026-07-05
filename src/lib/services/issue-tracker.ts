import type { TFeedbackForm } from "@/utils/validation-schemas"
import { LinearClient } from "@linear/sdk"
import { Config, Context, Effect, Layer, Option, Redacted, Schema } from "effect"

class CreateIssueError extends Schema.TaggedErrorClass<CreateIssueError>()("CreateIssueError", {
	cause: Schema.Unknown,
}) {}

export class IssueTracker extends Context.Service<IssueTracker>()("lib/services/issue-tracker", {
	make: Effect.gen(function* () {
		const apiKey = yield* Config.redacted("LINEAR_API_KEY")
		const workspaceId = yield* Config.redacted("LINEAR_WORKSPACE")
		const assigneeId = yield* Config.redacted("LINEAR_DEFAULT_ASSIGNEE_ID")
		const labelId = yield* Config.redacted("LINEAR_USER_FEEDBACK_LABEL")

		const linear = new LinearClient({ apiKey: Redacted.value(apiKey) })

		const createIssue = Effect.fn("IssueTracker.createIssue")(function* (data: TFeedbackForm) {
			const team = yield* Effect.tryPromise({
				try: () => linear.team(Redacted.value(workspaceId)),
				catch: cause => new CreateIssueError({ cause }),
			})

			const description = Option.match(Option.fromNullishOr(data.email), {
				onNone: () => `Feedback: ${data.feedback}`,
				onSome: email => `Feedback: ${data.feedback}\nContact Email: ${email}`,
			})

			const { success, issueId } = yield* Effect.tryPromise({
				try: () =>
					linear.createIssue({
						teamId: team.id,
						title: data.title ?? "Website Feedback",
						description,
						labelIds: [Redacted.value(labelId)],
						assigneeId: Redacted.value(assigneeId),
					}),
				catch: cause => new CreateIssueError({ cause }),
			})

			if (!success || !issueId)
				return yield* new CreateIssueError({
					cause: "The create issue operation failed for an unknown reason.",
				})

			return success
		})

		return { createIssue } as const
	}),
}) {
	static layer = Layer.effect(this, this.make)
}
