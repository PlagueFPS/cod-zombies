import { describe, expect, test } from "vitest"
import {
	solveTbfbDiskPuzzle,
	TBFB_DISK_PATHS,
	TBFB_DISK_SYMBOLS,
	type TbfbDiskSymbolId,
} from "@/data/tbfb-disk-puzzle"

const symbolIds = new Set<TbfbDiskSymbolId>(TBFB_DISK_SYMBOLS.map(symbol => symbol.id))

/**
 * Game disk ids from cp_final_puzzle_combos.csv.
 * 1 triangles, 2 N, 3 chevron, 4 K, 5 V-shield, 6 diamond-cross,
 * 7 crown, 8 butterfly, 9 figure, 10 notched-plus-cross, 11 X, 12 plus.
 */
const GAME_ID_TO_SYMBOL = {
	1: "triple-slash",
	2: "n",
	3: "chevron",
	4: "lambda",
	5: "wings-diamond",
	6: "four-triangles",
	7: "chevron-bar",
	8: "wings-triangle",
	9: "eagle",
	10: "corner-brackets",
	11: "x",
	12: "plus",
} as const satisfies Record<number, TbfbDiskSymbolId>

type GameDiskId = keyof typeof GAME_ID_TO_SYMBOL

/** The 58 combos the game can deal. Each one belongs to exactly one chart row. */
const PUBLISHED_COMBO_IDS = [
	[1, 5, 9, 4],
	[1, 5, 9, 12],
	[1, 5, 9, 2],
	[1, 5, 4, 12],
	[1, 5, 4, 2],
	[1, 5, 12, 2],
	[5, 9, 4, 12],
	[5, 9, 4, 2],
	[5, 9, 12, 2],
	[5, 4, 12, 2],
	[2, 6, 10, 3],
	[2, 6, 3, 11],
	[2, 6, 3, 5],
	[2, 10, 3, 11],
	[2, 10, 3, 5],
	[2, 3, 11, 5],
	[3, 7, 11, 6],
	[3, 7, 11, 5],
	[3, 7, 11, 9],
	[3, 7, 6, 5],
	[3, 7, 6, 9],
	[3, 7, 5, 9],
	[3, 11, 6, 9],
	[3, 11, 5, 9],
	[3, 6, 5, 9],
	[7, 11, 6, 9],
	[7, 11, 5, 9],
	[7, 6, 5, 9],
	[11, 6, 5, 9],
	[4, 8, 12, 9],
	[4, 8, 12, 1],
	[4, 8, 12, 2],
	[4, 8, 9, 1],
	[4, 8, 9, 2],
	[4, 8, 1, 2],
	[8, 12, 9, 1],
	[8, 12, 9, 2],
	[8, 12, 1, 2],
	[8, 9, 1, 2],
	[4, 3, 10, 11],
	[4, 3, 10, 5],
	[4, 3, 10, 6],
	[4, 3, 11, 5],
	[4, 3, 11, 6],
	[4, 3, 5, 6],
	[4, 10, 11, 5],
	[4, 10, 11, 6],
	[4, 10, 5, 6],
	[4, 11, 5, 6],
	[2, 7, 10, 6],
	[2, 7, 10, 11],
	[2, 7, 10, 5],
	[2, 7, 6, 11],
	[2, 7, 6, 5],
	[2, 7, 11, 5],
	[7, 10, 6, 11],
	[7, 10, 6, 5],
	[7, 10, 11, 5],
] as const satisfies readonly (readonly GameDiskId[])[]

