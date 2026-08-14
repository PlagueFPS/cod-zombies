import { describe, expect, test } from "vitest"
import { isDisabledCustomLink } from "@/components/custom-link"

describe("isDisabledCustomLink", () => {
	test("should be false when neither disabled nor aria-disabled is set", () => {
		expect(isDisabledCustomLink(undefined, undefined)).toBe(false)
		expect(isDisabledCustomLink(false, false)).toBe(false)
		expect(isDisabledCustomLink(false, "false")).toBe(false)
	})

	test("should be true when disabled is true", () => {
		expect(isDisabledCustomLink(true, undefined)).toBe(true)
	})

	test("should be true when aria-disabled is true so Coming Soon cards omit href", () => {
		expect(isDisabledCustomLink(undefined, true)).toBe(true)
		expect(isDisabledCustomLink(undefined, "true")).toBe(true)
	})
})
