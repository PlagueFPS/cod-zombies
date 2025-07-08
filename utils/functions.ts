import "server-only"
import type { DurationInput } from "effect/Duration"
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { Duration, Effect } from "effect"
import {
	AuthorizationError,
	TokenExpirationError,
	TokenGenerationError,
	TokenVerificationError,
} from "@/types/errors"
/**
 * Performs a timing-safe comparison of two secrets.
 * @param secret - The secret to be validated.
 * @param validSecret - The known valid secret.
 * @returns An Effect that succeeds with a boolean.
 */
export const authorizedRequest = Effect.fn("authorizedRequest")(function* (
	secret: string,
	validSecret: string,
) {
	const encoder = new TextEncoder()
	const secretBuffer = encoder.encode(secret)
	const validSecretBuffer = encoder.encode(validSecret)

	return yield* Effect.try({
		try: () => timingSafeEqual(secretBuffer, validSecretBuffer),
		catch: error => new AuthorizationError({ message: "Authorization Failed", cause: error }),
	})
})
/**
 * Generates a unique, secure, and time-limited token.
 * @param value - The value to secure.
 * @param expiresIn - The expiration time of the token.
 * @returns An Effect that succeeds with the generated unique secure token.
 */
export const generateToken = Effect.fn("generateToken")(function* (
	value: string,
	expiresIn: DurationInput,
) {
	const salt = randomBytes(16).toString("hex")
	const expiresInMs = Date.now() + Duration.toMillis(expiresIn)
	const payload = `${value}:${salt}:${expiresInMs}`
	const hash = createHash("sha256").update(payload).digest("hex")

	return yield* Effect.try({
		try: () => Buffer.from(`${payload}:${hash}`).toString("base64url"),
		catch: error =>
			new TokenGenerationError({ message: "Failed to generate token.", cause: error }),
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
	const expiresIn = expiresInStr ? parseInt(expiresInStr, 10) : 0
	const now = Date.now()

	if (Duration.greaterThan(now, expiresIn))
		return yield* new TokenExpirationError({
			message: "Token has expired",
			cause: new Error(`Token expired at ${new Date(expiresIn).toISOString()}`),
		})

	const payload = `${value}:${salt}:${expiresIn}`
	const hash = createHash("sha256").update(payload).digest("hex")

	if (hash !== originalHash || !value)
		return yield* new TokenVerificationError({
			message: "Invalid Token",
			cause: new Error("Original hash does not match the calculated hash"),
		})

	return value
})
