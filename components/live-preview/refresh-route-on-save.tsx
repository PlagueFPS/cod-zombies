"use client"
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react"
import { useRouter } from "next/navigation"
import { env } from "@/env"

export const RefreshRouteOnSave = () => {
	const router = useRouter()

	const shouldRefresh = () => router.refresh()

	return <PayloadLivePreview refresh={shouldRefresh} serverURL={env.NEXT_PUBLIC_WEBSITE_URL} />
}
