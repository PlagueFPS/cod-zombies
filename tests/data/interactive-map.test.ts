import { Effect, Option } from "effect"
import { describe, expect, test, vi } from "vitest"
import {
	getInteractiveMapByKey,
	getInteractiveMapConfig,
	getInteractiveMaps,
	type InteractiveMapKey,
} from "@/data/interactive-map"
import { getMapByKey, type MapKey } from "@/data/maps"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getInteractiveMaps", () => {
	test("sorted by release date descending", () => {
		assertSortedDescByDate(
			getInteractiveMaps().map(
				m => getMapByKey(m.id as MapKey).pipe(Option.getOrThrow).releaseDate,
			),
		)
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

describe("interactive map New badge vs backing map release date", () => {
	test("drops New after 14+ days from map release", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-15T12:00:00.000Z"))
		const m = getInteractiveMapByKey("totenreich").pipe(Option.getOrThrow)
		expect(Option.getOrNull(m.state)).toBeNull()
		vi.useRealTimers()
	})

	test("keeps New within 14 days of map release", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-10T12:00:00.000Z"))
		const m = getInteractiveMapByKey("totenreich").pipe(Option.getOrThrow)
		expect(Option.getOrNull(m.state)).toBe("New")
		vi.useRealTimers()
	})
})

describe("getInteractiveMapConfig", () => {
	test("resolves for every registered map id", async () => {
		for (const m of getInteractiveMaps()) {
			const config = await Effect.runPromise(getInteractiveMapConfig(m.id as InteractiveMapKey))
			expect(Array.isArray(config.layers)).toBe(true)
		}
	})
})
