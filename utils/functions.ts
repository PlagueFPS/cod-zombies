import type { Heading } from "@/components/table-of-contents/table-of-contents"
import { timingSafeEqual } from "node:crypto"
import { Effect, Redacted } from "effect"
import { files } from "@/data/last-modified.json"
import { env } from "@/env"
import {
	AuthorizationError
} from "@/types/errors"
import { DATE_OPTIONS } from "./constants"
import { slugify } from "./functions.client"

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
 */
export const getLastUpdated = (filePath: string) => {
	const fileData = files[filePath.replace(/^.*?\/content\//, "") as keyof typeof files]
	if (!fileData) {
		console.warn(`Missing last-modified data for file ${filePath}`)
		return {
			lastModified: new Date().toISOString(),
			lastModifiedFormatted: new Date().toLocaleDateString(undefined, DATE_OPTIONS),
		}
	}

	return {
		lastModified: fileData.lastModified,
		lastModifiedFormatted: fileData.lastModifiedFormatted,
	}
}

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
			catch: error =>
				new AuthorizationError({
					message: "Authorization Failed",
					cause: error,
				}),
		})
	}).pipe(Effect.withLogSpan("authorized_request"))

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
