import type { GamesImagePath } from "@/types/generated/image-paths.gen"
import { Option } from "effect"
import { sortDates } from "@/utils/shared-functions"

export interface Game {
	/** The internal tag to discriminate against for type-narrowing */
	readonly _tag: "Game"
	/** The unique identifier of the game */
	readonly id: string
	/** The title of the game */
	readonly title: string
	/**
	 * Release calendar day as an ISO 8601 date-only string (`YYYY-MM-DD`).
	 */
	readonly releaseDate: string
	/** The image of the game */
	readonly image: GamesImagePath
}

/** Union type of all game keys */
export type GameKey = Parameters<typeof GAMES.get>[0]

/** Gets all games.
 * @returns An array of all games.
 */
export const getGames = (): Game[] =>
	[...GAMES.values()].sort((a, b) => sortDates(b.releaseDate, a.releaseDate))

/** Gets a game by its key.
 * @param key The key of the game.
 * @returns The game.
 */
export const getGameByKey = (key: GameKey) => Option.fromUndefinedOr(GAMES.get(key))

const makeGame = <T extends string>(identifier: T, game: Omit<Game, "_tag" | "id">): [T, Game] => [
	identifier,
	{
		_tag: "Game" as const,
		id: identifier,
		...game,
	},
]

const GAMES = new Map([
	makeGame("world-at-war", {
		title: "World at War",
		releaseDate: "2008-11-11",
		image: "/games/world-at-war_logo.webp",
	}),
	makeGame("black-ops-1", {
		title: "Black Ops 1",
		releaseDate: "2010-11-09",
		image: "/games/black-ops-1_logo.webp",
	}),
	makeGame("black-ops-2", {
		title: "Black Ops 2",
		releaseDate: "2012-11-12",
		image: "/games/black-ops-2_logo.webp",
	}),
	makeGame("black-ops-3", {
		title: "Black Ops 3",
		releaseDate: "2015-11-06",
		image: "/games/black-ops-3_logo.webp",
	}),
	makeGame("black-ops-4", {
		title: "Black Ops 4",
		releaseDate: "2018-10-11",
		image: "/games/black-ops-4_logo.webp",
	}),
	makeGame("black-ops-cold-war", {
		title: "Black Ops Cold War",
		releaseDate: "2020-11-13",
		image: "/games/black-ops-cold-war_logo.webp",
	}),
	makeGame("black-ops-6", {
		title: "Black Ops 6",
		releaseDate: "2024-10-25",
		image: "/games/black-ops-6_logo.webp",
	}),
	makeGame("black-ops-7", {
		title: "Black Ops 7",
		releaseDate: "2025-11-14",
		image: "/games/black-ops-7_logo.webp",
	}),
])
