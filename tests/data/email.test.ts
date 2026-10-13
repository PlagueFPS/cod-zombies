import { Effect, Layer } from "effect"
import { describe, expect, test } from "vitest"
import { sendContactEmail } from "@/data/email.server"
import { Email } from "@/lib/services/emails"
import { expectExitSuccess } from "@/tests/helpers"

const emailLayerTest = Layer.mock(Email, {
	sendEmail: () => Effect.succeed({ id: "123" }),
})

describe("sendContactEmail", () => {
	test("returns success when the contact email is sent successfully", async () => {
		const exit = await sendContactEmail({
			name: "John Doe",
			email: "john.doe@example.com",
			message: "Hello, world! ",
		}).pipe(Effect.provide(emailLayerTest), Effect.runPromiseExit)

		const result = expectExitSuccess(exit)
		expect(result.success).toBe(true)
		expect(result.message).toBe(
			"Thank you for contacting us! We will get back to you as soon as possible.",
		)
	})
})
