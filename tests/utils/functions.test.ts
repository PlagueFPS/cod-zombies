import { FileSystem, Path } from "@effect/platform"
import { expect, it } from "@effect/vitest"
import { Effect, Exit, Layer, Redacted } from "effect"
import { beforeAll, beforeEach, describe, test, vi } from "vitest"

// We'll import the functions dynamically in each test

const mockFs = (content: string) =>
	FileSystem.layerNoop(
		FileSystem.makeNoop({
			readFileString: () => Effect.succeed(content),
		}),
	)

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
	beforeEach(() => {
		vi.resetModules()
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
		test(`should return correct URL for ${desc}`, async () => {
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

	beforeEach(async () => {
		const functions = await import("@/utils/functions")
		getLastUpdated = functions.getLastUpdated
	})

	test("should return last modified data for existing file", () => {
		const result = getLastUpdated("test/file.mdx")
		expect(result).toStrictEqual({
			lastModified: "2025-10-31T12:00:00.000Z",
			lastModifiedFormatted: "October 31, 2025",
		})
	})

	test("should throw error for non-existing file", () => {
		expect(() => getLastUpdated("non-existing-file.mdx")).toThrow()
	})
})

describe("calculateTimeToRead", () => {
	it.effect("should return 1 for anything less than 200 words", ({ expect }) =>
		Effect.gen(function* () {
			const { calculateTimeToRead } = yield* Effect.promise(
				async () => await import("@/utils/functions"),
			)
			const content = "word ".repeat(150) // 150 words
			const result = yield* Effect.exit(
				calculateTimeToRead("test/file.mdx").pipe(
					Effect.provide(Layer.merge(mockFs(content), Path.layer)),
				),
			)
			expect(result).toStrictEqual(Exit.succeed(1))
		}),
	)

	it.effect("should use the worst case when rounding", ({ expect }) =>
		Effect.gen(function* () {
			const { calculateTimeToRead } = yield* Effect.promise(
				async () => await import("@/utils/functions"),
			)
			const content = "word ".repeat(500) // 500 words
			const result = yield* Effect.exit(
				calculateTimeToRead("test/file.mdx").pipe(
					Effect.provide(Layer.merge(mockFs(content), Path.layer)),
				),
			)
			// 500 words / 200 words per minute = 2.5 minutes
			expect(result).toStrictEqual(Exit.succeed(3))
		}),
	)
})

describe("stripMarkdown", () => {
	it("should remove markdown formatting", async () => {
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
