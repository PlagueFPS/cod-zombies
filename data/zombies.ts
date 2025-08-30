import { Effect, Either } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedZombie = Awaited<ReturnType<typeof getZombies>>[number]
export type ZombieBySlug = Awaited<ReturnType<typeof getZombieBySlug>>

export const getZombies = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const zombies = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							pagination: false,
							draft: IN_DEVELOPMENT,
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
				}).pipe(
					Effect.flatMap(zombies =>
						Effect.forEach(zombies.docs, doc =>
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
						),
					),
				)

				return zombies
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
		async (limit?: number) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							pagination: false,
							draft: IN_DEVELOPMENT,
							limit,
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
				const zombie = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							pagination: false,
							draft: IN_DEVELOPMENT,
							limit: 1,
							where: {
								slug: {
									equals: slug,
								},
							},
							populate: {
								zombieAttacks: {
									title: true,
									description: true,
									range: true,
								},
								zombies: {
									title: true,
									slug: true,
									type: true,
									image: true,
									weakPoints: true,
									elementalWeakness: true,
								},
								ammoMods: {
									title: true,
									description: true,
									image: true,
									augments: true,
								},
								augments: {
									title: true,
									type: true,
									description: true,
									image: true,
								},
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get zombie by slug: ${slug}`,
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(zombie =>
						Effect.forEach(zombie.docs, zombie =>
							Effect.gen(function* () {
								const map = yield* Effect.forEach(zombie.maps, map => assertRelation(map))
								const game = yield* Effect.forEach(zombie.games, game => assertRelation(game))
								const image = yield* assertRelation(zombie.image)
								const attacks = yield* Effect.forEach(zombie.attacks, attack =>
									assertRelation(attack),
								)
								const elementalWeakness = zombie.elementalWeakness
									? yield* Effect.forEach(zombie.elementalWeakness, elementalWeakness =>
											Effect.gen(function* () {
												const weakness = yield* assertRelation(elementalWeakness)
												const media = yield* assertRelation(weakness.image)
												const augments = weakness.augments.docs
													? yield* Effect.forEach(weakness.augments.docs, augment =>
															Effect.gen(function* () {
																const { title, description, type, image } =
																	yield* assertRelation(augment)
																const media = yield* assertRelation(image)
																return {
																	title,
																	description,
																	type,
																	image: createMediaDto(media),
																}
															}),
														)
													: []

												return {
													title: weakness.title,
													description: weakness.description,
													image: createMediaDto(media),
													augments,
												}
											}),
										)
									: []
								const weakPoints = zombie.weakPoints
									? yield* Effect.forEach(zombie.weakPoints, weakPoint => assertRelation(weakPoint))
									: []

								return {
									...zombie,
									maps: map,
									games: game,
									image: createMediaDto(image),
									attacks,
									elementalWeakness,
									weakPoints,
								}
							}),
						),
					),
				)

				return zombie[0] ?? null
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

export const getAdjacentZombies = cache(
	unstable_cache(
		async (currentCreatedAt: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const prevZombieEffect = Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							draft: IN_DEVELOPMENT,
							sort: "-createdAt",
							limit: 1,
							where: {
								createdAt: {
									less_than: currentCreatedAt,
								},
							},
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
							message: "Failed to get previous zombie",
							cause: error,
						}),
				}).pipe(
					Effect.withLogSpan("get_previous_zombie"),
					Effect.tapError(Effect.logError),
					Effect.flatMap(zombie =>
						Effect.forEach(zombie.docs, zombie =>
							Effect.gen(function* () {
								const map = yield* Effect.forEach(zombie.maps, map => assertRelation(map))
								const game = yield* Effect.forEach(zombie.games, game => assertRelation(game))
								const image = yield* assertRelation(zombie.image)

								return {
									...zombie,
									maps: map,
									games: game,
									image: createMediaDto(image),
								}
							}),
						),
					),
				)

				const nextZombieEffect = Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "zombies",
							draft: IN_DEVELOPMENT,
							sort: "-createdAt",
							limit: 1,
							where: {
								createdAt: {
									greater_than: currentCreatedAt,
								},
							},
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
							message: "Failed to get next zombie",
							cause: error,
						}),
				}).pipe(
					Effect.withLogSpan("get_next_zombie"),
					Effect.tapError(Effect.logError),
					Effect.flatMap(zombie =>
						Effect.forEach(zombie.docs, zombie =>
							Effect.gen(function* () {
								const map = yield* Effect.forEach(zombie.maps, map => assertRelation(map))
								const game = yield* Effect.forEach(zombie.games, game => assertRelation(game))
								const image = yield* assertRelation(zombie.image)

								return {
									...zombie,
									maps: map,
									games: game,
									image: createMediaDto(image),
								}
							}),
						),
					),
				)

				const [prevZombie, nextZombie] = yield* Effect.all([prevZombieEffect, nextZombieEffect], {
					concurrency: "unbounded",
					mode: "either",
				})

				return {
					prevZombie: Either.isLeft(prevZombie)
						? null
						: prevZombie.right.length > 0
							? prevZombie.right[0]
							: null,
					nextZombie: Either.isLeft(nextZombie)
						? null
						: nextZombie.right.length > 0
							? nextZombie.right[0]
							: null,
				}
			}).pipe(
				Effect.withLogSpan("get_adjacent_zombies"),
				Effect.annotateLogs({ currentCreatedAt }),
				Effect.tapError(Effect.logError),
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
