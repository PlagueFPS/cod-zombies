import { Option } from "effect"
import { describe, expect, test } from "vite-plus/test"
import {
	AotrtChemicalSolution,
	decodeAotrtDiamondInput,
	solveAotrtChemical,
} from "@/utils/aotrt-chemical"

describe("solveAotrtChemical", () => {
	test("subtracts the O number from the 1,7 column of 1,3,5-Tera-Nitra-Phenol", () => {
		expect(solveAotrtChemical("1,3,5-Tera-Nitra-Phenol", 1, 7, Option.some(4))).toEqual(
			AotrtChemicalSolution.Solved({ steps: [24, 22, 15] }),
		)
	})

	test("asks for the O number before printing steps for a valid diamond", () => {
		expect(solveAotrtChemical("3,4-Di-Nitroxy-Methyl-Propane", 8, 1, Option.none())).toEqual(
			AotrtChemicalSolution.MissingONumber(),
		)
	})

	test("treats a reversed diamond pair identically to the canonical pair", () => {
		expect(solveAotrtChemical("1,3,5-Tera-Nitra-Phenol", 7, 1, Option.some(4))).toEqual(
			AotrtChemicalSolution.Solved({ steps: [24, 22, 15] }),
		)
		expect(solveAotrtChemical("1,3,5-Tera-Nitra-Phenol", 7, 1, Option.none())).toEqual(
			AotrtChemicalSolution.MissingONumber(),
		)
	})

	test("reports the wrong TV color when the pair is not a diamond", () => {
		expect(
			solveAotrtChemical("Octahydro-2,5-Nitro-3,4,7-Parazokine", 2, 2, Option.some(4)),
		).toEqual(AotrtChemicalSolution.WrongTvColor())
		expect(solveAotrtChemical("Octahydro-2,5-Nitro-3,4,7-Parazokine", 8, 7, Option.none())).toEqual(
			AotrtChemicalSolution.WrongTvColor(),
		)
	})

	test("keeps 6,6 as a valid diamond", () => {
		expect(solveAotrtChemical("1,3,5-Tera-Nitra-Phenol", 6, 6, Option.some(2))._tag).toBe("Solved")
	})
})

describe("decodeAotrtDiamondInput", () => {
	test("accepts positive whole numbers", () => {
		expect(Option.getOrThrow(decodeAotrtDiamondInput({ top: "1", left: "7" }))).toEqual({
			top: 1,
			left: 7,
		})
	})

	test("rejects blank, zero, decimal, and negative input", () => {
		const rejected = [
			{ top: "", left: "7" },
			{ top: "0", left: "7" },
			{ top: "1.5", left: "7" },
			{ top: "-1", left: "7" },
			{ top: "1", left: "0" },
			{ top: "eight", left: "1" },
		]

		for (const input of rejected) {
			expect(Option.isNone(decodeAotrtDiamondInput(input))).toBe(true)
		}
	})
})
