import { cn } from "cn"
import { describe, expect, test } from "vitest"

describe("cn", () => {
	test("joins conditionals and resolves conflicting Tailwind classes", () => {
		const hidden = false
		expect(cn("px-2 py-1", hidden && "hidden", { "font-bold": true }, "px-4")).toBe(
			"py-1 font-bold px-4",
		)
	})

	test("keeps the later conflicting utility", () => {
		expect(cn("bg-red-500 text-sm", "bg-blue-500 text-lg")).toBe("bg-blue-500 text-lg")
	})
})
