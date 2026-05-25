import { describe, expect, test } from "vitest"
import { CARD_LIMIT } from "@/utils/constants"
import { resolveValidGridPage } from "@/utils/grid-pagination"

describe("resolveValidGridPage", () => {
	test("returns the page when it is within range", () => {
		expect(resolveValidGridPage(2, 25, CARD_LIMIT)).toBe(2)
	})

	test("clamps to 1 when page is below 1", () => {
		expect(resolveValidGridPage(0, 25, CARD_LIMIT)).toBe(1)
		expect(resolveValidGridPage(-3, 25, CARD_LIMIT)).toBe(1)
	})

	test("clamps to last page when page exceeds total pages", () => {
		expect(resolveValidGridPage(5, 25, CARD_LIMIT)).toBe(3)
	})

	test("with zero items, only sub-1 pages clamp; high page is unchanged until items exist", () => {
		expect(resolveValidGridPage(3, 0, CARD_LIMIT)).toBe(3)
		expect(resolveValidGridPage(0, 0, CARD_LIMIT)).toBe(1)
	})
})
