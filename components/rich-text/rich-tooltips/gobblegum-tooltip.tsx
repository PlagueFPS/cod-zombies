"use client"
import { RarityBadge } from "@/components/custom-badges/custom-badges"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Gobblegum, type GobblegumKey, getGobblegumByKey } from "@/data/gobblegum"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export default function GobbleGumTooltip({ gobblegumKey }: { gobblegumKey: GobblegumKey }) {
	const isMobile = useIsMobile(640)
	const gobblegum = getGobblegumByKey(gobblegumKey)

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline"
					asChild
				>
					<span>
						<IconImage
							featuredImage={gobblegum.image}
							alt={`${gobblegum.title} Image`}
							width={64}
							height={24}
							sizes="64px"
							className="my-auto h-6 w-auto"
						/>
						<span
							className={cn(
								"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
								{
									"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
										gobblegum.type === "Time-Based",
									"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
										gobblegum.type === "Round-Based",
									"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
										gobblegum.type === "Immediate",
									"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
										gobblegum.type === "Player-Activated",
								},
								{
									"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
										gobblegum.rarity === "Ultra",
									"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
										gobblegum.rarity === "Legendary",
									"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
										gobblegum.rarity === "Epic",
									"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
										gobblegum.rarity === "Rare",
								},
							)}
						>
							{gobblegum.title}
						</span>
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className={cn(
						`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200 `,
						{
							"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
								gobblegum.type === "Time-Based",
							"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
								gobblegum.type === "Round-Based",
							"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
								gobblegum.type === "Immediate",
							"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
								gobblegum.type === "Player-Activated",
						},
						{
							"border-red-600/25 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
								gobblegum.rarity === "Ultra",
							"border-orange-600/25 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
								gobblegum.rarity === "Legendary",
							"border-purple-600/25 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
								gobblegum.rarity === "Epic",
							"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
								gobblegum.rarity === "Rare",
						},
					)}
				>
					{<GobbleGumTooltipContent gobblegum={gobblegum} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger
				className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
				asChild
			>
				<span>
					<IconImage
						featuredImage={gobblegum.image}
						alt={`${gobblegum.title} Image`}
						width={64}
						height={24}
						sizes="64px"
						className="my-auto h-6 w-auto"
					/>
					<span
						className={cn(
							"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
							{
								"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
									gobblegum.type === "Time-Based",
								"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
									gobblegum.type === "Round-Based",
								"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
									gobblegum.type === "Immediate",
								"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
									gobblegum.type === "Player-Activated",
							},
							{
								"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
									gobblegum.rarity === "Ultra",
								"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
									gobblegum.rarity === "Legendary",
								"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
									gobblegum.rarity === "Epic",
								"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
									gobblegum.rarity === "Rare",
							},
						)}
					>
						{gobblegum.title}
					</span>
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn(
					`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200 `,
					{
						"border-green-600/30 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
							gobblegum.type === "Time-Based",
						"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
							gobblegum.type === "Round-Based",
						"border-orange-600/30 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
							gobblegum.type === "Immediate",
						"border-purple-600/30 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
							gobblegum.type === "Player-Activated",
					},
					{
						"border-red-600/25 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
							gobblegum.rarity === "Ultra",
						"border-orange-600/25 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
							gobblegum.rarity === "Legendary",
						"border-purple-600/25 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
							gobblegum.rarity === "Epic",
						"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
							gobblegum.rarity === "Rare",
					},
				)}
			>
				{<GobbleGumTooltipContent gobblegum={gobblegum} />}
			</PopoverContent>
		</Popover>
	)
}

const GobbleGumTooltipContent = ({ gobblegum }: { gobblegum: Gobblegum }) => {
	return (
		<div
			className={cn("relative flex w-full flex-col rounded-md px-4 py-2", {
				"bg-gobblegum-time-based": gobblegum.type === "Time-Based",
				"bg-gobblegum-round-based": gobblegum.type === "Round-Based",
				"bg-gobblegum-immediate": gobblegum.type === "Immediate",
				"bg-gobblegum-player-activated": gobblegum.type === "Player-Activated",
				"bg-gobblegum-ultra": gobblegum.rarity === "Ultra",
				"bg-gobblegum-legendary": gobblegum.rarity === "Legendary",
				"bg-gobblegum-epic": gobblegum.rarity === "Epic",
				"bg-gobblegum-rare": gobblegum.rarity === "Rare",
			})}
		>
			<RarityBadge
				rarity={gobblegum.rarity}
				type={gobblegum.type}
				className="absolute top-4 left-4"
			>
				{gobblegum.rarity}
			</RarityBadge>
			<RarityBadge
				rarity={gobblegum.rarity}
				type={gobblegum.type}
				className="absolute top-4 right-4"
			>
				{gobblegum.type}
			</RarityBadge>
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
				<IconImage
					featuredImage={gobblegum.image}
					alt={`${gobblegum.title} Image`}
					width={64}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="-mt-3 relative z-10">
				<div
					className={cn(
						"px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200",
						{
							"text-green-600 dark:text-green-300": gobblegum.type === "Time-Based",
							"text-blue-600 dark:text-blue-300": gobblegum.type === "Round-Based",
							"text-orange-600 dark:text-orange-300": gobblegum.type === "Immediate",
							"text-purple-600 dark:text-purple-300": gobblegum.type === "Player-Activated",
						},
						{
							"text-red-600 dark:text-red-300": gobblegum.rarity === "Ultra",
							"text-orange-600 dark:text-orange-300": gobblegum.rarity === "Legendary",
							"text-purple-600 dark:text-purple-300": gobblegum.rarity === "Epic",
							"text-blue-600 dark:text-blue-300": gobblegum.rarity === "Rare",
						},
					)}
				>
					{gobblegum.title}
				</div>
				<div className="mt-6 pb-8">
					<div
						className={cn(
							"text-center text-orange-800 text-sm dark:text-orange-200",
							{
								"text-green-600 dark:text-green-300": gobblegum.type === "Time-Based",
								"text-blue-600 dark:text-blue-300": gobblegum.type === "Round-Based",
								"text-orange-600 dark:text-orange-300": gobblegum.type === "Immediate",
								"text-purple-600 dark:text-purple-300": gobblegum.type === "Player-Activated",
							},
							{
								"text-red-600 dark:text-red-300": gobblegum.rarity === "Ultra",
								"text-orange-600 dark:text-orange-300": gobblegum.rarity === "Legendary",
								"text-purple-600 dark:text-purple-300": gobblegum.rarity === "Epic",
								"text-blue-600 dark:text-blue-300": gobblegum.rarity === "Rare",
							},
						)}
					>
						{gobblegum.description}
					</div>
				</div>
			</div>
		</div>
	)
}
