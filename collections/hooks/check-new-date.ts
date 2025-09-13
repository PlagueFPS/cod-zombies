import type { FieldHook } from "payload"
import { isFirstTimePublish } from "@/utils/payload-utils"

export const CheckNewDate: FieldHook = ({ originalDoc, value, data }) => {
	// If state is being changed from "New" to something else, remove newAt
	if (originalDoc?.state === "New" && data?.state !== "New") {
		return null
	}

	// Only set newAt if the document is being published for the first time and is marked as 'New'
	if (isFirstTimePublish(originalDoc?._status, data?._status) && data?.state === "New") {
		return new Date()
	}

	return value
}
