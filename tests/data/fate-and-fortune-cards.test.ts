import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getFateAndFortuneCardByKey, getFateAndFortuneCards } from "@/data/fate-and-fortune-cards"

describe("getFateAndFortuneCardByKey", () => {
	test("returns None when the card does not exist", () => {
		const card = getFateAndFortuneCardByKey("invalid-card")
		expect(Option.isNone(card)).toBe(true)
	})

	test("returns Some when the card exists", () => {
		const card = getFateAndFortuneCardByKey("five-second-muscle").pipe(Option.getOrThrow)
		expect(card.id).toBe("five-second-muscle")
	})

	test("returns no rarity for Fate cards", () => {
		const card = getFateAndFortuneCardByKey("nade-party").pipe(Option.getOrThrow)
		expect(card.type).toBe("Fate")
		expect(Option.isNone(card.rarity)).toBe(true)
	})

	test("returns the Fortune card rarity", () => {
		const card = getFateAndFortuneCardByKey("explosive-touch").pipe(Option.getOrThrow)
		expect(card.type).toBe("Fortune")
		expect(card.rarity).toEqual(Option.some("Legendary"))
	})
})

describe("getFateAndFortuneCards", () => {
	test("returns every registered card", () => {
		const cards = getFateAndFortuneCards()
		expect(cards).toHaveLength(8)
		expect(cards.map(card => card.id)).toEqual([
			"five-second-muscle",
			"best-for-last",
			"nade-party",
			"scoped-dollars",
			"perk-insured",
			"raining-bullets",
			"explosive-touch",
			"all-the-ammos",
		])
	})
})
