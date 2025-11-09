import type { Metadata } from "next"
import { Effect, Option } from "effect"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CustomSideBarTrigger } from "@/components/interactive-map/custom-sidebar-trigger"
import InteractiveMapWrapper from "@/components/interactive-map/interactive-map-wrapper"
import MapSidebar from "@/components/interactive-map/map-sidebar"
import SidebarLoader from "@/components/loaders/sidebar-loader"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
	getInteractiveMaps,
	getMapConfig,
	getMapConfigMetadata,
	type MapId,
} from "@/data/interactive-map"
import { BasePage } from "@/lib/layers"
import { cn } from "@/lib/utils"
import { categoryHandlers, type MarkerCategory } from "@/map-configs/markers"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/functions"

export const generateStaticParams = () =>
	Effect.gen(function* () {
		const maps = yield* getInteractiveMaps()
		return yield* Effect.forEach(maps, map => Effect.succeed({ id: map.id }), {
			concurrency: "unbounded",
		})
	}).pipe(Effect.runPromise)

export const generateMetadata = async ({ params }: PageProps<"/maps/[id]">): Promise<Metadata> => {
	const { id } = await params
	const metadata = await Effect.runPromise(getMapConfigMetadata(id as MapId))
	if (!metadata || Option.getOrNull(metadata.state) === "Coming Soon") return notFound()
	const title = `${metadata.title} Interactive Map`
	const serverUrl = getServerUrl()

	return {
		title,
		description: metadata.description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description: metadata.description,
			url: `/maps/${metadata.id}`,
			images: {
				url: `${serverUrl}/previews/${metadata.id}-preview.webp`,
				width: 640,
				height: 360,
			},
		},
		twitter: {
			title,
			description: metadata.description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${serverUrl}/maps/${metadata.id}`,
		},
	}
}

const InteractiveMapPage = Effect.fn("InteractiveMapPage")(function* ({
	params,
}: PageProps<"/maps/[id]">) {
	const [{ id }, cookieStore] = yield* Effect.all(
		[Effect.promise(() => params), Effect.promise(() => cookies())],
		{ concurrency: "unbounded" },
	)
	const metadata = yield* getMapConfigMetadata(id as MapId)
	if (!metadata || Option.getOrNull(metadata.state) === "Coming Soon")
		return yield* Effect.sync(() => notFound())

	const [config, maps] = yield* Effect.all([getMapConfig(metadata.id), getInteractiveMaps()], {
		concurrency: "unbounded",
	})
	// This is unreachable code but is needed for Type-Narrowing
	if (!config) return yield* Effect.sync(() => notFound())

	const state = cookieStore.get("sidebar_state")?.value
	const defaultOpen = state === undefined ? true : state === "true"
	const initialGroups: Record<MarkerCategory, Set<string>> = {
		general: new Set(),
		equipment: new Set(),
		intel: new Set(),
		objectives: new Set(),
		transportation: new Set(),
		upgrades: new Set(),
	}

	const groups = config.layers.reduce((acc, layer) => {
		layer.markers.forEach(marker => {
			const category = marker.category
			if (!acc[category]) {
				acc[category] = new Set()
			}
			acc[category].add(categoryHandlers[category](marker))
		})

		return acc
	}, initialGroups)

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Suspense fallback={<SidebarLoader />}>
				<MapSidebar groups={groups} maps={maps} mapLayers={config.layers} />
			</Suspense>
			<div className="h-svh w-svw">
				<CustomSideBarTrigger className={cn({ "top-18": config.layers.length === 1 })} />
				<InteractiveMapWrapper mapConfig={config} />
			</div>
		</SidebarProvider>
	)
})

export default BasePage.build(InteractiveMapPage)
