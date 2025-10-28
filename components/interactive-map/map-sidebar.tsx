"use client"
import type { MapId } from "@/map-configs"
import type { MapMarker, MarkerCategory } from "@/map-configs/markers"
import { ChevronDown, MapPin } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Discord from "@/components/SVGs/DiscordSVG"
import Reddit from "@/components/SVGs/Reddit"
import X from "@/components/SVGs/XSVG"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { cn } from "@/lib/utils"
import { capitalize, slugify } from "@/utils/functions.client"
import ExternalLink from "../external-link/external-link"
import ShareButton from "../share-button/share-button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem } from "../ui/select"
import { Input } from "../ui/input"
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
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "../ui/sidebar"
import { Switch } from "../ui/switch"

interface IMapSidebar {
	availableMaps: MapId[]
	groups: Record<MarkerCategory, Set<string>>
	mapMarkers: MapMarker[]
}

export default function MapSidebar({ groups, availableMaps, mapMarkers }: IMapSidebar) {
	const { clearParam, toggleExcludeParam, createParams, searchTerm, updateURLParams, isIncluded } =
		useMapSearchParams()
	const { id } = useParams()
	const [toggle, setToggle] = useState<"All" | "None">("None")
	const router = useRouter()
	const currentMap = capitalize(String(id))
	const filteredGroups = Object.keys(groups).reduce(
		(acc, category) => {
			const filtered = new Set(
				[...groups[category as MarkerCategory]].filter(value =>
					value.includes(slugify(searchTerm)),
				),
			)

			acc[category as MarkerCategory] = filtered
			return acc
		},
		{} as Record<MarkerCategory, Set<string>>,
	)

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
				const excludeParams = params.getAll("exclude")
				const includeParams = mapMarkers.filter(
					marker => !excludeParams.includes(marker.type || marker.id),
				)
				params.delete("exclude")
				includeParams.forEach(marker => {
					params.append("include", marker.type || marker.id)
				})

				return `${window.location.origin}/maps/${id}?${params.toString()}`
			}

			return `${window.location.origin}/maps/${id}?${params.toString()}`
		}

		return `${window.location.origin}/maps/${id}`
	}

	const toggleFilters = () => {
		if (toggle === "All") {
			setToggle("None")
			return clearParam("exclude")
		}

		const newValues: string[] = []

		for (const category in groups) {
			groups[category as MarkerCategory].forEach(value => {
				newValues.push(value)
			})
		}

		toggleExcludeParam(newValues)
		setToggle("All")
	}

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const params = createParams()
		if (e.target.value) params.set("search", e.target.value)
		else params.delete("search")
		updateURLParams(params)
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
									{availableMaps.map(map => (
										<SelectItem
											key={map}
											className={cn({ "pointer-events-none": map === id })}
											value={map}
										>
											<span className={cn({ "text-muted-foreground": map === id })}>
												{capitalize(map)}
											</span>
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
				<SidebarMenu className="px-4 pt-2">
					<SidebarMenuItem>
						<Input
							type="search"
							placeholder="Filter Search..."
							aria-label="Filter Search"
							value={searchTerm}
							onChange={handleOnChange}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					<SidebarMenuItem className="mt-2 px-8">
						<SidebarMenuButton
							onClick={toggleFilters}
							className="cursor-pointer justify-center border bg-accent/30"
						>
							<span className="tracking-wide">
								{toggle === "None" ? "Disable Filters" : "Enable Filters"}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				{filteredGroups.general.size > 0 && (
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
										{[...filteredGroups.general].map(marker => (
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

				{filteredGroups.equipment.size > 0 && (
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
										{[...filteredGroups.equipment].map(marker => (
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

				{filteredGroups.upgrades.size > 0 && (
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
										{[...filteredGroups.upgrades].map(marker => (
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

				{filteredGroups.objectives.size > 0 && (
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
										{[...filteredGroups.objectives].map(marker => (
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

				{filteredGroups.transportation.size > 0 && (
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
										{[...filteredGroups.transportation].map(marker => (
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

				{filteredGroups.intel.size > 0 && (
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
										{[...filteredGroups.intel].map(marker => (
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
						<div className="flex items-center justify-evenly gap-3 text-muted-foreground">
							<ExternalLink
								href="https://x.com/CodZombiesGuide"
								title="Twitter"
								aria-label="Check out our Twitter profile"
							>
								<X className="size-5" />
							</ExternalLink>
							<Separator orientation="vertical" className="min-h-5" />
							<ExternalLink
								href="https://discord.gg/callofduty"
								title="Discord"
								aria-label="Join the Official Call of Duty Discord"
							>
								<Discord className="size-5" />
							</ExternalLink>
							<Separator orientation="vertical" className="min-h-5" />
							<ExternalLink
								href="https://www.reddit.com/r/CODZombies/"
								title="Reddit"
								aria-label="Join the Official Call of Duty: Zombies Subreddit"
							>
								<Reddit className="size-5" />
							</ExternalLink>
							<Separator orientation="vertical" className="min-h-5" />
							<ShareButton title={`${currentMap} interactive map`} url={createShareableURL()} />
						</div>
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
						src={`/icons/upgrades/juggernog.webp`}
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
