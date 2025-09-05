import type { Augment } from "@/types/payload-types"
import { Effect, Predicate } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { getMediaById } from "./media"

export type MinifiedAugment = NonNullable<Awaited<ReturnType<typeof getAugmentById>>>

export const getAugmentById = cache(
	unstable_cache(
		async (id: string) => {
			return await getAugmentByIdEffect(id).pipe(
				Effect.withLogSpan("get_augment_by_id"),
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
			tags: [CACHE_KEYS.augments.all],
		},
	),
)

export const getAugmentByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const augment = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "augments",
					id,
					draft: IN_DEVELOPMENT,
					select: {
						title: true,
						type: true,
						image: true,
						description: true,
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Augment with id ${id} not found`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(augment =>
				Effect.gen(function* () {
					const image = yield* assertRelation(augment.image)
					return {
						id: augment.id,
						title: augment.title,
						type: augment.type,
						description: augment.description,
						image: createMediaDto(image),
					}
				}),
			),
		)

		return augment
	}).pipe(Effect.withLogSpan("internal_get_augment_by_id"), Effect.annotateLogs({ id }))

export const createAugmentDto = (augmentOrId: string | Augment) =>
	Effect.gen(function* () {
		const augment = Predicate.isString(augmentOrId)
			? yield* getAugmentByIdEffect(augmentOrId)
			: yield* assertRelation(augmentOrId)

		const image = Predicate.isString(augment.image)
			? yield* getMediaById(augment.image)
			: yield* assertRelation(augment.image).pipe(Effect.map(createMediaDto))

		return {
			id: augment.id,
			title: augment.title,
			type: augment.type,
			description: augment.description,
			image: {
				url: image?.url,
				width: image?.width,
				height: image?.height,
			},
		}
	})
