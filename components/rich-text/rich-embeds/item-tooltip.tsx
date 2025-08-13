"use client"
import { RarityBadge } from "@/components/custom-badges/custom-badges"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { type createItemTooltipDto, isWeaponBuildDto } from "@/utils/contentful-utils"

interface ItemTooltipProps {
	item: ReturnType<typeof createItemTooltipDto>
	className?: string
}

export default function ItemTooltip({ item, className }: ItemTooltipProps) {
	const isMobile = useIsMobile(640)
	const { title, image, rarity, type } = item

	return (
		<>
			{!isMobile ? (
				<HoverCard openDelay={200}>
					<HoverCardTrigger
						className={cn(
							"group relative inline-flex cursor-default items-center justify-center gap-2",
							className,
						)}
						asChild
					>
						<span>
							{image.url ? (
								<IconImage
									featuredImage={image}
									alt={`${title} Image`}
									sizes="24px"
									className="my-auto h-6 w-auto"
								/>
							) : null}
							<span
								className={cn(
									"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
									{
										"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
											rarity === "Ultra",
										"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
											rarity === "Legendary",
										"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
											rarity === "Epic",
										"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
											rarity === "Rare",
									},
									{
										"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
											type === "Time-Based",
										"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
											type === "Round-Based",
										"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
											type === "Immediate",
										"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
											type === "Player-Activated",
									},
								)}
							>
								{title}
							</span>
						</span>
					</HoverCardTrigger>
					<HoverCardContent
						side="top"
						className={cn(
							`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200 `,
							{
								"border-red-600/25 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
									rarity === "Ultra",
								"border-orange-600/25 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
									rarity === "Legendary",
								"border-purple-600/25 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
									rarity === "Epic",
								"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
									rarity === "Rare",
							},
							{
								"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
									type === "Time-Based",
								"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
									type === "Round-Based",
								"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
									type === "Immediate",
								"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
									type === "Player-Activated",
							},
						)}
					>
						{<ItemTooltipContent item={item} />}
					</HoverCardContent>
				</HoverCard>
			) : (
				<ItemPopover item={item} className={className} />
			)}
		</>
	)
}

const ItemPopover = ({ item, className }: ItemTooltipProps) => {
	const { title, image, rarity, type } = item

	return (
		<Popover>
			<PopoverTrigger
				className={cn("group inline-flex items-center justify-center gap-2", className)}
			>
				{image.url ? (
					<IconImage
						featuredImage={image}
						alt={`${title} Image`}
						sizes="24px"
						className="my-auto h-6 w-auto"
					/>
				) : null}
				<span
					className={cn(
						"mr-1.5 text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
						{
							"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
								rarity === "Ultra",
							"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
								rarity === "Legendary",
							"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
								rarity === "Epic",
							"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
								rarity === "Rare",
						},
						{
							"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
								type === "Time-Based",
							"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
								type === "Round-Based",
							"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
								type === "Immediate",
							"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
								type === "Player-Activated",
						},
						{
							truncate: title.length > 18,
						},
					)}
				>
					{title}
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn(
					`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200`,
					{
						"border-red-600/30 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
							rarity === "Ultra",
						"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
							rarity === "Legendary",
						"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
							rarity === "Epic",
						"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
							rarity === "Rare",
					},
					{
						"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
							type === "Time-Based",
						"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
							type === "Round-Based",
						"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
							type === "Immediate",
						"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
							type === "Player-Activated",
					},
				)}
			>
				<ItemTooltipContent item={item} />
			</PopoverContent>
		</Popover>
	)
}

const ItemTooltipContent = (props: ItemTooltipProps) => {
	const { title, image, description, rarity, type } = props.item

	return (
		<div
			className={cn(
				"relative flex w-full flex-col rounded-md px-4 py-2",
				{
					"bg-gobblegum-ultra": rarity === "Ultra",
					"bg-gobblegum-legendary": rarity === "Legendary",
					"bg-gobblegum-epic": rarity === "Epic",
					"bg-gobblegum-rare": rarity === "Rare",
				},
				{
					"bg-gobblegum-time-based": type === "Time-Based",
					"bg-gobblegum-round-based": type === "Round-Based",
					"bg-gobblegum-immediate": type === "Immediate",
					"bg-gobblegum-player-activated": type === "Player-Activated",
				},
			)}
		>
			{rarity ? (
				<RarityBadge rarity={rarity} type={type} className="absolute top-4 left-4">
					{rarity}
				</RarityBadge>
			) : null}
			{type && rarity ? (
				<RarityBadge rarity={rarity} type={type} className="absolute top-4 right-4">
					{type}
				</RarityBadge>
			) : null}
			{image.url ? (
				<div className="relative flex items-center justify-center">
					<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
					<IconImage
						featuredImage={image}
						alt={`${title} Image`}
						sizes="80px"
						className="relative z-10 h-20 w-auto p-2"
					/>
				</div>
			) : null}
			<div className={cn("-mt-3 relative z-10", { "mt-0": isWeaponBuildDto(props.item) })}>
				<div
					className={cn(
						"px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200",
						{
							"text-red-600 dark:text-red-300": rarity === "Ultra",
							"text-orange-600 dark:text-orange-300": rarity === "Legendary",
							"text-purple-600 dark:text-purple-300": rarity === "Epic",
							"text-blue-600 dark:text-blue-300": rarity === "Rare",
						},
						{
							"text-green-600 dark:text-green-300": type === "Time-Based",
							"text-blue-600 dark:text-blue-300": type === "Round-Based",
							"text-orange-600 dark:text-orange-300": type === "Immediate",
							"text-purple-600 dark:text-purple-300": type === "Player-Activated",
						},
					)}
				>
					{isWeaponBuildDto(props.item) ? `${title} Weapon Build` : title}
				</div>
			</div>
			{description ? (
				<div className="mt-6 pb-8">
					<div
						className={cn(
							"text-center text-orange-800 text-sm dark:text-orange-200",
							{
								"text-red-600 dark:text-red-300": rarity === "Ultra",
								"text-orange-600 dark:text-orange-300": rarity === "Legendary",
								"text-purple-600 dark:text-purple-300": rarity === "Epic",
								"text-blue-600 dark:text-blue-300": rarity === "Rare",
							},
							{
								"text-green-600 dark:text-green-300": type === "Time-Based",
								"text-blue-600 dark:text-blue-300": type === "Round-Based",
								"text-orange-600 dark:text-orange-300": type === "Immediate",
								"text-purple-600 dark:text-purple-300": type === "Player-Activated",
							},
						)}
					>
						{description}
					</div>
				</div>
			) : null}
			{isWeaponBuildDto(props.item) ? (
				<div className="mx-auto mt-2 grid grid-cols-1 place-content-center gap-2 text-orange-800 text-sm dark:text-orange-200">
					{props.item.attachments.map((attachment, index) => (
						<span key={`${attachment}_${index + 1}`}>{attachment}</span>
					))}
				</div>
			) : null}
		</div>
	)
}
