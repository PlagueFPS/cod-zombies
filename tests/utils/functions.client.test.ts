import { describe, expect, it } from "vitest"
import { slugify } from "../../utils/functions.client"

describe("slugify", () => {
	it("should convert basic text to slug", () => {
		expect(slugify("Hello World")).toBe("hello-world")
	})

	it("should handle special characters", () => {
		expect(slugify("What's New? (2023)")).toBe("whats-new-2023")
	})

	it("should handle ampersands", () => {
		expect(slugify("Tom & Jerry")).toBe("tom-and-jerry")
	})

	it("should handle multiple spaces and special chars", () => {
		expect(slugify("  Hello   World!  ")).toBe("hello-world")
	})

	it("should handle quotes and double quotes", () => {
		expect(slugify("\"Quote\" and 'single quote'")).toBe("quote-and-single-quote")
	})

	it("should handle periods and question marks", () => {
		expect(slugify("What is this? It's a test.")).toBe("what-is-this-its-a-test")
	})

	it("should handle parentheses", () => {
		expect(slugify("Function (example)")).toBe("function-example")
	})

	it("should handle multiple consecutive special chars", () => {
		expect(slugify("Hello!!! World??? (Test) S.A.M. + A.D.A.M. Unit")).toBe(
			"hello-world-test-sam-adam-unit",
		)
	})

	it("should handle markdown headings", () => {
		expect(slugify("## Heading")).toBe("heading")
		expect(slugify("### Sub Heading")).toBe("sub-heading")
		expect(slugify("#### Sub Sub Heading")).toBe("sub-sub-heading")
	})
})
