import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import { compareZombieReleaseDescending, getAdjacentZombies, getZombies } from "@/data/zombies"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getZombies", () => {
	test("sorted by release date descending", () => {
		const dates = Arr.map(getZombies(), z => z.releaseDate)
		expect(dates.length).toBeGreaterThan(1)
		assertSortedDescByDate(dates)
	})
})

describe("getAdjacentZombies", () => {
	test("matches getZombies order", () => {
		const zombies = getZombies()
		const z1 = zombies[Math.floor(zombies.length / 2)]!
		const { prev, next } = getAdjacentZombies(z1.id)

		const idx = Option.getOrElse(
			Arr.findFirstIndex(zombies, z => z.id === z1.id),
			() => -1,
		)

		expect(idx).toBeGreaterThanOrEqual(0)

		const expectedPrev =
			idx < zombies.length - 1 ? Option.some(zombies[idx + 1]!.id) : Option.none<string>()

		const expectedNext = idx > 0 ? Option.some(zombies[idx - 1]!.id) : Option.none<string>()
		expect(prev.pipe(Option.map(n => n.id))).toEqual(expectedPrev)
		expect(next.pipe(Option.map(p => p.id))).toEqual(expectedNext)
	})

	test("prev is Some and Next is None when the first zombie is provided", () => {
		const first = Arr.head(getZombies()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentZombies(first.id)
		expect(Option.isSome(prev)).toBe(true)
		expect(Option.isNone(next)).toBe(true)
	})

	test("prev is None and Next is Some when the last zombie is provided", () => {
		const last = Arr.last(getZombies()).pipe(Option.getOrThrow)
		const { prev, next } = getAdjacentZombies(last.id)
		expect(Option.isNone(prev)).toBe(true)
		expect(Option.isSome(next)).toBe(true)
	})
})

test("compareZombieReleaseDescending returns None for missing tie-break indexes", () => {
	expect(
		compareZombieReleaseDescending(
			{ id: "unknown-a", releaseDate: "2026-01-01" },
			{ id: "unknown-b", releaseDate: "2026-01-01" },
		),
	).toEqual(Option.none())
})
