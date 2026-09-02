import type { TFeedbackForm } from "@/utils/validation-schemas"
import { Config, Context, Effect, Layer, Redacted, Schema } from "effect"
import {
	FetchHttpClient,
	HttpBody,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
} from "effect/unstable/http"

/** Linear "User Feedback" label UUID. */
const USER_FEEDBACK_LABEL_ID = "c5154d91-ffed-4d2d-afe8-1e4777a3a908"

const ISSUE_CREATE_MUTATION = `mutation IssueCreate($input: IssueCreateInput!) {
	issueCreate(input: $input) {
		success
		issue { id }
	}
}`

const IssueCreateResponse = Schema.Struct({
	data: Schema.optionalKey(
		Schema.NullOr(
			Schema.Struct({
				issueCreate: Schema.optionalKey(
					Schema.NullOr(
						Schema.Struct({
							success: Schema.Boolean,
						}),
					),
				),
			}),
		),
	),
	errors: Schema.optionalKey(Schema.Array(Schema.Struct({ message: Schema.String }))),
})

class CreateIssueError extends Schema.TaggedError<CreateIssueError>()("CreateIssueError", {
	cause: Schema.Defect(),
}) {}

export class IssueTracker extends Context.Service<IssueTracker>()("lib/services/issue-tracker", {
	make: Effect.gen(function* () {
		const apiKey = yield* Config.redacted("LINEAR_API_KEY")
		const teamId = yield* Config.nonEmptyString("LINEAR_TEAM_ID")

		const linearClient = (yield* HttpClient.HttpClient).pipe(
			HttpClient.mapRequest(request =>
				request.pipe(
					HttpClientRequest.prependUrl("https://api.linear.app"),
					// Personal Linear API keys use a raw Authorization value (no Bearer prefix).
					HttpClientRequest.setHeader("Authorization", Redacted.value(apiKey)),
					HttpClientRequest.acceptJson,
				),
			),
			HttpClient.filterStatusOk,
		)

		const createIssue = Effect.fn("IssueTracker.createIssue")(function* (data: TFeedbackForm) {
			const description = data.email
				? `${data.feedback}\n\n---\nContact: ${data.email}`
				: data.feedback

			const response = yield* linearClient
				.post("/graphql", {
					body: HttpBody.jsonUnsafe({
						query: ISSUE_CREATE_MUTATION,
						variables: {
							input: {
								title: data.title,
								description,
								teamId,
								labelIds: [USER_FEEDBACK_LABEL_ID],
							},
						},
					}),
				})
				.pipe(
					Effect.flatMap(HttpClientResponse.schemaBodyJson(IssueCreateResponse)),
					Effect.mapError(cause => new CreateIssueError({ cause })),
				)

			if (response.errors && response.errors.length > 0) {
				return yield* new CreateIssueError({ cause: response.errors })
			}

			if (response.data?.issueCreate?.success !== true) {
				return yield* new CreateIssueError({
					cause: "Linear issueCreate returned unsuccessful",
				})
			}

			return true
		})

		return { createIssue } as const
	}),
}) {
	static layer = Layer.provide(Layer.effect(this, this.make), FetchHttpClient.layer)

	static layerTest = Layer.succeed(this, {
		createIssue: (_data: TFeedbackForm) => Effect.succeed(true),
	})
}
