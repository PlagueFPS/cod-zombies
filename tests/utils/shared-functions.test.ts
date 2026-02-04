import { describe, expect, test } from "vitest"
import {
	capitalize,
	getYouTubeVideoId,
	slugify,
	sortReleaseDateDesc,
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

describe("sortReleaseDateDesc", () => {
	test("should return a positive number if first date is older than second", () => {
		expect(sortReleaseDateDesc("2020-01-01", "2020-01-02")).toBeGreaterThan(0)
	})
	test("should return a negative number if first date is newer than second", () => {
		expect(sortReleaseDateDesc("2020-01-02", "2020-01-01")).toBeLessThan(0)
	})
	test("should return 0 if dates are equal", () => {
		expect(sortReleaseDateDesc("2020-01-01", "2020-01-01")).toBe(0)
	})
})
