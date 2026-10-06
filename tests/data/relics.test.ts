import type { ContentState } from "@/types/data"
import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import {
	getAdjacentRelics,
	getRelicByKey,
	getRelics,
	RELIC_TYPES,
	relicTypeSearchParam,
	relicTypeSlug,
	type Relic,
} from "@/data/relics"
import { assertSortedDescByDate } from "@/tests/helpers"
import { resolveNewContentState } from "@/utils/content-state"
import { applyFilters, type FilterSpec } from "@/utils/filter-helpers"

/** Minimal catalog-shaped fixture for `"New"` resolution (does not depend on real RELICS rows). */
const relicNewBadgeFixture = (discoveredDate: string): Pick<Relic, "discoveredDate" | "state"> => ({
	discoveredDate,
	state: Option.some("New"),
})

const resolvedRelicDisplayState = (
	fixture: Pick<Relic, "discoveredDate" | "state">,
	isoUtcInstant: string,
) => resolveNewContentState(fixture.state, fixture.discoveredDate, Date.parse(isoUtcInstant))

describe("getRelics", () => {
	test("sorted by discovered date descending", () => {
		const dates = getRelics().map(r => r.discoveredDate)
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

describe("relic New badge vs discovery date (fixtures)", () => {
	const fixtureRecentWindow = relicNewBadgeFixture("2026-05-01")
	const fixtureYoungerWithinWindow = relicNewBadgeFixture("2026-05-09")

	test("drops New when the discovery date is 14+ full calendar days in the past", () => {
		expect(
			Option.getOrNull(resolvedRelicDisplayState(fixtureRecentWindow, "2026-05-15T12:00:00.000Z")),
		).toBeNull()
	})

	test("keeps New when within 14 days of the discovery date", () => {
		expect(
			Option.getOrNull(
				resolvedRelicDisplayState(fixtureYoungerWithinWindow, "2026-05-15T12:00:00.000Z"),
			),
		).toBe("New")
	})

	test("keeps New one week after discovery while still inside the window", () => {
		expect(
			Option.getOrNull(resolvedRelicDisplayState(fixtureRecentWindow, "2026-05-08T12:00:00.000Z")),
		).toBe("New")
	})

	test("keeps New through the last instant before the 14th full UTC day after discovery", () => {
		expect(
			Option.getOrNull(resolvedRelicDisplayState(fixtureRecentWindow, "2026-05-14T23:59:59.999Z")),
		).toBe("New")
	})

	test("drops New at the start of the 14th full UTC day after discovery", () => {
		expect(
			Option.getOrNull(resolvedRelicDisplayState(fixtureRecentWindow, "2026-05-15T00:00:00.000Z")),
		).toBeNull()
	})

	test("stored None stays None regardless of calendar age", () => {
		const noBadge: Pick<Relic, "discoveredDate" | "state"> = {
			...fixtureRecentWindow,
			state: Option.none<ContentState>(),
		}

		expect(
			Option.getOrNull(resolvedRelicDisplayState(noBadge, "2026-05-08T12:00:00.000Z")),
		).toBeNull()
	})

	test('stored Coming Soon is preserved when stored state is Some("Coming Soon")', () => {
		const comingSoon = { ...fixtureRecentWindow, state: Option.some("Coming Soon" as const) }
		expect(
			Option.getOrNull(resolvedRelicDisplayState(comingSoon, "2026-05-15T12:00:00.000Z")),
		).toBe("Coming Soon")
	})
})

describe("getAdjacentRelics", () => {
	test("matches getRelics order", () => {
		const relics = getRelics()
		const r1 = relics[Math.floor(relics.length / 2)]!
		const { prev, next } = getAdjacentRelics(r1.id)
		const idx = relics.findIndex(r => r.id === r1.id)
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

describe("relic type filter", () => {
	const relicTypeFilter = (slugs: readonly string[] | undefined): FilterSpec<Relic> => ({
		values: relicTypeSearchParam(slugs),
		match: (item, slug) => relicTypeSlug(item.type) === slug,
	})

	test("keeps special when the combobox selection is written to the type param", () => {
		expect(relicTypeSearchParam(["special"])).toEqual(["special"])
	})

	test("keeps grim, sinister, and wicked, including a combination with special", () => {
		expect(relicTypeSearchParam(["grim"])).toEqual(["grim"])
		expect(relicTypeSearchParam(["sinister"])).toEqual(["sinister"])
		expect(relicTypeSearchParam(["wicked"])).toEqual(["wicked"])
		expect(relicTypeSearchParam(["grim", "sinister", "wicked"])).toEqual([
			"grim",
			"sinister",
			"wicked",
		])
		expect(relicTypeSearchParam(["grim", "special"])).toEqual(["grim", "special"])
	})

	test("drops unknown slugs and omits an empty selection", () => {
		expect(relicTypeSearchParam(["not-a-type"])).toBeUndefined()
		expect(relicTypeSearchParam(["special", "not-a-type"])).toEqual(["special"])
		expect(relicTypeSearchParam([])).toBeUndefined()
		expect(relicTypeSearchParam(undefined)).toBeUndefined()
	})

	test("accepts a slug for every relic type", () => {
		for (const type of RELIC_TYPES) {
			const slug = relicTypeSlug(type)
			expect(relicTypeSearchParam([slug])).toEqual([slug])
		}
	})

	test("special lists Mister Peeks Mayhem", () => {
		const filtered = applyFilters(getRelics(), [relicTypeFilter(["special"])])
		expect(filtered.map(relic => relic.title)).toEqual(["Mister Peeks Mayhem"])
	})

	test("grim stays on grim relics when combined with special", () => {
		const filtered = applyFilters(getRelics(), [relicTypeFilter(["grim", "special"])])
		const types = [...new Set(filtered.map(relic => relic.type))]
		expect(types.sort()).toEqual(["Grim", "Special"])
		expect(filtered.some(relic => relic.title === "Mister Peeks Mayhem")).toBe(true)
		expect(filtered.some(relic => relic.title === "Lawyer's Pen")).toBe(true)
	})
})
