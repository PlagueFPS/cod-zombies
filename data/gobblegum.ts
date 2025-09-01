import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedGobbleGum = NonNullable<Awaited<ReturnType<typeof getGobbleGumById>>>

export const getGobbleGumById = cache(
	unstable_cache(async (id: string) => {
		return await Effect.gen(function* () {
			const payload = yield* Payload
			const gobblegum = yield* Effect.tryPromise({
				try: () =>
					payload.findByID({
						collection: "gobblegum",
						id,
						draft: IN_DEVELOPMENT,
						select: {
							title: true,
							image: true,
							rarity: true,
							description: true,
							type: true,
						},
					}),
				catch: error =>
					new EntryNotFoundError({
						message: `Failed to get gobblegum with id ${id}`,
						cause: error,
					}),
			}).pipe(
				Effect.flatMap(gobblegum =>
					Effect.gen(function* () {
						const image = yield* assertRelation(gobblegum.image)
						return {
							...gobblegum,
							image: createMediaDto(image),
						}
					}),
				),
			)

			return gobblegum
		}).pipe(
			Effect.withLogSpan("get_gobblegum_by_id"),
			Effect.annotateLogs({ id }),
			Effect.tapError(Effect.logError),
			Effect.catchAll(_error => Effect.succeed(null)),
			Effect.ensureErrorType<never>(),
			Effect.provide(Payload.Default),
			Effect.runPromise,
		)
	}),
)
