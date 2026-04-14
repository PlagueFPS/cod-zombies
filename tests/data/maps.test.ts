import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import {
	getAdjacentMaps,
	getMaps,
	getMapsWithMainQuest,
	type MapEntry,
	type MapKey,
} from "@/data/maps"
import type { ContentState } from "@/types/data"
import { assertSortedDescByDate } from "@/tests/helpers"
import { resolveNewContentState } from "@/utils/content-state"

/** Minimal catalog-shaped fixture for `"New"` resolution (does not depend on real MAPS rows). */
const mapNewBadgeFixture = (
	releaseDate: string,
): Pick<MapEntry, "releaseDate" | "state"> => ({
	releaseDate,
	state: Option.some("New"),
})

const resolvedMapDisplayState = (
	fixture: Pick<MapEntry, "releaseDate" | "state">,
	isoUtcInstant: string,
) =>
	resolveNewContentState(fixture.state, fixture.releaseDate, Date.parse(isoUtcInstant))

describe("getMaps", () => {
	test("sorted by release date descending", () => {
		assertSortedDescByDate(getMaps().map(m => m.releaseDate))
	})

	test("same calendar day: later MAPS entries appear first (e.g. BO4 launch)", () => {
		const maps = getMaps()
		const indexOf = (id: string) => maps.findIndex(m => m.id === id)
		expect(indexOf("classified")).toBeLessThan(indexOf("voyage-of-despair"))
	})
})

describe("map New badge vs release date (fixtures)", () => {
	const fixture = mapNewBadgeFixture("2026-04-30")

	test("drops New when release date is 14+ full calendar days in the past", () => {
		expect(Option.getOrNull(resolvedMapDisplayState(fixture, "2026-05-15T12:00:00.000Z"))).toBeNull()
	})

	test("keeps New within 14 days of release date", () => {
		expect(Option.getOrNull(resolvedMapDisplayState(fixture, "2026-05-10T12:00:00.000Z"))).toBe(
			"New",
		)
	})

	test("keeps New through the last instant before the 14th full UTC day after release", () => {
		expect(Option.getOrNull(resolvedMapDisplayState(fixture, "2026-05-13T23:59:59.999Z"))).toBe(
			"New",
		)
	})

	test("drops New at the start of the 14th full UTC day after release", () => {
		expect(Option.getOrNull(resolvedMapDisplayState(fixture, "2026-05-14T00:00:00.000Z"))).toBeNull()
	})

	test("stored None stays None regardless of calendar age", () => {
		const noBadge: Pick<MapEntry, "releaseDate" | "state"> = {
			...fixture,
			state: Option.none<ContentState>(),
		}
		expect(Option.getOrNull(resolvedMapDisplayState(noBadge, "2026-05-10T12:00:00.000Z"))).toBeNull()
	})

	test('stored Coming Soon is preserved when stored state is Some("Coming Soon")', () => {
		const comingSoon = { ...fixture, state: Option.some("Coming Soon" as const) }
		expect(Option.getOrNull(resolvedMapDisplayState(comingSoon, "2026-05-15T12:00:00.000Z"))).toBe(
			"Coming Soon",
		)
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
