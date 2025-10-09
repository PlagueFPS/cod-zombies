import type { DurationInput } from "effect/Duration"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import { execSync } from "node:child_process"
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { Data, Duration, Effect, Number as Num, Option, Redacted } from "effect"
import { ReadFileError } from "@/data/og-images"
import { env } from "@/env"
import {
	AuthorizationError,
	type CommonErrorProps,
	TokenExpirationError,
	TokenGenerationError,
	TokenVerificationError,
} from "@/types/errors"
import { DATE_OPTIONS } from "./constants"
import { slugify } from "./functions.client"

class GetLastUpdatedError extends Data.TaggedError("GetLastUpdatedError")<CommonErrorProps> {}

/**
 * Gets the server URL.
 * @returns The server URL.
 */
export const getServerUrl = () => {
	const currentEnv = Redacted.value(env.VERCEL_ENV)
	switch (currentEnv) {
		case "preview":
			return `https://${Redacted.value(env.VERCEL_URL)}`
		case "production":
			return `https://${Redacted.value(env.VERCEL_PROJECT_PRODUCTION_URL)}`
		default:
			return `http://localhost:3000`
	}
}

/**
 * Gets the last updated date of a file.
 * @param filePath The path of the file.
 * @returns The last updated date of the file.
 */
export const getLastUpdated = (filePath: string) =>
	Effect.gen(function* () {
		const abs = path.join(process.cwd(), filePath)
		const out = yield* Effect.try({
			try: () =>
				execSync(`git log -1 --format=%cI -- ${abs}`, {
					encoding: "utf-8",
					stdio: ["ignore", "pipe", "ignore"],
				}),
			catch: error =>
				new GetLastUpdatedError({ message: "Failed to get last updated", cause: error }),
		}).pipe(
			Effect.map(out =>
				out
					// strip stray wrapping quotes if any
					.replace(/^"|"$/g, "")
					.trim(),
			),
		)

		const ms = Date.parse(out)
		if (Number.isNaN(ms))
			return yield* new GetLastUpdatedError({ message: "Invalid date", cause: out })

		return new Date(out).toLocaleDateString(undefined, DATE_OPTIONS)
	}).pipe(
		Effect.withLogSpan("get_last_updated"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error =>
			Effect.succeed(new Date().toLocaleDateString(undefined, DATE_OPTIONS)),
		),
	)

export const calculateTimeToRead = (contentPath: string) =>
	Effect.gen(function* () {
		const wordCount = yield* Effect.tryPromise({
			try: () => readFile(path.join(process.cwd(), contentPath), { encoding: "utf-8" }),
			catch: error => new ReadFileError({ message: "Failed to read file", cause: error }),
		}).pipe(
			Effect.map(stripMarkdown),
			Effect.map(content => content.split(/\s+/).filter(word => word.length > 0).length),
		)

		const wordPerMinute = 200 // avg reading speed
		const minutes = Math.ceil(wordCount / wordPerMinute) // always use the worst case
		return minutes
	}).pipe(
		Effect.withLogSpan("calculate_time_to_read"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(0)),
	)

export const stripMarkdown = (text: string) =>
	text
		.replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, "") // remove import statements
		.replace(/\*\*([^*]+)\*\*/g, "$1") // bold **text** -> text
		.replace(/\*([^*]+)\*/g, "$1") // italic *text* -> text
		.replace(/_([^_]+)_/g, "$1") // underline _text_ -> text
		.replace(/`([^`]+)`/g, "$1") // code `text` -> text
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // link [text](https://example.com) -> text
		.replace(/<[^>]+>/g, "") // remove html tags
		.trim()

export const extractHeadingsFromMDX = (contentPath: string) =>
	Effect.gen(function* () {
		const content = yield* Effect.tryPromise({
			try: () => readFile(path.join(process.cwd(), contentPath), { encoding: "utf-8" }),
			catch: error => new ReadFileError({ message: "Failed to read file", cause: error }),
		})

		const lines = content.split(/\r?\n/)
		const headings: Heading[] = []

		for (const line of lines) {
			const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line)
			if (!match) continue

			const level = match[1]?.length
			const type = level === 2 ? "h2" : level === 3 ? "h3" : "h4"
			const text = stripMarkdown(match[2] || "")
			if (!text) continue

			const id = slugify(text)
			headings.push({ type, text, id })
		}

		return headings
	}).pipe(
		Effect.withLogSpan("extract_headings_from_mdx"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
	)

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
