import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getZombieAttackByKey } from "@/data/zombie-attacks"

describe("getZombieAttackByKey", () => {
	test("returns None when the zombie attack does not exist", () => {
		// @ts-expect-error invalid key
		const zombieAttack = getZombieAttackByKey("invalid-zombie-attack")
		expect(Option.isNone(zombieAttack)).toBe(true)
	})

	test("returns Some when the zombie attack exists", () => {
		const zombieAttack = getZombieAttackByKey("melee-swing").pipe(Option.getOrThrow)
		expect(zombieAttack.id).toBe("melee-swing")
	})
})
