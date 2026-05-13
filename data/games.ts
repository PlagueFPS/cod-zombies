import type { GamesImagePath } from "@/types/generated/image-paths.gen"
import { HashMap } from "effect"
import { sortDates } from "@/utils/shared-functions"

export interface Game {
	/** The internal tag to discriminate against for type-narrowing */
	readonly _tag: "Game"
	/** The unique identifier of the game */
	readonly id: string
	/** The title of the game */
	readonly title: string
	/** The release date of the game */
	readonly releaseDate: Date
	/** The image of the game */
	readonly image: GamesImagePath
}

/** Union type of all game keys */
export type GameKey = HashMap.HashMap.Key<typeof gameHashMap>

/** Gets all games.
 * @returns An array of all games.
 */
export const getGames = (): Game[] =>
	HashMap.toValues(gameHashMap).sort((a, b) => sortDates(b.releaseDate, a.releaseDate))

/** Gets a game by its key.
 * @param key The key of the game.
 * @returns The game.
 */
export const getGameByKey = (key: GameKey) => HashMap.get(gameHashMap, key)

const makeGame = <T extends string>(identifier: T, game: Omit<Game, "_tag" | "id">): [T, Game] => [
	identifier,
	{
		_tag: "Game" as const,
		id: identifier,
		...game,
	},
]

const gameHashMap = HashMap.make(
	makeGame("world-at-war", {
		title: "World at War",
		releaseDate: new Date("November 11, 2008"),
		image: "/games/world-at-war_logo.webp",
	}),
	makeGame("black-ops-1", {
		title: "Black Ops 1",
		releaseDate: new Date("November 9, 2010"),
		image: "/games/black-ops-1_logo.webp",
	}),
	makeGame("black-ops-2", {
		title: "Black Ops 2",
		releaseDate: new Date("November 12, 2012"),
		image: "/games/black-ops-2_logo.webp",
	}),
	makeGame("black-ops-3", {
		title: "Black Ops 3",
		releaseDate: new Date("November 6, 2015"),
		image: "/games/black-ops-3_logo.webp",
	}),
	makeGame("black-ops-4", {
		title: "Black Ops 4",
		releaseDate: new Date("October 11, 2018"),
		image: "/games/black-ops-4_logo.webp",
	}),
	makeGame("black-ops-cold-war", {
		title: "Black Ops Cold War",
		releaseDate: new Date("November 13, 2020"),
		image: "/games/black-ops-cold-war_logo.webp",
	}),
	makeGame("black-ops-6", {
		title: "Black Ops 6",
		releaseDate: new Date("October 25, 2024"),
		image: "/games/black-ops-6_logo.webp",
	}),
	makeGame("black-ops-7", {
		title: "Black Ops 7",
		releaseDate: new Date("November 14, 2025"),
		image: "/games/black-ops-7_logo.webp",
	}),
)
