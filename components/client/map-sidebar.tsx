"use client"
import type { MapConfigLayer } from "@/data/interactive-map"
import type { MapMarker, MarkerCategory } from "@/map-configs/markers"
import type { EncodedInteractiveMap } from "@/utils/rsc-wire"
import { Option } from "effect"
import { ChevronDown, MapPin } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { LayerSwitcher } from "@/components/client/layer-switcher"
import { ShareButton } from "@/components/client/share-button"
import { ComingSoonBadge, NewBadge } from "@/components/server/custom-badges"
import { Socials } from "@/components/server/socials"
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
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { cn } from "@/lib/utils"
import { capitalize } from "@/utils/shared-functions"

interface IMapSidebar {
	maps: EncodedInteractiveMap[]
	groups: Record<MarkerCategory, Set<string>>
	mapLayers: MapConfigLayer[]
}

export default function MapSidebar({ groups, maps, mapLayers }: IMapSidebar) {
	const {
		clearParam,
		toggleExcludeParam,
		createParams,
		layerParam,
		isIncluded,
		convertIncludeToExclude,
		updateURLParams,
	} = useMapSearchParams()
	const { id } = useParams()
	const router = useRouter()
	const mapMarkers = Option.isSome(layerParam)
		? (mapLayers.find(layer => layer.id === layerParam.value)?.markers ?? [])
		: (mapLayers.at(0)?.markers ?? [])
	const currentMap = capitalize(String(id))

	useEffect(() => {
		convertIncludeToExclude(mapMarkers)
	}, [convertIncludeToExclude, mapMarkers])

	const handleCheckedChange = (type: string) => {
		toggleExcludeParam(type)
	}

	const handleClick = (map: string | null) => {
		if (!map) return
		router.push(`/maps/${map}`)
	}

	const createShareableURL = () => {
		// Without this line, function errors during SSR
		if (typeof window === "undefined") return ""

		const params = createParams()
		if (params.size > 0) {
			if (params.has("exclude")) {
				const excludeParams = Option.match(Option.fromNullOr(params.get("exclude")), {
					onSome: value => {
						const decoded = decodeURIComponent(value)
						return decoded
							.split(",")
							.map(v => v.trim())
							.filter(v => v.length > 0)
					},
					onNone: (): string[] => [],
				})

				const includedIds = new Set<string>()
				const includeParams = mapMarkers.filter(marker => {
					const id = marker.type || marker.id
					if (!excludeParams.includes(id) && !includedIds.has(id)) {
						includedIds.add(id)
						return true
					}
					return false
				})

				params.delete("exclude")
				params.append("include", includeParams.map(marker => marker.type || marker.id).join(","))
				return `${window.location.origin}/maps/${id}?${params.toString()}`
			}

			return `${window.location.origin}/maps/${id}?${params.toString()}`
		}

		return `${window.location.origin}/maps/${id}`
	}

	const hideFilters = () => {
		const allMarkerIds = Array.from(new Set(mapMarkers.map(marker => marker.type || marker.id)))

		const params = createParams()
		params.delete("exclude")

		if (allMarkerIds.length > 0) {
			params.append("exclude", allMarkerIds.join(","))
		}

		updateURLParams(params)
	}

	const existsInLayer = (marker: string) => {
		return mapMarkers.some(m => m.type === marker || m.id === marker)
	}

	return (
		<Sidebar side="left" collapsible="offcanvas" className="mt-16">
			<SidebarHeader className="border-b bg-background">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<Select value={currentMap} onValueChange={handleClick}>
							<SelectTrigger className="w-full border border-input bg-input/30 hover:bg-input/50">
								<SelectValue>{currentMap}</SelectValue>
							</SelectTrigger>
							<SelectContent className="z-900">
								<SelectGroup>
									<SelectLabel>Available Maps</SelectLabel>
									{maps.map(map => (
										<SelectItem
											key={map.id}
											className={cn({
												"pointer-events-none": map.id === id || map.state === "Coming Soon",
											})}
											value={map.id}
										>
											<span
												className={cn({
													"text-muted-foreground": map.id === id || map.state === "Coming Soon",
												})}
											>
												{map.title}
											</span>
											{Option.match(Option.fromNullOr(map.state), {
												onNone: () => null,
												onSome: state =>
													state === "Coming Soon" ? <ComingSoonBadge /> : <NewBadge />,
											})}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<SidebarTrigger className="ml-auto" />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="bg-background [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-track]:bg-background [&::-webkit-scrollbar]:w-1.5">
				{mapLayers.length > 1 && (
					<SidebarMenu className="px-4 pt-2">
						<SidebarMenuItem>
							<LayerSwitcher mapLayers={mapLayers} />
						</SidebarMenuItem>
					</SidebarMenu>
				)}
				<SidebarMenu className="mt-4 flex flex-row items-center justify-center">
					<SidebarMenuButton
						onClick={() => clearParam("exclude")}
						aria-label="Show All Markers"
						className="mx-2 cursor-pointer items-center justify-center bg-accent font-medium uppercase tracking-wide transition-colors hover:bg-primary dark:bg-accent/50 hover:dark:bg-primary"
					>
						All
					</SidebarMenuButton>
					<SidebarMenuButton
						onClick={hideFilters}
						aria-label="Hide All Markers"
						className="mx-2 cursor-pointer items-center justify-center bg-accent font-medium uppercase tracking-wide transition-colors hover:bg-primary dark:bg-accent/50 hover:dark:bg-primary"
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
											<SidebarMenuItem
												key={marker}
												className="flex items-center rounded-md bg-accent p-2 dark:bg-accent/25"
											>
												<div className="flex items-center justify-center gap-1">
													<MarkerFilterIcon
														mapMarkers={mapMarkers}
														marker={marker}
														category="general"
													/>
													<span className="font-medium text-base">{capitalize(marker)}</span>
												</div>
												<Switch
													id={`${marker}-filter`}
													onCheckedChange={() => handleCheckedChange(marker)}
													checked={isIncluded(marker)}
													className="ml-auto cursor-pointer data-[state=checked]:bg-blue-500"
												/>
											</SidebarMenuItem>
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
											<SidebarMenuItem
												key={marker}
												className="flex items-center rounded-md bg-accent p-2 dark:bg-accent/25"
											>
												<div className="flex items-center justify-center gap-1">
													<MarkerFilterIcon
														mapMarkers={mapMarkers}
														marker={marker}
														category="equipment"
													/>
													<span className="font-medium text-base">{capitalize(marker)}</span>
												</div>
												<Switch
													id={`${marker}-filter`}
													onCheckedChange={() => handleCheckedChange(marker)}
													checked={isIncluded(marker)}
													className="ml-auto cursor-pointer data-[state=checked]:bg-gray-500"
												/>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.upgrades.size > 0 && (
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
											<SidebarMenuItem
												key={marker}
												className="flex items-center rounded-md bg-accent p-2 dark:bg-accent/25"
											>
												<div className="flex items-center justify-center gap-1">
													<MarkerFilterIcon
														mapMarkers={mapMarkers}
														marker={marker}
														category="upgrades"
													/>
													<span className="font-medium text-base">{capitalize(marker)}</span>
												</div>
												<Switch
													id={`${marker}-filter`}
													onCheckedChange={() => handleCheckedChange(marker)}
													checked={isIncluded(marker)}
													className="ml-auto cursor-pointer data-[state=checked]:bg-yellow-500"
												/>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.objectives.size > 0 && (
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
											<SidebarMenuItem
												key={marker}
												className="flex items-center rounded-md bg-accent p-2 dark:bg-accent/25"
											>
												<div className="flex items-center justify-center gap-1">
													<MarkerFilterIcon
														mapMarkers={mapMarkers}
														marker={marker}
														category="objectives"
													/>
													<span className="font-medium text-base">{capitalize(marker)}</span>
												</div>
												<Switch
													id={`${marker}-filter`}
													onCheckedChange={() => handleCheckedChange(marker)}
													checked={isIncluded(marker)}
													className="ml-auto cursor-pointer"
												/>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.transportation.size > 0 && (
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
											<SidebarMenuItem
												key={marker}
												className="flex items-center rounded-md bg-accent p-2 dark:bg-accent/25"
											>
												<div className="flex items-center justify-center gap-1">
													<MarkerFilterIcon
														mapMarkers={mapMarkers}
														marker={marker}
														category="transportation"
													/>
													<span className="font-medium text-base">{capitalize(marker)}</span>
												</div>
												<Switch
													id={`${marker}-filter`}
													onCheckedChange={() => handleCheckedChange(marker)}
													checked={isIncluded(marker)}
													className="ml-auto cursor-pointer data-[state=checked]:bg-green-500"
												/>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{groups.intel.size > 0 && (
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
											<SidebarMenuItem
												key={marker}
												className="flex items-center rounded-md bg-accent p-2 dark:bg-accent/25"
											>
												<div className="flex items-center justify-center gap-1">
													<MarkerFilterIcon
														mapMarkers={mapMarkers}
														marker={marker}
														category="intel"
													/>
													<span className="font-medium text-base">{capitalize(marker)}</span>
												</div>
												<Switch
													id={`${marker}-filter`}
													onCheckedChange={() => handleCheckedChange(marker)}
													checked={isIncluded(marker)}
													className="ml-auto cursor-pointer data-[state=checked]:bg-purple-500"
												/>
											</SidebarMenuItem>
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
							<ShareButton title={`${currentMap} interactive map`} url={createShareableURL()} />
						</Socials>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
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
						src={`/perks/juggernog-bo6.webp`}
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
						src={mapMarker.icon || `/icons/${category}/${mapMarker.id}.webp`}
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
			src={mapMarker.icon || `/icons/${category}/${mapMarker.id}.webp`}
			height={128}
			width={128}
			alt={`${mapMarker.id} Image`}
			className="size-8"
		/>
	)
}
