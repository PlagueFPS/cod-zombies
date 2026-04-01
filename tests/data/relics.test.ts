import { Option, Array as Arr } from "effect"
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
		const r1 = relics[Math.floor(relics.length / 2)]!
		const { prev, next } = getAdjacentRelics(r1.id as RelicKey)
		const idx = relics.findIndex(r => r.id === r1.id)
		expect(idx).toBeGreaterThanOrEqual(0)
		if (idx < relics.length - 1) {
			expect(prev.pipe(Option.map(n => n.id))).toEqual(Option.some(relics[idx + 1]!.id))
		}
		if (idx > 0) {
			expect(next.pipe(Option.map(p => p.id))).toEqual(Option.some(relics[idx - 1]!.id))
		}
	})

	test("prev is Some and Next is None when the first relic is provided", () => {
		const first = Arr.head(getRelics()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentRelics(first.id as RelicKey)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last relic is provided", () => {
		const last = Arr.last(getRelics()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentRelics(last.id as RelicKey)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})
