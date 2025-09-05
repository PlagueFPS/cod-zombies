import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { createAugmentDto } from "./augments"

export type MinifiedFieldUpgrade = NonNullable<Awaited<ReturnType<typeof getFieldUpgradeById>>>

export const getFieldUpgradeById = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const fieldUpgrade = yield* Effect.tryPromise({
					try: () =>
						payload.findByID({
							collection: "fieldUpgrades",
							id,
							draft: IN_DEVELOPMENT,
							select: {
								title: true,
								image: true,
								description: true,
								augments: true,
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get field upgrade by id: ${id}`,
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(fieldUpgrade =>
						Effect.gen(function* () {
							const image = yield* assertRelation(fieldUpgrade.image)
							const augments = fieldUpgrade.augments?.docs
								? yield* Effect.forEach(
										fieldUpgrade.augments.docs,
										augment => createAugmentDto(augment),
										{ concurrency: "unbounded" },
									)
								: []

							return {
								id: fieldUpgrade.id,
								title: fieldUpgrade.title,
								description: fieldUpgrade.description,
								image: createMediaDto(image),
								augments,
							}
						}),
					),
				)

				return fieldUpgrade
			}).pipe(
				Effect.withLogSpan("get_field_upgrade_by_id"),
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
			tags: [CACHE_KEYS.fieldUpgrades.all],
		},
	),
)
