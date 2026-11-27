import { Effect, Layer } from "effect"
import { describe, expect, test } from "vite-plus/test"
import { submitFeedback } from "@/data/feedback.server"
import { IssueTracker } from "@/lib/services/issue-tracker"
import { expectExitSuccess } from "@/tests/helpers"

const issueTrackerLayerTest = Layer.mock(IssueTracker, {
	createIssue: () => Effect.succeed(true),
})

describe("submitFeedback", () => {
	test("returns a success message after creating a Linear issue", async () => {
		const exit = await submitFeedback({
			title: "Typo on the Terminus map",
			feedback: "The Pack-a-Punch marker is labeled incorrectly.",
			email: "reader@example.com",
		}).pipe(Effect.provide(issueTrackerLayerTest), Effect.runPromiseExit)

		const result = expectExitSuccess(exit)
		expect(result.success).toBe(true)
	})
})
