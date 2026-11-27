import { Option, Array as Arr } from "effect"
import { describe, expect, test } from "vite-plus/test"
import {
	compareZombieReleaseDescending,
	getAdjacentZombies,
	getZombies,
	getZombieWeaknessesByGame,
	type Zombie,
	zombieHasWeakness,
} from "@/data/zombies"
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

const fixtureZombie = (
	variants: Zombie["variants"],
): Pick<Zombie, "games" | "elementalWeakness" | "variants"> => ({
	games: ["black-ops-1", "black-ops-3", "black-ops-6"],
	elementalWeakness: ["napalm-burst"],
	variants,
})

describe("getZombieWeaknessesByGame", () => {
	test("returns one group with every game when there are no overrides", () => {
		expect(getZombieWeaknessesByGame(fixtureZombie(Option.none()))).toEqual([
			{ games: ["black-ops-1", "black-ops-3", "black-ops-6"], weaknesses: ["napalm-burst"] },
		])
	})

	test("an override replaces the default list for that game instead of appending", () => {
		const zombie = fixtureZombie(
			Option.some({ "black-ops-6": { elementalWeakness: ["brain-rot"] } }),
		)

		expect(getZombieWeaknessesByGame(zombie)).toEqual([
			{ games: ["black-ops-1", "black-ops-3"], weaknesses: ["napalm-burst"] },
			{ games: ["black-ops-6"], weaknesses: ["brain-rot"] },
		])
	})

	test("groups games whose resolved lists are equal, including an override equal to the default", () => {
		const zombie = fixtureZombie(
			Option.some({
				"black-ops-1": { elementalWeakness: [] },
				"black-ops-6": { elementalWeakness: ["napalm-burst"] },
			}),
		)

		expect(getZombieWeaknessesByGame(zombie)).toEqual([
			{ games: ["black-ops-1"], weaknesses: [] },
			{ games: ["black-ops-3", "black-ops-6"], weaknesses: ["napalm-burst"] },
		])
	})

	test("every catalog zombie's groups cover exactly its games", () => {
		for (const zombie of getZombies()) {
			const groupedGames = Arr.flatMap(getZombieWeaknessesByGame(zombie), group => group.games)
			expect([...groupedGames].sort()).toEqual([...zombie.games].sort())
		}
	})
})

describe("zombieHasWeakness", () => {
	const zombie = fixtureZombie(Option.some({ "black-ops-6": { elementalWeakness: ["brain-rot"] } }))

	test("without a game filter, matches a weakness from any game", () => {
		expect(zombieHasWeakness(zombie, "napalm-burst")).toBe(true)
		expect(zombieHasWeakness(zombie, "brain-rot")).toBe(true)
		expect(zombieHasWeakness(zombie, "shatter-blast")).toBe(false)
	})

	test("with a game filter, matches only the resolved lists of the selected games", () => {
		expect(zombieHasWeakness(zombie, "brain-rot", ["black-ops-6"])).toBe(true)
		expect(zombieHasWeakness(zombie, "napalm-burst", ["black-ops-6"])).toBe(false)
		expect(zombieHasWeakness(zombie, "brain-rot", ["black-ops-1"])).toBe(false)
		expect(zombieHasWeakness(zombie, "napalm-burst", ["black-ops-1", "black-ops-6"])).toBe(true)
	})

	test("a selected game the zombie is not in never matches its default list", () => {
		expect(zombieHasWeakness(zombie, "napalm-burst", ["black-ops-7"])).toBe(false)
		expect(zombieHasWeakness(zombie, "napalm-burst", ["black-ops-7", "black-ops-6"])).toBe(false)
	})
})
