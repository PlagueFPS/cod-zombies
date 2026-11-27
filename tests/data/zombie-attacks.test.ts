import { Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import { getZombieAttacks } from "@/data/zombie-attacks"
import { getZombies } from "@/data/zombies"

const duplicates = (values: string[]) =>
	Arr.dedupe(Arr.filter(values, (value, i) => values.indexOf(value) !== i))

describe("ZOMBIE_ATTACKS", () => {
	test("no two attacks share a title", () => {
		expect(duplicates(Arr.map(getZombieAttacks(), attack => attack.title))).toEqual([])
	})

	test("no two attacks share a description", () => {
		expect(duplicates(Arr.map(getZombieAttacks(), attack => attack.description))).toEqual([])
	})
})

test("no zombie uses the same attack twice", () => {
	const repeats = Arr.flatMap(getZombies(), zombie =>
		Arr.map(duplicates(Arr.map(zombie.attacks, attack => attack.id)), id => `${zombie.id}: ${id}`),
	)

	expect(repeats).toEqual([])
})
