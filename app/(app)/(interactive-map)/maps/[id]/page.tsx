import type { Metadata } from "next"
import type { MapId } from "@/map-configs"
import type { MarkerCategory } from "@/map-configs/markers"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CustomSideBarTrigger } from "@/components/interactive-map/custom-sidebar-trigger"
import InteractiveMapWrapper from "@/components/interactive-map/interactive-map-wrapper"
import MapSidebar from "@/components/interactive-map/map-sidebar"
import SidebarLoader from "@/components/loaders/sidebar-loader"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getAvailableMaps, getMapConfig } from "@/data/interactive-map"
import { cn } from "@/lib/utils"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/functions"

export const generateStaticParams = () => {
	const maps = getAvailableMaps()
	return maps.map(map => ({
		id: map,
	}))
}

export const generateMetadata = async ({ params }: PageProps<"/maps/[id]">): Promise<Metadata> => {
	const { id } = await params
	const config = await getMapConfig(id as MapId)
	if (!config || config.state === "Coming Soon") notFound()
	const title = `${config.title} Interactive Map`
	const serverUrl = getServerUrl()

	return {
		title,
		description: config.description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description: config.description,
			url: `/maps/${config.id}`,
			images: {
				url: `${serverUrl}/previews/${config.id}-preview.webp`,
				width: 640,
				height: 360,
			},
		},
		twitter: {
			title,
			description: config.description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${serverUrl}/maps/${config.id}`,
		},
	}
}

export default async function InteractiveMapPage({ params }: PageProps<"/maps/[id]">) {
	const [{ id }, cookieStore] = await Promise.all([params, cookies()])
	const config = await getMapConfig(id as MapId)
	if (!config || config.state === "Coming Soon") notFound()
	const availableMaps = getAvailableMaps()
	const sidebarState = cookieStore.get("sidebar_state")?.value
	const defaultOpen = sidebarState ? sidebarState === "true" : true
	const groups: Record<MarkerCategory, Set<string>> = {
		general: new Set(),
		equipment: new Set(),
		upgrades: new Set(),
		objectives: new Set(),
		transportation: new Set(),
		intel: new Set(),
	}

	config.layers[0]?.markers.forEach(marker => {
		switch (marker.category) {
			case "general":
				if (marker.type && marker.type === "label") {
					groups.general.add(marker.type)
				} else groups.general.add(marker.id)
				break
			case "equipment":
				if (marker.type && marker.type === "weapon-wall-buy") {
					groups.equipment.add(marker.type)
				} else groups.equipment.add(marker.id)
				break
			case "upgrades":
				if (marker.type && marker.type === "perk") {
					groups.upgrades.add(marker.type)
				} else groups.upgrades.add(marker.id)
				break
			case "objectives":
				groups.objectives.add(marker.id)
				break
			case "transportation":
				groups.transportation.add(marker.id)
				break
			case "intel":
				groups.intel.add(marker.id)
				break
		}
	})

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Suspense fallback={<SidebarLoader />}>
				<MapSidebar
					groups={groups}
					availableMaps={availableMaps}
					mapMarkers={config.layers[0]?.markers ?? []}
				/>
			</Suspense>
			<div className="h-svh w-svw">
				<CustomSideBarTrigger className={cn({ "top-18": config.layers.length === 1 })} />
				<InteractiveMapWrapper mapConfig={config} />
			</div>
		</SidebarProvider>
	)
}
