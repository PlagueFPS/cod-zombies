import { Option } from "effect"
import { describe, expect, test } from "vitest"
import {
	getMapsWithMainQuest,
	mainQuestDifficultySearchParam,
	mainQuestDifficultySlug,
} from "@/data/maps"

describe("mainQuestDifficultySearchParam", () => {
	test("selecting Very Hard yields difficulty=[very-hard] and the filtered quests", () => {
		const selected = mainQuestDifficultySlug("Very Hard")
		const difficulty = mainQuestDifficultySearchParam([selected])

		expect(difficulty).toEqual(["very-hard"])

		const titles = getMapsWithMainQuest().flatMap(map => {
			if (Option.isNone(map.difficulty)) return []

			const slug = mainQuestDifficultySlug(map.difficulty.value)

			return difficulty?.includes(slug) ? [map.title] : []
		})

		expect(titles).toEqual([
			"Blood of the Dead",
			"Voyage of Despair",
			"The Darkest Shore",
			"Gorod Krovi",
		])
	})

	test("drops unknown difficulty slugs and omits an empty selection", () => {
		expect(mainQuestDifficultySearchParam(["very-hard", "nightmare"])).toEqual(["very-hard"])
		expect(mainQuestDifficultySearchParam(["nightmare"])).toBeUndefined()
		expect(mainQuestDifficultySearchParam(undefined)).toBeUndefined()
	})
})
