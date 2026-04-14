import type { MapMarker } from "@/map-configs/markers"
import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { buildShareableMapSearch, computeIsIncluded, uniqueMarkerIds } from "@/hooks/use-map-search"

const marker = (id: string, type?: MapMarker["type"]): MapMarker => ({
	id,
	title: id,
	description: "",
	type,
	category: "general",
	icon: Option.none(),
	locations: [{ x: 0, y: 0 }],
})

const markers = [
	marker("spawn", "label"),
	marker("village", "label"),
	marker("juggernog", "perk"),
	marker("mystery-box", "mystery-box"),
]

describe("map search helpers", () => {
	test("deduplicates marker types before ids", () => {
		expect(uniqueMarkerIds(markers)).toEqual(["label", "perk", "mystery-box"])
	})

	test("computes marker visibility from include and exclude lists", () => {
		expect(computeIsIncluded("perk", [], [])).toBe(true)
		expect(computeIsIncluded("perk", ["perk"], [])).toBe(true)
		expect(computeIsIncluded("perk", ["label"], [])).toBe(false)
		expect(computeIsIncluded("perk", ["perk"], ["perk"])).toBe(false)
	})

	test("builds the shortest shareable search using include for smaller visible sets", () => {
		expect(
			buildShareableMapSearch(markers, {
				include: ["perk"],
				exclude: [],
				layer: "boss-fight-arena",
			}),
		).toEqual({
			include: ["perk"],
			exclude: undefined,
			layer: "boss-fight-arena",
		})
	})

	test("builds the shortest shareable search using exclude for smaller hidden sets", () => {
		expect(
			buildShareableMapSearch(markers, {
				include: [],
				exclude: ["label"],
			}),
		).toEqual({
			include: undefined,
			exclude: ["label"],
		})
	})

	test("omits include and exclude when all or no markers are visible", () => {
		expect(buildShareableMapSearch(markers, { include: [], exclude: [] })).toEqual({
			include: undefined,
			exclude: undefined,
		})
		expect(
			buildShareableMapSearch(markers, { include: [], exclude: ["label", "perk", "mystery-box"] }),
		).toEqual({
			include: undefined,
			exclude: undefined,
		})
	})
})
