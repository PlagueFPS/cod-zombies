import { Exit } from "effect"
import { describe, expect, test } from "vitest"
import { expectExitSuccess } from "@/tests/helpers"
import {
	decodeBestiarySearchParams,
	decodeInteractiveMapSearchParams,
	decodeMainQuestSearchParams,
} from "@/utils/validation-schemas"

describe("search param validation schemas", () => {
	test("coerces multi-value params and omits defaults", () => {
		const bestiary = decodeBestiarySearchParams({
			game: "black-ops-6",
			map: ["terminus", "reckoning"],
		})

		const bestiaryValue = expectExitSuccess(bestiary)
		expect(bestiaryValue.game).toEqual(["black-ops-6"])
		expect(bestiaryValue.map).toEqual(["terminus", "reckoning"])
		expect(bestiaryValue.type).toEqual([])
	})

	test("rejects invalid pages while accepting known search shape", () => {
		expect(Exit.isFailure(decodeMainQuestSearchParams({ page: 0 }))).toBe(true)
		expect(
			Exit.isSuccess(
				decodeMainQuestSearchParams({
					page: 2,
					sort: "latest",
					game: ["black-ops-7"],
					time: [],
					difficulty: "Medium",
				}),
			),
		).toBe(true)
	})

	test("decodes interactive map include, exclude, and layer search params", () => {
		const search = decodeInteractiveMapSearchParams({
			include: "perk",
			exclude: ["label"],
			layer: "boss-fight-arena",
		})

		const searchValue = expectExitSuccess(search)
		expect(searchValue).toEqual({
			include: ["perk"],
			exclude: ["label"],
			layer: "boss-fight-arena",
		})
	})
})
