"use client"
import type { Route } from "next"
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys"
import {
	ArrowDownIcon,
	ArrowUpIcon,
	BookIcon,
	BookTextIcon,
	BrainIcon,
	ComponentIcon,
	CornerDownLeftIcon,
	type LucideIcon,
	MapIcon,
	Search,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import { Shortcut } from "@/components/client/shortcut"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandCollection,
	CommandDialog,
	CommandDialogPopup,
	CommandDialogTrigger,
	CommandEmpty,
	CommandFooter,
	CommandGroup,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	CommandList,
	CommandPanel,
	CommandSeparator,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

const SEARCH_ICONS = {
	BookText: BookTextIcon,
	Book: BookIcon,
	Brain: BrainIcon,
	Component: ComponentIcon,
	Map: MapIcon,
} as const satisfies Record<string, LucideIcon>

interface SearchItem {
	value: string
	icon?: keyof typeof SEARCH_ICONS
	items: {
		value: Route
		label: string
	}[]
}

interface SearchInputProps {
	searchItems: SearchItem[]
}

export function SearchBarInput({ searchItems }: SearchInputProps) {
	const router = useRouter()
	const [open, setOpen] = useState(false)

	useHotkey("Mod+K", () => setOpen(prev => !prev))

	const onClickHandler = <T extends string>(url: Route<T>) => {
		setOpen(false)
		router.push(url)
	}

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandDialogTrigger
				render={<Button variant="outline" size="sm" />}
				className={cn("relative gap-x-2 rounded-sm text-xs text-muted-foreground")}
			>
				<Search className="size-5" />
				<span className="mr-auto text-sm">Search</span>
				<Shortcut shortcut={formatForDisplay("Mod+K")} size="sm" />
			</CommandDialogTrigger>
			<CommandDialogPopup>
				<Command items={searchItems}>
					<CommandInput placeholder="Search quests, relics, zombies, maps" />
					<CommandPanel>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandList>
							{(group: SearchItem, index: number) => (
								<Fragment key={group.value}>
									<CommandGroup items={group.items}>
										<CommandGroupLabel>{group.value}</CommandGroupLabel>
										<CommandCollection>
											{(item: SearchItem["items"][number]) => {
												const Icon = group.icon ? SEARCH_ICONS[group.icon] : null
												return (
													<CommandItem
														key={item.value}
														value={item.value}
														onClick={() => onClickHandler(item.value)}
														className="flex items-center gap-2"
													>
														{Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
														{item.label}
													</CommandItem>
												)
											}}
										</CommandCollection>
									</CommandGroup>
									{index < searchItems.length - 1 && <CommandSeparator />}
								</Fragment>
							)}
						</CommandList>
					</CommandPanel>
					<CommandFooter>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Shortcut size="sm" variant="outline">
									<ArrowDownIcon />
									<ArrowUpIcon />
								</Shortcut>
								<span>Navigate</span>
							</div>
							<div className="flex items-center gap-2">
								<Shortcut size="sm" variant="outline">
									<CornerDownLeftIcon />
								</Shortcut>
								<span>Open</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Shortcut shortcut="Esc" size="sm" variant="outline" />
							<span>Close</span>
						</div>
					</CommandFooter>
				</Command>
			</CommandDialogPopup>
		</CommandDialog>
	)
}
