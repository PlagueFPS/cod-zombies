import type { ONumber } from "@/utils/aotrt-o-number"
import { Data, Schema } from "effect"

export type AotrtChemical =
	| "1,3,5-Tera-Nitra-Phenol"
	| "3,4-Di-Nitroxy-Methyl-Propane"
	| "Octahydro-2,5-Nitro-3,4,7-Parazokine"
	| "3-Methyl-2,4-Dinitro Benzene"

/** Top, then Left, for the six Acetaldehyde diamonds. */
const DIAMONDS = [
	[8, 1],
	[1, 7],
	[3, 9],
	[6, 6],
	[8, 4],
	[4, 5],
] as const

type DiamondKey = "8,1" | "1,7" | "3,9" | "6,6" | "8,4" | "4,5"

const diamondKey = (top: number, left: number) => `${top},${left}`

const DIAMOND_KEYS: ReadonlySet<string> = new Set(
	DIAMONDS.map(([top, left]) => diamondKey(top, left)),
)

/**
 * Chemical-board values for each Acetaldehyde column, before subtracting O.
 * Each list is step 1 through step 3 or 4.
 */
const CHEMICAL_STEPS = {
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
} as const satisfies Record<AotrtChemical, Record<DiamondKey, readonly number[]>>

export type AotrtChemicalSolution = Data.TaggedEnum<{
	WrongTvColor: {}
	MissingONumber: {}
	Solved: { readonly steps: readonly number[] }
}>

export const AotrtChemicalSolution = Data.taggedEnum<AotrtChemicalSolution>()

const { WrongTvColor, MissingONumber, Solved } = AotrtChemicalSolution

const PositiveWholeNumberFromString = Schema.FiniteFromString.pipe(
	Schema.check(Schema.isInt(), Schema.isGreaterThan(0)),
)

const AotrtDiamondInputSchema = Schema.Struct({
	top: PositiveWholeNumberFromString,
	left: PositiveWholeNumberFromString,
})

export const decodeAotrtDiamondInput = Schema.decodeUnknownExit(AotrtDiamondInputSchema)

const isDiamondKey = (key: string): key is DiamondKey => DIAMOND_KEYS.has(key)

/**
 * Look up the chemical-station numbers for one compound and Acetaldehyde diamond.
 * A reversed Top/Left pair is corrected to the diamond. Each board value is reduced by the session O number.
 */
export function solveAotrtChemical(
	chemical: AotrtChemical,
	top: number,
	left: number,
	oNumber: ONumber | null,
): AotrtChemicalSolution {
	const entered = diamondKey(top, left)
	const reversed = diamondKey(left, top)
	const key = isDiamondKey(entered) ? entered : isDiamondKey(reversed) ? reversed : null

	if (key === null) {
		return WrongTvColor()
	}

	if (oNumber === null) {
		return MissingONumber()
	}

	return Solved({
		steps: CHEMICAL_STEPS[chemical][key].map(step => step - oNumber),
	})
}
