"use client"
import type { createItemTooltipDto } from "@/utils/contentful-utils"
import { AlertTriangle, ExternalLinkIcon, Target } from "lucide-react"
import { RarityBadge, TypeBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import IconImage from "@/components/icon-image/icon-image"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ItemTooltipProps {
	item: ReturnType<typeof createItemTooltipDto>
	className?: string
}

export default function ItemTooltip({ item, className }: ItemTooltipProps) {
	const isMobile = useIsMobile(640)

	if (!isMobile) {
		switch (item._tag) {
			case "ZOMBIE": {
				return (
					<HoverCard openDelay={200}>
						<HoverCardTrigger
							className={cn(
								"relative inline-flex cursor-default items-center justify-center gap-2",
								className,
							)}
							asChild
						>
							<span
								className={cn(
									"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
									{
										"text-teal-600 decoration-teal-600 dark:text-teal-300 dark:decoration-teal-300":
											item.type === "Normal",
										"text-yellow-700 decoration-yellow-700 dark:text-yellow-200 dark:decoration-yellow-200":
											item.type === "Special",
										"text-rose-600 decoration-rose-600 dark:text-rose-300 dark:decoration-rose-300":
											item.type === "Elite",
										"text-red-600 decoration-red-600 dark:text-red-400 dark:decoration-red-400":
											item.type === "Boss",
									},
								)}
							>
								{item.title}
							</span>
						</HoverCardTrigger>
						<HoverCardContent
							side="top"
							className={cn(
								`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200 `,
								{
									"border-teal-600/30 shadow-teal-600 dark:border-teal-300/30 dark:shadow-teal-300":
										item.type === "Normal",
									"border-yellow-600/30 shadow-yellow-600 dark:border-yellow-300/30 dark:shadow-yellow-300":
										item.type === "Special",
									"border-rose-600/30 shadow-rose-600 dark:border-rose-300/30 dark:shadow-rose-300":
										item.type === "Elite",
									"border-red-600/30 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
										item.type === "Boss",
								},
							)}
						>
							{<ItemTooltipContent item={item} />}
						</HoverCardContent>
					</HoverCard>
				)
			}
			default: {
				return (
					<HoverCard openDelay={200}>
						<HoverCardTrigger
							className={cn(
								"group relative inline-flex cursor-default items-center justify-center gap-2",
								className,
							)}
							asChild
						>
							<span>
								{item._tag !== "WEAPON_BUILD" && item.image.url ? (
									<IconImage
										featuredImage={item.image}
										alt={`${item.title} Image`}
										sizes="24px"
										className="my-auto h-6 w-auto"
									/>
								) : null}
								<span
									className={cn(
										"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
										{
											"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
												item.rarity === "Ultra",
											"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
												item.rarity === "Legendary",
											"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
												item.rarity === "Epic",
											"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
												item.rarity === "Rare",
										},
										{
											"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
												item.type === "Time-Based",
											"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
												item.type === "Round-Based",
											"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
												item.type === "Immediate",
											"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
												item.type === "Player-Activated",
										},
									)}
								>
									{item.title}
								</span>
							</span>
						</HoverCardTrigger>
						<HoverCardContent
							side="top"
							className={cn(
								`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200 `,
								{
									"border-red-600/25 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
										item.rarity === "Ultra",
									"border-orange-600/25 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
										item.rarity === "Legendary",
									"border-purple-600/25 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
										item.rarity === "Epic",
									"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
										item.rarity === "Rare",
								},
								{
									"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
										item.type === "Time-Based",
									"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
										item.type === "Round-Based",
									"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
										item.type === "Immediate",
									"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
										item.type === "Player-Activated",
								},
							)}
						>
							{<ItemTooltipContent item={item} />}
						</HoverCardContent>
					</HoverCard>
				)
			}
		}
	}

	return <ItemPopover item={item} className={className} />
}

// Used for Mobile Devices
const ItemPopover = ({ item, className }: ItemTooltipProps) => {
	switch (item._tag) {
		case "ZOMBIE": {
			return (
				<Popover>
					<PopoverTrigger
						className={cn(
							"relative inline-flex cursor-default items-center justify-center gap-2",
							className,
						)}
						asChild
					>
						<span
							className={cn(
								"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
								{
									"text-teal-600 decoration-teal-600 dark:text-teal-300 dark:decoration-teal-300":
										item.type === "Normal",
									"text-yellow-700 decoration-yellow-700 dark:text-yellow-200 dark:decoration-yellow-200":
										item.type === "Special",
									"text-rose-600 decoration-rose-600 dark:text-rose-300 dark:decoration-rose-300":
										item.type === "Elite",
									"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
										item.type === "Boss",
								},
							)}
						>
							{item.title}
						</span>
					</PopoverTrigger>
					<PopoverContent
						side="top"
						className={cn(
							`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200 `,
							{
								"border-teal-600/30 shadow-teal-600 dark:border-teal-300/30 dark:shadow-teal-300":
									item.type === "Normal",
								"border-yellow-600/30 shadow-yellow-600 dark:border-yellow-300/30 dark:shadow-yellow-300":
									item.type === "Special",
								"border-rose-600/30 shadow-rose-600 dark:border-rose-300/30 dark:shadow-rose-300":
									item.type === "Elite",
								"border-red-600/30 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
									item.type === "Boss",
							},
						)}
					>
						{<ItemTooltipContent item={item} />}
					</PopoverContent>
				</Popover>
			)
		}
		default: {
			return (
				<Popover>
					<PopoverTrigger
						className={cn("group inline-flex items-center justify-center gap-2", className)}
					>
						{item._tag !== "WEAPON_BUILD" && item.image.url ? (
							<IconImage
								featuredImage={item.image}
								alt={`${item.title} Image`}
								sizes="24px"
								className="my-auto h-6 w-auto"
							/>
						) : null}
						<span
							className={cn(
								"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
								{
									"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
										item.rarity === "Ultra",
									"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
										item.rarity === "Legendary",
									"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
										item.rarity === "Epic",
									"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
										item.rarity === "Rare",
								},
								{
									"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
										item.type === "Time-Based",
									"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
										item.type === "Round-Based",
									"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
										item.type === "Immediate",
									"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
										item.type === "Player-Activated",
								},
								{
									truncate: item.title.length > 18,
								},
							)}
						>
							{item.title}
						</span>
					</PopoverTrigger>
					<PopoverContent
						side="top"
						className={cn(
							`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200`,
							{
								"border-red-600/30 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
									item.rarity === "Ultra",
								"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
									item.rarity === "Legendary",
								"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
									item.rarity === "Epic",
								"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
									item.rarity === "Rare",
							},
							{
								"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
									item.type === "Time-Based",
								"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
									item.type === "Round-Based",
								"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
									item.type === "Immediate",
								"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
									item.type === "Player-Activated",
							},
						)}
					>
						<ItemTooltipContent item={item} />
					</PopoverContent>
				</Popover>
			)
		}
	}
}

const ItemTooltipContent = ({ item }: ItemTooltipProps) => {
	switch (item._tag) {
		case "ZOMBIE": {
			return (
				<div className="relative flex w-full max-w-sm flex-col rounded-md">
					<div className="flex items-center justify-between bg-accent px-4 py-2 dark:bg-accent/50">
						<div className="flex w-fit items-center justify-center gap-4">
							<TypeBadge type={item.type} />
						</div>
						<CustomLink
							href={`/bestiary/${item.slug}`}
							className="flex items-center justify-center gap-1 text-xs"
							aria-label="View Zombie Details"
						>
							<ExternalLinkIcon
								className={cn(
									"size-4.5 transition-colors hover:text-primary dark:hover:text-primary",
									{
										"text-teal-600 dark:text-teal-200": item.type === "Normal",
										"text-yellow-600 dark:text-yellow-200": item.type === "Special",
										"text-rose-600 dark:text-rose-200": item.type === "Elite",
										"text-red-600 dark:text-red-200": item.type === "Boss",
									},
								)}
							/>
						</CustomLink>
					</div>
					<div className="mt-2 grid grid-cols-2">
						<div className="flex h-full flex-col">
							<div
								className={cn("pl-3 font-bold text-lg", {
									"text-teal-600 dark:text-teal-300": item.type === "Normal",
									"text-yellow-700 dark:text-yellow-200": item.type === "Special",
									"text-rose-600 dark:text-rose-300": item.type === "Elite",
									"text-red-600 dark:text-red-300": item.type === "Boss",
								})}
							>
								{item.title}
							</div>
							{item.image.url ? (
								<IconImage
									featuredImage={item.image}
									alt={`${item.title} Image`}
									sizes="272px"
									className="relative z-10 aspect-square w-full rounded-lg object-cover object-top p-2"
								/>
							) : null}
						</div>
						<div className="mt-2 flex flex-col gap-4">
							<div>
								<h3 className="mb-2 flex items-center gap-1 font-semibold text-foreground text-sm">
									<Target className="size-4 text-red-500" />
									Weak Points
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{item.weakPoints.map((weakPoint, index) => (
										<Badge
											key={`${weakPoint}-${index + 1}`}
											className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit"
										>
											{weakPoint}
										</Badge>
									))}
								</div>
							</div>
							<div className={cn({ hidden: item.elementalWeaknesses.length === 0 })}>
								<h3 className="mb-2 flex items-center gap-1 font-semibold text-foreground text-sm">
									<AlertTriangle className="size-4 text-orange-800 dark:text-orange-300" />
									Elemental Weaknesses
								</h3>
								<div className="flex flex-wrap items-center gap-2 text-sm">
									{item.elementalWeaknesses.map(weakness => (
										<ItemTooltip key={weakness.id} item={weakness} />
									)) ?? (
										<span className="text-foreground dark:text-foreground/80">
											No elemental weaknesses
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		case "GOBBLEGUM": {
			return (
				<div
					className={cn("relative flex w-full flex-col rounded-md px-4 py-2", {
						"bg-gobblegum-ultra": item.rarity === "Ultra",
						"bg-gobblegum-legendary": item.rarity === "Legendary",
						"bg-gobblegum-epic": item.rarity === "Epic",
						"bg-gobblegum-rare": item.rarity === "Rare",
						"bg-gobblegum-time-based": item.type === "Time-Based",
						"bg-gobblegum-round-based": item.type === "Round-Based",
						"bg-gobblegum-immediate": item.type === "Immediate",
						"bg-gobblegum-player-activated": item.type === "Player-Activated",
					})}
				>
					{item.rarity ? (
						<RarityBadge rarity={item.rarity} type={item.type} className="absolute top-4 left-4">
							{item.rarity}
						</RarityBadge>
					) : null}
					{item.type && item.rarity ? (
						<RarityBadge rarity={item.rarity} type={item.type} className="absolute top-4 right-4">
							{item.type}
						</RarityBadge>
					) : null}
					{item.image.url ? (
						<div className="relative flex items-center justify-center">
							<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
							<IconImage
								featuredImage={item.image}
								alt={`${item.title} Image`}
								sizes="80px"
								className="relative z-10 h-20 w-auto p-2"
							/>
						</div>
					) : null}
					<div className="-mt-3 relative z-10">
						<div
							className={cn(
								"px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200",
								{
									"text-red-600 dark:text-red-300": item.rarity === "Ultra",
									"text-orange-600 dark:text-orange-300": item.rarity === "Legendary",
									"text-purple-600 dark:text-purple-300": item.rarity === "Epic",
									"text-blue-600 dark:text-blue-300": item.rarity === "Rare",
								},
								{
									"text-green-600 dark:text-green-300": item.type === "Time-Based",
									"text-blue-600 dark:text-blue-300": item.type === "Round-Based",
									"text-orange-600 dark:text-orange-300": item.type === "Immediate",
									"text-purple-600 dark:text-purple-300": item.type === "Player-Activated",
								},
							)}
						>
							{item.title}
						</div>
						<div className="mt-6 pb-8">
							<div
								className={cn(
									"text-center text-orange-800 text-sm dark:text-orange-200",
									{
										"text-red-600 dark:text-red-300": item.rarity === "Ultra",
										"text-orange-600 dark:text-orange-300": item.rarity === "Legendary",
										"text-purple-600 dark:text-purple-300": item.rarity === "Epic",
										"text-blue-600 dark:text-blue-300": item.rarity === "Rare",
									},
									{
										"text-green-600 dark:text-green-300": item.type === "Time-Based",
										"text-blue-600 dark:text-blue-300": item.type === "Round-Based",
										"text-orange-600 dark:text-orange-300": item.type === "Immediate",
										"text-purple-600 dark:text-purple-300": item.type === "Player-Activated",
									},
								)}
							>
								{item.description}
							</div>
						</div>
					</div>
				</div>
			)
		}
		case "WEAPON_BUILD": {
			return (
				<div className="relative flex w-full flex-col rounded-md px-4 py-2">
					{item.image.url ? (
						<div className="relative flex items-center justify-center">
							<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
							<IconImage
								featuredImage={item.image}
								alt={`${item.title} Image`}
								sizes="80px"
								className="relative z-10 h-20 w-auto p-2"
							/>
						</div>
					) : null}
					<div className="relative z-10">
						<div className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
							{`${item.title} Weapon Build`}
						</div>
						<div className="mx-auto mt-2 grid grid-cols-1 place-content-center gap-2 text-orange-800 text-sm dark:text-orange-200">
							{item.attachments.map((attachment, index) => (
								<span key={`${attachment}_${index + 1}`}>{attachment}</span>
							))}
						</div>
					</div>
				</div>
			)
		}
		default: {
			return (
				<div className="relative flex w-full flex-col rounded-md px-4 py-2">
					{item.image.url ? (
						<div className="relative flex items-center justify-center">
							<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
							<IconImage
								featuredImage={item.image}
								alt={`${item.title} Image`}
								sizes="80px"
								className="relative z-10 h-20 w-auto p-2"
							/>
						</div>
					) : null}
					<div className="-mt-3 relative z-10">
						<div className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
							{item.title}
						</div>
						<div className="mt-6 pb-8">
							<div className="text-center text-orange-800 text-sm dark:text-orange-200">
								{item.description}
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
}
