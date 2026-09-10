import type { ContentState } from "@/types/data"
import { Option, Array as Arr } from "effect"
import { describe, expect, test, vi } from "vitest"
import {
	compareSideQuestDescending,
	getAdjacentSideQuests,
	getSideQuestByKey,
	getSideQuests,
	type SideQuest,
} from "@/data/side-quests"
import { resolveNewContentState } from "@/utils/content-state"

/** Minimal catalog-shaped fixture for `"New"` resolution (does not depend on real SIDE_QUESTS rows). */
const sideQuestNewBadgeFixture = (
	publishedDate: string,
): Pick<SideQuest, "publishedDate" | "state"> => ({
	publishedDate,
	state: Option.some("New"),
})

const resolvedSideQuestDisplayState = (
	fixture: Pick<SideQuest, "publishedDate" | "state">,
	isoUtcInstant: string,
) => resolveNewContentState(fixture.state, fixture.publishedDate, Date.parse(isoUtcInstant))

describe("compareSideQuestDescending", () => {
	test("same host map: later SIDE_QUESTS insertion index sorts first", () => {
		expect(
			compareSideQuestDescending(
				{ id: "dead-again", map: "der-eisendrache" },
				{ id: "brm-wall-buy", map: "der-eisendrache" },
			),
		).toBeGreaterThan(0)
	})
})

describe("getSideQuests", () => {
	test("sorted by map release date descending", () => {
		const quests = getSideQuests()

		for (let i = 0; i < quests.length - 1; i++) {
			expect(compareSideQuestDescending(quests[i]!, quests[i + 1]!)).toBeLessThanOrEqual(0)
		}
	})
})

describe("getSideQuestByKey", () => {
	test("returns None when the side quest does not exist", () => {
		const s = getSideQuestByKey("invalid-side-quest")
		expect(Option.isNone(s)).toBe(true)
	})

	test("returns Some when the side quest exists", () => {
		const s = getSideQuestByKey("115-clock-tower").pipe(Option.getOrThrow)
		expect(s.id).toBe("115-clock-tower")
	})
})

describe("side quest New badge vs published date (fixtures)", () => {
	const fixture = sideQuestNewBadgeFixture("2026-08-26")

	test("drops New when published date is 14+ full calendar days in the past", () => {
		expect(
			Option.getOrNull(resolvedSideQuestDisplayState(fixture, "2026-09-10T12:00:00.000Z")),
		).toBeNull()
	})

	test("keeps New within 14 days of published date", () => {
		expect(
			Option.getOrNull(resolvedSideQuestDisplayState(fixture, "2026-09-05T12:00:00.000Z")),
		).toBe("New")
	})

	test("keeps New through the last instant before the 14th full UTC day after publish", () => {
		expect(
			Option.getOrNull(resolvedSideQuestDisplayState(fixture, "2026-09-08T23:59:59.999Z")),
		).toBe("New")
	})

	test("drops New at the start of the 14th full UTC day after publish", () => {
		expect(
			Option.getOrNull(resolvedSideQuestDisplayState(fixture, "2026-09-09T00:00:00.000Z")),
		).toBeNull()
	})

	test("stored None stays None regardless of calendar age", () => {
		const noBadge: Pick<SideQuest, "publishedDate" | "state"> = {
			...fixture,
			state: Option.none<ContentState>(),
		}

		expect(
			Option.getOrNull(resolvedSideQuestDisplayState(noBadge, "2026-09-05T12:00:00.000Z")),
		).toBeNull()
	})

	test('stored Coming Soon is preserved when stored state is Some("Coming Soon")', () => {
		const comingSoon = { ...fixture, state: Option.some("Coming Soon" as const) }
		expect(
			Option.getOrNull(resolvedSideQuestDisplayState(comingSoon, "2026-09-10T12:00:00.000Z")),
		).toBe("Coming Soon")
	})
})

describe("getSideQuestByKey applies publishedDate New window", () => {
	test("stored None stays None even when publishedDate is inside the 14-day window", () => {
		vi.useFakeTimers()
		vi.setSystemTime(Date.parse("2026-09-01T12:00:00.000Z"))
		const quest = getSideQuestByKey("skull-mask").pipe(Option.getOrThrow)
		expect(quest.publishedDate).toBe("2026-08-26")
		expect(Option.getOrNull(quest.state)).toBeNull()
		vi.useRealTimers()
	})
})

describe("getAdjacentSideQuests", () => {
	test("matches getSideQuests order", () => {
		const quests = getSideQuests()
		const q1 = quests[Math.floor(quests.length / 2)]!
		const { prev, next } = getAdjacentSideQuests(q1.id)
		const idx = quests.findIndex(q => q.id === q1.id)
		expect(idx).toBeGreaterThanOrEqual(0)

		const expectedPrev =
			idx < quests.length - 1 ? Option.some(quests[idx + 1]!.id) : Option.none<string>()

		const expectedNext = idx > 0 ? Option.some(quests[idx - 1]!.id) : Option.none<string>()
		expect(prev.pipe(Option.map(n => n.id))).toEqual(expectedPrev)
		expect(next.pipe(Option.map(p => p.id))).toEqual(expectedNext)
	})

	test("prev is Some and Next is None when the first side quest is provided", () => {
		const first = Arr.head(getSideQuests()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentSideQuests(first.id)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last side quest is provided", () => {
		const last = Arr.last(getSideQuests()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentSideQuests(last.id)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})
