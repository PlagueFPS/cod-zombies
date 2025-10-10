import { describe, expect, test } from "bun:test"
import { slugify } from "../../utils/functions.client"

describe("slugify", () => {
	test("convert basic text to slug", () => {
		expect(slugify("Hello World")).toBe("hello-world")
	})

	test("handle special characters", () => {
		expect(slugify("What's New? (2023): Everything")).toBe("whats-new-2023-everything")
	})

	test("handle ampersands", () => {
		expect(slugify("Tom & Jerry")).toBe("tom-and-jerry")
	})

	test("handle multiple spaces and special chars", () => {
		expect(slugify("  Hello   World!  ")).toBe("hello-world")
	})

	test("handle quotes and double quotes", () => {
		expect(slugify("\"Quote\" and 'single quote'")).toBe("quote-and-single-quote")
	})

	test("handle periods and question marks", () => {
		expect(slugify("What is this? It's a test.")).toBe("what-is-this-its-a-test")
	})

	test("handle parentheses", () => {
		expect(slugify("Function (example)")).toBe("function-example")
	})

	test("handle multiple consecutive special chars", () => {
		expect(slugify("Hello!!! World??? (Test) S.A.M. + A.D.A.M. Unit")).toBe(
			"hello-world-test-sam-adam-unit",
		)
	})

	test("handle markdown headings", () => {
		expect(slugify("## Heading")).toBe("heading")
		expect(slugify("### Sub Heading")).toBe("sub-heading")
		expect(slugify("#### Sub Sub Heading")).toBe("sub-sub-heading")
	})
})
