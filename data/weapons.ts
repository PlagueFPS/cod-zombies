import type { TypeWeaponSkeleton } from "@/types/contentful-types"
import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { CMS } from "@/lib/services/CMS"
import { CACHE_KEYS } from "@/utils/constants"

export const getWeapon = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const { getEntry } = yield* CMS
				const weapon = yield* getEntry<TypeWeaponSkeleton>(id)
				return {
					id: weapon.sys.id,
					title: weapon.fields.title,
					slug: weapon.fields.slug,
				}
			}).pipe(
				Effect.withLogSpan("get_weapon"),
				Effect.annotateLogs({ id }),
				Effect.provide(CMS.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.weapons.all],
		},
	),
)
