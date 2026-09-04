import type { ContentState } from "@/types/data"
import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import {
	getAdjacentZombies,
	getZombieByKey,
	getZombies,
	type Zombie,
	type ZombieKey,
} from "@/data/zombies"
import { assertSortedDescByDate } from "@/tests/helpers"
import { resolveNewContentState } from "@/utils/content-state"

/** Minimal catalog-shaped fixture for `"New"` resolution (does not depend on real ZOMBIES rows). */
const zombieNewBadgeFixture = (releaseDate: string): Pick<Zombie, "releaseDate" | "state"> => ({
	releaseDate,
	state: Option.some("New"),
})

const resolvedZombieDisplayState = (
	fixture: Pick<Zombie, "releaseDate" | "state">,
	isoUtcInstant: string,
) => resolveNewContentState(fixture.state, fixture.releaseDate, Date.parse(isoUtcInstant))

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

	test("deathspinner weak points are back sacs only, not the head", () => {
		const z = getZombieByKey("deathspinner").pipe(Option.getOrThrow)
		expect(z.weakPoints).toEqual(["back-sacs"])
	})
})

describe("zombie New badge vs release date (fixtures)", () => {
	const fixture = zombieNewBadgeFixture("2026-04-30")

	test("drops New when release date is 14+ full calendar days in the past", () => {
		expect(
			Option.getOrNull(resolvedZombieDisplayState(fixture, "2026-05-15T12:00:00.000Z")),
		).toBeNull()
	})

	test("keeps New within 14 days of release date", () => {
		expect(Option.getOrNull(resolvedZombieDisplayState(fixture, "2026-05-10T12:00:00.000Z"))).toBe(
			"New",
		)
	})

	test("keeps New through the last instant before the 14th full UTC day after release", () => {
		expect(Option.getOrNull(resolvedZombieDisplayState(fixture, "2026-05-13T23:59:59.999Z"))).toBe(
			"New",
		)
	})

	test("drops New at the start of the 14th full UTC day after release", () => {
		expect(
			Option.getOrNull(resolvedZombieDisplayState(fixture, "2026-05-14T00:00:00.000Z")),
		).toBeNull()
	})

	test("stored None stays None regardless of calendar age", () => {
		const noBadge: Pick<Zombie, "releaseDate" | "state"> = {
			...fixture,
			state: Option.none<ContentState>(),
		}
		expect(
			Option.getOrNull(resolvedZombieDisplayState(noBadge, "2026-05-10T12:00:00.000Z")),
		).toBeNull()
	})

	test('stored Coming Soon is preserved when stored state is Some("Coming Soon")', () => {
		const comingSoon = { ...fixture, state: Option.some("Coming Soon" as const) }
		expect(
			Option.getOrNull(resolvedZombieDisplayState(comingSoon, "2026-05-15T12:00:00.000Z")),
		).toBe("Coming Soon")
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
