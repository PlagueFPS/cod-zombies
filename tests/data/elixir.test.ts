import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getElixirByKey } from "@/data/elixirs"

describe("getElixirByKey", () => {
	test("returns None when the elixir does not exist", () => {
		// @ts-expect-error invalid key
		const elixir = getElixirByKey("invalid-elixir")
		expect(Option.isNone(elixir)).toBe(true)
	})

	test("returns Some when the elixir exists", () => {
		const elixir = getElixirByKey("anywhere-but-here").pipe(Option.getOrThrow)
		expect(elixir.id).toBe("anywhere-but-here")
	})
})
