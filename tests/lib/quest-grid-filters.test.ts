import { Option } from "effect"
import { describe, expect, test } from "vitest"
import {
	mainQuestMatchesDifficultySlugs,
	mainQuestMatchesTimeSlugs,
} from "@/lib/quest-grid/filters"

describe("mainQuestMatchesDifficultySlugs", () => {
	test("passes when no difficulty slugs are selected", () => {
		expect(mainQuestMatchesDifficultySlugs(Option.some("Hard"), [])).toBe(true)
	})

	test("matches when slugified difficulty is in the filter list", () => {
		expect(mainQuestMatchesDifficultySlugs(Option.some("Very Hard"), ["very-hard"])).toBe(true)
	})

	test("rejects when difficulty is missing", () => {
		expect(mainQuestMatchesDifficultySlugs(Option.none(), ["hard"])).toBe(false)
	})

	test("rejects when slug is not selected (side quests stay excluded at grid layer)", () => {
		expect(mainQuestMatchesDifficultySlugs(Option.some("Easy"), ["hard"])).toBe(false)
	})
})

describe("mainQuestMatchesTimeSlugs", () => {
	test("passes when no time slugs are selected", () => {
		expect(mainQuestMatchesTimeSlugs(Option.some({ min: 30, max: 60 }), [])).toBe(true)
	})

	test("matches midpoint inside a selected bucket", () => {
		expect(mainQuestMatchesTimeSlugs(Option.some({ min: 30, max: 60 }), ["30-60"])).toBe(true)
	})

	test("rejects when estimated time is missing", () => {
		expect(mainQuestMatchesTimeSlugs(Option.none(), ["30-60"])).toBe(false)
	})

	test("rejects when midpoint falls outside selected buckets", () => {
		expect(mainQuestMatchesTimeSlugs(Option.some({ min: 30, max: 60 }), ["120-plus"])).toBe(false)
	})
})
