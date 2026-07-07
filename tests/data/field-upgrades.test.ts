import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getFieldUpgradeByKey } from "@/data/field-upgrades"

describe("getFieldUpgradeByKey", () => {
	test("merges game variant", () => {
		const fu6 = getFieldUpgradeByKey("aether-shroud", "black-ops-6").pipe(Option.getOrThrow)
		const aug6 = fu6.augments.pipe(Option.getOrThrow)
		expect(aug6.length).toBe(6)
		expect(aug6).toContain("group-shroud")

		const fu7 = getFieldUpgradeByKey("aether-shroud", "black-ops-7").pipe(Option.getOrThrow)
		const aug7 = fu7.augments.pipe(Option.getOrThrow)
		expect(aug7.length).toBe(8)
		expect(aug7).toContain("afterimage")
	})

	test("returns None when the field upgrade does not exist", () => {
		// @ts-expect-error invalid key
		const fu = getFieldUpgradeByKey("invalid-field-upgrade")
		expect(Option.isNone(fu)).toBe(true)
	})

	test("returns Some when the field upgrade exists", () => {
		const fu = getFieldUpgradeByKey("aether-shroud").pipe(Option.getOrThrow)
		expect(fu.id).toBe("aether-shroud")
	})
})
