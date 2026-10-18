/** Facing encoded 0–3. Front (2) points at the central Barbarossa statue. */
export const STATUE_DIRECTIONS = [0, 1, 2, 3] as const

export type StatueDirection = (typeof STATUE_DIRECTIONS)[number]

export const TARGET_DIRECTION = 2 satisfies StatueDirection

export const DIRECTION_SYMBOLS: Record<StatueDirection, string> = {
	0: "↑",
	1: "→",
	2: "↓",
	3: "←",
}

export const DIRECTION_NAMES: Record<StatueDirection, string> = {
	0: "back",
	1: "right",
	2: "front",
	3: "left",
}

export const STATUE_LABELS = ["A", "B", "C", "D"] as const

export type StatueLabel = (typeof STATUE_LABELS)[number]

/**
 * How far statue `j` advances, mod 4, each time a turn affects it.
 * Walls run counter-clockwise from the three-statue wall left of the stairs.
 */
export const WALL_OFFSETS = {
	1: [1, 1, 1],
	2: [1, 2, 1, 1],
	3: [2, 1, 1, 2],
	4: [1, 3, 1, 2],
} as const satisfies Record<number, readonly number[]>

export type WallId = keyof typeof WALL_OFFSETS

export const WALL_IDS = [1, 2, 3, 4] as const satisfies readonly WallId[]

export type StatueTurn = {
	statue: StatueLabel
	times: number
}

export type StatueSolveResult =
	| { status: "solved"; turns: readonly StatueTurn[] }
	| { status: "invalid"; statue: StatueLabel }
	| { status: "unsolved" }

const MAX_TURNS_PER_STATUE = 4

function advance(direction: StatueDirection, offset: number): StatueDirection {
	const next = STATUE_DIRECTIONS[(direction + offset) % STATUE_DIRECTIONS.length]

	if (next === undefined) return direction

	return next
}

/**
 * Turning statue `index` advances that statue and its immediate neighbors.
 * Each affected statue steps by its own offset, not the offset of the statue turned.
 */
export function turnStatue(
	directions: readonly StatueDirection[],
	offsets: readonly number[],
	index: number,
): StatueDirection[] {
	const next = [...directions]
	const start = Math.max(0, index - 1)
	const end = Math.min(directions.length - 1, index + 1)

	for (let statue = start; statue <= end; statue++) {
		const direction = next[statue]
		const offset = offsets[statue]

		if (direction === undefined || offset === undefined) continue

		next[statue] = advance(direction, offset)
	}

	return next
}

function neededRotations(direction: number, offset: number): number {
	for (let rotations = 0; rotations < STATUE_DIRECTIONS.length; rotations++) {
		if ((direction + offset * rotations) % STATUE_DIRECTIONS.length === TARGET_DIRECTION) {
			return rotations
		}
	}

	return -1
}

function recordTurn(turns: StatueTurn[], index: number, times: number) {
	if (times === 0) return

	const statue = STATUE_LABELS[index]

	if (statue === undefined) return

	turns.push({ statue, times })
}

/**
 * An offset of 2 only flips between two facings. When the other statue still
 * needs two more turns than that, further alignment turns cannot make the
 * counts equal. The later pair-solve absorbs the extra full cycle.
 */
function pairCannotMatch(
	leftOffset: number,
	rightOffset: number,
	leftNeeded: number,
	rightNeeded: number,
) {
	return (leftOffset === 2 || rightOffset === 2) && Math.abs(leftNeeded - rightNeeded) === 2
}

function readPair(
	directions: readonly StatueDirection[],
	offsets: readonly number[],
	left: number,
	right: number,
) {
	const leftDirection = directions[left]
	const rightDirection = directions[right]
	const leftOffset = offsets[left]
	const rightOffset = offsets[right]

	if (
		leftDirection === undefined ||
		rightDirection === undefined ||
		leftOffset === undefined ||
		rightOffset === undefined
	) {
		return null
	}

	return { leftDirection, rightDirection, leftOffset, rightOffset }
}

