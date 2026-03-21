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
	getInteractiveMapByKey,
	getInteractiveMapConfig,
	getInteractiveMaps,
	type InteractiveMapKey,
} from "@/data/interactive-map"
import { cn } from "@/lib/utils"
import { categoryHandlers, type MarkerCategory } from "@/map-configs/markers"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { encodeInteractiveMap } from "@/utils/rsc-wire"
import { getServerUrl } from "@/utils/server-functions"

export const generateStaticParams = () => getInteractiveMaps().map(map => ({ id: map.id }))

export const generateMetadata = async ({ params }: PageProps<"/maps/[id]">): Promise<Metadata> => {
	const { id } = await params
	const map = getInteractiveMapByKey(id as InteractiveMapKey)
	if (Option.isNone(map)) return notFound()
	if (Option.getOrNull(map.value.state) === "Coming Soon") return notFound()
	const title = `${map.value.title} Interactive Map`
	const serverUrl = getServerUrl()

	return {
		title,
		description: map.value.description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description: map.value.description,
			url: `/maps/${map.value.id}`,
			images: {
				url: `${serverUrl}/previews/${map.value.id}-preview.webp`,
				width: 640,
				height: 360,
			},
		},
		twitter: {
			title,
			description: map.value.description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${serverUrl}/maps/${map.value.id}`,
		},
	}
}

export default async function InteractiveMapPage({ params }: PageProps<"/maps/[id]">) {
	return await buildInteractiveMapPage(params).pipe(
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			ConfigNotFoundError: () => Effect.sync(() => notFound()),
		}),
		Effect.orDie,
		Effect.runPromise,
	)
}

const buildInteractiveMapPage = Effect.fn("buildInteractiveMapPage")(function* (
	params: PageProps<"/maps/[id]">["params"],
) {
	const [{ id }, cookieStore] = yield* Effect.all(
		[Effect.promise(() => params), Effect.promise(() => cookies())],
		{ concurrency: "unbounded" },
	)
	const metadata = getInteractiveMapByKey(id as InteractiveMapKey)
	if (Option.isNone(metadata)) return yield* Effect.sync(() => notFound())
	if (Option.getOrNull(metadata.value.state) === "Coming Soon") {
		return yield* Effect.sync(() => notFound())
	}

	const config = yield* getInteractiveMapConfig(metadata.value.id as InteractiveMapKey)
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
	const maps = getInteractiveMaps().map(encodeInteractiveMap)

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Suspense fallback={<SidebarLoader />}>
				<MapSidebar groups={groups} maps={maps} mapLayers={config.layers} />
			</Suspense>
			<div className="-mt-10 h-svh w-svw">
				<CustomSideBarTrigger className={cn({ "top-18": config.layers.length === 1 })} />
				<InteractiveMapWrapper mapConfig={config} />
			</div>
		</SidebarProvider>
	)
})
