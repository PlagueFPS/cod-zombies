import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getAugmentByKey } from "@/data/augments"

describe("getAugmentByKey", () => {
	test("merges game variant", () => {
		const a = getAugmentByKey("double-jeopardy", "black-ops-7").pipe(Option.getOrThrow)
		expect(a.image).toBe("/augments/bo7/dead-first-major-augment-bo7.webp")
	})

	test("returns None when the augment does not exist", () => {
		// @ts-expect-error invalid key
		const a = getAugmentByKey("invalid-augment", "black-ops-7")
		expect(Option.isNone(a)).toBe(true)
	})

	test("returns Some when the augment exists", () => {
		const a = getAugmentByKey("double-jeopardy").pipe(Option.getOrThrow)
		expect(a.id).toBe("double-jeopardy")
	})
})
