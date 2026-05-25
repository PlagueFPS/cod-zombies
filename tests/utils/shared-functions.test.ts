import { Option } from "effect"
import { afterEach, describe, expect, test, vi } from "vitest"
import { MAIN_QUEST_DIFFICULTIES } from "@/data/maps"
import {
	calculateSkip,
	capitalize,
	compareByOptionalSome,
	copyTextToClipboard,
	formatEstimatedTimeMidpoint,
	formatEstimatedTimeRange,
	getAdjacentItems,
	getEstimatedTimeMidpoint,
	getYouTubeVideoId,
	slugify,
	sortDates,
	sortDifficulties,
	sortEstimatedTime,
	sortRelicTypes,
	sortZombieSpeeds,
	sortZombieTypes,
	toPascalCase,
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

	test("slugifies each main quest difficulty label for URL filter params", () => {
		expect(slugify("Very Hard")).toBe("very-hard")
		for (const difficulty of MAIN_QUEST_DIFFICULTIES) {
			expect(slugify(difficulty)).toBe(difficulty.toLowerCase().replace(/\s+/g, "-"))
		}
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

describe("sortEstimatedTime", () => {
	test("orders ranges by midpoint ascending", () => {
		const short = { min: 30, max: 60 }
		const long = { min: 120, max: 180 }
		expect(sortEstimatedTime(short, long)).toBeLessThan(0)
		expect(sortEstimatedTime(long, short)).toBeGreaterThan(0)
	})

	test("returns 0 when midpoints are equal", () => {
		expect(sortEstimatedTime({ min: 40, max: 80 }, { min: 50, max: 70 })).toBe(0)
	})
})

describe("calculateSkip", () => {
	test("first page skips zero items", () => {
		expect(calculateSkip(1, 12)).toBe(0)
		expect(calculateSkip(0, 12)).toBe(0)
	})

	test("page 2 skips one page of items", () => {
		expect(calculateSkip(2, 12)).toBe(12)
	})

	test("page 3 skips two pages of items", () => {
		expect(calculateSkip(3, 12)).toBe(24)
	})
})

describe("getAdjacentItems", () => {
	const items = [
		{ id: "newest" },
		{ id: "middle" },
		{ id: "oldest" },
	] as const

	test("returns none when id is missing", () => {
		expect(getAdjacentItems([...items], "missing")).toEqual({
			prev: Option.none(),
			next: Option.none(),
		})
	})

	test("newest item has prev toward older entry and no next", () => {
		const { prev, next } = getAdjacentItems([...items], "newest")
		expect(prev).toEqual(Option.some({ id: "middle" }))
		expect(next).toEqual(Option.none())
	})

	test("oldest item has next toward newer entry and no prev", () => {
		const { prev, next } = getAdjacentItems([...items], "oldest")
		expect(prev).toEqual(Option.none())
		expect(next).toEqual(Option.some({ id: "middle" }))
	})

	test("middle item has both neighbors in descending order", () => {
		const { prev, next } = getAdjacentItems([...items], "middle")
		expect(prev).toEqual(Option.some({ id: "oldest" }))
		expect(next).toEqual(Option.some({ id: "newest" }))
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

describe("formatEstimatedTimeRange", () => {
	test("single value when min equals max", () => {
		expect(formatEstimatedTimeRange({ min: 45, max: 45 })).toBe("45m")
		expect(formatEstimatedTimeRange({ min: 60, max: 60 })).toBe("1h")
	})

	test("range with hour and minute parts", () => {
		expect(formatEstimatedTimeRange({ min: 30, max: 90 })).toBe("30m-1h 30m")
		expect(formatEstimatedTimeRange({ min: 120, max: 180 })).toBe("2h-3h")
	})
})

describe("formatEstimatedTimeMidpoint", () => {
	test("formats midpoint using same rules as range display", () => {
		expect(formatEstimatedTimeMidpoint({ min: 30, max: 60 })).toBe("45m")
		expect(formatEstimatedTimeMidpoint({ min: 60, max: 120 })).toBe("1h 30m")
	})
})

describe("compareByOptionalSome", () => {
	const compare = (a: number, b: number) => a - b

	test("compares values when both are Some", () => {
		expect(compareByOptionalSome(Option.some(1), Option.some(3), compare)).toBeLessThan(0)
		expect(compareByOptionalSome(Option.some(5), Option.some(2), compare)).toBeGreaterThan(0)
	})

	test("Some sorts before None", () => {
		expect(compareByOptionalSome(Option.some(1), Option.none(), compare)).toBe(-1)
		expect(compareByOptionalSome(Option.none(), Option.some(1), compare)).toBe(1)
	})

	test("returns 0 when both are None", () => {
		expect(compareByOptionalSome(Option.none(), Option.none(), compare)).toBe(0)
	})
})

describe("toPascalCase", () => {
	test("converts space, underscore, and hyphen separators", () => {
		expect(toPascalCase("hello world")).toBe("HelloWorld")
		expect(toPascalCase("hello_world")).toBe("HelloWorld")
		expect(toPascalCase("hello-world")).toBe("HelloWorld")
	})

	test("normalizes screaming snake case for generated type names", () => {
		expect(toPascalCase("MAIN_QUESTS")).toBe("MainQuests")
	})
})

describe("sortZombieTypes", () => {
	test("orders types Normal → Special → Elite → Boss", () => {
		expect(sortZombieTypes("Normal", "Boss")).toBeLessThan(0)
		expect(sortZombieTypes("Boss", "Normal")).toBeGreaterThan(0)
	})
})

describe("sortRelicTypes", () => {
	test("orders types Grim → Sinister → Wicked", () => {
		expect(sortRelicTypes("Grim", "Wicked")).toBeLessThan(0)
		expect(sortRelicTypes("Wicked", "Grim")).toBeGreaterThan(0)
	})
})

describe("sortZombieSpeeds", () => {
	test("orders speeds Slow → Medium → Fast", () => {
		expect(sortZombieSpeeds("Slow", "Fast")).toBeLessThan(0)
		expect(sortZombieSpeeds("Fast", "Slow")).toBeGreaterThan(0)
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
