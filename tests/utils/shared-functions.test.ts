import { afterEach, describe, expect, test, vi } from "vitest"
import { MAIN_QUEST_DIFFICULTIES } from "@/data/maps"
import {
	capitalize,
	getYouTubeVideoId,
	slugify,
	getEstimatedTimeMidpoint,
	sortDates,
	sortDifficulties,
	copyTextToClipboard,
} from "@/utils/shared-functions"

describe("slugify", () => {
	test("should convert basic text to slug", () => {
		expect(slugify("Hello World")).toBe("hello-world")
	})

	test("should handle various special characters and formats", () => {
		// Special characters
		expect(slugify("What's New? (2023): Everything")).toBe("whats-new-2023-everything")
		expect(slugify("Tom & Jerry")).toBe("tom-and-jerry")
		expect(slugify("\"Quote\" and 'single quote'")).toBe("quote-and-single-quote")
		expect(slugify("What is this? It's a test.")).toBe("what-is-this-its-a-test")
		expect(slugify("Function (example)")).toBe("function-example")
		expect(slugify("Hello!!! World??? (Test) S.A.M. + A.D.A.M. Unit")).toBe(
			"hello-world-test-sam-adam-unit",
		)
		expect(slugify("Noose/Rope")).toBe("noose-rope")
		expect(slugify("Wunderwaffe DG-Scharfschütze")).toBe("wunderwaffe-dg-scharfschutze")

		// Markdown headings
		expect(slugify("## Heading")).toBe("heading")
		expect(slugify("### Sub Heading")).toBe("sub-heading")
		expect(slugify("#### Sub Sub Heading")).toBe("sub-sub-heading")
	})

	test("should handle spacing and formatting", () => {
		expect(slugify("  Hello   World!  ")).toBe("hello-world")
		expect(slugify("hello-world")).toBe("hello-world") // Already slugified
		expect(slugify("")).toBe("") // Empty string
	})
})

describe("capitalize", () => {
	test("should capitalize first letter", () => {
		expect(capitalize("hello")).toBe("Hello")
	})

	test("should handle multiple words and formats", () => {
		// Basic multi-word
		expect(capitalize("hello world")).toBe("Hello World")
		// Slug format
		expect(capitalize("hello-world-test-sam-adam-unit")).toBe("Hello World Test Sam Adam Unit")
		// Underscore format
		expect(capitalize("hello_world_test_sam_adam_unit")).toBe("Hello World Test Sam Adam Unit")
	})

	test("should handle potential edge cases", () => {
		expect(capitalize("Hello World")).toBe("Hello World")
		expect(capitalize("")).toBe("")
	})
})

describe("getYoutubeVideoId", () => {
	test("should extract video id from shortened url", () => {
		expect(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
	})
	test("should extract video id from full url", () => {
		expect(getYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
	})
	test("should extract video id from youtube shorts url", () => {
		expect(getYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
	})
	test("should extract video id from share url query params", () => {
		expect(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ?si=yG8VkeG8544HZlg-")).toBe(
			"dQw4w9WgXcQ",
		)
	})
})

describe("getEstimatedTimeMidpoint", () => {
	test("returns the arithmetic mean of min and max minutes", () => {
		expect(getEstimatedTimeMidpoint({ min: 30, max: 60 })).toBe(45)
		expect(getEstimatedTimeMidpoint({ min: 120, max: 180 })).toBe(150)
	})
})

describe("sortDates", () => {
	test("should return a negative number if first date is older than second", () => {
		expect(sortDates("2020-01-01", "2020-01-02")).toBeLessThan(0)
	})
	test("should return a positive number if first date is newer than second", () => {
		expect(sortDates("2020-01-02", "2020-01-01")).toBeGreaterThan(0)
	})
	test("should return 0 if dates are equal", () => {
		expect(sortDates("2020-01-01", "2020-01-01")).toBe(0)
	})
})

describe("sortDifficulties", () => {
	test("orders permutations to match MAIN_QUEST_DIFFICULTIES canonical order", () => {
		const ordered = [...MAIN_QUEST_DIFFICULTIES].reverse().sort(sortDifficulties)
		expect(ordered).toEqual([...MAIN_QUEST_DIFFICULTIES])
	})

	test("each adjacent pair in MAIN_QUEST_DIFFICULTIES sorts ascending", () => {
		for (let i = 1; i < MAIN_QUEST_DIFFICULTIES.length; i++) {
			const prev = MAIN_QUEST_DIFFICULTIES[i - 1]!
			const curr = MAIN_QUEST_DIFFICULTIES[i]!
			expect(sortDifficulties(prev, curr)).toBeLessThan(0)
			expect(sortDifficulties(curr, prev)).toBeGreaterThan(0)
		}
	})
})

describe("copyTextToClipboard", () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	test("returns true when clipboard.writeText succeeds", async () => {
		const writeText = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
		vi.stubGlobal("navigator", { clipboard: { writeText } })

		await expect(copyTextToClipboard("https://example.com/guide")).resolves.toBe(true)
		expect(writeText).toHaveBeenCalledWith("https://example.com/guide")
	})

	test("returns false when clipboard.writeText rejects", async () => {
		vi.stubGlobal("navigator", {
			clipboard: { writeText: vi.fn<() => Promise<void>>().mockRejectedValue(new Error("denied")) },
		})

		await expect(copyTextToClipboard("https://example.com/guide")).resolves.toBe(false)
	})
})
