import { Option } from "effect"
import { describe, expect, test } from "vite-plus/test"
import { getAmmoModByKey } from "@/data/ammo-mods"

describe("getAmmoModByKey", () => {
	test("returns None when the ammo mod does not exist", () => {
		const m = getAmmoModByKey("invalid-ammo-mod", "black-ops-6")
		expect(Option.isNone(m)).toBe(true)
	})

	test("returns Some when the ammo mod exists", () => {
		const m = getAmmoModByKey("brain-rot", "black-ops-6").pipe(Option.getOrThrow)
		expect(m.id).toBe("brain-rot")
	})
})
