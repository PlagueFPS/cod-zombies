import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

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
							select: {
								title: true,
								description: true,
								image: true,
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
							return {
								...ammoMod,
								image: createMediaDto(image),
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
			tags: [],
		},
	),
)
