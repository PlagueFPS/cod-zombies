import { Effect } from "effect"
import { describe, expect, test } from "vitest"
import {
	requestSubscribe,
	requestUnsubscribe,
	sendContactEmail,
	subscribeEmail,
	unsubscribeEmail,
} from "@/data/email"
import { Email } from "@/lib/services/emails"
import {
	expectCauseHasString,
	expectCauseTaggedError,
	expectExitFailure,
	expectExitSuccess,
} from "../helpers"

const TestEmailLayer = Email.layerTest

describe("requestSubscribe", () => {
	test("returns success when the subscribe request is successful", async () => {
		const exit = await requestSubscribe("new@test.com").pipe(
			Effect.provide(TestEmailLayer),
			Effect.runPromiseExit,
		)
		const result = expectExitSuccess(exit)
		expect(result.success).toBe(true)
		expect(result.message).toBe("Check your inbox to complete your subscribe request.")
	})

	test("returns ContactExistsError when the email is already subscribed", async () => {
		const exit = await requestSubscribe("default@test.com").pipe(
			Effect.provide(TestEmailLayer),
			Effect.runPromiseExit,
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ContactExistsError")
		expectCauseHasString(cause, "That email is already subscribed!")
	})
})

describe("requestUnsubscribe", () => {
	test("returns success when the unsubscribe request is successful", async () => {
		const exit = await requestUnsubscribe("default@test.com").pipe(
			Effect.provide(TestEmailLayer),
			Effect.runPromiseExit,
		)
		const result = expectExitSuccess(exit)
		expect(result.success).toBe(true)
		expect(result.message).toBe("Check your inbox to complete your unsubscribe request.")
	})

	test("returns ContactNotFoundError when the email is not subscribed", async () => {
		const exit = await requestUnsubscribe("doesnotexist@test.com").pipe(
			Effect.provide(TestEmailLayer),
			Effect.runPromiseExit,
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ContactNotFoundError")
		expectCauseHasString(cause, "That email is not currently subscribed!")
	})
})

describe("subscribeEmail", () => {
	test("returns created contact id when subscription is successful", async () => {
		const exit = await subscribeEmail("new@test.com").pipe(
			Effect.provide(TestEmailLayer),
			Effect.runPromiseExit,
		)
		const result = expectExitSuccess(exit)
		expect(result.id).toBeDefined()
	})
})

describe("unsubscribeEmail", () => {
	test("returns removed contact when unsubscribe is successful", async () => {
		const exit = await unsubscribeEmail("default@test.com").pipe(
			Effect.provide(TestEmailLayer),
			Effect.runPromiseExit,
		)
		const result = expectExitSuccess(exit)
		expect(result.contact).toBe("default@test.com")
		expect(result.deleted).toBe(true)
	})
})

describe("sendContactEmail", () => {
	test("returns success when the contact email is sent successfully", async () => {
		const exit = await sendContactEmail({
			name: "John Doe",
			email: "john.doe@example.com",
			message: "Hello, world!",
		}).pipe(Effect.provide(TestEmailLayer), Effect.runPromiseExit)
		const result = expectExitSuccess(exit)
		expect(result.success).toBe(true)
		expect(result.message).toBe(
			"Thank you for contacting us! We will get back to you as soon as possible.",
		)
	})
})
