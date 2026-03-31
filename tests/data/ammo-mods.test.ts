import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getAmmoModByKey } from "@/data/ammo-mods"

describe("getAmmoModByKey", () => {
	test("merges game variant", () => {
		const m = getAmmoModByKey("brain-rot", "black-ops-cold-war").pipe(Option.getOrThrow)
		expect(m.image).toBe("/ammo-mods/brain-rot-bo6.webp")
		const deepM = getAmmoModByKey("brain-rot", "black-ops-6").pipe(Option.getOrThrow)
		const aug = deepM.augments.pipe(Option.getOrThrow)

		expect(aug.length).toBe(6)
		expect(aug).toContain("plague")
	})

	test("returns None when the ammo mod does not exist", () => {
		// @ts-expect-error invalid key
		const m = getAmmoModByKey("invalid-ammo-mod", "black-ops-6")
		expect(Option.isNone(m)).toBe(true)
	})

	test("returns Some when the ammo mod exists", () => {
		const m = getAmmoModByKey("brain-rot", "black-ops-6").pipe(Option.getOrThrow)
		expect(m.id).toBe("brain-rot")
	})
})
