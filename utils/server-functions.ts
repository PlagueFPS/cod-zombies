import type { Heading } from "@/components/client/table-of-contents"
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import {
	Clock,
	Duration,
	Effect,
	FileSystem,
	Number as Num,
	Option,
	Path,
	Redacted,
	Schema,
} from "effect"
import { env } from "@/env"
import { DATE_OPTIONS } from "@/utils/constants"
import { slugify } from "@/utils/shared-functions"
import { decodeLastModifiedData } from "@/utils/validation-schemas"

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
 */
export const getLastModified = Effect.fn("getLastModifiedData")(function* (filePath: string) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const dataPath = path.join(process.cwd(), "data/last-modified.json")
	const { files } = yield* fs
		.readFileString(dataPath)
		.pipe(Effect.flatMap(data => decodeLastModifiedData(data)))

	const fileData = files[filePath.replace(/^.*?\/content\//, "") as keyof typeof files]
	if (!fileData) {
		yield* Effect.logWarning(`Missing last-modified data for file ${filePath}`)
		return {
			lastModified: Date.now(),
			lastModifiedFormatted: new Date().toLocaleDateString(undefined, DATE_OPTIONS),
		}
	}

	return {
		lastModified: fileData.lastModified,
		lastModifiedFormatted: fileData.lastModifiedFormatted,
	}
})

/**
 * Calculates the time to read a file.
 * @param contentPath The path of the file.
 * @returns The time to read the file.
 */
export const calculateTimeToRead = (content: string) => {
	const wordCount = stripMarkdown(content)
		.split(/\s+/)
		.filter(word => word.length > 0).length
	const wordPerMinute = 200 // avg reading speed
	const minutes = Math.ceil(wordCount / wordPerMinute) // always use the worst case
	return minutes < 1 ? 1 : minutes
}

/**
 * Extract headings from MDX content.
 * @param contentPath The path to the MDX file.
 * @returns An array of headings extracted from the MDX content.
 */
export const extractHeadingsFromMDX = (content: string) => {
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

	yield* Effect.try({
		try: () => timingSafeEqual(hashBuffer, originalHashBuffer),
		catch: error => new TokenVerificationError({ message: "Invalid Token", cause: error }),
	})

	return value
})

export const stripMarkdown = (text: string) =>
	text
		.trim()
		.replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, "") // remove import statements
		.replace(/^#{1,6}\s+(.*?)(\s*#*\s*)?$/gm, "$1") // remove markdown headings (e.g., # Heading -> Heading)
		.replace(/\*\*([^*]+)\*\*/g, "$1") // bold **text** -> text
		.replace(/\*([^*]+)\*/g, "$1") // italic *text* -> text
		.replace(/_([^_]+)_/g, "$1") // underline _text_ -> text
		.replace(/`([^`]+)`/g, "$1") // code `text` -> text
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // link [text](https://example.com) -> text
		.replace(/<[^>]+>/g, "") // remove html tags
