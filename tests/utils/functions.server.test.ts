import { createHash } from "node:crypto"
import { Cause, Effect, Option, String as Str } from "effect"
import { afterEach, describe, expect, it, vi } from "vitest"
import { expectExitFailure, expectExitSuccess } from "@/tests/helpers"
import { DATE_OPTIONS } from "@/utils/constants"
import { getLastModified, verifyToken } from "@/utils/functions.server"
import { dateFrom } from "@/utils/system-time"

describe("getLastModified", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it("should return current date for non-existing file", () => {
		const mockDate = dateFrom("2025-03-15T10:00:00.000Z")
		vi.useFakeTimers()
		vi.setSystemTime(mockDate)
		const result = getLastModified("content/main-quests/not-in-data")
		expect(result).toStrictEqual({
			lastModified: mockDate.getTime(),
			lastModifiedFormatted: mockDate.toLocaleDateString(undefined, DATE_OPTIONS),
		})
	})
})

describe("verifyToken", () => {
	const expiresAt = Date.parse("2026-01-02T00:00:00.000Z")
	const payload = `reader@example.com:fixed-salt:${expiresAt}`
	const hash = createHash("sha256").update(payload).digest("hex")

	afterEach(() => vi.useRealTimers())

	it("should accept a valid unexpired token", async () => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-01-01T00:00:00.000Z"))
		const token = Buffer.from(`${payload}:${hash}`).toString("base64url")

		const result = await Effect.runPromiseExit(verifyToken(token))

		expect(expectExitSuccess(result)).toBe("reader@example.com")
	})

	it.each([
		"reader@example.com:fixed-salt:not-a-number:hash",
		"reader@example.com:fixed-salt:Infinity:hash",
		`reader@example.com:fixed-salt:${expiresAt}:`,
		`:fixed-salt:${expiresAt}:hash`,
		`${payload}:${hash}:extra`,
		`${payload}:${Str.repeat(64)("0")}`,
	])("should reject malformed or tampered token payload %s", async malformed => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-01-01T00:00:00.000Z"))
		const token = Buffer.from(malformed).toString("base64url")

		const result = await Effect.runPromiseExit(verifyToken(token))

		const error = Cause.findErrorOption(expectExitFailure(result)).pipe(Option.getOrUndefined)

		expect(error).toHaveProperty("_tag", "TokenVerificationError")
	})

	it("should preserve the expiration error for an expired token", async () => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-01-03T00:00:00.000Z"))
		const token = Buffer.from(`${payload}:${hash}`).toString("base64url")

		const result = await Effect.runPromiseExit(verifyToken(token))

		const error = Cause.findErrorOption(expectExitFailure(result)).pipe(Option.getOrUndefined)

		expect(error).toHaveProperty("_tag", "TokenExpirationError")
	})
})
