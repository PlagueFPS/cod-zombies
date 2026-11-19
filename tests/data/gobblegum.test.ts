import { Option } from "effect"
import { describe, expect, test } from "vite-plus/test"
import { getGobblegumByKey } from "@/data/gobblegum"

describe("getGobblegumByKey", () => {
	test("returns None when the gobblegum does not exist", () => {
		const g = getGobblegumByKey("invalid-gobblegum", "black-ops-6")
		expect(Option.isNone(g)).toBe(true)
	})

	test("returns Some when the gobblegum exists", () => {
		const g = getGobblegumByKey("anywhere-but-here").pipe(Option.getOrThrow)
		expect(g.id).toBe("anywhere-but-here")
	})
})
