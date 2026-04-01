import { Option } from "effect"
import { describe, expect, test } from "vitest"
import { getGameByKey, getGames } from "@/data/games"
import { assertSortedDescByDate } from "@/tests/helpers"

describe("getGames", () => {
	test("sorted by release date descending", () => {
		assertSortedDescByDate(getGames().map(g => g.releaseDate))
	})
})

describe("getGameByKey", () => {
	test("returns the game by its key when it exists", () => {
		const game = getGameByKey("world-at-war").pipe(Option.getOrThrow)
		expect(game).toBeDefined()
		expect(game.id).toBe("world-at-war")
	})

	test("returns None when the game does not exist", () => {
		// @ts-expect-error invalid key
		const game = getGameByKey("invalid-game")
		expect(Option.isNone(game)).toBe(true)
	})
})
