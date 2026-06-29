/** Scroll positions in the 3x3 grid, row-major from top-left. */
export const SCROLL_POSITIONS = [
	"Top Left",
	"Top Middle",
	"Top Right",
	"Middle Left",
	"Middle",
	"Middle Right",
	"Bottom Left",
	"Bottom Middle",
	"Bottom Right",
] as const

/**
 * When scroll `row` is pressed, each `true` column toggles that scroll.
 * Verified in-game on Kowakujō Storage Rooms scroll puzzle.
 */
export const KOWAKUJO_SCROLL_TOGGLE_MATRIX: boolean[][] = [
	// TL  TM  TR  ML  M   MR  BL  BM  BR
	[true, true, false, true, false, false, false, false, false],
	[true, true, true, false, true, false, false, false, false],
	[false, true, true, false, false, true, false, false, false],
	[true, false, false, true, true, false, true, false, false],
	[false, true, false, true, true, true, false, false, false],
	[false, false, true, false, true, true, false, false, true],
	[false, false, false, true, false, false, true, true, false],
	[false, false, false, false, true, false, true, true, true],
	[false, false, false, false, false, true, false, true, true],
]

export const SCROLL_COUNT = KOWAKUJO_SCROLL_TOGGLE_MATRIX.length

const ALL_SCROLLS_IN = Array.from({ length: SCROLL_COUNT }, () => true)

/** XOR of required toggles on these indices must be even for a solution to exist. */
const SOLVABILITY_PARITY_INDICES = [1, 3, 4, 5, 7] as const

function computePressEffect(presses: readonly boolean[]): boolean[] {
	const effect = Array.from({ length: SCROLL_COUNT }, () => false)

	for (let scroll = 0; scroll < SCROLL_COUNT; scroll++) {
		if (!presses[scroll]) continue

		for (let affected = 0; affected < SCROLL_COUNT; affected++) {
			if (KOWAKUJO_SCROLL_TOGGLE_MATRIX[scroll]?.[affected]) {
				effect[affected] = !effect[affected]
			}
		}
	}

	return effect
}

function getRequiredToggles(
	current: readonly boolean[],
	goal: readonly boolean[] = ALL_SCROLLS_IN,
): boolean[] {
	return current.map((isIn, index) => isIn !== goal[index])
}

/**
 * Each press toggles scrolls according to the puzzle matrix. Over GF(2) this is
 * `A * presses = requiredToggles`. Among all valid press sets, pressing a scroll
 * twice cancels out, so the shortest path uses each scroll at most once.
 */
