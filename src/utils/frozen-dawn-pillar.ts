import { Array as Arr, Match } from "effect"

export type PillarDirection = 0 | 1 | 2 | 3

export type PillarState = readonly [
	PillarDirection,
	PillarDirection,
	PillarDirection,
	PillarDirection,
]

export const PILLAR_IDS = [0, 1, 2, 3] as const

export const PILLAR_LABELS = ["A", "B", "C", "D"] as const

export const DIRECTION_SYMBOLS = ["↓", "→", "↑", "←"] as const

export const DIRECTION_NAMES = ["front", "right", "back", "left"] as const

export const INITIAL_PILLARS: PillarState = [0, 0, 0, 0]

export function rotatePillar(direction: number): PillarDirection {
	const remainder = direction % 4

	return Match.value(remainder).pipe(
		Match.when(1, () => 1 as const),
		Match.when(2, () => 2 as const),
		Match.when(3, () => 3 as const),
		Match.orElse(() => 0 as const),
	)
}

// Four shots restore every affected block, so counts from zero to three cover every solution.
const SHOT_COUNTS = Arr.makeBy(256, (index): PillarState => [
	rotatePillar(Math.floor(index / 64)),
	rotatePillar(Math.floor(index / 16)),
	rotatePillar(Math.floor(index / 4)),
	rotatePillar(index),
])

export function solvePillars(directions: PillarState) {
	return Arr.findFirst(
		SHOT_COUNTS,
		([a, b, c, d]) =>
			(directions[0] + 2 * a + b) % 4 === 0 &&
			(directions[1] + a + 2 * b + c) % 4 === 0 &&
			(directions[2] + b + 2 * c + d) % 4 === 0 &&
			(directions[3] + c + 2 * d) % 4 === 0,
	)
}
