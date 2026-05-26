import { Option } from "effect"
import { describe, expect, test } from "vitest"
import {
	MAIN_QUEST_TIME_RANGE_FILTERS,
	MAIN_QUEST_TIME_RANGE_OPEN_END_SLUG,
	mainQuestMatchesDifficultySlugs,
	mainQuestMatchesTimeSlugs,
	mainQuestMidpointMatchesAnyTimeSlug,
	mainQuestMidpointMatchesTimeRange,
} from "@/data/maps"

const rangeBySlug = (slug: string) => MAIN_QUEST_TIME_RANGE_FILTERS.find(r => r.slug === slug)!

describe("mainQuestMidpointMatchesTimeRange", () => {
	test("under-30: inclusive min, exclusive max", () => {
		const range = rangeBySlug("under-30")
		expect(mainQuestMidpointMatchesTimeRange(0, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(29.9, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(30, range)).toBe(false)
	})

	test("30-60: lower bound inclusive, upper exclusive", () => {
		const range = rangeBySlug("30-60")
		expect(mainQuestMidpointMatchesTimeRange(29.9, range)).toBe(false)
		expect(mainQuestMidpointMatchesTimeRange(30, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(59.9, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(60, range)).toBe(false)
	})

	test("60-120: lower bound inclusive, upper exclusive", () => {
		const range = rangeBySlug("60-120")
		expect(mainQuestMidpointMatchesTimeRange(59.9, range)).toBe(false)
		expect(mainQuestMidpointMatchesTimeRange(60, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(119.9, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(120, range)).toBe(false)
	})

	test("120-plus: inclusive on both ends (open-ended max)", () => {
		const range = rangeBySlug(MAIN_QUEST_TIME_RANGE_OPEN_END_SLUG)
		expect(mainQuestMidpointMatchesTimeRange(119.9, range)).toBe(false)
		expect(mainQuestMidpointMatchesTimeRange(120, range)).toBe(true)
		expect(mainQuestMidpointMatchesTimeRange(500, range)).toBe(true)
	})
})

describe("mainQuestMidpointMatchesAnyTimeSlug", () => {
	test("matches when any selected slug bucket contains the midpoint", () => {
		expect(mainQuestMidpointMatchesAnyTimeSlug(45, ["30-60", "60-120"])).toBe(true)
	})

	test("returns false when midpoint falls outside all selected buckets", () => {
		expect(mainQuestMidpointMatchesAnyTimeSlug(45, ["under-30", "120-plus"])).toBe(false)
	})

	test("ignores unknown slugs", () => {
		expect(mainQuestMidpointMatchesAnyTimeSlug(45, ["not-a-filter"])).toBe(false)
	})
})

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
