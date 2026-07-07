import { describe, expect, test } from "vitest"
import {
	applyFilters,
	applySort,
	paginate,
	type FilterSpec,
	type SortSpec,
} from "@/utils/filter-helpers"

type Item = {
	id: string
	color: string
	shape: string
	score: number
}

const items: Item[] = [
	{ id: "red-circle-low", color: "red", shape: "circle", score: 1 },
	{ id: "red-square-mid", color: "red", shape: "square", score: 2 },
	{ id: "blue-circle-high", color: "blue", shape: "circle", score: 3 },
	{ id: "green-square-top", color: "green", shape: "square", score: 4 },
]

describe("applyFilters", () => {
	test("applies AND across specs and OR within each spec", () => {
		const specs: FilterSpec<Item>[] = [
			{
				values: ["red", "blue"],
				match: (item, value) => item.color === value,
			},
			{
				values: ["circle"],
				match: (item, value) => item.shape === value,
			},
		]

		expect(applyFilters(items, specs).map(item => item.id)).toEqual([
			"red-circle-low",
			"blue-circle-high",
		])
	})

	test("ignores empty and undefined filter values", () => {
		const specs: FilterSpec<Item>[] = [
			{ values: [], match: (item, value) => item.color === value },
			{ values: undefined, match: (item, value) => item.shape === value },
		]

		expect(applyFilters(items, specs)).toEqual(items)
	})
})

describe("applySort", () => {
	const specs: SortSpec<Item>[] = [
		{ key: "score-asc", compare: (a, b) => a.score - b.score },
		{ key: "score-desc", compare: (a, b) => b.score - a.score },
	]

	test("uses the requested sort without mutating input", () => {
		const result = applySort(items, "score-desc", specs, "score-asc")

		expect(result.map(item => item.id)).toEqual([
			"green-square-top",
			"blue-circle-high",
			"red-square-mid",
			"red-circle-low",
		])
		expect(items.map(item => item.id)).toEqual([
			"red-circle-low",
			"red-square-mid",
			"blue-circle-high",
			"green-square-top",
		])
	})

	test("falls back to the default sort for unknown sort keys", () => {
		expect(applySort(items, "unknown", specs, "score-asc").map(item => item.id)).toEqual([
			"red-circle-low",
			"red-square-mid",
			"blue-circle-high",
			"green-square-top",
		])
	})
})

describe("paginate", () => {
	test("clamps invalid pages and preserves totals", () => {
		expect(paginate(items, 0, 2)).toMatchObject({
			items: items.slice(0, 2),
			page: 1,
			pageSize: 2,
			totalCount: 4,
			totalPages: 2,
		})

		expect(paginate(items, 99, 2)).toMatchObject({
			items: items.slice(2, 4),
			page: 2,
			pageSize: 2,
			totalCount: 4,
			totalPages: 2,
		})
	})

	test("keeps an empty collection on page one", () => {
		expect(paginate([], 4, 12)).toEqual({
			items: [],
			page: 1,
			pageSize: 12,
			totalCount: 0,
			totalPages: 1,
		})
	})
})