function alignPair(
	directions: StatueDirection[],
	offsets: readonly number[],
	mover: number,
	left: number,
	right: number,
): { directions: StatueDirection[]; turns: number } | null {
	let current = directions
	let turns = 0
	const initial = readPair(current, offsets, left, right)

	if (initial === null) return null

	let leftNeeded = neededRotations(initial.leftDirection, initial.leftOffset)
	let rightNeeded = neededRotations(initial.rightDirection, initial.rightOffset)
	let leftOffset = initial.leftOffset
	let rightOffset = initial.rightOffset

	while (leftNeeded !== rightNeeded) {
		if (leftNeeded < 0 || rightNeeded < 0) return null

		if (pairCannotMatch(leftOffset, rightOffset, leftNeeded, rightNeeded)) break

		current = turnStatue(current, offsets, mover)
		turns += 1

		if (turns > MAX_TURNS_PER_STATUE) return null

		const pair = readPair(current, offsets, left, right)

		if (pair === null) return null

		leftOffset = pair.leftOffset
		rightOffset = pair.rightOffset
		leftNeeded = neededRotations(pair.leftDirection, pair.leftOffset)
		rightNeeded = neededRotations(pair.rightDirection, pair.rightOffset)
	}

	return { directions: current, turns }
}

function solvePair(
	directions: StatueDirection[],
	offsets: readonly number[],
	mover: number,
	left: number,
	right: number,
): { directions: StatueDirection[]; turns: number } | null {
	let current = directions
	let turns = 0

	while (current[left] !== TARGET_DIRECTION || current[right] !== TARGET_DIRECTION) {
		current = turnStatue(current, offsets, mover)
		turns += 1

		if (turns > MAX_TURNS_PER_STATUE) return null
	}

	return { directions: current, turns }
}

function turnWhile(
	directions: StatueDirection[],
	offsets: readonly number[],
	index: number,
	pending: (directions: readonly StatueDirection[]) => boolean,
): { directions: StatueDirection[]; turns: number } | null {
	let current = directions
	let turns = 0

	while (pending(current)) {
		current = turnStatue(current, offsets, index)
		turns += 1

		if (turns > MAX_TURNS_PER_STATUE) return null
	}

	return { directions: current, turns }
}

function solveThree(
	directions: readonly StatueDirection[],
	offsets: readonly number[],
): StatueSolveResult {
	const turns: StatueTurn[] = []
	const alignedBC = turnWhile([...directions], offsets, 0, current => current[1] !== current[2])

	if (alignedBC === null) return { status: "unsolved" }

	recordTurn(turns, 0, alignedBC.turns)

	const alignedA = turnWhile(alignedBC.directions, offsets, 2, current => current[0] !== current[1])

	if (alignedA === null) return { status: "unsolved" }

	recordTurn(turns, 2, alignedA.turns)

	const solved = turnWhile(
		alignedA.directions,
		offsets,
		1,
		current => current[1] !== TARGET_DIRECTION,
	)

	if (solved === null) return { status: "unsolved" }

	recordTurn(turns, 1, solved.turns)

	return { status: "solved", turns }
}

function solveFour(
	directions: readonly StatueDirection[],
	offsets: readonly number[],
): StatueSolveResult {
	const turns: StatueTurn[] = []
	const alignedLeft = alignPair([...directions], offsets, 2, 0, 1)

	if (alignedLeft === null) return { status: "unsolved" }

	recordTurn(turns, 2, alignedLeft.turns)

	const alignedRight = alignPair(alignedLeft.directions, offsets, 1, 2, 3)

	if (alignedRight === null) return { status: "unsolved" }

	recordTurn(turns, 1, alignedRight.turns)

	const solvedLeft = solvePair(alignedRight.directions, offsets, 0, 0, 1)

	if (solvedLeft === null) return { status: "unsolved" }

	recordTurn(turns, 0, solvedLeft.turns)

	const solvedRight = solvePair(solvedLeft.directions, offsets, 3, 2, 3)

	if (solvedRight === null) return { status: "unsolved" }

	recordTurn(turns, 3, solvedRight.turns)

	return { status: "solved", turns }
}

/** Solve one wall. Turn order is A, C, B on wall 1, and C, B, A, D on the others. */
export function solveStatueWall(
	directions: readonly StatueDirection[],
	wallId: WallId,
): StatueSolveResult {
	const offsets = WALL_OFFSETS[wallId]

	if (directions.length !== offsets.length) return { status: "unsolved" }

	for (let index = 0; index < offsets.length; index++) {
		const offset = offsets[index]
		const direction = directions[index]
		const statue = STATUE_LABELS[index]

		if (offset === undefined || direction === undefined || statue === undefined) {
			return { status: "unsolved" }
		}

		if (offset === 2 && (direction === 1 || direction === 3)) {
			return { status: "invalid", statue }
		}
	}

	if (wallId === 1) return solveThree(directions, offsets)

	return solveFour(directions, offsets)
}

export function cycleFacing(direction: StatueDirection): StatueDirection {
	return advance(direction, 1)
}