describe("solveTbfbDiskPuzzle", () => {
	test("waits until four distinct symbols are selected", () => {
		expect(solveTbfbDiskPuzzle(["n", "eagle", "lambda"])).toEqual([])
		expect(solveTbfbDiskPuzzle(["n", "n", "eagle", "lambda"])).toEqual([])
	})

	test("orders X, N, chevron, and V-shield as they appear on path 1", () => {
		expect(solveTbfbDiskPuzzle(["x", "n", "chevron", "wings-diamond"])).toEqual([
			{ path: 1, order: ["n", "chevron", "x", "wings-diamond"] },
		])
	})

	test("returns one path when only that path contains the four symbols", () => {
		expect(solveTbfbDiskPuzzle(["triple-slash", "wings-diamond", "eagle", "lambda"])).toEqual([
			{ path: 2, order: ["triple-slash", "wings-diamond", "eagle", "lambda"] },
		])
	})

	test("lists every order when more than one path contains the four symbols", () => {
		expect(solveTbfbDiskPuzzle(["n", "eagle", "lambda", "plus"])).toEqual([
			{ path: 2, order: ["eagle", "lambda", "plus", "n"] },
			{ path: 3, order: ["lambda", "plus", "eagle", "n"] },
		])
	})

	test("lists a different order for each path that contains the four symbols", () => {
		expect(solveTbfbDiskPuzzle(["corner-brackets", "chevron", "x", "wings-diamond"])).toEqual([
			{ path: 1, order: ["corner-brackets", "chevron", "x", "wings-diamond"] },
			{ path: 4, order: ["chevron", "corner-brackets", "x", "wings-diamond"] },
		])
	})

	test("keeps both paths when they produce the same insertion order", () => {
		expect(solveTbfbDiskPuzzle(["n", "four-triangles", "x", "wings-diamond"])).toEqual([
			{ path: 1, order: ["n", "four-triangles", "x", "wings-diamond"] },
			{ path: 5, order: ["n", "four-triangles", "x", "wings-diamond"] },
		])
	})

	test("returns nothing when the four symbols are not on one path", () => {
		expect(solveTbfbDiskPuzzle(["x", "n", "plus", "eagle"])).toEqual([])
	})

	test("resolves every published combo to exactly one insertion order", () => {
		expect(PUBLISHED_COMBO_IDS).toHaveLength(58)

		for (const comboIds of PUBLISHED_COMBO_IDS) {
			const picked = comboIds.map(id => GAME_ID_TO_SYMBOL[id])

			const containing = TBFB_DISK_PATHS.filter(path => {
				const symbols = new Set<TbfbDiskSymbolId>(path.symbols)

				return picked.every(symbol => symbols.has(symbol))
			})

			expect(containing).toHaveLength(1)

			const path = containing[0]

			if (!path) throw new Error(`missing path for ${picked.join(", ")}`)

			expect(solveTbfbDiskPuzzle(picked)).toEqual([
				{
					path: path.id,
					order: path.symbols.filter(symbol => picked.includes(symbol)),
				},
			])
		}
	})
})

describe("TBFB_DISK_PATHS", () => {
	test("lists six paths of known symbols", () => {
		expect(TBFB_DISK_PATHS).toHaveLength(6)

		for (const path of TBFB_DISK_PATHS) {
			expect(path.symbols).toHaveLength(6)
			expect(new Set(path.symbols).size).toBe(6)

			for (const symbol of path.symbols) {
				expect(symbolIds.has(symbol)).toBe(true)
			}
		}
	})

	test("matches the six chart rows from the game", () => {
		expect(TBFB_DISK_PATHS.map(path => [...path.symbols])).toEqual([
			// N, diamond-cross, notched-plus-cross, chevron, X, V-shield
			["n", "four-triangles", "corner-brackets", "chevron", "x", "wings-diamond"],
			// triangles, V-shield, figure, K, plus, N
			["triple-slash", "wings-diamond", "eagle", "lambda", "plus", "n"],
			// K, butterfly, plus, figure, triangles, N
			["lambda", "wings-triangle", "plus", "eagle", "triple-slash", "n"],
			// K, chevron, notched-plus-cross, X, V-shield, diamond-cross
			["lambda", "chevron", "corner-brackets", "x", "wings-diamond", "four-triangles"],
			// N, crown, notched-plus-cross, diamond-cross, X, V-shield
			["n", "chevron-bar", "corner-brackets", "four-triangles", "x", "wings-diamond"],
			// chevron, crown, X, diamond-cross, V-shield, figure
			["chevron", "chevron-bar", "x", "four-triangles", "wings-diamond", "eagle"],
		])
	})
})
