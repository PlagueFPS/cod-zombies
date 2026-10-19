import { describe, expect, test } from "vitest"
import {
	MAIN_QUEST_DIFFICULTIES,
	mainQuestDifficultySearchParam,
	mainQuestDifficultySlug,
} from "@/data/maps"

describe("mainQuestDifficultySearchParam", () => {
	test("keeps the slug written for every difficulty option", () => {
		for (const difficulty of MAIN_QUEST_DIFFICULTIES) {
			const slug = mainQuestDifficultySlug(difficulty)

			expect(mainQuestDifficultySearchParam([slug])).toEqual([slug])
		}
	})

	test("drops unknown slugs and omits an empty selection", () => {
		const slug = mainQuestDifficultySlug(MAIN_QUEST_DIFFICULTIES[0])

		expect(mainQuestDifficultySearchParam([slug, "not-a-difficulty"])).toEqual([slug])
		expect(mainQuestDifficultySearchParam(["not-a-difficulty"])).toBeUndefined()
		expect(mainQuestDifficultySearchParam([])).toBeUndefined()
		expect(mainQuestDifficultySearchParam(undefined)).toBeUndefined()
	})
})
