import type { ContentPaths } from "@/types/generated/content-paths.gen"
import type { OpengraphKind } from "@/utils/validation-schemas"
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { Clock, Duration, Effect, Number as Num, Option, Schema } from "effect"
import { files } from "@/data/last-modified.json" with { type: "json" }
import manifest from "@/data/opengraph-manifest.json" with { type: "json" }
import { DATE_OPTIONS } from "@/utils/constants"
import { getServerUrl } from "@/utils/request.server"

class TokenExpirationError extends Schema.TaggedErrorClass<TokenExpirationError>()(
	"TokenExpirationError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}
class TokenGenerationError extends Schema.TaggedErrorClass<TokenGenerationError>()(
	"TokenGenerationError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}
class TokenVerificationError extends Schema.TaggedErrorClass<TokenVerificationError>()(
	"TokenVerificationError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}

export const getOpengraphImageUrl = async (kind: OpengraphKind, id: string) => {
	const contentType = manifest[kind]
	const version: number = contentType[id as keyof typeof contentType]

	if (!version) {
		console.warn(`Missing opengraph image version for ${kind}: ${id}`)
		return Option.none()
	}

	const serverUrl = getServerUrl()
	return Option.some(`${serverUrl}/opengraph-images/${kind}/opengraph-${id}-v${version}.jpg`)
}

/**
 * Gets the last updated date of a file.
 */
export const getLastModified = (filePath: ContentPaths) => {
	const posixPath = filePath.replace(/\\/g, "/")
	const lastModifiedKey = `${posixPath.replace(/^.*?\/content\//, "").replace(/^content\//, "")}.mdx`
	const fileData = files[lastModifiedKey as keyof typeof files]
	if (!fileData) {
		console.warn(`Missing last-modified data for file ${filePath}`)
		return {
			lastModified: Date.now(),
			lastModifiedFormatted: new Date().toLocaleDateString(undefined, DATE_OPTIONS),
		}
	}

	return {
		lastModified: fileData.lastModified,
		lastModifiedFormatted: fileData.lastModifiedFormatted,
	}
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
			new TokenGenerationError({
				message: "Failed to generate token.",
				cause: error,
			}),
	})
})
/**
 * Verifies a securely generated token.
 * @param token - the secure token to verify.
 * @returns An Effect that succeeds with the valid token.
 */
export const verifyToken = Effect.fn("verifyToken")(function* (token: string) {
	const buffer = yield* Effect.try({
		try: () => Buffer.from(token, "base64url").toString(),
		catch: error => new TokenVerificationError({ message: "Invalid Token", cause: error }),
	})
	const [value, salt, expiresInStr, originalHash] = buffer.split(":")

	if (!value || !salt || !expiresInStr || !originalHash) {
		return yield* new TokenVerificationError({
			message: "Invalid Token Format",
			cause: new Error("Token is malformed"),
		})
	}

	const expiresIn = Num.parse(expiresInStr)
	const now = yield* Clock.currentTimeMillis

	if (Option.isNone(expiresIn))
		return yield* new TokenVerificationError({
			message: "Invalid Token Format",
			cause: new Error("Token is malformed"),
		})

	if (Duration.isGreaterThan(Duration.millis(now), Duration.millis(expiresIn.value))) {
		return yield* new TokenExpirationError({
			message: "Token has expired",
			cause: new Error(`Token expired at ${new Date(expiresIn.value).toISOString()}`),
		})
	}

	const payload = `${value}:${salt}:${expiresIn.value}`
	const hash = createHash("sha256").update(payload).digest("hex")
	const hashBuffer = Buffer.from(hash, "hex")
	const originalHashBuffer = Buffer.from(originalHash, "hex")

	const isTimingSafe = yield* Effect.try({
		try: () => timingSafeEqual(hashBuffer, originalHashBuffer),
		catch: error => new TokenVerificationError({ message: "Invalid Token", cause: error }),
	})

	if (!isTimingSafe) {
		return yield* new TokenVerificationError({
			message: "Invalid Token",
			cause: "Timing comparison failed",
		})
	}

	return value
})
