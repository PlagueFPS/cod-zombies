import type { DurationInput } from "effect/Duration"
import { createHash, randomBytes, timingSafeEqual } from "crypto"
import { Duration, Effect } from "effect"
import { AuthorizationError, TokenExpirationError, TokenGenerationError, TokenVerificationError } from "@/types/errors"

/**
 * Capitalizes the first letter of each word in a string, replacing hyphens with spaces.
 * @param text - The input string to be capitalized.
 * @returns The capitalized string.
 * @example
 * capitalize("hello-world") // "Hello World"
 */
export const capitalize = (text: string) => {
	return text
		.replace(/-/g, " ")
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Converts a string to a URL-friendly slug, replacing spaces, slashes, and commas with hyphens, and '&' with 'and'.
 * @param text - The input string to be slugified.
 * @returns The slugified string.
 * @example
 * slugify("Hello World") // "hello-world"
 */
export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.replace(/[ /,]+/g, "-")
		.replace(/&/g, "and")
}

/**
 * Extracts the YouTube video ID from a given URL.
 * @param url - The YouTube video URL.
 * @returns The extracted video ID, or null if not found.
 */
export const getYouTubeVideoId = (url: string) => {
	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
	const match = url.match(regex)
	return match ? match[1] : null
}

/**
 * Performs a timing-safe comparison of two secrets.
 * @param secret - The secret to be validated.
 * @param validSecret - The known valid secret.
 * @returns An Effect that succeeds with a boolean.
 */
export const authorizedRequest = (secret: string, validSecret: string) =>
	Effect.gen(function* () {
		const encoder = new TextEncoder()
		const secretBuffer = encoder.encode(secret)
		const validSecretBuffer = encoder.encode(validSecret)

		return yield* Effect.try({
			try: () => timingSafeEqual(secretBuffer, validSecretBuffer),
			catch: error => new AuthorizationError({ message: "Authorization Failed", cause: error }),
		})
	}).pipe(Effect.withLogSpan("authorized_request"))
/**
 * Generates a unique, secure, and time-limited token.
 * @param value - The value to secure.
 * @param expiresIn - The expiration time of the token.
 * @returns An Effect that succeeds with the generated unique secure token.
 */
export const generateToken = (value: string, expiresIn: DurationInput) =>
	Effect.gen(function* () {
		const salt = randomBytes(16).toString("hex")
		const expiresInMs = Date.now() + Duration.toMillis(expiresIn)
		const payload = `${value}:${salt}:${expiresInMs}`
		const hash = createHash("sha256").update(payload).digest("hex")

		return yield* Effect.try({
			try: () => Buffer.from(`${payload}:${hash}`).toString("base64url"),
			catch: error => new TokenGenerationError({ message: "Failed to generate token.", cause: error }),
		})
	}).pipe(Effect.withLogSpan("generate_token"))
/**
 * Verifies a securely generated token.
 * @param token - the secure token to verify.
 * @returns An Effect that succeeds with the valid token.
 */
export const verifyToken = (token: string) =>
	Effect.gen(function* () {
		const buffer = yield* Effect.try({
			try: () => Buffer.from(token, "base64url").toString(),
			catch: error => new TokenVerificationError({ message: "Invalid Token", cause: error }),
		})
		const [value, salt, expiresInStr, originalHash] = buffer.split(":")
		const expiresIn = parseInt(expiresInStr, 10) 
		const now = Date.now()

		if (Duration.greaterThan(now, expiresIn)) return yield* new TokenExpirationError({
					message: "Token has expired",
					cause: new Error(`Token expired at ${new Date(expiresIn).toISOString()}`),
				})

		const payload = `${value}:${salt}:${expiresIn}`
		const hash = createHash("sha256").update(payload).digest("hex")

		if (hash !== originalHash) return yield* new TokenVerificationError({ 
			message: "Invalid Token",
			cause: new Error("Original hash does not match the calculated hash"),
		})

		return value
	}).pipe(Effect.withLogSpan("verify_token"))
