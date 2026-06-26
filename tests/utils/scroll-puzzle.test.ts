import { describe, expect, test } from "vitest"
import {
	applyScrollPresses,
	isScrollPuzzleSolvable,
	KOWAKUJO_SCROLL_TOGGLE_MATRIX,
	SCROLL_COUNT,
	solveScrollPuzzle,
} from "@/utils/scroll-puzzle"

const allIn = Array.from({ length: SCROLL_COUNT }, () => true)
const stateFromMask = (mask: number) =>
	Array.from({ length: SCROLL_COUNT }, (_, index) => ((mask >> index) & 1) === 1)

describe("solveScrollPuzzle", () => {
	test("returns no presses when puzzle is already solved", () => {
		expect(solveScrollPuzzle(allIn)).toEqual([])
	})

	test("exactly half of all states are solvable", () => {
		let solvableCount = 0

		for (let mask = 0; mask < 1 << SCROLL_COUNT; mask++) {
			if (isScrollPuzzleSolvable(stateFromMask(mask))) solvableCount++
		}

		expect(solvableCount).toBe(256)
	})

	test("pressing a scroll twice cancels out", () => {
		for (let scroll = 0; scroll < SCROLL_COUNT; scroll++) {
			const once = applyScrollPresses(allIn, [scroll])
			const twice = applyScrollPresses(once, [scroll])
			expect(twice).toEqual(allIn)
		}
	})

	test("solution presses reach the all-in goal", () => {
		for (let mask = 0; mask < 1 << SCROLL_COUNT; mask++) {
			const state = stateFromMask(mask)
			if (!isScrollPuzzleSolvable(state)) continue

			const presses = solveScrollPuzzle(state)
			expect(presses).not.toBeNull()

			const solved = applyScrollPresses(state, presses ?? [])
			expect(solved).toEqual(allIn)
		}
	})

	test("toggle matrix matches in-game behavior", () => {
		const expectations: Record<number, number[]> = {
			0: [0, 1, 3],
			1: [0, 1, 2, 4],
			2: [1, 2, 5],
			3: [0, 3, 4, 6],
			4: [1, 3, 4, 5],
			5: [2, 4, 5, 8],
			6: [3, 6, 7],
			7: [4, 6, 7, 8],
			8: [5, 7, 8],
		}

		for (const [scroll, affected] of Object.entries(expectations)) {
			const row = KOWAKUJO_SCROLL_TOGGLE_MATRIX[Number(scroll)]
			expect(row).toBeDefined()
			const actual = row!.flatMap((isAffected, index) => (isAffected ? [index] : []))
			expect(actual).toEqual(affected)
		}
	})

	test("prefers fewer presses when multiple solutions exist", () => {
		const state = stateFromMask(1 << 1)
		const presses = solveScrollPuzzle(state)
		expect(presses).not.toBeNull()
		expect(presses?.length).toBeLessThanOrEqual(4)
	})

	test("returns null when only bottom left is pushed in", () => {
		const bottomLeftOnly = stateFromMask(1 << 6)
		expect(isScrollPuzzleSolvable(bottomLeftOnly)).toBe(false)
		expect(solveScrollPuzzle(bottomLeftOnly)).toBeNull()
	})

	test("returns null for unsolvable layouts", () => {
		for (let mask = 0; mask < 1 << SCROLL_COUNT; mask++) {
			const state = stateFromMask(mask)
			if (isScrollPuzzleSolvable(state)) continue

			expect(solveScrollPuzzle(state)).toBeNull()
		}
	})

	test("uses the fewest presses for every solvable layout", () => {
		for (let mask = 0; mask < 1 << SCROLL_COUNT; mask++) {
			const state = stateFromMask(mask)
			if (!isScrollPuzzleSolvable(state)) continue

			let minimumPressCount = Number.POSITIVE_INFINITY
			for (let pressMask = 0; pressMask < 1 << SCROLL_COUNT; pressMask++) {
				const presses = stateFromMask(pressMask)
				const solved = applyScrollPresses(
					state,
					presses.flatMap((shouldPress, index) => (shouldPress ? [index] : [])),
				)
				if (!solved.every((isIn, index) => isIn === allIn[index])) continue

				const pressCount = presses.filter(Boolean).length
				if (pressCount < minimumPressCount) minimumPressCount = pressCount
			}

			expect(solveScrollPuzzle(state)?.length).toBe(minimumPressCount)
		}
	})
})
