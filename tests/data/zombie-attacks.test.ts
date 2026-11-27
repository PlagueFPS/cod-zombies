import { Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import { getZombieAttacks } from "@/data/zombie-attacks"

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
