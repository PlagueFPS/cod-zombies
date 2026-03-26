"use client"
import dynamic from "next/dynamic"
import { Suspense, useEffect } from "react"
import { decodeMapConfig, type EncodedMapConfig } from "@/utils/rsc-wire"
import InteractiveMapLoader from "../server/interactive-map-loader"

const InteractiveMap = dynamic(() => import("@/components/client/interactive-map"), {
	ssr: false,
	loading: () => <InteractiveMapLoader />,
})

export default function InteractiveMapWrapper({ mapConfig }: { mapConfig: EncodedMapConfig }) {
	const config = decodeMapConfig(mapConfig)
	// disable main page scrolling on canvas
	useEffect(() => {
		document.body.classList.add("no-scroll")
		return () => {
			document.body.classList.remove("no-scroll")
		}
	}, [])

	return (
		<Suspense fallback={<InteractiveMapLoader />}>
			<InteractiveMap mapConfig={config} />
		</Suspense>
	)
}
