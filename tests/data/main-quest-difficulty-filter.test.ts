import { Option } from "effect"
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

			expect(mainQuestDifficultySearchParam(Option.some([slug]))).toEqual(Option.some([slug]))
		}
	})

	test("drops unknown slugs and omits an empty selection", () => {
		const slug = mainQuestDifficultySlug(MAIN_QUEST_DIFFICULTIES[0])

		expect(mainQuestDifficultySearchParam(Option.some([slug, "not-a-difficulty"]))).toEqual(
			Option.some([slug]),
		)
		expect(mainQuestDifficultySearchParam(Option.some(["not-a-difficulty"]))).toEqual(Option.none())
		expect(mainQuestDifficultySearchParam(Option.some([]))).toEqual(Option.none())
		expect(mainQuestDifficultySearchParam(Option.none())).toEqual(Option.none())
	})
})
