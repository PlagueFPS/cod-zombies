import type { Difficulty } from "@/data/maps"
import type { ZombieType } from "@/data/zombies"
import { CirclePlus, Trash } from "lucide-react"
import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"
import { capitalize } from "@/utils/functions.client"
import { DifficultyBadge, TypeBadge } from "../custom-badges/custom-badges"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"

export interface Filter {
	id: string
	slug: string
	title: string
}

interface IFiltersCombobox {
	data: Filter[]
	currentSelection: string[]
	title: string
	enableInput?: boolean
	inputPlaceholder?: string
	toggleParam: (param: string) => void
	clearParam: () => void
}

const FiltersCombobox = ({
	data,
	currentSelection,
	title,
	inputPlaceholder,
	enableInput,
	toggleParam,
	clearParam,
}: IFiltersCombobox) => {
	const [open, setOpen] = useState(false)

	const renderBadge = () => {
		if (currentSelection.length !== 1) {
			return (
				<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
					{currentSelection.length}
				</Badge>
			)
		}

		if (!currentSelection[0]) return null

		switch (title) {
			case "Difficulty":
				return <DifficultyBadge difficulty={capitalize(currentSelection[0]) as Difficulty} />
			case "Type":
				return <TypeBadge type={capitalize(currentSelection[0]) as ZombieType} />
			default:
				return (
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{capitalize(currentSelection[0])}
					</Badge>
				)
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					size={"sm"}
					aria-expanded={open}
					className="gap-2 border-dashed"
				>
					<CirclePlus className="size-4 text-primary" />
					{title}
					{currentSelection.length > 0 && (
						<>
							<Separator orientation="vertical" className="min-h-5" />
							{renderBadge()}
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-52 p-0">
				<Command>
					{enableInput && <CommandInput placeholder={inputPlaceholder ?? title} />}
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							<div className="space-y-2 py-2">
								{data.map(item => (
									<CommandItem
										key={item.id}
										className="group flex cursor-pointer items-center gap-2 rounded data-[selected=true]:hover:bg-accent data-[selected=true]:focus-within:bg-accent data-[selected=true]:hover:dark:bg-secondary data-[selected=true]:focus-within:dark:bg-secondary"
										onSelect={() => toggleParam(item.slug)}
										tabIndex={0}
									>
										<Checkbox
											checked={currentSelection.includes(item.slug)}
											onCheckedChange={() => toggleParam(item.slug)}
											className="cursor-pointer group-data-[selected=true]:bg-background group-data-[selected=true]:dark:bg-background/50"
											tabIndex={-1}
										/>
										{title === "Game" ? <FilterLogo slug={item.slug} className="size-4" /> : null}
										<Label
											htmlFor={item.id}
											className="w-full cursor-pointer font-normal"
											onClick={() => toggleParam(item.slug)}
											tabIndex={-1}
										>
											{title === "Difficulty" ? (
												<DifficultyBadge difficulty={item.title as Difficulty} />
											) : title === "Type" ? (
												<TypeBadge type={item.title as ZombieType} />
											) : (
												item.title
											)}
										</Label>
									</CommandItem>
								))}
							</div>
						</CommandGroup>
						{currentSelection.length > 0 && (
							<div className="sticky bottom-0 flex w-full items-center justify-center border-t py-1">
								<CommandItem onSelect={clearParam} asChild>
									<Button variant={"ghost"} size={"sm"} className="items-center justify-center">
										<Trash className="size-4 text-red-800 dark:text-red-400" />
										<span>Clear {title} Filters</span>
									</Button>
								</CommandItem>
							</div>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default FiltersCombobox

interface IFilterLogo extends Omit<ImageProps, "src" | "alt"> {
	slug: string
}

const FilterLogo = ({ slug, ...props }: IFilterLogo) => {
	const { imageLoaded, setImageLoaded, imageErrored, setImageErrored } = useImageState()

	if (imageErrored) return null

	return (
		<Image
			{...props}
			unoptimized
			src={`/${slug}_logo.webp`}
			alt={`${slug} Logo`}
			height={32}
			width={32}
			onError={() => setImageErrored(true)}
			onLoad={() => setImageLoaded(true)}
			className={cn("opacity-0", props.className, {
				"animate-fade-in opacity-100": imageLoaded,
			})}
		/>
	)
}
