import type { ContentState } from "@/types/data"
import { Effect, Option } from "effect"
import { describe, expect, test, vi } from "vitest"
import {
	getInteractiveMapByKey,
	getInteractiveMapConfig,
	getInteractiveMaps,
	type InteractiveMap,
	type InteractiveMapKey,
} from "@/data/interactive-map"
import { getMapByKey, type MapKey } from "@/data/maps"
import { assertSortedDescByDate } from "@/tests/helpers"
import { resolveNewContentState } from "@/utils/content-state"

/** Minimal catalog-shaped fixture for `"New"` resolution (does not depend on real INTERACTIVE_MAPS rows). */
const interactiveMapNewBadgeFixture = (
	publishedDate: string,
): Pick<InteractiveMap, "publishedDate" | "state"> => ({
	publishedDate,
	state: Option.some("New"),
})

const resolvedInteractiveMapDisplayState = (
	fixture: Pick<InteractiveMap, "publishedDate" | "state">,
	isoUtcInstant: string,
) => resolveNewContentState(fixture.state, fixture.publishedDate, Date.parse(isoUtcInstant))

describe("getInteractiveMaps", () => {
	test("sorted by release date descending", () => {
		const dates = getInteractiveMaps().map(
			m => getMapByKey(m.id as MapKey).pipe(Option.getOrThrow).releaseDate,
		)
		expect(dates.length).toBeGreaterThan(1)
		assertSortedDescByDate(dates)
	})
})

describe("getInteractiveMapByKey", () => {
	test("returns None when the interactive map does not exist", () => {
		// @ts-expect-error invalid key
		const m = getInteractiveMapByKey("invalid-interactive-map")
		expect(Option.isNone(m)).toBe(true)
	})

	test("returns Some when the interactive map exists", () => {
		const m = getInteractiveMapByKey("paradox-junction").pipe(Option.getOrThrow)
		expect(m.id).toBe("paradox-junction")
	})
})

describe("interactive map New badge vs published date (fixtures)", () => {
	const fixture = interactiveMapNewBadgeFixture("2026-08-30")

	test("drops New when published date is 14+ full calendar days in the past", () => {
		expect(
			Option.getOrNull(resolvedInteractiveMapDisplayState(fixture, "2026-09-14T12:00:00.000Z")),
		).toBeNull()
	})

	test("keeps New within 14 days of published date", () => {
		expect(
			Option.getOrNull(resolvedInteractiveMapDisplayState(fixture, "2026-09-08T12:00:00.000Z")),
		).toBe("New")
	})

	test("keeps New through the last instant before the 14th full UTC day after publish", () => {
		expect(
			Option.getOrNull(resolvedInteractiveMapDisplayState(fixture, "2026-09-12T23:59:59.999Z")),
		).toBe("New")
	})

	test("drops New at the start of the 14th full UTC day after publish", () => {
		expect(
			Option.getOrNull(resolvedInteractiveMapDisplayState(fixture, "2026-09-13T00:00:00.000Z")),
		).toBeNull()
	})

	test("stored None stays None regardless of calendar age", () => {
		const noBadge: Pick<InteractiveMap, "publishedDate" | "state"> = {
			...fixture,
			state: Option.none<ContentState>(),
		}
		expect(
			Option.getOrNull(resolvedInteractiveMapDisplayState(noBadge, "2026-09-08T12:00:00.000Z")),
		).toBeNull()
	})

	test('stored Coming Soon is preserved when stored state is Some("Coming Soon")', () => {
		const comingSoon = { ...fixture, state: Option.some("Coming Soon" as const) }
		expect(
			Option.getOrNull(resolvedInteractiveMapDisplayState(comingSoon, "2026-09-14T12:00:00.000Z")),
		).toBe("Coming Soon")
	})
})

describe("getInteractiveMapByKey applies publishedDate New window", () => {
	test("keeps stored New inside the 14-day window", () => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-09-08T12:00:00.000Z"))
		const map = getInteractiveMapByKey("rex-infernus").pipe(Option.getOrThrow)
		expect(Option.getOrNull(map.state)).toBe("New")
		vi.useRealTimers()
	})

	test("clears stored New after the 14-day window", () => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-09-14T12:00:00.000Z"))
		const map = getInteractiveMapByKey("rex-infernus").pipe(Option.getOrThrow)
		expect(Option.getOrNull(map.state)).toBeNull()
		vi.useRealTimers()
	})
})

describe("getInteractiveMapConfig", () => {
	test("resolves for every registered map that is not Coming Soon", async () => {
		for (const m of getInteractiveMaps()) {
			if (m.state.valueOrUndefined === "Coming Soon") continue
			const config = await Effect.runPromise(getInteractiveMapConfig(m.id as InteractiveMapKey))
			expect(Array.isArray(config.layers)).toBe(true)
		}
	})
})
