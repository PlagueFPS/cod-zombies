import type { DurationInput } from "effect/Duration"
import { createHash, randomBytes, timingSafeEqual } from "crypto"
import { Duration, Effect, Predicate } from "effect"
import { AuthorizationError, TokenExpirationError, TokenGenerationError, TokenVerificationError } from "@/types/errors"

/**
 * Capitalizes the first letter of each word in a string, replacing hyphens with spaces.
 * @param text - The input string to be capitalized.
 * @returns The capitalized string with spaces instead of hyphens.
 */
export const capatilize = (text: string) => {
	return text
		.replace(/-/g, " ")
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Converts a string to a URL-friendly slug.
 * @param text - The input string to be slugified.
 * @returns The slugified string in lowercase, with spaces, slashes, and commas replaced by hyphens, and '&' replaced with 'and'.
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
 * A type representing a successful result
 */
type Success<T> = {
	success: true
	data: T
	error: null
}

/**
 * A type representing a failed result
 */
type Failure = {
	success: false
	data: null
	error: Error
}

/**
 * A union type representing either a successful or failed result
 */
type Result<T> = Success<T> | Failure

/**
 * Safely executes an async operation and returns a structured result
 *
 * @param promiseOrFn - Either a promise or a function that returns a promise
 * @returns A Result object containing either the data or error
 */
export async function tryCatch<T>(promiseOrFn: Promise<T> | (() => Promise<T>)): Promise<Result<T>> {
	try {
		const data = Predicate.isFunction(promiseOrFn) ? await promiseOrFn() : await promiseOrFn

		return {
			success: true,
			data,
			error: null,
		}
	} catch (error) {
		return {
			success: false,
			data: null,
			error: error instanceof Error ? error : new Error(String(error)),
		}
	}
}
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

		if (Duration.greaterThan(now, expiresIn))
			return yield* Effect.fail(
				new TokenExpirationError({
					message: "Token has expired",
					cause: new Error(`Token expired at ${new Date(expiresIn).toISOString()}`),
				}),
			)

		const payload = `${value}:${salt}:${expiresIn}`
		const hash = createHash("sha256").update(payload).digest("hex")

		if (hash !== originalHash)
			return yield* Effect.fail(
				new TokenVerificationError({
					message: "Invalid Token",
					cause: new Error("Original hash does not match the calculated hash"),
				}),
			)

		return value
	}).pipe(Effect.withLogSpan("verify_token"))
