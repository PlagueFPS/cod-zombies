import type { TFeedbackForm } from "@/utils/validation-schemas"
import { Config, Context, Effect, Layer, Redacted, Schema } from "effect"
import { GraphQL, GraphQLClient, GraphQLGroup, GraphQLProtocol } from "effect/graphql"
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/http"

export class CreateIssueError extends Schema.TaggedError<CreateIssueError>()("CreateIssueError", {
	cause: Schema.Defect(),
}) {}

export interface IssueTrackerService {
	readonly createIssue: (data: TFeedbackForm) => Effect.Effect<boolean, CreateIssueError>
}

export class IssueTracker extends Context.Service<IssueTracker, IssueTrackerService>()(
	"lib/services/issue-tracker",
) {}

/** Linear "User Feedback" label UUID. */
const USER_FEEDBACK_LABEL_ID = "c5154d91-ffed-4d2d-afe8-1e4777a3a908"

export const IssueCreateMutation = GraphQL.mutation("IssueCreate", {
	document: `mutation IssueCreate($input: IssueCreateInput!) {
	issueCreate(input: $input) {
		success
		issue { id }
	}
}`,
	variables: Schema.Struct({
		input: Schema.Struct({
			title: Schema.String,
			description: Schema.String,
			teamId: Schema.String,
			labelIds: Schema.Array(Schema.String),
		}),
	}),
	result: Schema.Struct({
		issueCreate: Schema.NullOr(
			Schema.Struct({
				success: Schema.Boolean,
				issue: Schema.optionalKey(
					Schema.NullOr(
						Schema.Struct({
							id: Schema.String,
						}),
					),
				),
			}),
		),
	}),
})

export const IssueTrackerGraphQLGroup = GraphQLGroup.make(IssueCreateMutation)

const makeIssueTracker = Effect.gen(function* () {
	const apiKey = yield* Config.Redacted("LINEAR_API_KEY")
	const teamId = yield* Config.NonEmptyString("LINEAR_TEAM_ID")

	const linearHttpClient = (yield* HttpClient.HttpClient).pipe(
		HttpClient.mapRequest(request =>
			request.pipe(
				// Personal Linear API keys use a raw Authorization value (no Bearer prefix).
				HttpClientRequest.setHeader("Authorization", Redacted.value(apiKey)),
			),
		),
	)

	const protocolLayer = GraphQLProtocol.layerHttp({
		url: "https://api.linear.app/graphql",
	}).pipe(Layer.provide(Layer.succeed(HttpClient.HttpClient, linearHttpClient)))

	const client = yield* GraphQLClient.make(IssueTrackerGraphQLGroup).pipe(
		Effect.provide(protocolLayer),
	)

	const createIssue = Effect.fn("IssueTracker.createIssue")(function* (data: TFeedbackForm) {
		const description = data.email
			? `${data.feedback}\n\n---\nContact: ${data.email}`
			: data.feedback

		const response = yield* client
			.IssueCreate({
				input: {
					title: data.title,
					description,
					teamId,
					labelIds: [USER_FEEDBACK_LABEL_ID],
				},
			})
			.pipe(Effect.mapError(cause => new CreateIssueError({ cause })))

		if (response.issueCreate?.success !== true) {
			return yield* new CreateIssueError({
				cause: "Linear issueCreate returned unsuccessful",
			})
		}

		return true
	})

	return IssueTracker.of({ createIssue })
})

export const issueTrackerLayerNoDeps = Layer.effect(IssueTracker, makeIssueTracker)

export const issueTrackerLayer = Layer.provide(issueTrackerLayerNoDeps, FetchHttpClient.layer)
