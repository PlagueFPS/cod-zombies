import { describe, expect, test } from "vitest"
import { solveTbfbDiskPuzzle } from "@/data/tbfb-disk-puzzle"

describe("solveTbfbDiskPuzzle", () => {
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
})
