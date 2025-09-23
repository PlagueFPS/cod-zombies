/** Gets all games.
 * @returns An array of all games.
 */
export const getGames = (): Game[] => Object.values(gameRegistry).sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime())

/** Gets a game by its key.
 * @param key The key of the game.
 * @returns The game.
 */
export const getGameByKey = (key: GameKey): Game => gameRegistry[key]

export interface Game {
	/** The unique identifier of the game */
	id: string
	/** The title of the game */
	title: string
	/** The release date of the game */
	releaseDate: Date
	/** The image of the game */
	image: string
}

const gameRegistry = {
	worldAtWar: {
		id: "world-at-war",
		title: "World at War",
		releaseDate: new Date("November 11, 2008 7:00 AM"),
		image: "/games/world-at-war_logo.webp",
	},
	blackOps1: {
		id: "black-ops-1",
		title: "Black Ops 1",
		releaseDate: new Date("November 9, 2010 7:00 AM"),
		image: "/games/black-ops-1_logo.webp",
	},
	blackOps2: {
		id: "black-ops-2",
		title: "Black Ops 2",
		releaseDate: new Date("November 12, 2012 7:00 AM"),
		image: "/games/black-ops-2_logo.webp",
	},
	blackOps3: {
		id: "black-ops-3",
		title: "Black Ops 3",
		releaseDate: new Date("November 6, 2015 7:00 AM"),
		image: "/games/black-ops-3_logo.webp",
	},
	blackOps4: {
		id: "black-ops-4",
		title: "Black Ops 4",
		releaseDate: new Date("October 11, 2018 7:00 AM"),
		image: "/games/black-ops-4_logo.webp",
	},
	blackOpsColdWar: {
		id: "black-ops-cold-war",
		title: "Black Ops Cold War",
		releaseDate: new Date("November 13, 2020 7:00 AM"),
		image: "/games/black-ops-cold-war_logo.webp",
	},
	blackOps6: {
		id: "black-ops-6",
		title: "Black Ops 6",
		releaseDate: new Date("October 25, 2024 7:00 AM"),
		image: "/games/black-ops-6_logo.webp",
	},
} as const satisfies Record<string, Game>

export type GameKey = keyof typeof gameRegistry
export const {
	worldAtWar,
	blackOps1,
	blackOps2,
	blackOps3,
	blackOps4,
	blackOpsColdWar,
	blackOps6,
} = gameRegistry
