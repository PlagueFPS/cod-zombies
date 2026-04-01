import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getWeaponBuildByKey } from "@/data/weapon-builds"

describe("getWeaponBuildByKey", () => {
	test("returns None when the weapon build does not exist", () => {
		// @ts-expect-error invalid key
		const weaponBuild = getWeaponBuildByKey("invalid-weapon-build")
		expect(Option.isNone(weaponBuild)).toBe(true)
	})

	test("returns Some when the weapon build exists", () => {
		const weaponBuild = getWeaponBuildByKey("maelstrom-reckoning").pipe(Option.getOrThrow)
		expect(weaponBuild.id).toBe("maelstrom-reckoning")
	})
})
