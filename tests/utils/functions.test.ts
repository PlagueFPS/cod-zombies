import { it } from "@effect/vitest"
import { Redacted } from "effect"
import { afterEach, beforeAll, beforeEach, describe, vi } from "vitest"
import { DATE_OPTIONS } from "@/utils/constants"

// We'll import the functions dynamically in each test

// Set up the mocks and import the module in a beforeAll hook
beforeAll(() => {
	// Mock the last-modified.json module
	vi.mock("@/data/last-modified.json", () => ({
		files: {
			"test/file.mdx": {
				lastModified: "2025-10-31T12:00:00.000Z",
				lastModifiedFormatted: "October 31, 2025",
			},
		},
	}))
})

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
			const { getServerUrl } = await import("@/utils/functions")
			expect(getServerUrl()).toBe(expected)
		})
	}
})

describe("getLastUpdated", () => {
	let getLastUpdated: typeof import("@/utils/functions").getLastUpdated
	let _originalFiles: Record<string, unknown>

	beforeEach(async () => {
		// Store the original files object
		const lastModifiedModule = await import("@/data/last-modified.json")
		_originalFiles = { ...lastModifiedModule.files }

		// Import the module after setting up the mock
		const functions = await import("@/utils/functions")
		getLastUpdated = functions.getLastUpdated
	})

	afterEach(() => {
		vi.resetModules()
		vi.useRealTimers()
	})

	it("should return last modified data for existing file", ({ expect }) => {
		const result = getLastUpdated("test/file.mdx")
		expect(result).toStrictEqual({
			lastModified: "2025-10-31T12:00:00.000Z",
			lastModifiedFormatted: "October 31, 2025",
		})
	})

	it("should return current date for non-existing file", ({ expect }) => {
		const mockDate = new Date()

		vi.setSystemTime(mockDate)

		const result = getLastUpdated("non-existing-file.mdx")
		expect(result).toStrictEqual({
			lastModified: mockDate.toISOString(),
			lastModifiedFormatted: mockDate.toLocaleDateString(undefined, DATE_OPTIONS),
		})
	})

	it("should handle full relative and absolute paths", ({ expect }) => {
		const result1 = getLastUpdated("test/file.mdx")
		const result2 = getLastUpdated("./content/test/file.mdx")
		const result3 = getLastUpdated("cod-zombies/content/test/file.mdx")
		expect(result1).toStrictEqual({
			lastModified: "2025-10-31T12:00:00.000Z",
			lastModifiedFormatted: "October 31, 2025",
		})
		expect(result2).toStrictEqual({
			lastModified: "2025-10-31T12:00:00.000Z",
			lastModifiedFormatted: "October 31, 2025",
		})
		expect(result3).toStrictEqual({
			lastModified: "2025-10-31T12:00:00.000Z",
			lastModifiedFormatted: "October 31, 2025",
		})
	})
})

describe("calculateTimeToRead", () => {
	it("should return 1 for anything less than 200 words", async ({ expect }) => {
		const { calculateTimeToRead } = await import("@/utils/functions")
		const content = "word ".repeat(150) // 150 words
		const result = calculateTimeToRead(content)
		expect(result).toStrictEqual(1)
	})

	it("should use the worst case when rounding", async ({ expect }) => {
		const { calculateTimeToRead } = await import("@/utils/functions")
		const content = "word ".repeat(500) // 500 words
		const result = calculateTimeToRead(content)
		// 500 words / 200 words per minute = 2.5 minutes
		expect(result).toStrictEqual(3)
	})
})

describe("stripMarkdown", () => {
	it("should remove markdown formatting", async ({ expect }) => {
		const { stripMarkdown } = await import("@/utils/functions")
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
