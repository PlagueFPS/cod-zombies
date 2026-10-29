import type { OpengraphKind } from "@/utils/validation-schemas"
// Token bytes, SHA-256 digests, and constant-time compares stay on node:crypto.
// oxlint-disable-next-line effecttsgo/node-builtin-import
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { Clock, Duration, Effect, Option, Schema, String as Str } from "effect"
import { opengraphImagePath } from "@/utils/opengraph-image-url"
import { getServerUrl } from "@/utils/request.server"
import { dateFrom } from "@/utils/system-time"

export { getLastModified } from "@/utils/content-meta"

class TokenExpirationError extends Schema.TaggedError<
	TokenExpirationError,
	{ readonly brand: unique symbol }
>()("TokenExpirationError", {
	message: Schema.String,
	cause: Schema.Defect(),
}) {}

class TokenGenerationError extends Schema.TaggedError<
	TokenGenerationError,
	{ readonly brand: unique symbol }
>()("TokenGenerationError", {
	message: Schema.String,
	cause: Schema.Defect(),
}) {}

class TokenVerificationError extends Schema.TaggedError<
	TokenVerificationError,
	{ readonly brand: unique symbol }
>()("TokenVerificationError", {
	message: Schema.String,
	cause: Schema.Defect(),
}) {}

export const getOpengraphImageUrl = async (kind: OpengraphKind, id: string) => {
	const path = opengraphImagePath(kind, id)

	if (Option.isNone(path)) {
		// oxlint-disable-next-line effecttsgo/global-console -- logged from a TanStack server helper, outside an Effect
		console.warn(`Missing opengraph image version for ${kind}: ${id}`)

		return Option.none()
	}

	return Option.some(`${getServerUrl()}${path.value}`)
}

/**
 * Generates a unique, secure, and time-limited token.
 * @param value - The value to secure.
 * @param expiresIn - The expiration time of the token.
 * @returns An Effect that succeeds with the generated unique secure token.
 */
export const generateToken = Effect.fn("generateToken")(function* (
	value: string,
	expiresIn: Duration.Duration,
) {
	const salt = randomBytes(16).toString("hex")

	const expiresInMs = yield* Clock.currentTimeMillis.pipe(
		Effect.map(now => now + Duration.toMillis(expiresIn)),
	)

	const payload = `${value}:${salt}:${expiresInMs}`
	const hash = createHash("sha256").update(payload).digest("hex")

	return yield* Effect.try({
		try: () => Buffer.from(`${payload}:${hash}`).toString("base64url"),
		catch: error =>
			TokenGenerationError.make({
				message: "Failed to generate token.",
				cause: error,
			}),
	})
})

const TokenPayloadSchema = Schema.Tuple([
	Schema.NonEmptyString,
	Schema.NonEmptyString,
	Schema.FiniteFromString.pipe(Schema.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0))),
	Schema.NonEmptyString,
])

/**
 * Verifies a securely generated token.
 * @param token - the secure token to verify.
 * @returns An Effect that succeeds with the valid token.
 */
export const verifyToken = Effect.fn("verifyToken")(function* (token: string) {
	const buffer = yield* Effect.try({
		try: () => Buffer.from(token, "base64url").toString(),
		catch: error => TokenVerificationError.make({ message: "Invalid Token", cause: error }),
	})

	const [value, salt, expiresIn, originalHash] = yield* Schema.decodeUnknownEffect(
		TokenPayloadSchema,
	)(Str.split(buffer, ":")).pipe(
		Effect.mapError(cause =>
			TokenVerificationError.make({ message: "Invalid Token Format", cause }),
		),
	)

	const now = yield* Clock.currentTimeMillis

	if (Duration.isGreaterThan(Duration.millis(now), Duration.millis(expiresIn))) {
		return yield* TokenExpirationError.make({
			message: "Token has expired",
			cause: new Error(`Token expired at ${dateFrom(expiresIn).toISOString()}`),
		})
	}

	const payload = `${value}:${salt}:${expiresIn}`
	const hash = createHash("sha256").update(payload).digest("hex")
	const hashBuffer = Buffer.from(hash, "hex")
	const originalHashBuffer = Buffer.from(originalHash, "hex")

	const isTimingSafe = yield* Effect.try({
		try: () => timingSafeEqual(hashBuffer, originalHashBuffer),
		catch: error => TokenVerificationError.make({ message: "Invalid Token", cause: error }),
	})

	if (!isTimingSafe) {
		return yield* TokenVerificationError.make({
			message: "Invalid Token",
			cause: "Timing comparison failed",
		})
	}

	return value
})
