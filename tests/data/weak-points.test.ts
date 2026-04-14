import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getWeakPointByKey } from "@/data/weak-points"

describe("getWeakPointByKey", () => {
	test("returns None when the weak point does not exist", () => {
		// @ts-expect-error invalid key
		const weakPoint = getWeakPointByKey("invalid-weak-point")
		expect(Option.isNone(weakPoint)).toBe(true)
	})

	test("returns Some when the weak point exists", () => {
		const weakPoint = getWeakPointByKey("head").pipe(Option.getOrThrow)
		expect(weakPoint.id).toBe("head")
	})
})
