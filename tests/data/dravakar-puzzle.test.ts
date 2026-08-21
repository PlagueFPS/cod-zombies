import { describe, expect, test } from "vitest"
import {
	DRAVAKAR_PUZZLE_QUOTES,
	formatDravakarSwitchInteractions,
	formatDravakarSwitchSolution,
} from "@/data/dravakar-puzzle"

describe("DRAVAKAR_PUZZLE_QUOTES", () => {
	test("includes four phrases", () => {
		expect(DRAVAKAR_PUZZLE_QUOTES).toHaveLength(4)
	})

	test("maps each phrase to the expected switch interactions", () => {
		const pressesByQuote = Object.fromEntries(
			DRAVAKAR_PUZZLE_QUOTES.map(entry => [entry.quote, entry.presses]),
		)

		expect(
			pressesByQuote[
				"I remember the runner that travels to stars, while moons and galaxies stay true"
			],
		).toEqual({ middle: 2, right: 3 })
		expect(
			pressesByQuote[
				"I drift to the runner that travels moons, who borrow from galaxies when stars stay true"
			],
		).toEqual({ left: 3, middle: 2, right: 1 })
		expect(
			pressesByQuote[
				"I drift to stars that remember moons, who borrow the runner that travels the galaxy"
			],
		).toEqual({ left: 1, middle: 2, right: 2 })
		expect(
			pressesByQuote[
				"I remember galaxies that drift to moons, who borrow the runner that travels the stars"
			],
		).toEqual({ left: 2, right: 2 })
	})
})

describe("formatDravakarSwitchInteractions", () => {
	test("omits switches that do not need to be interacted with", () => {
		expect(formatDravakarSwitchInteractions({ middle: 2, right: 3 })).toEqual([
			{ switch: "middle", label: "Middle", count: 2 },
			{ switch: "right", label: "Right", count: 3 },
		])
	})

	test("keeps left, middle, then right order", () => {
		expect(formatDravakarSwitchInteractions({ right: 1, left: 3, middle: 2 })).toEqual([
			{ switch: "left", label: "Left", count: 3 },
			{ switch: "middle", label: "Middle", count: 2 },
			{ switch: "right", label: "Right", count: 1 },
		])
	})
})

describe("formatDravakarSwitchSolution", () => {
	test("joins used switches into a single line", () => {
		expect(formatDravakarSwitchSolution({ middle: 2, right: 3 })).toBe("Middle 2x, Right 3x")
	})
})
