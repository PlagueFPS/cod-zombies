import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getFateAndFortuneCardByKey } from "@/data/fate-and-fortune-cards"

describe("getFateAndFortuneCardByKey", () => {
	test("returns None when the card does not exist", () => {
		const card = getFateAndFortuneCardByKey("invalid-card")
		expect(Option.isNone(card)).toBe(true)
	})

	test("returns Some when the card exists", () => {
		const card = getFateAndFortuneCardByKey("five-second-muscle").pipe(Option.getOrThrow)
		expect(card.id).toBe("five-second-muscle")
	})
})
