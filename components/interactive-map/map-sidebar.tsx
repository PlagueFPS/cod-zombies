"use client"
import type { MapConfigMetadata, MapLayer } from "@/map-configs"
import type { MapMarker, MarkerCategory } from "@/map-configs/markers"
import { Option } from "effect"
import { ChevronDown, MapPin } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { cn } from "@/lib/utils"
import { capitalize } from "@/utils/functions.client"
import { ComingSoonBadge, NewBadge } from "../custom-badges/custom-badges"
import ShareButton from "../share-button/share-button"
import Socials from "../socials/socials"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select"
import { Separator } from "../ui/separator"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarTrigger,
} from "../ui/sidebar"
import { Switch } from "../ui/switch"
import LayerSwitcher from "./layer-switcher"

interface IMapSidebar {
	maps: MapConfigMetadata[]
	groups: Record<MarkerCategory, Set<string>>
	mapLayers: MapLayer[]
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
	const mapMarkers = Option.isSome(layerParam)
		? (mapLayers.find(layer => layer.id === layerParam.value)?.markers ?? [])
		: (mapLayers.at(0)?.markers ?? [])
	const { id } = useParams()
	const [toggle, setToggle] = useState<"All" | "None">("None")
	const router = useRouter()
	const currentMap = capitalize(String(id))

	useEffect(() => {
		convertIncludeToExclude(mapMarkers)
	}, [convertIncludeToExclude, mapMarkers])

	const handleCheckedChange = (type: string) => {
		toggleExcludeParam(type)
	}

	const handleClick = (map: string) => {
		router.push(`/maps/${map}`)
	}

	const createShareableURL = () => {
		// Without this line, function errors during SSR
		if (typeof window === "undefined") return ""

		const params = createParams()
		if (params.size > 0) {

			if (params.has("exclude")) {
				const excludeParams = Option.match(Option.fromNullable(params.get("exclude")), {
					onSome: value => {
						const decoded = decodeURIComponent(value)
						return decoded.split(",").map(v => v.trim()).filter(v => v.length > 0)
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

	const toggleFilters = () => {
		if (toggle === "All") {
			setToggle("None")
			clearParam("exclude")
			return
		}

		const allMarkerIds = Array.from(
			new Set(mapMarkers.map(marker => marker.type || marker.id)),
		)

		const params = createParams()
		params.delete("include")
		params.delete("exclude")

		if (allMarkerIds.length > 0) {
			params.append("exclude", allMarkerIds.join(","))
		}

		updateURLParams(params)
		setToggle("All")
	}

	const existsInLayer = (marker: string) => {
		return mapMarkers.some(m => m.type === marker || m.id === marker)
	}

	return (
		<Sidebar side="left" collapsible="offcanvas" className="z-500 mt-16">
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
												"pointer-events-none":
													map.id === id || Option.getOrNull(map.state) === "Coming Soon",
											})}
											value={map.id}
										>
											<span
												className={cn({
													"text-muted-foreground":
														map.id === id || Option.getOrNull(map.state) === "Coming Soon",
												})}
											>
												{map.title}
											</span>
											{Option.match(map.state, {
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
				<SidebarMenu>
					<SidebarMenuItem className="mx-2 mt-4 flex items-center justify-between rounded-md bg-accent p-2 dark:bg-accent/25">
						<span className="text-sm">Disable Filters</span>
						<Switch
							checked={toggle === "All"}
							onCheckedChange={toggleFilters}
							className="ml-auto cursor-pointer data-[state=checked]:bg-primary"
						/>
					</SidebarMenuItem>
				</SidebarMenu>

				{groups.general.size > 0 && (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="mb-2 cursor-pointer hover:bg-accent/50">
									<span>General</span>
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
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
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="mb-2 cursor-pointer hover:bg-accent/50">
									<span>Equipment</span>
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
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
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="mb-2 cursor-pointer hover:bg-accent/50">
									<span>Upgrades</span>
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
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
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="mb-2 cursor-pointer hover:bg-accent/50">
									Objectives
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
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
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="mb-2 cursor-pointer hover:bg-accent/50">
									Transportation
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
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
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="mb-2 cursor-pointer hover:bg-accent/50">
									Intel
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
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
