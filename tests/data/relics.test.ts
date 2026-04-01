import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getAdjacentRelics, getRelicByKey, getRelics, type RelicKey } from "@/data/relics"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getRelics", () => {
	test("sorted by discovered date descending", () => {
		assertSortedDescByDate(getRelics().map(r => r.discoveredDate))
	})
})

describe("getRelicByKey", () => {
	test("returns None when the relic does not exist", () => {
		// @ts-expect-error invalid key
		const r = getRelicByKey("invalid-relic")
		expect(Option.isNone(r)).toBe(true)
	})

	test("returns Some when the relic exists", () => {
		const r = getRelicByKey("lawyers-pen").pipe(Option.getOrThrow)
		expect(r.id).toBe("lawyers-pen")
	})
})

describe("getAdjacentRelics", () => {
	test("matches getRelics order", () => {
		const relics = getRelics()
		const r1 = relics[1]!
		const { prev, next } = getAdjacentRelics(r1.id as RelicKey)
		expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(relics[0]!.id))
		expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(relics[2]!.id))
	})
})
