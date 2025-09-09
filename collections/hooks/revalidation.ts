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
	const collectionKey = collection.slug as keyof typeof CACHE_KEYS
	const cacheKey = CACHE_KEYS?.[collectionKey]?.all
	if (!cacheKey) {
		payload.logger.info(`[CACHE] No cache key found for "${collectionKey}"`)
		return
	}

	// handle revalidation of non-versioned collections
	if (!previousDoc?._status && !doc?._status) {
		revalidateTag(cacheKey)
		payload.logger.info(`[CACHE] Revalidated "${cacheKey}"`)
		return
	}

	const isPublishing = previousDoc._status !== "published" && doc._status === "published"
	const isUnpublishing = previousDoc._status === "published" && doc._status !== "published"

	// Skip if the document isn't being published or unpublished; unfortunately Payload does not have a way to prevent running this on autosave
	if (!isPublishing && !isUnpublishing) return

	revalidateTag(cacheKey)
	payload.logger.info(`[CACHE] Revalidated "${cacheKey}"`)
	return
}
