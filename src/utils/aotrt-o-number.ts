import { Schema } from "effect"

/** Chemical-step O values for Attack of the Radioactive Thing. */
export const O_NUMBERS = [2, 4, 5, 6, 8, 9, 11, 15] as const

export type ONumber = (typeof O_NUMBERS)[number]

/** Which row on Elvira's TV to read. The printed color changes each game. */
export type AotrtTvColorRow = "top" | "middle" | "bottom"

/**
 * Middle row width above the top TV number.
 * Top number 61 means the middle row is 61–63 and the bottom row is greater than 63.
 */
const TV_MIDDLE_SPAN = 2

export type AotrtTvColor = {
	/** O × M. */
	product: number
	row: AotrtTvColorRow
	/** First number on the middle TV row. Same as the top TV number. */
	middleStart: number
	/** Last number on the middle TV row, and the number beside ">" on the bottom row. */
	middleEnd: number
}

export type AotrtONumberResult = {
	/** Top TV number ÷ M, before rounding. */
	quotient: number
	/** Quotient rounded to the nearest whole number. Halves round away from zero. */
	rounded: number
	/** Closest O value to `rounded`. An equal distance resolves to the lower value. */
	oNumber: ONumber
	tvColor: AotrtTvColor
}

const PositiveWholeNumberFromString = Schema.FiniteFromString.pipe(
	Schema.check(Schema.isInt(), Schema.isGreaterThan(0)),
)

const AotrtONumberInputSchema = Schema.Struct({
	m: PositiveWholeNumberFromString,
	topTvNumber: PositiveWholeNumberFromString,
})

export const decodeAotrtONumberInput = Schema.decodeUnknownExit(AotrtONumberInputSchema)

const ONumberFromString = Schema.FiniteFromString.pipe(Schema.decodeTo(Schema.Literals(O_NUMBERS)))

/** Accept a remembered O number. Only the values the number tool can produce are valid. */
export const decodeAotrtONumberString = Schema.decodeUnknownExit(ONumberFromString)

/**
 * Divide the top TV number by M, round to the nearest whole number, then pick
 * the closest chemical O value. `m` must be a positive finite number.
 */
export function solveAotrtONumber(m: number, topTvNumber: number): AotrtONumberResult {
	const quotient = topTvNumber / m
	const rounded = Math.round(quotient)
	const [first, ...rest] = O_NUMBERS
	let oNumber: ONumber = first
	let closestDistance = Math.abs(rounded - first)

	for (const candidate of rest) {
		const distance = Math.abs(rounded - candidate)

		if (distance < closestDistance) {
			oNumber = candidate
			closestDistance = distance
		}
	}

	return {
		quotient,
		rounded,
		oNumber,
		tvColor: classifyAotrtTvColor(oNumber * m, topTvNumber),
	}
}

/**
 * Place O × M on the TV.
 * Below the top number is the top color, the inclusive span through two above it is the middle color,
 * and anything higher is the bottom color.
 */
export function classifyAotrtTvColor(product: number, topTvNumber: number): AotrtTvColor {
	const middleStart = topTvNumber
	const middleEnd = topTvNumber + TV_MIDDLE_SPAN
	let row: AotrtTvColorRow

	if (product < topTvNumber) {
		row = "top"
	} else if (product <= middleEnd) {
		row = "middle"
	} else {
		row = "bottom"
	}

	return { product, row, middleStart, middleEnd }
}
