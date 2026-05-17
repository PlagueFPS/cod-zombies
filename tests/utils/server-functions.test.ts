import * as BunPath from "@effect/platform-bun/BunPath"
import { expect, it, layer } from "@effect/vitest"
import { Effect, FileSystem, Layer, Option } from "effect"
import { describe, vi } from "vitest"
import { DATE_OPTIONS } from "@/utils/constants"
import {
	getLastModified,
	getOpengraphImageUrl,
	getServerUrl,
	serverUrlFromVercelEnv,
} from "@/utils/server-functions"

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

const MOCK_OPENGRAPH_MANIFEST_JSON = JSON.stringify({
	"main-quests": { "paradox-junction": 2 },
	"side-quests": { "free-perk": 1 },
	zombies: { zombie: 1 },
})

const OpengraphManifestFileSystemLayer = Layer.mergeAll(
	FileSystem.layerNoop({
		readFileString: () => Effect.succeed(MOCK_OPENGRAPH_MANIFEST_JSON),
	}),
	BunPath.layer,
)

describe("serverUrlFromVercelEnv", () => {
	const testCases = [
		{
			input: {
				vercelEnv: "development" as const,
				vercelUrl: "[REDACTED]",
				vercelProjectProductionUrl: "example.com",
			},
			expected: "[REDACTED]",
			desc: "development environment",
		},
		{
			input: {
				vercelEnv: "preview" as const,
				vercelUrl: "preview.example.com",
				vercelProjectProductionUrl: "example.com",
			},
			expected: "https://preview.example.com",
			desc: "preview environment",
		},
		{
			input: {
				vercelEnv: "production" as const,
				vercelUrl: "example.vercel.app",
				vercelProjectProductionUrl: "example.com",
			},
			expected: "https://example.com",
			desc: "production environment",
		},
	]

	for (const { input, expected, desc } of testCases) {
		it(`should return correct URL for ${desc}`, ({ expect }) => {
			expect(serverUrlFromVercelEnv(input)).toBe(expected)
		})
	}
})

describe("getServerUrl", () => {
	it("delegates to seeded env from vitest.setup", ({ expect }) => {
		expect(getServerUrl()).toBe("[REDACTED]")
	})
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
			const result5 = yield* getLastModified("cod-zombies\\content\\test\\file.mdx")
			expect(result1).toStrictEqual(expected)
			expect(result2).toStrictEqual(expected)
			expect(result3).toStrictEqual(expected)
			expect(result4).toStrictEqual(expected)
			expect(result5).toStrictEqual(expected)
		}),
	)
})

layer(OpengraphManifestFileSystemLayer)("getOpengraphImageUrl", it => {
	it.effect("should return `Some` with a versioned URL when the id exists in the manifest", () =>
		Effect.gen(function* () {
			const result = yield* getOpengraphImageUrl("main-quests", "paradox-junction")
			expect(Option.getOrThrow(result)).toBe(
				`${getServerUrl()}/opengraph-images/main-quests/opengraph-paradox-junction-v2.jpg`,
			)
		}),
	)

	it.effect("should build URLs for side-quests and zombies kinds", () =>
		Effect.gen(function* () {
			const sideQuests = yield* getOpengraphImageUrl("side-quests", "free-perk")
			const zombies = yield* getOpengraphImageUrl("zombies", "zombie")
			expect(Option.getOrThrow(sideQuests)).toBe(
				`${getServerUrl()}/opengraph-images/side-quests/opengraph-free-perk-v1.jpg`,
			)
			expect(Option.getOrThrow(zombies)).toBe(
				`${getServerUrl()}/opengraph-images/zombies/opengraph-zombie-v1.jpg`,
			)
		}),
	)

	it.effect("should return `None` when the id is missing from the manifest", () =>
		Effect.gen(function* () {
			const result = yield* getOpengraphImageUrl("main-quests", "no-such-map")
			expect(result).toEqual(Option.none())
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
