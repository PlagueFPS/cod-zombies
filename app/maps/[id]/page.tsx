import type { Metadata } from "next"
import { Effect, Option } from "effect"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CustomSideBarTrigger } from "@/components/client/custom-sidebar-trigger"
import InteractiveMapWrapper from "@/components/client/interactive-map-wrapper"
import MapSidebar from "@/components/client/map-sidebar"
import SidebarLoader from "@/components/server/sidebar-loader"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
	getInteractiveMaps,
	getMapConfig,
	getMapConfigMetadata,
	type MapId,
} from "@/data/interactive-map"
import { cn } from "@/lib/utils"
import { categoryHandlers, type MarkerCategory } from "@/map-configs/markers"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/server-functions"

export const generateStaticParams = Effect.fnUntraced(function* () {
	const maps = yield* getInteractiveMaps()
	return yield* Effect.forEach(maps, map => Effect.succeed({ id: map.id }), {
		concurrency: "unbounded",
	})
}, Effect.runPromise)

export const generateMetadata = async ({ params }: PageProps<"/maps/[id]">): Promise<Metadata> => {
	const { id } = await params
	const metadata = await Effect.runPromise(getMapConfigMetadata(id as MapId))
	if (Option.isNone(metadata)) return notFound()
	if (Option.getOrNull(metadata.value.state) === "Coming Soon") return notFound()
	const title = `${metadata.value.title} Interactive Map`
	const serverUrl = getServerUrl()

	return {
		title,
		description: metadata.value.description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description: metadata.value.description,
			url: `/maps/${metadata.value.id}`,
			images: {
				url: `${serverUrl}/previews/${metadata.value.id}-preview.webp`,
				width: 640,
				height: 360,
			},
		},
		twitter: {
			title,
			description: metadata.value.description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${serverUrl}/maps/${metadata.value.id}`,
		},
	}
}

export default async function InteractiveMapPage({ params }: PageProps<"/maps/[id]">) {
	return await buildInteractiveMapPage(params).pipe(Effect.runPromise)
}

const buildInteractiveMapPage = Effect.fn("buildInteractiveMapPage")(function* (
	params: PageProps<"/maps/[id]">["params"],
) {
	const [{ id }, cookieStore] = yield* Effect.all(
		[Effect.promise(() => params), Effect.promise(() => cookies())],
		{ concurrency: "unbounded" },
	)
	const metadata = yield* getMapConfigMetadata(id as MapId)
	if (Option.isNone(metadata)) return yield* Effect.sync(() => notFound())
	if (Option.getOrNull(metadata.value.state) === "Coming Soon") {
		return yield* Effect.sync(() => notFound())
	}

	const [config, maps] = yield* Effect.all(
		[getMapConfig(metadata.value.id), getInteractiveMaps()],
		{
			concurrency: "unbounded",
		},
	)
	// This is unreachable code but is needed for Type-Narrowing
	if (Option.isNone(config)) return yield* Effect.sync(() => notFound())

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

	const groups = config.value.layers.reduce((acc, layer) => {
		layer.markers.forEach(marker => {
			const category = marker.category
			if (!acc[category]) {
				acc[category] = new Set()
			}
			acc[category].add(categoryHandlers[category](marker))
		})

		return acc
	}, initialGroups)
	const transformedMaps = maps.map(map => ({
		...map,
		state: Option.getOrNull(map.state),
	}))

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Suspense fallback={<SidebarLoader />}>
				<MapSidebar groups={groups} maps={transformedMaps} mapLayers={config.value.layers} />
			</Suspense>
			<div className="-mt-10 h-svh w-svw">
				<CustomSideBarTrigger className={cn({ "top-18": config.value.layers.length === 1 })} />
				<InteractiveMapWrapper mapConfig={config.value} />
			</div>
		</SidebarProvider>
	)
})
