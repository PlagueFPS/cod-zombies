import type { CollectionAfterDeleteHook } from "payload"
import { revalidateTag } from "next/cache"
import { CACHE_KEYS } from "@/utils/constants"

export const handleDelete: CollectionAfterDeleteHook = ({ collection, req: { payload } }) => {
	const collectionKey = collection.slug as keyof typeof CACHE_KEYS
	if (CACHE_KEYS[collectionKey]?.all) {
		revalidateTag(CACHE_KEYS[collectionKey].all)
		payload.logger.info(`[CACHE] Revalidated "${CACHE_KEYS[collectionKey].all}" cache`)
	}
}
