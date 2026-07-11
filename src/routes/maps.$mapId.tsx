import type { Link } from "@/components/breadcrumbs"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCookie, setResponseHeader } from "@tanstack/react-start/server"
import { Effect, Option, Array as Arr } from "effect"
import { CustomSideBarTrigger } from "@/components/custom-sidebar-trigger"
import { InteractiveMap } from "@/components/interactive-map"
import InteractiveMapLoader from "@/components/interactive-map-loader"
import MapSidebar from "@/components/map-sidebar"
import NotFoundContent from "@/components/not-found-content"
import { RemoveScroll } from "@/components/remove-scroll"
import SidebarLoader from "@/components/sidebar-loader"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MapSettingsProvider } from "@/contexts/interactive-map-settings"
import {
	getInteractiveMapByKey,
	getInteractiveMapConfig,
	getInteractiveMaps,
	type InteractiveMapKey,
} from "@/data/interactive-map"
import { cn } from "@/lib/utils"
import { categoryHandlers, type MarkerCategory } from "@/map-configs/markers"
import { encodeInteractiveMap, encodeMapConfig, encodeMapConfigLayer } from "@/utils/rsc-wire"
import { capitalize, createSeoTitle } from "@/utils/shared-functions"
import { StandardInteractiveMapSearchParamsSchema } from "@/utils/validation-schemas"

const getSidebarState = createServerFn().handler(async () => {
	const sidebarState = getCookie("sidebar_state")

	// Caches the response in the browser for 1 year
	setResponseHeader("Cache-Control", "private, max-age=31536000")
	// or until any cookies change (sidebar_state)
	setResponseHeader("Vary", "Cookie")

	return { sidebarState: sidebarState ? sidebarState === "true" : true }
})

export const Route = createFileRoute("/maps/$mapId")({
	ssr: "data-only",
	validateSearch: StandardInteractiveMapSearchParamsSchema,
	loaderDeps: ({ search }) => ({
		include: search.include,
		exclude: search.exclude,
		layer: search.layer,
	}),
	loader: async ({ params, deps, context }) => {
		const metadata = getInteractiveMapByKey(params.mapId as InteractiveMapKey).pipe(
			Option.getOrThrowWith(() => notFound()),
		)
		if (metadata.state.valueOrUndefined === "Coming Soon") throw notFound()

		const [config, { sidebarState }] = await Promise.all([
			getInteractiveMapConfig(metadata.id as InteractiveMapKey).pipe(Effect.runPromise),
			getSidebarState(),
		])

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
				acc[marker.category].add(categoryHandlers[marker.category](marker))
			})

			return acc
		}, initialGroups)

		const currentLayer = Option.match(Option.fromNullishOr(deps.layer), {
			onNone: () => Arr.head(config.layers),
			onSome: layerId => Arr.findFirst(config.layers, layer => layer.id === layerId),
		}).pipe(Option.map(encodeMapConfigLayer), Option.getOrNull)

		if (!currentLayer) throw notFound()

		return {
			metadata: {
				title: createSeoTitle(`${metadata.title} Interactive Map`),
				description: metadata.description,
				image: metadata.image,
			},
			serverUrl: context.serverUrl,
			config: encodeMapConfig(config),
			currentLayer,
			groups,
			maps: getInteractiveMaps().map(encodeInteractiveMap),
			sidebarState,
		}
	},
	head: ({ loaderData, params }) => ({
		meta: [
			{ title: loaderData?.metadata.title },
			{ name: "description", content: loaderData?.metadata.description },
			{ property: "og:title", content: loaderData?.metadata.title },
			{ property: "og:description", content: loaderData?.metadata.description },
			{
				property: "og:url",
				content: `${loaderData?.serverUrl}/maps/${params.mapId}.webp`,
			},
			{ property: "og:image", content: `${loaderData?.serverUrl}${loaderData?.metadata.image}` },
			{ property: "og:image:width", content: "640" },
			{ property: "og:image:height", content: "360" },
			{ property: "og:image:type", content: "image/jpeg" },
			{ property: "twitter:title", content: loaderData?.metadata.title },
			{ property: "twitter:description", content: loaderData?.metadata.description },
			{ property: "twitter:card", content: "summary_large_image" },
			{ property: "twitter:url", content: `${loaderData?.serverUrl}/maps/${params.mapId}.webp` },
			{
				property: "twitter:image",
				content: `${loaderData?.serverUrl}/maps/${params.mapId}.webp`,
			},
		],
	}),
	notFoundComponent: InteractiveMapNotFound,
	pendingComponent: InteractiveMapPending,
	component: InteractiveMapPage,
})

function InteractiveMapPage() {
	const { config, currentLayer, groups, maps, sidebarState } = Route.useLoaderData()

	return (
		<MapSettingsProvider>
			<SidebarProvider defaultOpen={sidebarState}>
				<MapSidebar groups={groups} maps={maps} mapLayers={config.layers} />
				<div className="-mt-10 h-svh w-svw">
					<CustomSideBarTrigger className={cn({ "top-18": config.layers.length === 1 })} />
					<RemoveScroll>
						<InteractiveMap currentLayer={currentLayer} />
					</RemoveScroll>
				</div>
			</SidebarProvider>
		</MapSettingsProvider>
	)
}

function InteractiveMapPending() {
	return (
		<div className="flex">
			<SidebarLoader />
			<InteractiveMapLoader />
		</div>
	)
}

function InteractiveMapNotFound() {
	const params = Route.useParams()
	const items: Link[] = [
		{ href: "/maps", title: "Maps" },
		{
			href: "/maps/$mapId",
			title: capitalize(params.mapId),
			params: { mapId: params.mapId },
		},
	]

	return <NotFoundContent items={items} resource="Map" param={params.mapId} />
}
