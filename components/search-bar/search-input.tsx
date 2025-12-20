"use client"
import type { Route } from "next"
import type { MapConfigMetadata } from "@/map-configs"
import { Book, BookText, Brain, ComponentIcon, MapIcon, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { IS_MAC_OS } from "@/utils/constants"
import Shortcut from "../shortcut/shortcut"
import { Button } from "../ui/button"
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command"
import { DialogDescription, DialogTitle } from "../ui/dialog"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

interface SearchEntry {
	id: string
	title: string
}

interface MapSearch extends SearchEntry {
	game: {
		title: string
		id: string
	}
}

interface QuestSearch extends MapSearch {
	map: {
		title: string
		id: string
	}
}

type RelicSearch = QuestSearch

interface SearchInputProps {
	showFull?: boolean
	maps: MapSearch[]
	games: SearchEntry[]
	quests: QuestSearch[]
	zombies: SearchEntry[]
	relics: RelicSearch[]
	availableMaps: Pick<MapConfigMetadata, "id" | "title">[]
}

const filters = [
	{ name: "All", icon: Search },
	{ name: "Main Quests", icon: BookText },
	{ name: "Side Quests", icon: Book },
	{ name: "Zombies", icon: Brain },
	{ name: "Maps", icon: MapIcon },
	{ name: "Relics", icon: ComponentIcon },
]

export default function SearchInput({
	showFull,
	maps,
	games,
	quests,
	zombies,
	availableMaps,
	relics,
}: SearchInputProps) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [filter, setFilter] = useState("All")

	const mapSlugs = new Set(quests.map(q => q.map.id))
	const relicMapSlugs = new Set(relics.map(r => r.map.id))
	const questMaps = maps.filter(m => mapSlugs.has(m.id))
	const relicMaps = maps.filter(m => relicMapSlugs.has(m.id))
	const shortcut = IS_MAC_OS ? "meta+k" : "ctrl+k"

	useShortcut(shortcut, () => setOpen(prev => !prev), { ignoreInputs: false })

	const onSelectHandler = <T extends string>(url: Route<T>) => {
		setOpen(false)
		router.push(url)
	}

	return (
		<>
			<Button
				type="button"
				size="sm"
				variant="outline"
				className={cn(
					"relative hidden w-64 gap-x-2 rounded-sm text-muted-foreground text-xs lg:flex",
					{
						flex: showFull,
					},
				)}
				onClick={() => setOpen(!open)}
			>
				<Search className="size-5" />
				<span className="mr-auto text-sm">Search Content...</span>
				<Shortcut shortcuts={IS_MAC_OS ? ["⌘", "K"] : ["Ctrl", "K"]} size="sm" />
			</Button>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className={cn("flex text-muted-foreground lg:hidden", { hidden: showFull })}
				onClick={() => setOpen(!open)}
				title="Search"
				aria-label="Search Content"
			>
				<Search className="size-6" />
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="sr-only">Search Bar</DialogTitle>
				<DialogDescription className="sr-only">Search for Guides</DialogDescription>
				<CommandInput placeholder="Search guides, zombies, maps, relics" className="text-base" />
				<ScrollArea className="pb-2">
					<div className="flex gap-1 p-2">
						{filters.map(f => (
							<Button
								key={f.name}
								size={"sm"}
								variant="outline"
								onClick={() => setFilter(f.name)}
								className={cn("flex h-5 items-center rounded-lg p-2 py-3 text-xs", {
									"badge-primary-gradient dark:dark-badge-primary-gradient": filter === f.name,
								})}
							>
								<f.icon className="size-4" />
								<span className="blur-none">{f.name}</span>
							</Button>
						))}
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
				<div className="relative">
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						{filter === "All" || filter === "Main Quests"
							? games
									.filter(game => maps.some(m => m.game.id === game.id))
									.map(game => (
										<CommandGroup heading={`${game.title} Main Quests`} key={game.id}>
											{maps.map(m =>
												m.game.id !== game.id ? null : (
													<CommandItem
														key={`${game.id}_${m.id}`}
														onSelect={() => onSelectHandler(`/${m.game.id}/${m.id}`)}
														className="cursor-pointer gap-2"
													>
														<BookText className="size-4" />
														<span className="blur-none">{m.title}</span>
													</CommandItem>
												),
											)}
										</CommandGroup>
									))
							: null}
						{filter === "All" || filter === "Side Quests"
							? questMaps.map(m => (
									<CommandGroup heading={`${m.title} Side Quests`} key={m.id}>
										{quests.map(q =>
											q.map.id !== m.id ? null : (
												<CommandItem
													key={`${q.id}_${m.id}`}
													onSelect={() =>
														onSelectHandler(`/side-quests/${q.game.id}/${q.map.id}/${q.id}`)
													}
													className="cursor-pointer gap-2"
												>
													<Book className="size-4" />
													<span className="blur-none">{q.title}</span>
												</CommandItem>
											),
										)}
									</CommandGroup>
								))
							: null}
						{filter === "All" || filter === "Zombies" ? (
							<CommandGroup heading="Zombies">
								{zombies.map(zombie => (
									<CommandItem
										key={zombie.id}
										onSelect={() => onSelectHandler(`/bestiary/${zombie.id}`)}
										className="cursor-pointer gap-2"
									>
										<Brain className="size-4" />
										<span className="blur-none">{zombie.title}</span>
									</CommandItem>
								))}
							</CommandGroup>
						) : null}
						{filter === "All" || filter === "Maps" ? (
							<CommandGroup heading="Interactive Maps">
								{availableMaps.map(map => (
									<CommandItem
										key={map.id}
										onSelect={() => onSelectHandler(`/maps/${map.id}`)}
										className="cursor-pointer gap-2"
									>
										<MapIcon className="size-4" />
										<span className="blur-none">{`${map.title} Interactive Map`}</span>
									</CommandItem>
								))}
							</CommandGroup>
						) : null}
						{filter === "All" || filter === "Relics"
							? relicMaps.map(m => (
									<CommandGroup heading={`${m.title} Relics`} key={m.id}>
										{relics.map(r =>
											r.map.id !== m.id ? null : (
												<CommandItem
													key={`${r.id}_${m.id}`}
													onSelect={() =>
														onSelectHandler(`/relics/${r.game.id}/${r.id}`)
													}
													className="cursor-pointer gap-2"
												>
													<ComponentIcon className="size-4" />
													<span className="blur-none">{r.title}</span>
												</CommandItem>
											),
										)}
									</CommandGroup>
								))
							: null}
					</CommandList>
				</div>
			</CommandDialog>
		</>
	)
}
