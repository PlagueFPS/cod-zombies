"use client"
import type { MapConfig } from "@/data/interactive-map"
import dynamic from "next/dynamic"
import { Suspense, useEffect } from "react"
import InteractiveMapLoader from "../server/interactive-map-loader"

const InteractiveMap = dynamic(() => import("@/components/client/interactive-map"), {
	ssr: false,
	loading: () => <InteractiveMapLoader />,
})

export default function InteractiveMapWrapper({ mapConfig }: { mapConfig: MapConfig }) {
	// disable main page scrolling on canvas
	useEffect(() => {
		document.body.classList.add("no-scroll")
		return () => {
			document.body.classList.remove("no-scroll")
		}
	}, [])

	return (
		<Suspense fallback={<InteractiveMapLoader />}>
			<InteractiveMap mapConfig={mapConfig} />
		</Suspense>
	)
}
