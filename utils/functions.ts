import type { DurationInput } from "effect/Duration"
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { Duration, Effect, Number as Num, Option, Redacted } from "effect"
import { env } from "@/env"
import {
	AuthorizationError,
	TokenExpirationError,
	TokenGenerationError,
	TokenVerificationError,
} from "@/types/errors"

export const getServerUrl = () => {
	const currentEnv = Redacted.value(env.VERCEL_ENV)
	switch(currentEnv) {
		case "preview":
			return `https://${Redacted.value(env.VERCEL_URL)}`
		case "production":
			return `https://${Redacted.value(env.VERCEL_PROJECT_PRODUCTION_URL)}`
		default:
			return `http://localhost:3000`
	}
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
			catch: error =>
				new TokenGenerationError({ message: "Failed to generate token.", cause: error }),
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

		if (!value || !salt || !expiresInStr || !originalHash) {
			return yield* new TokenVerificationError({
				message: "Invalid Token Format",
				cause: new Error("Token is malformed"),
			})
		}

		const expiresIn = Num.parse(expiresInStr)
		const now = Date.now()

		if (Option.isNone(expiresIn))
			return yield* new TokenVerificationError({
				message: "Invalid Token Format",
				cause: new Error("Token is malformed"),
			})

		if (Duration.greaterThan(now, expiresIn.value)) {
			return yield* new TokenExpirationError({
				message: "Token has expired",
				cause: new Error(`Token expired at ${new Date(expiresIn.value).toISOString()}`),
			})
		}

		const payload = `${value}:${salt}:${expiresIn}`
		const hash = createHash("sha256").update(payload).digest("hex")
		const hashBuffer = Buffer.from(hash, "hex")
		const originalHashBuffer = Buffer.from(originalHash, "hex")

		yield* Effect.try({
			try: () => timingSafeEqual(hashBuffer, originalHashBuffer),
			catch: error => new TokenVerificationError({ message: "Invalid Token", cause: error }),
		})

		return value
	}).pipe(Effect.withLogSpan("verify_token"))
