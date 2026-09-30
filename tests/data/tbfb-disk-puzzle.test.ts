import { describe, expect, test } from "vitest"
import {
	solveTbfbDiskPuzzle,
	TBFB_DISK_PATHS,
	TBFB_DISK_SYMBOLS,
	type TbfbDiskSymbolId,
} from "@/data/tbfb-disk-puzzle"

const symbolIds = new Set<TbfbDiskSymbolId>(TBFB_DISK_SYMBOLS.map(symbol => symbol.id))

describe("solveTbfbDiskPuzzle", () => {
	test("waits until four distinct symbols are selected", () => {
		expect(solveTbfbDiskPuzzle(["n", "eagle", "lambda"])).toEqual([])
		expect(solveTbfbDiskPuzzle(["n", "n", "eagle", "lambda"])).toEqual([])
	})

	test("matches the slanted N, eagle, lambda, and skewed plus to path 2 only", () => {
		expect(solveTbfbDiskPuzzle(["n", "eagle", "lambda", "plus"])).toEqual([
			{ path: 2, order: ["eagle", "lambda", "plus", "n"] },
		])
	})

	test("returns one path when only that path contains the four symbols", () => {
		expect(solveTbfbDiskPuzzle(["triple-slash", "wings-diamond", "eagle", "lambda"])).toEqual([
			{ path: 2, order: ["triple-slash", "wings-diamond", "eagle", "lambda"] },
		])
	})

	test("returns every path whose four symbols are consecutive", () => {
		expect(solveTbfbDiskPuzzle(["corner-brackets", "chevron", "x", "wings-diamond"])).toEqual([
			{ path: 1, order: ["corner-brackets", "chevron", "x", "wings-diamond"] },
			{ path: 4, order: ["chevron", "corner-brackets", "x", "wings-diamond"] },
		])
	})

	test("returns nothing when the four symbols are not on one path", () => {
		expect(solveTbfbDiskPuzzle(["x", "n", "plus", "eagle"])).toEqual([])
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
})
