import { Array as Arr } from "effect"
import { describe, expect, test } from "vitest"
import {
	solveStatueWall,
	STATUE_DIRECTIONS,
	STATUE_LABELS,
	TARGET_DIRECTION,
	turnStatue,
	WALL_IDS,
	WALL_OFFSETS,
	type StatueDirection,
	type StatueTurn,
	type WallId,
} from "@/utils/shadowed-throne-statue"

describe("turnStatue", () => {
	test("should advance a statue and its neighbors by each statue's own offset", () => {
		// Arrange
		const directions: StatueDirection[] = [0, 0, 0, 0]

		// Act
		const next = turnStatue(directions, WALL_OFFSETS[2], 1)

		// Assert
		expect(next).toEqual([1, 2, 1, 0])
	})
})

describe("solveStatueWall", () => {
	test("should return no turns when every statue already faces front", () => {
		// Arrange
		const directions: StatueDirection[] = [2, 2, 2]

		// Act
		const result = solveStatueWall(directions, 1)

		// Assert
		expect(result).toEqual({ status: "solved", turns: [] })
	})

	test("should turn statue B twice when wall 1 faces back", () => {
		// Arrange
		const directions: StatueDirection[] = [0, 0, 0]

		// Act
		const result = solveStatueWall(directions, 1)

		// Assert
		expect(result).toEqual({ status: "solved", turns: [{ statue: "B", times: 2 }] })
	})

	test("should turn C, then A, then D for wall 2 facing back", () => {
		// Arrange
		const directions: StatueDirection[] = [0, 0, 0, 0]

		// Act
		const result = solveStatueWall(directions, 2)

		// Assert
		expect(result).toEqual({
			status: "solved",
			turns: [
				{ statue: "C", times: 1 },
				{ statue: "A", times: 2 },
				{ statue: "D", times: 1 },
			],
		})
	})

	test("should name the first statue whose 180 degree step cannot reach front", () => {
		// Arrange
		const directions: StatueDirection[] = [2, 1, 2, 2]

		// Act
		const result = solveStatueWall(directions, 2)

		// Assert
		expect(result).toEqual({ status: "invalid", statue: "B" })
	})

	test("should reject exactly the facings an offset-2 statue cannot reach", () => {
		for (const wallId of WALL_IDS) {
			for (const directions of facings(WALL_OFFSETS[wallId].length)) {
				const result = solveStatueWall(directions, wallId)
				const unreachable = hasUnreachableFacing(directions, wallId)

				expect(result.status === "invalid").toBe(unreachable)
			}
		}
	})

	test("should reach front for every reachable facing", () => {
		for (const wallId of WALL_IDS) {
			for (const directions of facings(WALL_OFFSETS[wallId].length)) {
				if (hasUnreachableFacing(directions, wallId)) continue

				const result = solveStatueWall(directions, wallId)
				const turns = result.status === "solved" ? result.turns : null

				expect(turns).not.toBeNull()

				const solved = applyTurns(directions, wallId, turns ?? [])

				expect(solved).toEqual(Arr.map(directions, () => TARGET_DIRECTION))
			}
		}
	})
})

// Helpers

function facings(count: number): StatueDirection[][] {
	const total = STATUE_DIRECTIONS.length ** count
	const states: StatueDirection[][] = []

	for (let mask = 0; mask < total; mask++) {
		const state: StatueDirection[] = []
		let rest = mask

		for (let index = 0; index < count; index++) {
			state.push(STATUE_DIRECTIONS[rest % 4] ?? 0)
			rest = Math.floor(rest / 4)
		}

		states.push(state)
	}

	return states
}

function hasUnreachableFacing(directions: readonly StatueDirection[], wallId: WallId) {
	return Arr.some(
		directions,
		(direction, index) => WALL_OFFSETS[wallId][index] === 2 && (direction === 1 || direction === 3),
	)
}

function applyTurns(
	directions: readonly StatueDirection[],
	wallId: WallId,
	turns: readonly StatueTurn[],
) {
	let current = [...directions]

	for (const turn of turns) {
		const index = STATUE_LABELS.indexOf(turn.statue)

		for (let time = 0; time < turn.times; time++) {
			current = turnStatue(current, WALL_OFFSETS[wallId], index)
		}
	}

	return current
}
