import type { FieldHook } from "payload"

export const CheckPublishDate: FieldHook = ({ originalDoc, value, data }) => {
	// If the field already has a value, preserve it
	if (originalDoc?.firstPublishedAt) {
		return originalDoc.firstPublishedAt
	}

	// Only set firstPublishedAt if the document is being published for the first time
	if (data?._status === "published" && originalDoc?._status !== "published") {
		return new Date()
	}

	return value
}
