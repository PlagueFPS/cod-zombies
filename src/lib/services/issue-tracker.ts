import type { TFeedbackForm } from "@/utils/validation-schemas"
import { Config, Context, Effect, Layer, Schema } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpBody } from "effect/unstable/http"

class CreateIssueError extends Schema.TaggedError<CreateIssueError>()("CreateIssueError", {
	cause: Schema.Defect(),
}) {}

export class IssueTracker extends Context.Service<IssueTracker>()("lib/services/issue-tracker", {
	make: Effect.gen(function* () {
		const token = yield* Config.redacted("GITHUB_TOKEN")
		const owner = yield* Config.string("GITHUB_REPO_OWNER")
		const repo = yield* Config.string("GITHUB_REPO_NAME")
		const feedbackLabel = yield* Config.string("GITHUB_USER_FEEDBACK_LABEL")

		const githubClient = (yield* HttpClient.HttpClient).pipe(
			HttpClient.mapRequest(request =>
				request.pipe(
					HttpClientRequest.prependUrl("https://api.github.com"),
					HttpClientRequest.bearerToken(token),
					HttpClientRequest.accept("application/vnd.github+json"),
					HttpClientRequest.setHeader("User-Agent", "cod-zombies"),
				),
			),
			HttpClient.filterStatusOk,
		)

		const createIssue = Effect.fn("IssueTracker.createIssue")(function* (data: TFeedbackForm) {
			// `data.email` is intentionally omitted from the issue body: public GitHub issues must not
			// expose contact info. The form still collects email for a future custom feedback manager.

			yield* githubClient
				.post(`/repos/${owner}/${repo}/issues`, {
					body: HttpBody.jsonUnsafe({
						title: data.title,
						body: data.feedback,
						labels: [feedbackLabel],
					}),
				})
				.pipe(
					Effect.flatMap(res => res.text),
					Effect.asVoid,
					Effect.mapError(cause => new CreateIssueError({ cause })),
				)

			return true
		})

		return { createIssue } as const
	}),
}) {
	static layer = Layer.provide(Layer.effect(this, this.make), FetchHttpClient.layer)
}
