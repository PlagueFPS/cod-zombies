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

	// Skip if the document's status hasn't changed
	if (previousDoc._status === doc._status) return

	switch (collection.slug) {
		case "zombies": {
			revalidateTag(CACHE_KEYS.zombies.all)
			payload.logger.info(`Revalidated "${CACHE_KEYS.zombies.all}" cache`)
			return
		}
		case "maps": {
			revalidateTag(CACHE_KEYS.maps.all)
			payload.logger.info(`Revalidated "${CACHE_KEYS.maps.all}" cache`)
			return
		}
		case "sideQuests": {
			revalidateTag(CACHE_KEYS.sideQuests.all)
			payload.logger.info(`Revalidated "${CACHE_KEYS.sideQuests.all}" cache`)
			return
		}
		case "games": {
			revalidateTag(CACHE_KEYS.games.all)
			payload.logger.info(`Revalidated "${CACHE_KEYS.games.all}" cache`)
			return
		}
		case "mainQuests": {
			revalidateTag(CACHE_KEYS.mainQuests.all)
			payload.logger.info(`Revalidated "${CACHE_KEYS.mainQuests.all}" cache`)
			return
		}
	}
}
