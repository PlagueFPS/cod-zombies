import { Option, Array as Arr } from "effect"
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
		const z1 = zombies[Math.floor(zombies.length / 2)]!
		const { prev, next } = getAdjacentZombies(z1.id as ZombieKey)
		const idx = zombies.findIndex(z => z.id === z1.id)
		expect(idx).toBeGreaterThanOrEqual(0)
		if (idx < zombies.length - 1) {
			expect(prev.pipe(Option.map(n => n.id))).toEqual(Option.some(zombies[idx + 1]!.id))
		}
		if (idx > 0) {
			expect(next.pipe(Option.map(p => p.id))).toEqual(Option.some(zombies[idx - 1]!.id))
		}
	})

	test("prev is Some and Next is None when the first zombie is provided", () => {
		const first = Arr.head(getZombies()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentZombies(first.id as ZombieKey)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last zombie is provided", () => {
		const last = Arr.last(getZombies()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentZombies(last.id as ZombieKey)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})
