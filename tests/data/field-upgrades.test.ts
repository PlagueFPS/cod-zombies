import { Option } from "effect"
import { describe, expect, test } from "vite-plus/test"
import { getFieldUpgradeByKey } from "@/data/field-upgrades"

describe("getFieldUpgradeByKey", () => {
	test("returns None when the field upgrade does not exist", () => {
		const fu = getFieldUpgradeByKey("invalid-field-upgrade")
		expect(Option.isNone(fu)).toBe(true)
	})

	test("returns Some when the field upgrade exists", () => {
		const fu = getFieldUpgradeByKey("aether-shroud").pipe(Option.getOrThrow)
		expect(fu.id).toBe("aether-shroud")
	})
})
