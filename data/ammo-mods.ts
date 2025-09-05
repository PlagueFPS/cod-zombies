import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { resolveAugment } from "./augments"

export type MinifiedAmmoMod = NonNullable<Awaited<ReturnType<typeof getAmmoModById>>>

export const getAmmoModById = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const ammoMod = yield* Effect.tryPromise({
					try: () =>
						payload.findByID({
							collection: "ammoMods",
							id,
							draft: IN_DEVELOPMENT,
							depth: 3,
							select: {
								title: true,
								description: true,
								image: true,
								augments: true,
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get ammo mod with id ${id}`,
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(ammoMod =>
						Effect.gen(function* () {
							const image = yield* assertRelation(ammoMod.image)
							const augments = ammoMod.augments.docs 
								? yield* Effect.forEach(ammoMod.augments.docs, augment => resolveAugment(augment), { concurrency: "unbounded" }) 
								: []

							return {
								id: ammoMod.id,
								title: ammoMod.title,
								description: ammoMod.description,
								image: createMediaDto(image),
								augments,
							}
						}),
					),
				)
				return ammoMod
			}).pipe(
				Effect.withLogSpan("get_ammo_mod_by_id"),
				Effect.annotateLogs({ id }),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed(null)),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.ammoMods.all],
		},
	),
)
