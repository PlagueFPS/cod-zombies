import type { AmmoMod } from "@/types/payload-types"
import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { createAugmentDto } from "./augments"

export type MinifiedAmmoMod = NonNullable<Awaited<ReturnType<typeof getAmmoModById>>>

export const getAmmoModById = cache(async (id: string) => {
	"use cache"
	cacheTag(CACHE_KEYS.ammoMods.all, CACHE_KEYS.ammoMods.byId(id))

	return await getAmmoModByIdEffect(id).pipe(
		Effect.withLogSpan("get_ammo_mod_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

const getAmmoModByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const ammoMod = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "ammoMods",
					id,
					draft: IN_DEVELOPMENT,
					select: {
						title: true,
						description: true,
						image: true,
						augments: true,
					},
					populate: {
						augments: {
							title: true,
							description: true,
							image: true,
							type: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get ammo mod with id ${id}`,
					cause: error,
				}),
		}).pipe(Effect.flatMap(ammoMod => createAmmoModDto(ammoMod as AmmoMod)))

		return ammoMod
	}).pipe(Effect.withLogSpan("get_ammo_mod_by_id"), Effect.annotateLogs({ id }))

export const createAmmoModDto = (ammoModOrId: string | AmmoMod) =>
	Effect.gen(function* () {
		const ammoMod = yield* assertRelation(ammoModOrId)
		const image = ammoMod.image
			? yield* assertRelation(ammoMod.image).pipe(Effect.map(createMediaDto))
			: null
		const augments = ammoMod.augments?.docs
			? yield* Effect.forEach(ammoMod.augments.docs, augment => createAugmentDto(augment), {
					concurrency: "unbounded",
				})
			: []

		return {
			id: ammoMod.id,
			title: ammoMod.title,
			description: ammoMod.description,
			image: image ?? { url: null, width: null, height: null },
			augments,
		}
	}).pipe(Effect.withLogSpan("create_ammo_mod_dto"))
