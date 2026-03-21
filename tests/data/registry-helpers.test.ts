import { Option } from "effect"
import { describe, expect, test } from "vitest"

import { mapWithGameVariant, resolveGameVariantOption } from "@/data/registry-helpers"

type Sample = {
	readonly id: string
	readonly title: string
	readonly variants: Option.Option<Partial<Record<"black-ops-6", { title?: string }>>>
}

describe("data/registry-helpers", () => {
	test("resolveGameVariantOption returns entry unchanged when game omitted or no variant", () => {
		const base: Sample = {
			id: "x",
			title: "Base",
			variants: Option.some({ "black-ops-6": { title: "BO6" } }),
		}
		const entry = Option.some(base)
		expect(resolveGameVariantOption(entry, undefined)).toEqual(entry)
		expect(resolveGameVariantOption(entry, "black-ops-6")).toEqual(
			Option.some({ ...base, title: "BO6" }),
		)
		expect(resolveGameVariantOption(Option.none(), "black-ops-6")).toEqual(Option.none())
	})

	test("mapWithGameVariant applies the same merge to each item", () => {
		const items: Sample[] = [
			{
				id: "a",
				title: "A",
				variants: Option.some({ "black-ops-6": { title: "A BO6" } }),
			},
		]
		const out = mapWithGameVariant(items, "black-ops-6")
		expect(out[0]?.title).toBe("A BO6")
		expect(mapWithGameVariant(items, undefined)[0]?.title).toBe("A")
	})
})
