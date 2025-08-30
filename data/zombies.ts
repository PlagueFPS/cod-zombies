import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedZombie = Awaited<ReturnType<typeof getZombies>>[number]

export const getZombies = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							pagination: false,
							sort: "-createdAt",
							select: {
								title: true,
								slug: true,
								description: true,
								type: true,
								maps: true,
								games: true,
								isComingSoon: true,
								image: true,
								_status: true,
							},
							populate: {
								maps: {
									title: true,
									slug: true,
								},
								games: {
									title: true,
									slug: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get zombies",
							cause: error,
						}),
				})

				return yield* Effect.forEach(docs, doc =>
					Effect.gen(function* () {
						const map = yield* Effect.forEach(doc.maps, map => assertRelation(map))
						const game = yield* Effect.forEach(doc.games, game => assertRelation(game))
						const image = yield* assertRelation(doc.image)

						return {
							...doc,
							maps: map,
							games: game,
							image: createMediaDto(image),
						}
					}),
				)
			}).pipe(
				Effect.withLogSpan("get_zombies"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [],
		},
	),
)

export const getZombiesMetadata = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							pagination: false,
							where: {
								isComingSoon: {
									equals: false,
								},
							},
							select: {
								updatedAt: true,
								title: true,
								slug: true,
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get zombies metadata",
							cause: error,
						}),
				})

				return docs
			}).pipe(
				Effect.withLogSpan("get_zombies_metadata"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [],
		},
	),
)

export const getZombieBySlug = cache(
	unstable_cache(
		async (slug: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							pagination: false,
							where: {
								slug: {
									equals: slug,
								},
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get zombie by slug: ${slug}`,
							cause: error,
						}),
				})

				const zombie = docs[0]
				if (!zombie)
					return yield* new EntryNotFoundError({
						message: `Failed to get zombie by slug: ${slug}`,
					})

				const map = yield* Effect.forEach(zombie.maps, map => assertRelation(map))
				const game = yield* Effect.forEach(zombie.games, game => assertRelation(game))
				const attacks = yield* Effect.forEach(zombie.attacks, attack => assertRelation(attack))
				const image = yield* assertRelation(zombie.image)
				const elementalWeakness = zombie.elementalWeakness
					? yield* Effect.forEach(zombie.elementalWeakness, elementalWeakness =>
							assertRelation(elementalWeakness),
						)
					: []

				return {
					...zombie,
					maps: map,
					games: game,
					attacks,
					elementalWeakness,
					image: createMediaDto(image),
				}
			}).pipe(
				Effect.withLogSpan("get_zombie_by_slug"),
				Effect.annotateLogs({ slug }),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed(null)),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [],
		},
	),
)
