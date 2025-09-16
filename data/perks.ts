import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { createAugmentDto } from "./augments"

export type MinifiedPerk = NonNullable<Awaited<ReturnType<typeof getPerkById>>>

export const getPerkById = cache(async (id: string) => {
	"use cache"
	cacheTag(CACHE_KEYS.perks.all, CACHE_KEYS.perks.byId(id))

	return await getPerkByIdEffect(id).pipe(
		Effect.withLogSpan("get_perk_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

const getPerkByIdEffect = (id: string) =>
	Effect.gen(function* () {
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
						augments: true,
					},
					populate: {
						augments: {
							title: true,
							type: true,
							image: true,
							description: true,
						},
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
					const augments = perk.augments?.docs
						? yield* Effect.forEach(perk.augments.docs, augment => createAugmentDto(augment), {
								concurrency: "unbounded",
							})
						: []

					return {
						...perk,
						image: createMediaDto(image),
						augments,
					}
				}),
			),
		)
		return perk
	}).pipe(Effect.withLogSpan("get_perk_by_id"), Effect.annotateLogs({ id }))
