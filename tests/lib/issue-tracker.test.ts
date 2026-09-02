import type { TFeedbackForm } from "@/utils/validation-schemas"
import { Effect, Exit, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { describe, expect, test } from "vitest"
import { IssueTracker } from "@/lib/services/issue-tracker"
import {
	expectCauseHasString,
	expectCauseTaggedError,
	expectExitFailure,
	expectExitSuccess,
} from "@/tests/helpers"

const USER_FEEDBACK_LABEL_ID = "c5154d91-ffed-4d2d-afe8-1e4777a3a908"

const feedbackWithoutEmail: TFeedbackForm = {
	title: "Map marker is in the wrong building",
	feedback: "The mystery box on Terminus is shown in the wrong room.",
}

const feedbackWithEmail: TFeedbackForm = {
	...feedbackWithoutEmail,
	email: "reader@example.com",
}

describe("IssueTracker.createIssue", () => {
	test("posts a Linear issueCreate mutation with title, team, and label", async () => {
		const { fetch, calls } = createFetchStub(
			jsonResponse({ data: { issueCreate: { success: true } } }),
		)

		const exit = await runCreateIssue(feedbackWithoutEmail, fetch)

		expectExitSuccess(exit)
		expect(calls).toHaveLength(1)

		const request = parseCapturedRequest(calls[0]!)
		expect(request.url).toBe("https://api.linear.app/graphql")
		expect(request.method).toBe("POST")
		expect(request.headers.get("Authorization")).toBe("test-linear-api-key")
		expect(request.headers.get("Accept")).toContain("json")
		expect(request.headers.get("Content-Type")).toContain("application/json")
		expect(request.body.query).toContain("issueCreate")
		expect(request.body.variables.input).toEqual({
			title: feedbackWithoutEmail.title,
			description: feedbackWithoutEmail.feedback,
			teamId: "test-linear-team-id",
			labelIds: [USER_FEEDBACK_LABEL_ID],
		})
	})

	test("appends the contact email to the Linear description when provided", async () => {
		const { fetch, calls } = createFetchStub(
			jsonResponse({ data: { issueCreate: { success: true } } }),
		)

		const exit = await runCreateIssue(feedbackWithEmail, fetch)

		expectExitSuccess(exit)
		expect(parseCapturedRequest(calls[0]!).body.variables.input.description).toBe(
			`${feedbackWithEmail.feedback}\n\n---\nContact: ${feedbackWithEmail.email}`,
		)
	})

	test("fails when Linear returns GraphQL errors", async () => {
		const { fetch } = createFetchStub(
			jsonResponse({
				errors: [{ message: "Entity not found: Team" }],
			}),
		)

		const exit = await runCreateIssue(feedbackWithoutEmail, fetch)

		expect(Exit.isFailure(exit)).toBe(true)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "CreateIssueError")
		expectCauseHasString(cause, "Entity not found: Team")
	})

	test("fails when Linear reports an unsuccessful issueCreate", async () => {
		const { fetch } = createFetchStub(jsonResponse({ data: { issueCreate: { success: false } } }))

		const exit = await runCreateIssue(feedbackWithoutEmail, fetch)

		expect(Exit.isFailure(exit)).toBe(true)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "CreateIssueError")
		expectCauseHasString(cause, "unsuccessful")
	})

	test("fails when Linear responds with a non-OK HTTP status", async () => {
		const { fetch } = createFetchStub(jsonResponse({ message: "Unauthorized" }, 401))

		const exit = await runCreateIssue(feedbackWithoutEmail, fetch)

		expect(Exit.isFailure(exit)).toBe(true)
		expectCauseTaggedError(expectExitFailure(exit), "CreateIssueError")
	})
})

// Helpers

interface CapturedCall {
	url: string
	init?: RequestInit
}

interface LinearIssueCreateBody {
	query: string
	variables: {
		input: {
			title: string
			description: string
			teamId: string
			labelIds: string[]
		}
	}
}

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	})
}

function createFetchStub(response: Response) {
	const calls: CapturedCall[] = []
	const fetch = Object.assign(
		async (input: RequestInfo | URL, init?: RequestInit) => {
			calls.push({ url: requestUrl(input), init })
			return response.clone()
		},
		{ preconnect: () => undefined },
	) as typeof globalThis.fetch
	return { fetch, calls }
}

function runCreateIssue(data: TFeedbackForm, fetch: typeof globalThis.fetch) {
	return Effect.gen(function* () {
		const tracker = yield* IssueTracker
		return yield* tracker.createIssue(data)
	}).pipe(
		Effect.provide(IssueTracker.layer),
		Effect.provide(Layer.succeed(FetchHttpClient.Fetch, fetch)),
		Effect.runPromiseExit,
	)
}

function requestUrl(input: RequestInfo | URL) {
	if (typeof input === "string") {
		return input
	}
	if (input instanceof URL) {
		return input.href
	}
	return input.url
}

function parseCapturedRequest(call: CapturedCall) {
	return {
		url: call.url,
		method: call.init?.method,
		headers: new Headers(call.init?.headers),
		body: decodeJsonBody(call.init?.body) as LinearIssueCreateBody,
	}
}

function decodeJsonBody(body: BodyInit | null | undefined) {
	if (body == null) {
		throw new Error("expected fetch body")
	}
	if (typeof body === "string") {
		return JSON.parse(body)
	}
	if (body instanceof Uint8Array) {
		return JSON.parse(new TextDecoder().decode(body))
	}
	if (body instanceof ArrayBuffer) {
		return JSON.parse(new TextDecoder().decode(new Uint8Array(body)))
	}
	throw new Error(`unexpected fetch body type: ${Object.prototype.toString.call(body)}`)
}
