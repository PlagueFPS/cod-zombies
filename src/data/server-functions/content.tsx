import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { getOpengraphImageUrl } from "@/utils/functions.server"
import { StandardOpengraphSchema } from "@/utils/validation-schemas"

/** Gets the current opengraph image URL version for a given kind and id. */
export const getOgImgUrl = createServerFn()
	.validator(StandardOpengraphSchema)
	.handler(async ({ data }) => {
		const url = await getOpengraphImageUrl(data.kind, data.id)

		setResponseHeader("Cache-Control", "public, max-age=31536000, immutable")

		return url.valueOrUndefined
	})