function findMinimumWeightPresses(requiredToggles: readonly boolean[]): boolean[] | null {
	const augmented = Array.from({ length: SCROLL_COUNT }, (_, affectedIndex) => {
		const equation = Array.from(
			{ length: SCROLL_COUNT },
			(_, pressIndex) => KOWAKUJO_SCROLL_TOGGLE_MATRIX[pressIndex]?.[affectedIndex] ?? false,
		)
		equation.push(requiredToggles[affectedIndex] ?? false)
		return equation
	})

	const pivotColumns: number[] = []
	let pivotRow = 0

	for (let col = 0; col < SCROLL_COUNT && pivotRow < SCROLL_COUNT; col++) {
		let swapRow = -1
		for (let row = pivotRow; row < SCROLL_COUNT; row++) {
			if (augmented[row]?.[col]) {
				swapRow = row
				break
			}
		}

		if (swapRow === -1) continue

		if (swapRow !== pivotRow) {
			const currentRow = augmented[pivotRow]
			const swapTarget = augmented[swapRow]
			if (!currentRow || !swapTarget) continue
			augmented[pivotRow] = swapTarget
			augmented[swapRow] = currentRow
		}

		const pivot = augmented[pivotRow]
		if (!pivot) continue

		for (let row = 0; row < SCROLL_COUNT; row++) {
			if (row === pivotRow || !augmented[row]?.[col]) continue
			const target = augmented[row]!
			for (let xorCol = col; xorCol < SCROLL_COUNT + 1; xorCol++) {
				target[xorCol] = target[xorCol] !== pivot[xorCol]
			}
		}

		pivotColumns.push(col)
		pivotRow++
	}

	for (let row = pivotRow; row < SCROLL_COUNT; row++) {
		const inconsistent =
			augmented[row]?.slice(0, SCROLL_COUNT).every(value => !value) &&
			augmented[row]?.[SCROLL_COUNT]
		if (inconsistent) return null
	}

	const isPivotColumn = Array.from({ length: SCROLL_COUNT }, () => false)
	for (const col of pivotColumns) {
		isPivotColumn[col] = true
	}

	const freeColumns = Array.from({ length: SCROLL_COUNT }, (_, col) => col).filter(
		col => !isPivotColumn[col],
	)

	const pivotColumnByRow = new Map<number, number>()
	for (let row = 0; row < pivotColumns.length; row++) {
		const col = pivotColumns[row]
		if (col !== undefined) pivotColumnByRow.set(row, col)
	}

	const assignFromAugmented = (assignment: boolean[], freeValues: readonly boolean[]): void => {
		assignment.fill(false)
		for (const [freeIndex, col] of freeColumns.entries()) {
			assignment[col] = freeValues[freeIndex] ?? false
		}

		for (let row = pivotColumns.length - 1; row >= 0; row--) {
			const pivotCol = pivotColumnByRow.get(row)
			const equation = augmented[row]
			if (pivotCol === undefined || !equation) continue

			let value = equation[SCROLL_COUNT] ?? false
			for (let col = pivotCol + 1; col < SCROLL_COUNT; col++) {
				if (equation[col] && assignment[col]) value = !value
			}
			assignment[pivotCol] = value
		}
	}

	let bestPresses: boolean[] | null = null
	let bestPressCount = Number.POSITIVE_INFINITY
	const candidate = Array.from({ length: SCROLL_COUNT }, () => false)

	for (let mask = 0; mask < 1 << freeColumns.length; mask++) {
		const freeValues = Array.from(
			{ length: freeColumns.length },
			(_, index) => ((mask >> index) & 1) === 1,
		)
		assignFromAugmented(candidate, freeValues)

		const pressCount = candidate.filter(Boolean).length
		if (pressCount < bestPressCount) {
			bestPressCount = pressCount
			bestPresses = [...candidate]
		}
	}

	return bestPresses
}

function hasSolvableParity(requiredToggles: readonly boolean[]): boolean {
	const parity = SOLVABILITY_PARITY_INDICES.reduce(
		(acc, index) => acc ^ Number(requiredToggles[index]),
		0,
	)
	return parity === 0
}

export function isScrollPuzzleSolvable(
	current: readonly boolean[],
	goal: readonly boolean[] = ALL_SCROLLS_IN,
): boolean {
	if (current.length !== SCROLL_COUNT || goal.length !== SCROLL_COUNT) {
		return false
	}

	return hasSolvableParity(getRequiredToggles(current, goal))
}

/**
 * Returns the fewest scrolls to melee so every scroll matches `goal`, or null
 * when the selected layout cannot reach the goal.
 */
export function solveScrollPuzzle(
	current: readonly boolean[],
	goal: readonly boolean[] = ALL_SCROLLS_IN,
): number[] | null {
	if (current.length !== SCROLL_COUNT || goal.length !== SCROLL_COUNT) {
		return null
	}

	const requiredToggles = getRequiredToggles(current, goal)
	if (!hasSolvableParity(requiredToggles)) {
		return null
	}

	const minimumPresses = findMinimumWeightPresses(requiredToggles)
	if (!minimumPresses) {
		return null
	}

	return minimumPresses.flatMap((shouldPress, index) => (shouldPress ? [index] : []))
}

export function applyScrollPresses(
	state: readonly boolean[],
	presses: readonly number[],
): boolean[] {
	const pressVector = Array.from({ length: SCROLL_COUNT }, () => false)
	for (const index of presses) {
		if (index < 0 || index >= SCROLL_COUNT) continue
		pressVector[index] = !pressVector[index]
	}

	const toggled = computePressEffect(pressVector)
	return state.map((isIn, index) => isIn !== toggled[index])
}
