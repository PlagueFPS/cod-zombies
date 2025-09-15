import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/cms"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedWeaponBuild = NonNullable<Awaited<ReturnType<typeof getWeaponBuildById>>>

export const getWeaponBuildById = cache(async (id: string) => {
	"use cache"
	cacheTag(CACHE_KEYS.weaponBuilds.all, CACHE_KEYS.weaponBuilds.byId(id))

	return await getWeaponBuildByIdEffect(id).pipe(
		Effect.withLogSpan("get_weapon_build_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

const getWeaponBuildByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const weaponBuild = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "weaponBuilds",
					id,
					draft: IN_DEVELOPMENT,
					select: {
						title: true,
						weapon: true,
						attachments: true,
						buildCode: true,
					},
					populate: {
						weapons: {
							title: true,
							image: true,
						},
						weaponAttachments: {
							title: true,
							type: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get weapon build by id: ${id}`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(weaponBuild =>
				Effect.gen(function* () {
					const weapon = yield* assertRelation(weaponBuild.weapon)
					const attachments = weaponBuild.attachments
						? yield* Effect.forEach(weaponBuild.attachments, attachment =>
								Effect.gen(function* () {
									const weaponAttachment = yield* assertRelation(attachment)
									return {
										id: weaponAttachment.id,
										title: weaponAttachment.title,
										type: weaponAttachment.type,
									}
								}),
							)
						: []
					const image = yield* assertRelation(weapon.image)
					return {
						id: weaponBuild.id,
						title: weapon.title,
						attachments,
						buildCode: weaponBuild.buildCode,
						image: createMediaDto(image),
					}
				}),
			),
		)

		return weaponBuild
	}).pipe(Effect.withLogSpan("get_weapon_build_by_id"), Effect.annotateLogs({ id }))
