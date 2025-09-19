import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { GetEntriesError } from "@/types/errors"
import { CACHE_KEYS } from "@/utils/constants"

export const getGames = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.games.all)

	return await getGamesEffect.pipe(
		Effect.withLogSpan("get_games_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

const getGamesEffect = Effect.gen(function* () {
	const payload = yield* Payload
	const { docs } = yield* Effect.tryPromise({
		try: () =>
			payload.find({
				collection: "games",
				pagination: false,
				select: {
					title: true,
					slug: true,
				},
			}),
		catch: error =>
			new GetEntriesError({
				message: "Failed to get games",
				cause: error,
			}),
	})

	return docs
}).pipe(Effect.withLogSpan("get_games"))

export interface Game {
	id: string
	title: string
	releaseDate: Date
	image: string
}

const games = {
	worldAtWar: {
		id: "world-at-war",
		title: "World at War",
		releaseDate: new Date("November 11, 2008 7:00 AM"),
		image: "/games/world-at-war-cover.avif",
	},
	blackOps1: {
		id: "black-ops-1",
		title: "Black Ops 1",
		releaseDate: new Date("November 9, 2010 7:00 AM"),
		image: "/games/black-ops-1-cover.avif",
	},
	blackOps2: {
		id: "black-ops-2",
		title: "Black Ops 2",
		releaseDate: new Date("November 12, 2012 7:00 AM"),
		image: "/games/black-ops-2-cover.avif",
	},
	blackOps3: {
		id: "black-ops-3",
		title: "Black Ops 3",
		releaseDate: new Date("November 6, 2015 7:00 AM"),
		image: "/games/black-ops-3-cover.avif",
	},
	blackOps4: {
		id: "black-ops-4",
		title: "Black Ops 4",
		releaseDate: new Date("October 11, 2018 7:00 AM"),
		image: "/games/black-ops-4-cover.avif",
	},
	blackOpsColdWar: {
		id: "black-ops-cold-war",
		title: "Black Ops Cold War",
		releaseDate: new Date("November 13, 2020 7:00 AM"),
		image: "/games/black-ops-cold-war-cover.avif",
	},
	blackOps6: {
		id: "black-ops-6",
		title: "Black Ops 6",
		releaseDate: new Date("October 25, 2024 7:00 AM"),
		image: "/games/black-ops-6-cover.avif",
	},
	// blackOps7: {
	// 	id: "black-ops-7",
	// 	title: "Black Ops 7",
	// 	releaseDate: new Date("November 14, 2025 7:00 AM"),
	// 	image: "/games/black-ops-7-cover.avif",
	// }
} satisfies Record<string, Game>

export type GameKey = keyof typeof games
export const {
	worldAtWar,
	blackOps1,
	blackOps2,
	blackOps3,
	blackOps4,
	blackOpsColdWar,
	blackOps6,
} = games
