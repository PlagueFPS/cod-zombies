import type { FieldHook } from "payload"
import { isFirstTimePublish } from "@/utils/payload-utils"

export const CheckPublishDate: FieldHook = ({ originalDoc, value, data }) => {
	// If the field already has a value, preserve it
	if (originalDoc?.firstPublishedAt) {
		return originalDoc.firstPublishedAt
	}

	// Only set firstPublishedAt if the document is being published for the first time and is not coming soon
	if (isFirstTimePublish(originalDoc?._status, data?._status) && !originalDoc.isComingSoon) {
		return new Date()
	}

	return value
}
