import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import {
	compareMapReleaseDescending,
	getAdjacentMaps,
	getMaps,
	getMapsWithMainQuest,
} from "@/data/maps"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("compareMapReleaseDescending", () => {
	test("orders by release date descending when dates differ", () => {
		expect(
			compareMapReleaseDescending(
				{ id: "nacht-der-untoten", releaseDate: "2008-11-11" },
				{ id: "totenreich", releaseDate: "2026-04-30" },
			),
		).toBeGreaterThan(0)
	})

	test("same calendar day: later MAPS insertion index sorts first", () => {
		expect(
			compareMapReleaseDescending(
				{ id: "classified", releaseDate: "2018-10-12" },
				{ id: "voyage-of-despair", releaseDate: "2018-10-12" },
			),
		).toBeLessThan(0)
	})
})

describe("getMaps", () => {
	test("sorted by release date descending", () => {
		const dates = Arr.map(getMaps(), m => m.releaseDate)
		expect(dates.length).toBeGreaterThan(1)
		assertSortedDescByDate(dates)
	})

	test("same calendar day: later MAPS entries appear first (e.g. BO4 launch)", () => {
		const maps = getMaps()

		const indexOf = (id: string) =>
			Option.getOrElse(
				Arr.findFirstIndex(maps, m => m.id === id),
				() => -1,
			)

		expect(indexOf("classified")).toBeLessThan(indexOf("voyage-of-despair"))
	})
})

describe("getMapsWithMainQuest", () => {
	test("is subset of getMaps and every entry has a main quest path", () => {
		const allIds = new Set(Arr.map(getMaps(), m => m.id))
		const withMq = getMapsWithMainQuest()
		expect(withMq.length).toBeGreaterThan(0)

		for (const m of withMq) {
			expect(allIds.has(m.id)).toBe(true)
			expect(Option.isSome(m.mainQuest)).toBe(true)
		}
	})
})

describe("getAdjacentMaps", () => {
	test("matches ordering of getMapsWithMainQuest", () => {
		const maps = getMapsWithMainQuest()
		const mid = maps[Math.floor(maps.length / 2)]!
		const { prev, next } = getAdjacentMaps(mid.id)

		const idx = Option.getOrElse(
			Arr.findFirstIndex(maps, m => m.id === mid.id),
			() => -1,
		)

		expect(idx).toBeGreaterThanOrEqual(0)

		const expectedPrev =
			idx < maps.length - 1 ? Option.some(maps[idx + 1]!.id) : Option.none<string>()

		const expectedNext = idx > 0 ? Option.some(maps[idx - 1]!.id) : Option.none<string>()
		expect(prev.pipe(Option.map(p => p.id))).toEqual(expectedPrev)
		expect(next.pipe(Option.map(n => n.id))).toEqual(expectedNext)
	})

	test("prev is Some and Next is None when the first map is provided", () => {
		const first = Arr.head(getMapsWithMainQuest()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentMaps(first.id)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last map is provided", () => {
		const last = Arr.last(getMapsWithMainQuest()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentMaps(last.id)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})
