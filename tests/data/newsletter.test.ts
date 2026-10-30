import { Effect, Layer, Option } from "effect"
import { describe, expect, test, vi } from "vitest"
import { newsletterRequest } from "@/data/email.server"
import { ResendError, Email } from "@/lib/services/emails"
import { NewsletterTokens } from "@/lib/services/newsletter-tokens"

describe("newsletter eligibility", () => {
	for (const action of ["subscribe", "unsubscribe"] as const) {
		const acknowledgement = {
			success: true,
			message:
				action === "subscribe"
					? "If this email isn't already subscribed a verification link will be sent to your inbox."
					: "If this email is already subscribed a verification link will be sent to your inbox.",
		}

		test.each([true, false])(
			`${action} acknowledges membership %s and dispatches only when eligible`,
			async exists => {
				const send = vi.fn(() => Effect.succeed({ id: "email-id" }))

				const layer = Layer.merge(
					Layer.mock(Email, {
						getContact: () =>
							Effect.succeed(
								exists
									? Option.some({
											id: "contact-id",
											email: "reader@example.com",
											first_name: "",
											last_name: "",
											created_at: "",
											unsubscribed: false,
											object: "contact",
											properties: {},
										})
									: Option.none(),
							),
						sendEmail: send,
					}),
					Layer.mock(NewsletterTokens, {
						issueSubscribe: () => Effect.succeed("subscribe-token"),
						issueUnsubscribe: () => Effect.succeed("unsubscribe-token"),
					}),
				)

				const request = (email: string, origin: string) => newsletterRequest(action, email, origin)
				expect(
					await Effect.runPromise(
						request("reader@example.com", "https://example.com").pipe(Effect.provide(layer)),
					),
				).toEqual(acknowledgement)
				expect(send).toHaveBeenCalledTimes(
					action === "subscribe" ? Number(!exists) : Number(exists),
				)
			},
		)
	}
})

describe("newsletter failure acknowledgement", () => {
	for (const action of ["subscribe", "unsubscribe"] as const) {
		const acknowledgement = {
			success: true,
			message:
				action === "subscribe"
					? "If this email isn't already subscribed a verification link will be sent to your inbox."
					: "If this email is already subscribed a verification link will be sent to your inbox.",
		}

		for (const failure of ["lookup", "send", "timeout"] as const) {
			test(`${action} returns generic success after ${failure} failure`, async () => {
				let attempts = 0

				const fail = () =>
					Effect.suspend(() => {
						attempts++

						return Effect.fail(
							new ResendError({ message: "private provider detail", cause: "private cause" }),
						)
					})

				const layer = Layer.merge(
					Layer.mock(Email, {
						getContact: () => {
							if (failure === "lookup") return fail()

							if (failure === "timeout") return Effect.never

							return Effect.succeed(
								action === "subscribe"
									? Option.none()
									: Option.some({
											id: "id",
											email: "reader@example.com",
											first_name: "",
											last_name: "",
											created_at: "",
											unsubscribed: false,
											object: "contact",
											properties: {},
										}),
							)
						},
						sendEmail: fail,
					}),
					Layer.mock(NewsletterTokens, {
						issueSubscribe: () => Effect.succeed("token"),
						issueUnsubscribe: () => Effect.succeed("token"),
					}),
				)

				const result = await Effect.runPromise(
					newsletterRequest(action, "reader@example.com", "https://example.com").pipe(
						Effect.provide(layer),
					),
				)

				expect(result).toEqual(acknowledgement)
				expect(attempts).toBe(failure === "timeout" ? 0 : 4)
			}, 15_000)
		}
	}
})
