import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getPerkByKey } from "@/data/perks"

describe("getPerkByKey", () => {
	test("merges game variant", () => {
		const p = getPerkByKey("juggernog", "black-ops-cold-war").pipe(Option.getOrThrow)
		expect(p.description).toBe("Increase Max Health by 100.")
		expect(p.image).toBe("/perks/juggernog-bo6.webp")

		const p6 = getPerkByKey("juggernog", "black-ops-6").pipe(Option.getOrThrow)
		const aug6 = p6.augments.pipe(Option.getOrThrow)
		expect(aug6.length).toBe(6)
		expect(aug6).toContain("probiotic")

		const p7 = getPerkByKey("juggernog", "black-ops-7").pipe(Option.getOrThrow)
		const aug7 = p7.augments.pipe(Option.getOrThrow)
		expect(aug7.length).toBe(8)
		expect(aug7).toContain("iron-core")
	})

	test("returns None when the perk does not exist", () => {
		// @ts-expect-error invalid key
		const p = getPerkByKey("invalid-perk", "black-ops-cold-war")
		expect(Option.isNone(p)).toBe(true)
	})

	test("returns Some when the perk exists", () => {
		const p = getPerkByKey("juggernog").pipe(Option.getOrThrow)
		expect(p.id).toBe("juggernog")
	})
})
