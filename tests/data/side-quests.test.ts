import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getMapByKey } from "@/data/maps"
import {
	getAdjacentSideQuests,
	getSideQuestByKey,
	getSideQuests,
	type SideQuestKey,
} from "@/data/side-quests"

describe("getSideQuests", () => {
	test("sorted by map release date descending", () => {
		const quests = getSideQuests()
		for (let i = 0; i < quests.length - 1; i++) {
			const mapA = getMapByKey(quests[i]!.map).pipe(Option.getOrThrow)
			const mapB = getMapByKey(quests[i + 1]!.map).pipe(Option.getOrThrow)
			expect(mapA.releaseDate.getTime()).toBeGreaterThanOrEqual(mapB.releaseDate.getTime())
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

describe("getAdjacentSideQuests", () => {
	test("matches getSideQuests order", () => {
		const quests = getSideQuests()
		const q1 = quests[1]!
		const { prev, next } = getAdjacentSideQuests(q1.id as SideQuestKey)
		expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(quests[0]!.id))
		expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(quests[2]!.id))
	})
})
