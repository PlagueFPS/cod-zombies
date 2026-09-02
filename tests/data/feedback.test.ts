import { Effect } from "effect"
import { describe, expect, test } from "vitest"
import { submitFeedback } from "@/data/feedback.server"
import { IssueTracker } from "@/lib/services/issue-tracker"
import { expectExitSuccess } from "@/tests/helpers"

describe("submitFeedback", () => {
	test("returns a success message after creating a Linear issue", async () => {
		const exit = await submitFeedback({
			title: "Typo on the Terminus map",
			feedback: "The Pack-a-Punch marker is labeled incorrectly.",
			email: "reader@example.com",
		}).pipe(Effect.provide(IssueTracker.layerTest), Effect.runPromiseExit)

		const result = expectExitSuccess(exit)
		expect(result.success).toBe(true)
		expect(result.message).toBe("Thank you for submitting! Your submission has been received.")
	})
})
