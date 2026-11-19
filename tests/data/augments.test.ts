import { Option } from "effect"
import { describe, expect, test } from "vite-plus/test"
import { getAugmentByKey } from "@/data/augments"

describe("getAugmentByKey", () => {
	test("returns None when the augment does not exist", () => {
		const a = getAugmentByKey("invalid-augment", "black-ops-7")
		expect(Option.isNone(a)).toBe(true)
	})

	test("returns Some when the augment exists", () => {
		const a = getAugmentByKey("double-jeopardy").pipe(Option.getOrThrow)
		expect(a.id).toBe("double-jeopardy")
	})
})
