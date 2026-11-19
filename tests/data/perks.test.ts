import { Option } from "effect"
import { describe, expect, test } from "vite-plus/test"
import { getPerkByKey } from "@/data/perks"

describe("getPerkByKey", () => {
	test("returns None when the perk does not exist", () => {
		const p = getPerkByKey("invalid-perk", "black-ops-cold-war")
		expect(Option.isNone(p)).toBe(true)
	})

	test("returns Some when the perk exists", () => {
		const p = getPerkByKey("juggernog").pipe(Option.getOrThrow)
		expect(p.id).toBe("juggernog")
	})
})
