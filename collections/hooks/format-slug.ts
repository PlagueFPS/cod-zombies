import type { FieldHook } from "payload"
import { slugify } from "@/utils/functions.client"

export const formatSlug =
	(fallback: string): FieldHook =>
	({ data, operation, value }) => {
		if (typeof value === "string") return slugify(value)

		if (operation === "create" || operation === "update" || data?.slug === undefined) {
			const fallbackData = data?.[fallback]
			if (typeof fallbackData === "string") return slugify(fallbackData)
		}

		return value
	}
