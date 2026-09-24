import type { MapMarker } from "@/map-configs/markers"
import { Option } from "effect"
import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { buildShareableMapSearch, computeIsIncluded, uniqueMarkerIds } from "@/hooks/use-map-search"

const idArb = fc.string({
	unit: fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz".split("")),
	minLength: 1,
	maxLength: 6,
})

function marker(id: string): MapMarker {
	return {
		id,
		title: id,
		description: "",
		category: "general",
		icon: Option.none(),
		locations: [{ x: 0, y: 0 }],
	}
}

describe("buildShareableMapSearch properties", () => {
	test("preserves inclusion, picks the shorter list, and copies a non-empty layer", () => {
		fc.assert(
			fc.property(
				fc.uniqueArray(idArb, { minLength: 0, maxLength: 6 }).chain(ids =>
					fc.record({
						ids: fc.constant(ids),
						include: fc.subarray(ids),
						exclude: fc.subarray(ids),
						extraInclude: fc.array(idArb, { maxLength: 3 }),
						extraExclude: fc.array(idArb, { maxLength: 3 }),
						layer: fc.constantFrom<string | undefined>(undefined, "", "boss-fight-arena"),
					}),
				),
				({ ids, include, exclude, extraInclude, extraExclude, layer }) => {
					const markers = ids.map(marker)
					const includeList = [...include, ...extraInclude]
					const excludeList = [...exclude, ...extraExclude]
					const original = { include: includeList, exclude: excludeList, layer }
					const shared = buildShareableMapSearch(markers, original)
					const sharedInclude = shared.include ?? []
					const sharedExclude = shared.exclude ?? []
					const allIds = uniqueMarkerIds(markers)
					const visible = allIds.filter(id => computeIsIncluded(id, includeList, excludeList))
					const hidden = allIds.filter(id => !computeIsIncluded(id, includeList, excludeList))
					const showsNothing = allIds.length > 0 && visible.length === 0

					// Hiding every marker intentionally drops both lists (same URL as show-all).
					// Inclusion still round-trips for show-all and for every partial subset.
					if (!showsNothing) {
						for (const id of allIds) {
							expect(computeIsIncluded(id, sharedInclude, sharedExclude)).toBe(
								computeIsIncluded(id, includeList, excludeList),
							)
						}
					}

					if (allIds.length === 0 || visible.length === 0 || hidden.length === 0) {
						expect(shared.include).toBeUndefined()
						expect(shared.exclude).toBeUndefined()
					} else if (visible.length < hidden.length) {
						expect(shared.include).toEqual(visible)
						expect(shared.exclude).toBeUndefined()
					} else {
						expect(shared.include).toBeUndefined()
						expect(shared.exclude).toEqual(hidden)
					}

					if (layer !== undefined && layer !== "") {
						expect(shared.layer).toBe(layer)
					} else {
						expect(shared.layer).toBeUndefined()
					}
				},
			),
		)
	})
})
