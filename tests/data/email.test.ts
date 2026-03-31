import { Effect } from "effect"
import { expect, describe, test } from "vitest"
import { requestSubscribe } from "@/data/email"
import { expectExitSuccess } from "../helpers"

describe("requestSubscribe", () => {
	test("returns success when the subscribe request is successful", async () => {
		const result = await Effect.runPromiseExit(requestSubscribe("test@test.com"))
		expectExitSuccess(result)
	})
})
