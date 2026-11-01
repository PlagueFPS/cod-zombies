import type { OpengraphKind } from "@/utils/validation-schemas"
import { Option } from "effect"
import { opengraphImagePath } from "@/utils/opengraph-image-url"
import { getServerUrl } from "@/utils/request.server"

export { getLastModified } from "@/utils/content-meta"

export const getOpengraphImageUrl = async (kind: OpengraphKind, id: string) => {
	const path = opengraphImagePath(kind, id)

	if (Option.isNone(path)) {
		// oxlint-disable-next-line effecttsgo/global-console -- logged from a TanStack server helper, outside an Effect
		console.warn(`Missing opengraph image version for ${kind}: ${id}`)

		return Option.none()
	}

	return Option.some(`${getServerUrl()}${path.value}`)
}
