import { Exit } from "effect"
import { describe, expect, test } from "vitest"
import { expectExitSuccess } from "@/tests/helpers"
import {
	AotrtChemicalSolution,
	decodeAotrtDiamondInput,
	solveAotrtChemical,
	type AotrtChemical,
} from "@/utils/aotrt-chemical"
import { O_NUMBERS } from "@/utils/aotrt-o-number"

const DIAMONDS = [
	[8, 1],
	[1, 7],
	[3, 9],
	[6, 6],
	[8, 4],
	[4, 5],
] as const

/** Board values before subtracting O. Step order matches the chemical station. */
const BOARD = {
	"1,3,5-Tera-Nitra-Phenol": {
		"8,1": [21, 20, 18],
		"1,7": [28, 26, 19],
		"3,9": [29, 18, 26],
		"6,6": [31, 24, 21],
		"8,4": [36, 16, 25],
		"4,5": [43, 22, 17],
	},
	"3,4-Di-Nitroxy-Methyl-Propane": {
		"8,1": [24, 25, 29, 19],
		"1,7": [26, 23, 28, 16],
		"3,9": [20, 30, 41, 25],
		"6,6": [21, 17, 37, 22],
		"8,4": [19, 22, 33, 16],
		"4,5": [18, 16, 35, 24],
	},
	"Octahydro-2,5-Nitro-3,4,7-Parazokine": {
		"8,1": [24, 18, 44],
		"1,7": [26, 30, 27],
		"3,9": [20, 21, 51],
		"6,6": [21, 30, 41],
		"8,4": [19, 23, 38],
		"4,5": [18, 23, 42],
	},
	"3-Methyl-2,4-Dinitro Benzene": {
		"8,1": [30, 40, 28],
		"1,7": [27, 31, 21],
		"3,9": [38, 45, 20],
		"6,6": [34, 39, 17],
		"8,4": [23, 33, 29],
		"4,5": [36, 48, 19],
	},
} as const

const chemicals: ReadonlyArray<AotrtChemical> = [
	"1,3,5-Tera-Nitra-Phenol",
	"3,4-Di-Nitroxy-Methyl-Propane",
	"Octahydro-2,5-Nitro-3,4,7-Parazokine",
	"3-Methyl-2,4-Dinitro Benzene",
]

describe("solveAotrtChemical", () => {
	test("subtracts the O number from the 1,7 column of 1,3,5-Tera-Nitra-Phenol", () => {
		expect(solveAotrtChemical("1,3,5-Tera-Nitra-Phenol", 1, 7, 4)).toEqual(
			AotrtChemicalSolution.Solved({ steps: [24, 22, 15] }),
		)
	})

	test("subtracts every O number from every Acetaldehyde column", () => {
		for (const chemical of chemicals) {
			for (const [top, left] of DIAMONDS) {
				const bases = boardSteps(chemical, top, left)

				for (const oNumber of O_NUMBERS) {
					expect(solveAotrtChemical(chemical, top, left, oNumber)).toEqual(
						AotrtChemicalSolution.Solved({
							steps: bases.map(step => step - oNumber),
						}),
					)
				}
			}
		}
	})

	test("asks for the O number before printing steps for a valid diamond", () => {
		expect(solveAotrtChemical("3,4-Di-Nitroxy-Methyl-Propane", 8, 1, null)).toEqual(
			AotrtChemicalSolution.MissingONumber(),
		)
	})

	test("treats a reversed diamond as the proper pair", () => {
		const swapped = DIAMONDS.filter(([top, left]) => top !== left)

		for (const chemical of chemicals) {
			for (const [top, left] of swapped) {
				expect(solveAotrtChemical(chemical, left, top, 4)).toEqual(
					solveAotrtChemical(chemical, top, left, 4),
				)
				expect(solveAotrtChemical(chemical, left, top, null)).toEqual(
					AotrtChemicalSolution.MissingONumber(),
				)
			}
		}
	})

	test("reports the wrong TV color when the pair is not a diamond", () => {
		expect(solveAotrtChemical("Octahydro-2,5-Nitro-3,4,7-Parazokine", 2, 2, 4)).toEqual(
			AotrtChemicalSolution.WrongTvColor(),
		)
		expect(solveAotrtChemical("Octahydro-2,5-Nitro-3,4,7-Parazokine", 8, 7, null)).toEqual(
			AotrtChemicalSolution.WrongTvColor(),
		)
	})

	test("keeps 6,6 as a valid diamond", () => {
		expect(solveAotrtChemical("1,3,5-Tera-Nitra-Phenol", 6, 6, 2)._tag).toBe("Solved")
	})
})

describe("decodeAotrtDiamondInput", () => {
	test("accepts positive whole numbers", () => {
		expect(expectExitSuccess(decodeAotrtDiamondInput({ top: "1", left: "7" }))).toEqual({
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
			expect(Exit.isFailure(decodeAotrtDiamondInput(input))).toBe(true)
		}
	})
})

function boardSteps(chemical: AotrtChemical, top: number, left: number): readonly number[] {
	for (const [key, steps] of Object.entries(BOARD[chemical])) {
		if (key === `${top},${left}`) return steps
	}

	throw new Error(`missing board value for ${chemical} ${top},${left}`)
}
