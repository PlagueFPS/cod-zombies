import { ConfigProvider, Effect, Exit, Layer, String as Str, Schema } from "effect"
import { TestClock } from "effect/testing"
import { describe, expect, test } from "vitest"
import { newsletterTokensLayer, NewsletterTokens } from "@/lib/services/newsletter-tokens"
import { expectCauseTaggedError, expectExitFailure } from "@/tests/helpers"

const configured = (secret = Str.repeat(32)("01")) =>
	newsletterTokensLayer.pipe(
		Layer.provide(
			ConfigProvider.layer(ConfigProvider.fromUnknown({ NEWSLETTER_TOKEN_SECRET: secret })),
		),
	)

const issue = Effect.gen(function* () {
	const tokens = yield* NewsletterTokens

	return yield* tokens.issueSubscribe("reader@example.com")
})

describe("newsletter tokens with real WebCrypto", () => {
	test("round trips both actions and rejects the opposite action", async () => {
		await Effect.runPromise(
			Effect.gen(function* () {
				const tokens = yield* NewsletterTokens
				const subscribe = yield* tokens.issueSubscribe("reader@example.com")
				const unsubscribe = yield* tokens.issueUnsubscribe("reader@example.com")
				expect(yield* tokens.issueSubscribe("reader@example.com")).not.toBe(subscribe)
				expect(yield* tokens.verifySubscribe(subscribe)).toBe("reader@example.com")
				expect(yield* tokens.verifyUnsubscribe(unsubscribe)).toBe("reader@example.com")
				expect(Exit.isFailure(yield* Effect.exit(tokens.verifySubscribe(unsubscribe)))).toBe(true)
				expect(Exit.isFailure(yield* Effect.exit(tokens.verifyUnsubscribe(subscribe)))).toBe(true)
			}).pipe(Effect.provide(configured())),
		)
	})
	test("accepts another service instance with the same key and rejects a different key", async () => {
		const token = await Effect.runPromise(issue.pipe(Effect.provide(configured())))
		const verify = Effect.flatMap(NewsletterTokens, tokens => tokens.verifySubscribe(token))
		expect(await Effect.runPromise(verify.pipe(Effect.provide(configured())))).toBe(
			"reader@example.com",
		)
		expect(
			Exit.isFailure(
				await Effect.runPromiseExit(verify.pipe(Effect.provide(configured(Str.repeat(32)("02"))))),
			),
		).toBe(true)
	})
	test("rejects malformed, legacy, forged, and tampered envelopes", async () => {
		await Effect.runPromise(
			Effect.gen(function* () {
				const tokens = yield* NewsletterTokens
				const token = yield* tokens.issueSubscribe("reader@example.com")
				const [version, claims, tag] = Str.split(".")(token)

				const forged = Buffer.from(
					yield* Schema.encodeEffect(Schema.fromJsonString(Schema.Unknown))({
						email: "attacker@example.com",
						action: "subscribe",
						expiresAt: 0,
						nonce: Str.repeat(22)("a"),
					}),
				).toString("base64url")

				for (const invalid of [
					"",
					Str.repeat(3000)("a"),
					"legacy:unsigned:token",
					Buffer.from("reader@example.com:salt:9999999999999:hash").toString("base64url"),
					`v2.${claims}.${tag}`,
					`${version}.${forged}.${tag}`,
					`${token}=`,
					`v1.${claims}.${Str.repeat(43)("A")}`,
					`v1.${claims}+.${tag}`,
				]) {
					const exit = yield* Effect.exit(tokens.verifySubscribe(invalid))
					expect(
						expectCauseTaggedError(expectExitFailure(exit), "TokenVerificationError"),
					).toMatchObject({ message: "Invalid token" })
				}
			}).pipe(Effect.provide(configured())),
		)
	})
	test("expires at the exact one day boundary", async () => {
		await Effect.runPromise(
			Effect.gen(function* () {
				yield* TestClock.setTime(0)
				const tokens = yield* NewsletterTokens
				const token = yield* tokens.issueSubscribe("reader@example.com")
				yield* TestClock.setTime(86_399_999)
				expect(yield* tokens.verifySubscribe(token)).toBe("reader@example.com")
				yield* TestClock.setTime(86_400_000)
				const expired = yield* Effect.exit(tokens.verifySubscribe(token))
				expectCauseTaggedError(expectExitFailure(expired), "TokenExpirationError")
			}).pipe(Effect.provide(Layer.merge(configured(), TestClock.layer()))),
		)
	})
	test.each([
		"",
		Str.repeat(63)("a"),
		Str.repeat(65)("a"),
		Str.repeat(64)("g"),
		Str.repeat(64)("a") + "\n",
	])("fails closed with invalid secret %s", async secret => {
		expect(
			Exit.isFailure(await Effect.runPromiseExit(issue.pipe(Effect.provide(configured(secret))))),
		).toBe(true)
	})
})
