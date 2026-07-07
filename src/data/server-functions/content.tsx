import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { getOpengraphImageUrl } from "@/utils/functions.server"
import { StandardOpengraphSchema } from "@/utils/validation-schemas"

/** Gets the current opengraph image URL version for a given kind and id. */
export const getOgImgUrl = createServerFn()
	.validator(StandardOpengraphSchema)
	.handler(async ({ data }) => {
		const url = await getOpengraphImageUrl(data.kind, data.id)

		// Aggressively cache the response since it's static content
		// This can be removed once static server functions are stable
		// @see https://tanstack.com/start/latest/docs/framework/react/guide/static-server-functions
		setResponseHeader("Cache-Control", "public, max-age=31536000, immutable")

		return url.valueOrUndefined
	})
