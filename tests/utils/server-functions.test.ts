import * as BunPath from "@effect/platform-bun/BunPath"
import { expect, it, layer } from "@effect/vitest"
import { Effect, FileSystem, Layer, Redacted } from "effect"
import { afterEach, beforeEach, describe, vi } from "vitest"
import { DATE_OPTIONS } from "@/utils/constants"
import { getLastModified } from "@/utils/server-functions"

vi.mock("@/env", () => ({
	env: {
		RESEND_API_KEY: Redacted.make("test-key"),
		RESEND_AUDIENCE_ID: Redacted.make("test-audience"),
		HASH_SALT: Redacted.make("test-salt"),
		LINEAR_API_KEY: Redacted.make("test-linear-key"),
		LINEAR_DEFAULT_ASSIGNEE_ID: Redacted.make("test-assignee"),
		VERCEL_ENV: Redacted.make("development"),
		VERCEL_URL: Redacted.make("localhost:3000"),
		VERCEL_PROJECT_PRODUCTION_URL: Redacted.make("example.com"),
	},
}))

const MOCK_LAST_MODIFIED_JSON = JSON.stringify({
	version: "1.0",
	generated: "2025-10-31T12:00:00.000Z",
	files: {
		"test/file.mdx": {
			lastModified: 1761901200000,
			lastModifiedFormatted: "October 31, 2025",
		},
	},
})

const MockFileSystemLayer = Layer.mergeAll(
	FileSystem.layerNoop({
		readFileString: () => Effect.succeed(MOCK_LAST_MODIFIED_JSON),
	}),
	BunPath.layer,
)

describe("getServerUrl", () => {
	let originalEnv: NodeJS.ProcessEnv

	beforeEach(() => {
		// Store original process.env
		originalEnv = { ...process.env }
		// Clear the module cache to ensure fresh imports
		vi.resetModules()
	})

	afterEach(() => {
		// Restore original process.env
		process.env = { ...originalEnv }
	})

	const testCases = [
		{
			env: {
				VERCEL_ENV: "development",
				VERCEL_URL: "localhost:3000",
				VERCEL_PROJECT_PRODUCTION_URL: "example.com",
			},
			expected: "http://localhost:3000",
			desc: "development environment",
		},
		{
			env: {
				VERCEL_ENV: "preview",
				VERCEL_URL: "preview.example.com",
				VERCEL_PROJECT_PRODUCTION_URL: "example.com",
			},
			expected: "https://preview.example.com",
			desc: "preview environment",
		},
		{
			env: {
				VERCEL_ENV: "production",
				VERCEL_URL: "example.vercel.app",
				VERCEL_PROJECT_PRODUCTION_URL: "example.com",
			},
			expected: "https://example.com",
			desc: "production environment",
		},
	]

	for (const { env, expected, desc } of testCases) {
		it(`should return correct URL for ${desc}`, async ({ expect }) => {
			// Set environment variables directly
			process.env.VERCEL_ENV = env.VERCEL_ENV
			process.env.VERCEL_URL = env.VERCEL_URL
			process.env.VERCEL_PROJECT_PRODUCTION_URL = env.VERCEL_PROJECT_PRODUCTION_URL

			// Mock the env module to return the expected values
			vi.doMock("@/env", () => ({
				env: {
					VERCEL_ENV: Redacted.make(env.VERCEL_ENV),
					VERCEL_URL: Redacted.make(env.VERCEL_URL),
					VERCEL_PROJECT_PRODUCTION_URL: Redacted.make(env.VERCEL_PROJECT_PRODUCTION_URL),
				},
			}))

			// Import dynamically after setting up the mock
			const { getServerUrl } = await import("@/utils/server-functions")
			expect(getServerUrl()).toBe(expected)
		})
	}
})

layer(MockFileSystemLayer)("getLastModified", it => {
	it.effect("should return last modified data for existing file", () =>
		Effect.gen(function* () {
			const result = yield* getLastModified("test/file.mdx")
			expect(result).toStrictEqual({
				lastModified: 1761901200000,
				lastModifiedFormatted: "October 31, 2025",
			})
		}),
	)

	it.effect("should return current date for non-existing file", () =>
		Effect.gen(function* () {
			const mockDate = new Date("2025-03-15T10:00:00.000Z")
			vi.setSystemTime(mockDate)
			try {
				const result = yield* getLastModified("non-existing-file.mdx")
				expect(result).toStrictEqual({
					lastModified: mockDate.getTime(),
					lastModifiedFormatted: mockDate.toLocaleDateString(undefined, DATE_OPTIONS),
				})
			} finally {
				vi.useRealTimers()
			}
		}),
	)

	it.effect("should handle full relative and absolute paths", () =>
		Effect.gen(function* () {
			const expected = {
				lastModified: 1761901200000,
				lastModifiedFormatted: "October 31, 2025",
			}
			const result1 = yield* getLastModified("test/file.mdx")
			const result2 = yield* getLastModified("./content/test/file.mdx")
			const result3 = yield* getLastModified("cod-zombies/content/test/file.mdx")
			const result4 = yield* getLastModified("content/test/file.mdx")
			expect(result1).toStrictEqual(expected)
			expect(result2).toStrictEqual(expected)
			expect(result3).toStrictEqual(expected)
			expect(result4).toStrictEqual(expected)
		}),
	)
})

describe("calculateTimeToRead", () => {
	it("should return 1 for anything less than 200 words", async ({ expect }) => {
		const { calculateTimeToRead } = await import("@/utils/server-functions")
		const content = "word ".repeat(150) // 150 words
		const result = calculateTimeToRead(content)
		expect(result).toStrictEqual(1)
	})

	it("should use the worst case when rounding", async ({ expect }) => {
		const { calculateTimeToRead } = await import("@/utils/server-functions")
		const content = "word ".repeat(500) // 500 words
		const result = calculateTimeToRead(content)
		// 500 words / 200 words per minute = 2.5 minutes
		expect(result).toStrictEqual(3)
	})
})

describe("stripMarkdown", () => {
	it("should remove markdown formatting", async ({ expect }) => {
		const { stripMarkdown } = await import("@/utils/server-functions")
		const heading = "# Heading"
		const subheading = "## Subheading"
		const subsubheading = "### Subsubheading"
		const bold = "**Bold**"
		const italic = "*Italic*"
		const link = "[Link](https://example.com)"
		const code = "`Code`"
		const html = "<div>HTML</div>"
		const block = `
# Heading1
**Bold Text**
*Italic Text*
[Link](https://example.com)
<div>HTML</div>
		`
		expect(stripMarkdown(heading)).toBe("Heading")
		expect(stripMarkdown(subheading)).toBe("Subheading")
		expect(stripMarkdown(subsubheading)).toBe("Subsubheading")
		expect(stripMarkdown(bold)).toBe("Bold")
		expect(stripMarkdown(italic)).toBe("Italic")
		expect(stripMarkdown(link)).toBe("Link")
		expect(stripMarkdown(code)).toBe("Code")
		expect(stripMarkdown(html)).toBe("HTML")
		expect(stripMarkdown(block)).toBe("Heading1\nBold Text\nItalic Text\nLink\nHTML")
	})
})
