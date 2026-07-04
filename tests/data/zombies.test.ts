import { Option, Array as Arr } from "effect"
import { afterEach, describe, expect, test, vi } from "vitest"
import { getAdjacentZombies, getZombieByKey, getZombies, type ZombieKey } from "@/data/zombies"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getZombies", () => {
	test("sorted by release date descending", () => {
		const dates = getZombies().map(z => z.releaseDate)
		expect(dates.length).toBeGreaterThan(1)
		assertSortedDescByDate(dates)
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

describe("zombie New badge vs release date", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	test("drops New when release date is 14+ full calendar days in the past", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-15T12:00:00.000Z"))
		const dravakar = getZombieByKey("dravakar").pipe(Option.getOrThrow)
		expect(Option.getOrNull(dravakar.state)).toBeNull()
	})

	test("keeps New within 14 days of release date", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-10T12:00:00.000Z"))
		const dravakar = getZombieByKey("dravakar").pipe(Option.getOrThrow)
		expect(Option.getOrNull(dravakar.state)).toBe("New")
	})

	test("keeps New through the last instant before the 14th full UTC day after release", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-13T23:59:59.999Z"))
		const dravakar = getZombieByKey("dravakar").pipe(Option.getOrThrow)
		expect(Option.getOrNull(dravakar.state)).toBe("New")
	})

	test("drops New at the start of the 14th full UTC day after release", () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-14T00:00:00.000Z"))
		const dravakar = getZombieByKey("dravakar").pipe(Option.getOrThrow)
		expect(Option.getOrNull(dravakar.state)).toBeNull()
	})
})

describe("getAdjacentZombies", () => {
	test("matches getZombies order", () => {
		const zombies = getZombies()
		const z1 = zombies[Math.floor(zombies.length / 2)]!
		const { prev, next } = getAdjacentZombies(z1.id as ZombieKey)
		const idx = zombies.findIndex(z => z.id === z1.id)
		expect(idx).toBeGreaterThanOrEqual(0)
		const expectedPrev =
			idx < zombies.length - 1 ? Option.some(zombies[idx + 1]!.id) : Option.none<string>()
		const expectedNext = idx > 0 ? Option.some(zombies[idx - 1]!.id) : Option.none<string>()
		expect(prev.pipe(Option.map(n => n.id))).toEqual(expectedPrev)
		expect(next.pipe(Option.map(p => p.id))).toEqual(expectedNext)
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
