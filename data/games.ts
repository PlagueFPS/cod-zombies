import "server-only"
import type { TypeGameCategorySkeleton } from "@/types/contentful-types"
import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { getNewEntries } from "@/lib/redis"
import { CMS } from "@/lib/services/CMS"
import { CACHE_KEYS } from "@/utils/constants"
import { DataLayer } from "./utils"

export const getGames = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const [games, { changedIds, draftIds, newIds }] = yield* Effect.all(
					[INTERNAL_getGameData(), getGameIds],
					{
						concurrency: "unbounded",
					},
				)

				return games.map(game => {
					const isDraft = draftIds.has(game.sys.id)
					const isChanged = changedIds.has(game.sys.id)
					const isNew = newIds.has(game.sys.id)
					return {
						id: game.sys.id,
						title: game.fields.title,
						slug: game.fields.slug,
						isComingSoon: game.fields.isComingSoon ?? false,
						isDraft,
						isChanged,
						isNew,
					}
				})
			}).pipe(
				Effect.withLogSpan("get_games"),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.gameCategories.all],
		},
	),
)

export const getGameSearchData = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const games = yield* INTERNAL_getGameData()
				if (!games) return []

				return games
					.filter(g => !g.fields.isComingSoon)
					.map(g => ({
						id: g.sys.id,
						title: g.fields.title,
						slug: g.fields.slug,
					}))
			}).pipe(
				Effect.withLogSpan("get_game_search_data"),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.gameCategories.all],
		},
	),
)

export const getGameById = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const games = yield* INTERNAL_getGameData()

				const game = games.find(g => g.sys.id === id)
				if (!game) return null

				return {
					id: game.sys.id,
					slug: game.fields.slug,
					isComingSoon: game.fields.isComingSoon ?? false,
				}
			}).pipe(
				Effect.withLogSpan("get_game_by_id"),
				Effect.annotateLogs({ id }),
				Effect.ensureErrorType<never>(),
				Effect.provide(CMS.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.gameCategories.all],
		},
	),
)

const getGameIds = Effect.gen(function* () {
	const [games, newEntries] = yield* Effect.all([INTERNAL_getManagementGameData(), getNewEntries], {
		concurrency: "unbounded",
	})

	const draftIds = new Set<string>()
	const changedIds = new Set<string>()
	const newIds = new Set<string>()

	games.forEach(game => {
		if (!game.sys.publishedVersion) {
			draftIds.add(game.sys.id)
		} else if (!!game.sys.publishedVersion && game.sys.version >= game.sys.publishedVersion + 2) {
			changedIds.add(game.sys.id)
		}
	})

	newEntries.forEach(entry => {
		if (entry.type !== "game") return
		newIds.add(entry.entryId)
	})

	return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_game_ids"))

const INTERNAL_getManagementGameData = cache(() =>
	Effect.gen(function* () {
		const { getManagementEntries } = yield* CMS
		const games = yield* getManagementEntries("gameCategory")
		return games.items
	}).pipe(
		Effect.withLogSpan("internal_get_management_game_data"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)

const INTERNAL_getGameData = cache(() =>
	Effect.gen(function* () {
		const { getEntries } = yield* CMS
		const games = yield* getEntries<TypeGameCategorySkeleton>({
			content_type: "gameCategory",
			order: ["-fields.releaseDate"],
			select: ["sys.id", "sys.updatedAt", "fields"],
		})
		return games.items
	}).pipe(
		Effect.withLogSpan("internal_get_game_data"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)
