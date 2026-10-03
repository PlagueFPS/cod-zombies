import { Exit } from "effect"
import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { expectExitSuccess } from "@/tests/helpers"
import {
	classifyAotrtTvColor,
	decodeAotrtONumberInput,
	O_NUMBERS,
	solveAotrtONumber,
} from "@/utils/aotrt-o-number"

describe("solveAotrtONumber", () => {
	test("multiplies the matched O number by M to choose the TV color", () => {
		expect(solveAotrtONumber(15, 61)).toMatchObject({
			rounded: 4,
			oNumber: 4,
			tvColor: { product: 60, row: "top", middleStart: 61, middleEnd: 63 },
		})
		expect(solveAotrtONumber(5, 61)).toMatchObject({
			rounded: 12,
			oNumber: 11,
			tvColor: { product: 55, row: "top" },
		})
	})

	test("rounds the top TV number divided by M to an exact O value", () => {
		expect(solveAotrtONumber(7, 61)).toMatchObject({ rounded: 9, oNumber: 9 })
		expect(solveAotrtONumber(10, 61)).toMatchObject({ rounded: 6, oNumber: 6 })
		expect(solveAotrtONumber(8, 61)).toMatchObject({ rounded: 8, oNumber: 8 })
		expect(solveAotrtONumber(4, 61)).toMatchObject({ rounded: 15, oNumber: 15 })
		expect(solveAotrtONumber(3, 15)).toMatchObject({ rounded: 5, oNumber: 5 })
	})

	test("picks the closest O value when the rounded quotient is not in the set", () => {
		expect(solveAotrtONumber(5, 61)).toMatchObject({ rounded: 12, oNumber: 11 })
		expect(solveAotrtONumber(10, 10)).toMatchObject({ rounded: 1, oNumber: 2 })
		expect(solveAotrtONumber(1, 100)).toMatchObject({ rounded: 100, oNumber: 15 })
	})

	test("rounds halves away from zero before matching an O value", () => {
		expect(solveAotrtONumber(2, 15)).toMatchObject({ quotient: 7.5, rounded: 8, oNumber: 8 })
	})

	test("uses the lower O value when two candidates are equally close", () => {
		expect(solveAotrtONumber(20, 61)).toMatchObject({ rounded: 3, oNumber: 2 })
		expect(solveAotrtONumber(9, 63)).toMatchObject({ rounded: 7, oNumber: 6 })
		expect(solveAotrtONumber(6, 60)).toMatchObject({ rounded: 10, oNumber: 9 })
		expect(solveAotrtONumber(4, 52)).toMatchObject({ rounded: 13, oNumber: 11 })
	})

	test("returns every listed O value when the quotient is that value", () => {
		for (const oNumber of O_NUMBERS) {
			expect(solveAotrtONumber(1, oNumber).oNumber).toBe(oNumber)
		}
	})

	test("always returns an O value no farther than any other candidate", () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 99 }),
				fc.integer({ min: 1, max: 999 }),
				(m, topTvNumber) => {
					const result = solveAotrtONumber(m, topTvNumber)
					const distance = Math.abs(result.oNumber - result.rounded)

					expect(result.rounded).toBe(Math.round(topTvNumber / m))
					expect(O_NUMBERS).toContain(result.oNumber)

					for (const candidate of O_NUMBERS) {
						expect(distance).toBeLessThanOrEqual(Math.abs(candidate - result.rounded))
					}

					const tied = O_NUMBERS.filter(
						candidate => Math.abs(candidate - result.rounded) === distance,
					)

					expect(result.oNumber).toBe(Math.min(...tied))

					const product = result.oNumber * m

					const expectedRow =
						product < topTvNumber ? "top" : product <= topTvNumber + 2 ? "middle" : "bottom"

					expect(result.tvColor.product).toBe(product)
					expect(result.tvColor.row).toBe(expectedRow)
					expect(result.tvColor.middleStart).toBe(topTvNumber)
					expect(result.tvColor.middleEnd).toBe(topTvNumber + 2)
				},
			),
		)
	})
})

describe("classifyAotrtTvColor", () => {
	test("uses the top TV color when O times M is below the top number", () => {
		expect(classifyAotrtTvColor(4 * 15, 61)).toEqual({
			product: 60,
			row: "top",
			middleStart: 61,
			middleEnd: 63,
		})
	})

	test("uses the middle TV color for the inclusive range from the top number through two above it", () => {
		expect(classifyAotrtTvColor(61, 61).row).toBe("middle")
		expect(classifyAotrtTvColor(63, 61).row).toBe("middle")
	})

	test("uses the bottom TV color when O times M is greater than the end of the middle range", () => {
		expect(classifyAotrtTvColor(64, 61)).toEqual({
			product: 64,
			row: "bottom",
			middleStart: 61,
			middleEnd: 63,
		})
	})
})

describe("decodeAotrtONumberInput", () => {
	test("accepts positive whole numbers", () => {
		const decoded = decodeAotrtONumberInput({ m: "7", topTvNumber: "61" })

		expect(expectExitSuccess(decoded)).toEqual({ m: 7, topTvNumber: 61 })
	})

	test("rejects blank, zero, decimal, and negative input", () => {
		const rejected = [
			{ m: "", topTvNumber: "61" },
			{ m: "0", topTvNumber: "61" },
			{ m: "7.5", topTvNumber: "61" },
			{ m: "-7", topTvNumber: "61" },
			{ m: "7", topTvNumber: "0" },
			{ m: "M", topTvNumber: "61" },
		]

		for (const input of rejected) {
			expect(Exit.isFailure(decodeAotrtONumberInput(input))).toBe(true)
		}
	})
})
