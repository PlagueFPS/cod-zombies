import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import { getAdjacentMaps, getMaps, getMapsWithMainQuest, type MapKey } from "@/data/maps"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getMaps", () => {
	test("sorted by release date descending", () => {
		assertSortedDescByDate(getMaps().map(m => m.releaseDate))
	})
})

describe("getMapsWithMainQuest", () => {
	test("is subset of getMaps and every entry has a main quest path", () => {
		const allIds = new Set(getMaps().map(m => m.id))
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
		const { prev, next } = getAdjacentMaps(mid.id as MapKey)
		const idx = maps.findIndex(m => m.id === mid.id)
		expect(idx).toBeGreaterThanOrEqual(0)
		if (idx < maps.length - 1) {
			expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(maps[idx + 1]!.id))
		}
		if (idx > 0) {
			expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(maps[idx - 1]!.id))
		}
	})

	test("prev is Some and Next is None when the first map is provided", () => {
		const first = Arr.head(getMapsWithMainQuest()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentMaps(first.id as MapKey)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last map is provided", () => {
		const last = Arr.last(getMapsWithMainQuest()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentMaps(last.id as MapKey)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})
