import { Clock, Config, Context, Effect, Layer, Redacted, Schema } from "effect"
import { Mac, SecureRandom } from "effect/crypto"
import { Base64Url, Hex } from "effect/encoding"
import { NewsletterFormSchema } from "@/utils/validation-schemas"

export class TokenGenerationError extends Schema.TaggedError<
	TokenGenerationError,
	{ readonly brand: unique symbol }
>()("TokenGenerationError", { message: Schema.String }) {}

export class TokenVerificationError extends Schema.TaggedError<
	TokenVerificationError,
	{ readonly brand: unique symbol }
>()("TokenVerificationError", { message: Schema.String }) {}

export class TokenExpirationError extends Schema.TaggedError<
	TokenExpirationError,
	{ readonly brand: unique symbol }
>()("TokenExpirationError", { message: Schema.String }) {}

const Claims = Schema.Struct({
	email: NewsletterFormSchema.fields.email,
	action: Schema.Literals(["subscribe", "unsubscribe"]),
	expiresAt: Schema.Int.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(0))),
	nonce: Schema.String.pipe(
		Schema.check(Schema.isBetweenLength(22, 22), Schema.isPattern(/^[A-Za-z0-9_-]{22}$/)),
	),
})

type Action = typeof Claims.Type.action

const Secret = Schema.String.pipe(
	Schema.check(Schema.isBetweenLength(64, 64), Schema.isPattern(/^[a-fA-F0-9]{64}$/)),
)

const Envelope = Schema.String.pipe(
	Schema.check(
		Schema.isMaxLength(2048),
		Schema.isPattern(/^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/),
	),
)

const encoder = new TextEncoder()

const encode = Base64Url.encode

const invalid = () => TokenVerificationError.make({ message: "Invalid token" })

const decode = Effect.fnUntraced(function* (encoded: string) {
	const bytes = yield* Effect.fromResult(Base64Url.decode(encoded)).pipe(Effect.mapError(invalid))

	if (encode(bytes) !== encoded) return yield* invalid()

	return bytes
})

const make = Effect.gen(function* () {
	const secret = yield* Config.Redacted("NEWSLETTER_TOKEN_SECRET")

	const hex = yield* Schema.decodeUnknownEffect(Secret)(Redacted.value(secret)).pipe(
		Effect.mapError(() =>
			TokenGenerationError.make({ message: "NEWSLETTER_TOKEN_SECRET must be 64 hex characters" }),
		),
	)

	const keyBytes = yield* Effect.fromResult(Hex.decode(hex)).pipe(
		Effect.mapError(() => TokenGenerationError.make({ message: "Invalid signing configuration" })),
	)

	const key = yield* Mac.key(Mac.hmacSha256, keyBytes).pipe(
		Effect.mapError(() => TokenGenerationError.make({ message: "Invalid signing configuration" })),
	)

	const mac = yield* Mac.Mac
	const random = yield* SecureRandom.SecureRandom

	const issue = Effect.fnUntraced(
		function* (action: Action, email: string) {
			const now = yield* Clock.currentTimeMillis
			const nonce = encode(yield* random.randomBytes(16))

			const claims = yield* Schema.decodeUnknownEffect(Claims)({
				email,
				action,
				expiresAt: now + 86_400_000,
				nonce,
			})

			const payload = `v1.${encode(encoder.encode(JSON.stringify(claims)))}`
			const signature = yield* mac.sign(key, encoder.encode(payload))

			return `${payload}.${encode(signature)}`
		},
		Effect.mapError(() => TokenGenerationError.make({ message: "Failed to generate token" })),
	)

	const verify = Effect.fnUntraced(function* (action: Action, token: string) {
		const envelope = yield* Schema.decodeUnknownEffect(Envelope)(token).pipe(
			Effect.mapError(invalid),
		)

		const [, encoded = "", signature = ""] = envelope.split(".")
		const bytes = yield* decode(encoded)
		const tag = yield* decode(signature)

		const valid = yield* mac
			.verify(key, tag, encoder.encode(`v1.${encoded}`))
			.pipe(Effect.mapError(invalid))

		if (!valid) return yield* invalid()

		const json = yield* Effect.try({
			try: () => JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
			catch: invalid,
		})

		const claims = yield* Schema.decodeUnknownEffect(Claims)(json).pipe(Effect.mapError(invalid))

		if (claims.action !== action) return yield* invalid()
		const now = yield* Clock.currentTimeMillis

		if (now >= claims.expiresAt)
			return yield* TokenExpirationError.make({ message: "Token has expired" })

		return claims.email
	})

	return {
		issueSubscribe: (email: string) => issue("subscribe", email),
		issueUnsubscribe: (email: string) => issue("unsubscribe", email),
		verifySubscribe: (token: string) => verify("subscribe", token),
		verifyUnsubscribe: (token: string) => verify("unsubscribe", token),
	}
})

export class NewsletterTokens extends Context.Service<
	NewsletterTokens,
	Effect.Success<typeof make>
>()("cod-zombies/lib/services/newsletter-tokens/NewsletterTokens") {}

export const newsletterTokensLayer = Layer.effect(NewsletterTokens, make).pipe(
	Layer.provide(
		Layer.merge(
			SecureRandom.layerWebCrypto,
			Mac.layerWebCrypto.pipe(Layer.provide(SecureRandom.layerWebCrypto)),
		),
	),
)
