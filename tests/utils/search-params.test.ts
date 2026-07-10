import { stringifySearchWith } from "@tanstack/react-router"
import { describe, expect, test } from "vitest"
import { getMapsWithMainQuest, type MapEntry } from "@/data/maps"
import { expectExitSuccess } from "@/tests/helpers"
import { applyFilters, type FilterSpec } from "@/utils/filter-helpers"
import { normalizeParsedSearch, parseSearch } from "@/utils/search-params"
import { decodeMainQuestSearchParams } from "@/utils/validation-schemas"

const baseStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse)

function pruneEmptySearch(search: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {}
	for (const key in search) {
		const value = search[key]
		if (value === undefined || value === null) continue
		if (Array.isArray(value) && value.length === 0) continue
		out[key] = value
	}
	return out
}

const stringifySearch = (search: Record<string, unknown>) =>
	baseStringifySearch(pruneEmptySearch(search))

describe("parseSearch", () => {
	test("decodes repeated query keys into string arrays", () => {
		expect(parseSearch("game=black-ops-1&game=black-ops-2")).toEqual({
			game: ["black-ops-1", "black-ops-2"],
		})
	})

	test("decodes json-encoded multi-value params", () => {
		expect(parseSearch("game=%5B%22black-ops-1%22%2C%22black-ops-2%22%5D")).toEqual({
			game: ["black-ops-1", "black-ops-2"],
		})
	})

	test("coerces single plain values to arrays through validation", () => {
		const parsed = parseSearch("game=black-ops-1")
		const validated = expectExitSuccess(decodeMainQuestSearchParams(parsed))
		expect(validated.game).toEqual(["black-ops-1"])
	})

	test("coerces repeated numeric-looking values to strings", () => {
		expect(parseSearch("game=0&game=1")).toEqual({
			game: ["0", "1"],
		})
	})

	test("round-trips repeated keys through stringifySearch", () => {
		const parsed = parseSearch("game=black-ops-1&game=black-ops-2&sort=oldest")
		const searchStr = stringifySearch(parsed)
		const reparsed = parseSearch(searchStr.replace(/^\?/, ""))

		expect(reparsed).toEqual({
			game: ["black-ops-1", "black-ops-2"],
			sort: "oldest",
		})
	})
})

describe("normalizeParsedSearch", () => {
	test("normalizes repeated keys that were coerced to numbers", () => {
		expect(
			normalizeParsedSearch({
				game: [0, 1],
			}),
		).toEqual({
			game: ["0", "1"],
		})
	})
})

describe("main quest filter integration", () => {
	test("filters maps from both games when using repeated query keys", () => {
		const parsed = parseSearch("game=black-ops-1&game=black-ops-2")
		const validated = expectExitSuccess(decodeMainQuestSearchParams(parsed))

		const filterSpecs: FilterSpec<MapEntry>[] = [
			{
				values: validated.game,
				match: (item, id) => item.game === id,
			},
		]

		const filtered = applyFilters(getMapsWithMainQuest(), filterSpecs)
		const games = [...new Set(filtered.map(item => item.game))]

		expect(games).toContain("black-ops-1")
		expect(games).toContain("black-ops-2")
		expect(filtered).toHaveLength(9)
	})
})
