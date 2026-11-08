import type { MapMarker } from "@/map-configs/markers"
import { it } from "@effect/vitest"
import { Arbitrary, Schema, Predicate, Option, Array as Arr } from "effect"
import { describe, expect } from "vitest"
import { buildShareableMapSearch, computeIsIncluded, uniqueMarkerIds } from "@/hooks/use-map-search"

const Id = Schema.String.check(Schema.isPattern(/^[a-z]{1,6}$/))

const idArb = Arbitrary.schema(Id)

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
	it.prop(
		"preserves inclusion, picks the shorter list, and copies a non-empty layer",
		[
			Arbitrary.schema(Schema.UniqueArray(Id).check(Schema.isMaxLength(6))).pipe(
				Arbitrary.flatMap(ids =>
					Arbitrary.all({
						ids: Arbitrary.Constant(ids),
						include: Arbitrary.array(Arbitrary.schema(Schema.Boolean), {
							minLength: ids.length,
							maxLength: ids.length,
						}).pipe(
							Arbitrary.map(selected => Arr.filter(ids, (_, index) => selected[index] === true)),
						),
						exclude: Arbitrary.array(Arbitrary.schema(Schema.Boolean), {
							minLength: ids.length,
							maxLength: ids.length,
						}).pipe(
							Arbitrary.map(selected => Arr.filter(ids, (_, index) => selected[index] === true)),
						),
						extraInclude: Arbitrary.array(idArb, { maxLength: 3 }),
						extraExclude: Arbitrary.array(idArb, { maxLength: 3 }),
						layer: Arbitrary.schema(Schema.UndefinedOr(Schema.Literals(["", "boss-fight-arena"]))),
					}),
				),
			),
		],
		([{ ids, include, exclude, extraInclude, extraExclude, layer }]) => {
			const markers = Arr.map(ids, marker)
			const includeList = [...include, ...extraInclude]
			const excludeList = [...exclude, ...extraExclude]
			const original = { include: includeList, exclude: excludeList, layer }
			const shared = buildShareableMapSearch(markers, original)
			const sharedInclude = shared.include ?? []
			const sharedExclude = shared.exclude ?? []
			const allIds = uniqueMarkerIds(markers)
			const visible = Arr.filter(allIds, id => computeIsIncluded(id, includeList, excludeList))
			const hidden = Arr.filter(allIds, id => !computeIsIncluded(id, includeList, excludeList))
			const showsNothing = allIds.length > 0 && visible.length === 0
			const listsOmitted = allIds.length === 0 || visible.length === 0 || hidden.length === 0
			const includeIsShorter = visible.length < hidden.length
			const expectedInclude = !listsOmitted && includeIsShorter ? visible : undefined
			const expectedExclude = !listsOmitted && !includeIsShorter ? hidden : undefined
			const expectedLayer = Predicate.isNotUndefined(layer) && layer !== "" ? layer : undefined

			expect(shared.include).toEqual(expectedInclude)
			expect(shared.exclude).toEqual(expectedExclude)
			expect(shared.layer).toBe(expectedLayer)

			const idsToCompare = showsNothing ? [] : allIds

			for (const id of idsToCompare) {
				expect(computeIsIncluded(id, sharedInclude, sharedExclude)).toBe(
					computeIsIncluded(id, includeList, excludeList),
				)
			}
		},
	)
})
