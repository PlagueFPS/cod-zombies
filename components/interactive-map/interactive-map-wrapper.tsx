"use client"
import type { MapConfig } from "@/map-configs"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import InteractiveMapLoader from "../loaders/interactive-map-loader"

const InteractiveMap = dynamic(() => import("@/components/interactive-map/interactive-map"), {
	ssr: false,
	loading: () => <InteractiveMapLoader />,
})

export default function InteractiveMapWrapper({ mapConfig }: { mapConfig: MapConfig }) {
	return (
		<Suspense fallback={<InteractiveMapLoader />}>
			<InteractiveMap mapConfig={mapConfig} />
		</Suspense>
	)
}
