import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import { getAdjacentRelics, getRelicByKey, getRelics, type Relic, type RelicKey } from "@/data/relics"
import type { ContentState } from "@/types/data"
import { assertSortedDescByDate } from "@/tests/helpers"
import { resolveNewContentState } from "@/utils/content-state"

/** Minimal catalog-shaped fixture for `"New"` resolution (does not depend on real RELICS rows). */
const relicNewBadgeFixture = (
	discoveredDate: string,
): Pick<Relic, "discoveredDate" | "state"> => ({
	discoveredDate,
	state: Option.some("New"),
})

const resolvedRelicDisplayState = (
	fixture: Pick<Relic, "discoveredDate" | "state">,
	isoUtcInstant: string,
) =>
	resolveNewContentState(fixture.state, fixture.discoveredDate, Date.parse(isoUtcInstant))

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
