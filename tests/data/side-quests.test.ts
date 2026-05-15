import { Option, Array as Arr } from "effect"
import { describe, expect, test, vi } from "vitest"
import {
	compareSideQuestDescending,
	getAdjacentSideQuests,
	getSideQuestByKey,
	getSideQuests,
	type SideQuestKey,
} from "@/data/side-quests"

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
		// @ts-expect-error invalid key
		const s = getSideQuestByKey("invalid-side-quest")
		expect(Option.isNone(s)).toBe(true)
	})

	test("returns Some when the side quest exists", () => {
		const s = getSideQuestByKey("115-clock-tower").pipe(Option.getOrThrow)
		expect(s.id).toBe("115-clock-tower")
	})
})

describe("side quest New badge vs host map release date", () => {
	test("drops New on Totenreich quests after 14+ days from map release", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-15T12:00:00.000Z"))
		const quest = getSideQuestByKey("no-one-there").pipe(Option.getOrThrow)
		expect(Option.getOrNull(quest.state)).toBeNull()
		vi.useRealTimers()
	})

	test("keeps New within 14 days of host map release", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-10T12:00:00.000Z"))
		const quest = getSideQuestByKey("no-one-there").pipe(Option.getOrThrow)
		expect(Option.getOrNull(quest.state)).toBe("New")
		vi.useRealTimers()
	})
})

describe("getAdjacentSideQuests", () => {
	test("matches getSideQuests order", () => {
		const quests = getSideQuests()
		const q1 = quests[Math.floor(quests.length / 2)]!
		const { prev, next } = getAdjacentSideQuests(q1.id as SideQuestKey)
		const idx = quests.findIndex(q => q.id === q1.id)
		expect(idx).toBeGreaterThanOrEqual(0)
		if (idx < quests.length - 1) {
			expect(prev.pipe(Option.map(n => n.id))).toEqual(Option.some(quests[idx + 1]!.id))
		}
		if (idx > 0) {
			expect(next.pipe(Option.map(p => p.id))).toEqual(Option.some(quests[idx - 1]!.id))
		}
	})

	test("prev is Some and Next is None when the first side quest is provided", () => {
		const first = Arr.head(getSideQuests()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentSideQuests(first.id as SideQuestKey)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last side quest is provided", () => {
		const last = Arr.last(getSideQuests()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentSideQuests(last.id as SideQuestKey)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})
