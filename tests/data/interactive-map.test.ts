import { Effect, Option, Array as Arr } from "effect"
import { afterEach, describe, expect, test, vi } from "vitest"
import {
	getInteractiveMapByKey,
	getInteractiveMapConfig,
	getInteractiveMaps,
} from "@/data/interactive-map"
import { getMapByKey } from "@/data/maps"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getInteractiveMaps", () => {
	test("sorted by release date descending", () => {
		const dates = Arr.map(
			getInteractiveMaps(),
			m => getMapByKey(m.id).pipe(Option.getOrThrow).releaseDate,
		)

		expect(dates.length).toBeGreaterThan(1)
		assertSortedDescByDate(dates)
	})
})

describe("getInteractiveMapByKey", () => {
	test("returns None when the interactive map does not exist", () => {
		const m = getInteractiveMapByKey("invalid-interactive-map")
		expect(Option.isNone(m)).toBe(true)
	})

	test("returns Some when the interactive map exists", () => {
		const m = getInteractiveMapByKey("paradox-junction").pipe(Option.getOrThrow)
		expect(m.id).toBe("paradox-junction")
	})
})

describe("getInteractiveMapByKey applies publishedDate New window", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	test("stored None stays None even when publishedDate is inside the 14-day window", () => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-09-08T12:00:00.000Z"))
		const map = getInteractiveMapByKey("rex-infernus").pipe(Option.getOrThrow)
		expect(map.publishedDate).toBe("2026-08-30")
		expect(Option.getOrNull(map.state)).toBeNull()
	})
})

describe("getInteractiveMapConfig", () => {
	test("resolves for every registered map that is not Coming Soon", async () => {
		for (const m of getInteractiveMaps()) {
			if (m.state.valueOrUndefined === "Coming Soon") continue
			const config = await Effect.runPromise(getInteractiveMapConfig(m.id))
			expect(Arr.isArray(config.layers)).toBe(true)
		}
	})
})
