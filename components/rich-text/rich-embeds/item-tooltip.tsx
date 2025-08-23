"use client"
import type { createItemTooltipDto } from "@/utils/contentful-utils"
import { RarityBadge, TypeBadge } from "@/components/custom-badges/custom-badges"
import IconImage from "@/components/icon-image/icon-image"
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
								"group relative inline-flex cursor-default items-center justify-center gap-2",
								className,
							)}
							asChild
						>
							<span
								className={cn(
									"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
									{
										"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
											item.type === "Normal",
										"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
											item.type === "Special",
										"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
											item.type === "Elite",
										"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
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
									"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
										item.type === "Normal",
									"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
										item.type === "Special",
									"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
										item.type === "Elite",
									"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
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

const ItemPopover = ({ item, className }: ItemTooltipProps) => {
	switch (item._tag) {
		case "ZOMBIE": {
			return (
				<Popover>
					<PopoverTrigger
						className={cn("group inline-flex items-center justify-center gap-2", className)}
					>
						<span
							className={cn(
								"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
								{
									"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
										item.type === "Normal",
									"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
										item.type === "Special",
									"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
										item.type === "Elite",
									"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
										item.type === "Boss",
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
								"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
									item.type === "Normal",
								"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
									item.type === "Special",
								"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
									item.type === "Elite",
								"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
									item.type === "Boss",
							},
						)}
					>
						<ItemTooltipContent item={item} />
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
				<div className="relative flex w-full rounded-md px-4 py-2">
					<div className="absolute top-2 left-2 z-20 flex w-fit items-center justify-center gap-1">
						<TypeBadge type={item.type} />
					</div>
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
					</div>
				</div>
			)
		}
		case "GOBBLEGUM": {
			return (
				<div
					className={cn("relative flex w-full rounded-md px-4 py-2", {
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
				<div className="relative flex w-full rounded-md px-4 py-2">
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
							{`${item.title} Weapon Build`}
						</div>
						<div className="mt-6 pb-8">
							<div className="text-center text-orange-800 text-sm dark:text-orange-200">
								{item.description}
							</div>
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
				<div className="relative flex w-full rounded-md px-4 py-2">
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
