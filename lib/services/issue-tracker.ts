import type { TFeedbackForm } from "@/utils/validation-schemas"
import { LinearClient } from "@linear/sdk"
import { Effect, Layer, Option, Redacted, Schema, ServiceMap } from "effect"
import { env } from "@/env"

class CreateIssueError extends Schema.TaggedErrorClass<CreateIssueError>()("CreateIssueError", {
	cause: Schema.Unknown,
}) {}

export class IssueTracker extends ServiceMap.Service<IssueTracker>()("lib/services/issue-tracker", {
	make: Effect.gen(function* () {
		const linear = new LinearClient({ apiKey: Redacted.value(env.LINEAR_API_KEY) })

		const createIssue = Effect.fn("IssueTracker.createIssue")(function* (data: TFeedbackForm) {
			const team = yield* Effect.tryPromise({
				try: () => linear.team("CODZG"),
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
						// "User Feedback" label id
						labelIds: ["c5154d91-ffed-4d2d-afe8-1e4777a3a908"],
						assigneeId: Redacted.value(env.LINEAR_DEFAULT_ASSIGNEE_ID),
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
