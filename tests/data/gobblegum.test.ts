import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getGobblegumByKey } from "@/data/gobblegum"

describe("getGobblegumByKey", () => {
	test("merges game variant", () => {
		const g = getGobblegumByKey("anywhere-but-here", "black-ops-6").pipe(Option.getOrThrow)
		expect(g.type).toBe("Instant")
		expect(g.rarity).toBe("Rare")
		expect(g.image).toBe("/gobblegums/anywhere-but-here-bo6.webp")
	})

	test("returns None when the gobblegum does not exist", () => {
		// @ts-expect-error invalid key
		const g = getGobblegumByKey("invalid-gobblegum", "black-ops-6")
		expect(Option.isNone(g)).toBe(true)
	})

	test("returns Some when the gobblegum exists", () => {
		const g = getGobblegumByKey("anywhere-but-here").pipe(Option.getOrThrow)
		expect(g.id).toBe("anywhere-but-here")
	})
})
