import { Option } from "effect"
import { describe, expect, test } from "vitest"
import {
	mapWithGameVariant,
	type RegistryKeyInput,
	registryGet,
	resolveGameVariantOption,
	uniqueMap,
} from "@/data/registry-helpers"

type Sample = {
	readonly id: string
	readonly title: string
	readonly variants: Option.Option<Partial<Record<"black-ops-6", { title?: string }>>>
}

describe("resolveGameVariantOption", () => {
	test("returns entry unchanged when game omitted or no variant", () => {
		const base: Sample = {
			id: "x",
			title: "Base",
			variants: Option.some({ "black-ops-6": { title: "BO6" } }),
		}

		const entry = Option.some(base)
		expect(resolveGameVariantOption(entry, undefined)).toEqual(entry)
		expect(resolveGameVariantOption(entry, "black-ops-7")).toEqual(entry)
	})

	test("returns entry with variant when game and variant are provided", () => {
		const base: Sample = {
			id: "x",
			title: "Base",
			variants: Option.some({ "black-ops-6": { title: "BO6" } }),
		}

		const entry = Option.some(base)
		expect(resolveGameVariantOption(entry, "black-ops-6")).toEqual(
			Option.some({ ...base, title: "BO6" }),
		)
	})
})

describe("mapWithGameVariant", () => {
	test("applies the same merge to each item", () => {
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

describe("uniqueMap", () => {
	test("returns a Map with every unique id", () => {
		const map = uniqueMap([
			["melee-swing", { title: "Melee Swing" }],
			["bite", { title: "Bite" }],
		])

		expect(map.size).toBe(2)
		expect(map.get("melee-swing")?.title).toBe("Melee Swing")
		expect(map.get("bite")?.title).toBe("Bite")
		// @ts-expect-error invalid key
		expect(map.get("not-an-attack")).toBeUndefined()
	})

	test("duplicate ids are a type error; runtime matches Map overwrite", () => {
		const map = uniqueMap([
			// @ts-expect-error duplicate registry id
			["a", 1],
			["b", 2],
			// @ts-expect-error duplicate registry id
			["a", 3],
		])

		expect(map.get("a")).toBe(3)
	})
})

describe("RegistryKeyInput", () => {
	test("does not collapse to string", () => {
		type Input = RegistryKeyInput<"alpha" | "beta">

		type CollapsedToString = Equals<Input, string>

		const collapsedToString: CollapsedToString = false

		expect(collapsedToString).toBe(false)
	})

	test("accepts known keys and arbitrary strings", () => {
		const known: RegistryKeyInput<"alpha" | "beta"> = "alpha"
		const unknown: RegistryKeyInput<"alpha" | "beta"> = "not-a-key"
		const fromString: string = "dynamic"
		const fromVariable: RegistryKeyInput<"alpha" | "beta"> = fromString

		expect(known).toBe("alpha")
		expect(unknown).toBe("not-a-key")
		expect(fromVariable).toBe("dynamic")
	})

	test("lets registryGet look up a string that is not a known key", () => {
		const map = uniqueMap([["melee-swing", { title: "Melee Swing" }]])
		const key: string = "not-an-attack"

		expect(Option.isNone(registryGet(map, key))).toBe(true)
	})
})

// Helpers
type Equals<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
