import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getAdjacentZombies, getZombieByKey, getZombies, type ZombieKey } from "@/data/zombies"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getZombies", () => {
	test("sorted by release date descending", () => {
		assertSortedDescByDate(getZombies().map(z => z.releaseDate))
	})
})

describe("getZombieByKey", () => {
	test("returns None when the zombie does not exist", () => {
		// @ts-expect-error invalid key
		const z = getZombieByKey("invalid-zombie")
		expect(Option.isNone(z)).toBe(true)
	})

	test("returns Some when the zombie exists", () => {
		const z = getZombieByKey("zombie").pipe(Option.getOrThrow)
		expect(z.id).toBe("zombie")
	})
})

describe("getAdjacentZombies", () => {
	test("matches getZombies order", () => {
		const zombies = getZombies()
		const z1 = zombies[1]!
		const { prev, next } = getAdjacentZombies(z1.id as ZombieKey)
		expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(zombies[0]!.id))
		expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(zombies[2]!.id))
	})
})
