import type { CollectionAfterChangeHook } from "payload"
import { revalidateTag } from "next/cache"
import { CACHE_KEYS } from "@/utils/constants"

export const revalidateCollection: CollectionAfterChangeHook = ({
	collection,
	previousDoc,
	doc,
	operation,
	req: { payload },
}) => {
	if (operation === "create") return
	const isPublishing = previousDoc?._status !== "published" && doc._status === "published"
	const isUnpublishing = previousDoc?._status === "published" && doc._status !== "published"

	// Skip if the document isn't being published or unpublished; unfortunately Payload does not have a way to prevent running this on autosave
	if (!isPublishing && !isUnpublishing) return

	switch (collection.slug) {
		case "zombies": {
			revalidateTag(CACHE_KEYS.zombies.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.zombies.all}"`)
			return
		}
		case "maps": {
			revalidateTag(CACHE_KEYS.maps.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.maps.all}"`)
			return
		}
		case "sideQuests": {
			revalidateTag(CACHE_KEYS.sideQuests.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.sideQuests.all}"`)
			return
		}
		case "games": {
			revalidateTag(CACHE_KEYS.games.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.games.all}"`)
			return
		}
		case "mainQuests": {
			revalidateTag(CACHE_KEYS.mainQuests.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.mainQuests.all}"`)
			return
		}
		case "legal": {
			revalidateTag(CACHE_KEYS.legal.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.legal.all}"`)
			return
		}
		case "ammoMods": {
			revalidateTag(CACHE_KEYS.ammoMods.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.ammoMods.all}"`)
			return
		}
		case "augments": {
			revalidateTag(CACHE_KEYS.augments.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.augments.all}"`)
			return
		}
		case "perks": {
			revalidateTag(CACHE_KEYS.perks.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.perks.all}"`)
			return
		}
		case "fieldUpgrades": {
			revalidateTag(CACHE_KEYS.fieldUpgrades.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.fieldUpgrades.all}"`)
			return
		}
		case "weaponBuilds": {
			revalidateTag(CACHE_KEYS.weaponBuilds.all)
			payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS.weaponBuilds.all}"`)
			return
		}
	}
}
