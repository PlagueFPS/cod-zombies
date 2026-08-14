import { Effect, Option } from "effect"
import { describe, expect, test } from "vitest"
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

describe("getInteractiveMapConfig", () => {
	test("resolves for every registered map that is not Coming Soon", async () => {
		for (const m of getInteractiveMaps()) {
			if (m.state.valueOrUndefined === "Coming Soon") continue
			const config = await Effect.runPromise(getInteractiveMapConfig(m.id as InteractiveMapKey))
			expect(Array.isArray(config.layers)).toBe(true)
		}
	})
})
