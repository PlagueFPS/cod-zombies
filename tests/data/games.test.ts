import { describe, it } from "vitest"
import { convertIdToGameKey } from "../../data/games"

describe("convertIdToGameKey", () => {
	it("should convert a game ID to a game key", ({ expect }) => {
		expect(convertIdToGameKey("black-ops-1")).toBe("blackOps1")
		expect(convertIdToGameKey("black-ops-cold-war")).toBe("blackOpsColdWar")
	})

	it("should throw an error for invalid game IDs", ({ expect }) => {
		expect(() => convertIdToGameKey("invalid-game-id")).toThrowError(
			"Invalid game key: invalidGameId",
		)
	})
})
