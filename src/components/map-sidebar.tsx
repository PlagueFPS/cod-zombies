import type { MapMarker, MarkerCategory } from "@/map-configs/markers"
import { useParams, useRouter } from "@tanstack/react-router"
import { cn } from "cn"
import { Option } from "effect"
import { ChevronDown, MapPin } from "lucide-react"
import { useEffect, useMemo } from "react"
import { NewBadge } from "@/components/custom-badges"
import { Image } from "@/components/image"
import { LayerSwitcher } from "@/components/layer-switcher"
import { ShareButton } from "@/components/share-button"
import { Socials } from "@/components/socials"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useMapSearch } from "@/hooks/use-map-search"
import {
	decodeInteractiveMap,
	decodeMapConfigLayer,
	type EncodedInteractiveMap,
	type EncodedMapConfigLayer,
} from "@/utils/rsc-wire"
import { capitalize } from "@/utils/shared-functions"
import { Badge } from "./ui/badge"

interface IMapSidebar {
	maps: EncodedInteractiveMap[]
	groups: Record<MarkerCategory, Set<string>>
	mapLayers: EncodedMapConfigLayer[]
}

export default function MapSidebar({
	groups,
	maps: encodedMaps,
	mapLayers: encodedMapLayer,
}: IMapSidebar) {
	const params = useParams({ from: "/maps/$mapId" })
	const router = useRouter()
	const {
		layer,
		isIncluded,
		toggleExclude,
		showAll,
		hideAll,
		convertIncludeToExclude,
		buildShareableSearch,
	} = useMapSearch()
	const maps = encodedMaps.map(decodeInteractiveMap)
	const mapLayers = encodedMapLayer.map(decodeMapConfigLayer)
	const mapMarkers = useMemo(() => {
		if (!layer) return mapLayers.at(0)?.markers ?? []
		return mapLayers.find(l => l.id === layer)?.markers ?? []
	}, [layer, mapLayers])

	const currentMap = capitalize(params.mapId)

	useEffect(() => {
		convertIncludeToExclude(mapMarkers)
	}, [convertIncludeToExclude, mapMarkers])

	const handleClick = (map: string | null) => {
		if (!map) return
		void router.navigate({ to: "/maps/$mapId", params: { mapId: map } })
	}

	const createShareableURL = () => {
		if (typeof window === "undefined") return ""

		const search = buildShareableSearch(mapMarkers)
		const { href } = router.buildLocation({
			to: "/maps/$mapId",
			params: { mapId: params.mapId },
			search,
		})
		return `${window.location.origin}${href}`
	}

	const existsInLayer = (marker: string) => {
		return mapMarkers.some(m => m.type === marker || m.id === marker)
	}

	const isGroupInLayer = (category: MarkerCategory) => {
		return mapMarkers.some(marker => marker.category === category)
	}

	const countLocationsInLayer = (markerKey: string) => {
		return mapMarkers
			.filter(m => m.type === markerKey || m.id === markerKey)
			.reduce((sum, m) => sum + m.locations.length, 0)
	}

	return (
		<Sidebar side="left" collapsible="offcanvas" className="mt-16">
			<SidebarHeader className="border-b bg-background">
				<SidebarMenu className="gap-4">
					<SidebarMenuItem className="mt-1 flex items-start gap-2">
						<div className="flex flex-1 flex-col">
							<span className="ml-1 text-sm text-muted-foreground">Current Map</span>
							<Select value={currentMap} onValueChange={handleClick}>
								<SelectTrigger className="w-full border border-input bg-input/30 hover:bg-input/50">
									<SelectValue>{currentMap}</SelectValue>
								</SelectTrigger>
								<SelectContent className="z-900">
									<SelectGroup>
										<SelectLabel>Available Maps</SelectLabel>
										{maps
											.filter(map => map.state.valueOrUndefined !== "Coming Soon")
											.map(map => (
												<SelectItem
													key={map.id}
													className={cn({
														"pointer-events-none":
															map.id === params.mapId ||
															map.state.valueOrUndefined === "Coming Soon",
													})}
													value={map.id}
												>
													<span
														className={cn({
															"text-muted-foreground":
																map.id === params.mapId ||
																map.state.valueOrUndefined === "Coming Soon",
														})}
													>
														{map.title}
													</span>
													{Option.match(map.state, {
														onNone: () => null,
														onSome: state => (state === "New" ? <NewBadge /> : null),
													})}
												</SelectItem>
											))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<SidebarTrigger className="ml-auto" />
					</SidebarMenuItem>
					{mapLayers.length > 1 && (
						<SidebarMenuItem>
							<span className="ml-1 text-sm text-muted-foreground">Current Layer</span>
							<LayerSwitcher mapLayers={mapLayers} />
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="bg-background [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-background">
				<SidebarMenu className="mt-4 flex flex-row items-center justify-center">
					<SidebarMenuButton
						onClick={() => showAll()}
						aria-label="Show All Markers"
						className="mx-2 cursor-pointer items-center justify-center bg-accent font-medium tracking-wide uppercase transition-colors hover:bg-primary dark:bg-accent/50 hover:dark:bg-primary"
					>
						All
					</SidebarMenuButton>
					<SidebarMenuButton
						onClick={() => hideAll(mapMarkers)}
						aria-label="Hide All Markers"
						className="mx-2 cursor-pointer items-center justify-center bg-accent font-medium tracking-wide uppercase transition-colors hover:bg-primary dark:bg-accent/50 hover:dark:bg-primary"
					>
						None
					</SidebarMenuButton>
				</SidebarMenu>

				{groups.general.size > 0 && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								render={<CollapsibleTrigger />}
								className="mb-2 cursor-pointer hover:bg-accent/50"
							>
								<span>General</span>
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="gap-1">
										{[...groups.general].filter(existsInLayer).map(marker => (
											<MarkerSidebarMenuItem
												key={marker}
												marker={marker}
												mapMarkers={mapMarkers}
												category="general"
												isIncluded={isIncluded}
												toggleExclude={toggleExclude}
												countLocationsInLayer={countLocationsInLayer}
											/>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.equipment.size > 0 && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								render={<CollapsibleTrigger />}
								className="mb-2 cursor-pointer hover:bg-accent/50"
							>
								<span>Equipment</span>
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="gap-1">
										{[...groups.equipment].filter(existsInLayer).map(marker => (
											<MarkerSidebarMenuItem
												key={marker}
												marker={marker}
												mapMarkers={mapMarkers}
												category="equipment"
												isIncluded={isIncluded}
												toggleExclude={toggleExclude}
												countLocationsInLayer={countLocationsInLayer}
											/>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.upgrades.size > 0 && isGroupInLayer("upgrades") && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								render={<CollapsibleTrigger />}
								className="mb-2 cursor-pointer hover:bg-accent/50"
							>
								<span>Upgrades</span>
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="gap-1">
										{[...groups.upgrades].filter(existsInLayer).map(marker => (
											<MarkerSidebarMenuItem
												key={marker}
												marker={marker}
												mapMarkers={mapMarkers}
												category="upgrades"
												isIncluded={isIncluded}
												toggleExclude={toggleExclude}
												countLocationsInLayer={countLocationsInLayer}
											/>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.objectives.size > 0 && isGroupInLayer("objectives") && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								render={<CollapsibleTrigger />}
								className="mb-2 cursor-pointer hover:bg-accent/50"
							>
								<span>Objectives</span>
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="gap-1">
										{[...groups.objectives].filter(existsInLayer).map(marker => (
											<MarkerSidebarMenuItem
												key={marker}
												marker={marker}
												mapMarkers={mapMarkers}
												category="objectives"
												isIncluded={isIncluded}
												toggleExclude={toggleExclude}
												countLocationsInLayer={countLocationsInLayer}
											/>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.transportation.size > 0 && isGroupInLayer("transportation") && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								render={<CollapsibleTrigger />}
								className="mb-2 cursor-pointer hover:bg-accent/50"
							>
								<span>Transportation</span>
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="gap-1">
										{[...groups.transportation].filter(existsInLayer).map(marker => (
											<MarkerSidebarMenuItem
												key={marker}
												marker={marker}
												mapMarkers={mapMarkers}
												category="transportation"
												isIncluded={isIncluded}
												toggleExclude={toggleExclude}
												countLocationsInLayer={countLocationsInLayer}
											/>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.intel.size > 0 && isGroupInLayer("intel") && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								render={<CollapsibleTrigger />}
								className="mb-2 cursor-pointer hover:bg-accent/50"
							>
								<span>Intel</span>
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="gap-1">
										{[...groups.intel].filter(existsInLayer).map(marker => (
											<MarkerSidebarMenuItem
												key={marker}
												marker={marker}
												mapMarkers={mapMarkers}
												category="intel"
												isIncluded={isIncluded}
												toggleExclude={toggleExclude}
												countLocationsInLayer={countLocationsInLayer}
											/>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}
			</SidebarContent>
			<SidebarFooter className="mb-16 border-t bg-background">
				<SidebarMenu className="py-4">
					<SidebarMenuItem>
						<Socials className="justify-evenly">
							<Separator orientation="vertical" className="min-h-5" />
							<ShareButton url={createShareableURL()} withText={false} />
						</Socials>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

interface IMarkerSidebarMenuItem {
	marker: string
	mapMarkers: MapMarker[]
	category: MarkerCategory
	isIncluded: (marker: string) => boolean
	toggleExclude: (marker: string) => void
	countLocationsInLayer: (marker: string) => number
}

function MarkerSidebarMenuItem({
	marker,
	mapMarkers,
	category,
	isIncluded,
	toggleExclude,
	countLocationsInLayer,
}: IMarkerSidebarMenuItem) {
	return (
		<SidebarMenuItem
			key={marker}
			className="flex items-center gap-3 rounded-md bg-accent px-2 py-2.5 dark:bg-accent/25"
		>
			<div className="flex flex-1 items-center gap-1">
				<MarkerFilterIcon mapMarkers={mapMarkers} marker={marker} category={category} />
				<span className="text-sm font-medium">{capitalize(marker)}</span>
			</div>
			<MarkerNumberBadge marker={marker} category={category} isIncluded={isIncluded}>
				{countLocationsInLayer(marker)}
			</MarkerNumberBadge>
			<Switch
				id={`${marker}-filter`}
				onCheckedChange={() => toggleExclude(marker)}
				checked={isIncluded(marker)}
				className="ml-auto cursor-pointer data-[state=checked]:bg-blue-500"
			/>
		</SidebarMenuItem>
	)
}

interface IMarkerFilterIcon {
	marker: string
	category: MarkerCategory
	mapMarkers: MapMarker[]
}

function MarkerFilterIcon({ marker, category, mapMarkers }: IMarkerFilterIcon) {
	const mapMarker = mapMarkers.find(m => m.type === marker || m.id === marker)
	if (!mapMarker) return null

	if (mapMarker.type) {
		switch (mapMarker.type) {
			case "label":
				return <MapPin className="size-8 p-1 text-blue-500 dark:text-blue-400" />
			case "perk":
				return (
					<Image
						unoptimized
						src="/perks/juggernog-bo6.webp"
						height={128}
						width={128}
						alt={`Juggernog Image`}
						className="size-8 p-1"
					/>
				)
			default:
				return (
					<Image
						unoptimized
						src={Option.getOrElse(mapMarker.icon, () => `/icons/${category}/${mapMarker.id}.webp`)}
						height={128}
						width={128}
						alt={`${mapMarker.id} Image`}
						className="size-8"
					/>
				)
		}
	}

	return (
		<Image
			unoptimized
			src={Option.getOrElse(mapMarker.icon, () => `/icons/${category}/${mapMarker.id}.webp`)}
			height={128}
			width={128}
			alt={`${mapMarker.id} Image`}
			className="size-8"
		/>
	)
}

interface IMarkerNumberBadge {
	marker: string
	category: MarkerCategory
	isIncluded: (marker: string) => boolean
	children: React.ReactNode
	className?: string
}

function MarkerNumberBadge({
	marker,
	category,
	isIncluded,
	children,
	className,
}: IMarkerNumberBadge) {
	return (
		<Badge
			className={cn(
				"flex h-5 min-w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
				{
					"opacity-35": !isIncluded(marker),
					"bg-blue-500/20 text-blue-600 dark:text-blue-400": category === "general",
					"bg-gray-500/20 text-gray-600 dark:text-gray-400": category === "equipment",
					"bg-yellow-500/20 text-yellow-800 dark:text-yellow-400": category === "upgrades",
					"bg-orange-500/20 text-orange-600 dark:text-orange-400": category === "objectives",
					"bg-green-500/20 text-green-600 dark:text-green-400": category === "transportation",
					"bg-purple-500/20 text-purple-600 dark:text-purple-400": category === "intel",
				},
				className,
			)}
		>
			{children}
		</Badge>
	)
}
