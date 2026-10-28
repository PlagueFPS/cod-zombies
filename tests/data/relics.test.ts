import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import {
	compareRelicReleaseDescending,
	getAdjacentRelics,
	getRelicByKey,
	getRelics,
} from "@/data/relics"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getRelics", () => {
	test("sorted by discovered date descending", () => {
		const dates = Arr.map(getRelics(), r => r.discoveredDate)
		expect(dates.length).toBeGreaterThan(1)
		assertSortedDescByDate(dates)
	})
})

describe("getRelicByKey", () => {
	test("returns None when the relic does not exist", () => {
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
		const { prev, next } = getAdjacentRelics(r1.id)

		const idx = Option.getOrElse(
			Arr.findFirstIndex(relics, r => r.id === r1.id),
			() => -1,
		)

		expect(idx).toBeGreaterThanOrEqual(0)

		const expectedPrev =
			idx < relics.length - 1 ? Option.some(relics[idx + 1]!.id) : Option.none<string>()

		const expectedNext = idx > 0 ? Option.some(relics[idx - 1]!.id) : Option.none<string>()
		expect(prev.pipe(Option.map(n => n.id))).toEqual(expectedPrev)
		expect(next.pipe(Option.map(p => p.id))).toEqual(expectedNext)
	})

	test("prev is Some and Next is None when the first relic is provided", () => {
		const first = Arr.head(getRelics()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentRelics(first.id)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last relic is provided", () => {
		const last = Arr.last(getRelics()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentRelics(last.id)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})

test("compareRelicReleaseDescending returns None for missing tie-break indexes", () => {
	expect(
		compareRelicReleaseDescending(
			{ id: "unknown-a", discoveredDate: "2026-01-01" },
			{ id: "unknown-b", discoveredDate: "2026-01-01" },
		),
	).toEqual(Option.none())
})
