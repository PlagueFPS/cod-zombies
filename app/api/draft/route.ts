import { draftMode } from "next/headers"
import { IN_DEVELOPMENT } from "@/utils/constants"

export async function GET() {
	if (!IN_DEVELOPMENT) return new Response("Forbidden", { status: 403 })

	const draft = await draftMode()
	if (draft.isEnabled) {
		draft.disable()
		console.log("[DEV] Draft Mode Disabled.")
		return new Response("false")
	}

	draft.enable()
	console.log("[DEV] Draft Mode Enabled.")
	return new Response("true")
}
