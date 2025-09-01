import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedPerk = NonNullable<Awaited<ReturnType<typeof getPerkById>>>

export const getPerkById = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const perk = yield* Effect.tryPromise({
					try: () =>
						payload.findByID({
							collection: "perks",
							id,
							draft: IN_DEVELOPMENT,
							select: {
								title: true,
								image: true,
								modifier: true,
								description: true,
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get perk with id ${id}`,
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(perk =>
						Effect.gen(function* () {
							const image = yield* assertRelation(perk.image)
							return {
								...perk,
								image: createMediaDto(image),
							}
						}),
					),
				)
				return perk
			}).pipe(
				Effect.withLogSpan("get_perk_by_id"),
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
			tags: [CACHE_KEYS.perks.all],
		},
	),
)
