"use client"
import { ElixirRarityBadge } from "@/components/custom-badges/custom-badges"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Elixir, type ElixirKey, type ElixirRarity, getElixirByKey } from "@/data/elixirs"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ElixirTooltipProps {
	elixirKey: ElixirKey
}

export default function ElixirTooltip({ elixirKey }: ElixirTooltipProps) {
	const isMobile = useIsMobile(640)
	const elixir = getElixirByKey(elixirKey)

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger className="group relative inline-flex cursor-default items-baseline justify-center align-baseline">
					<ElixirTrigger elixir={elixir} />
				</HoverCardTrigger>
				<HoverCardContent side="top" className={getRarityContentClasses(elixir.rarity)}>
					<ElixirTooltipContent elixir={elixir} />
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative inline-flex cursor-default items-baseline justify-center align-baseline">
				<ElixirTrigger elixir={elixir} />
			</PopoverTrigger>
			<PopoverContent side="top" className={getRarityContentClasses(elixir.rarity)}>
				<ElixirTooltipContent elixir={elixir} />
			</PopoverContent>
		</Popover>
	)
}

const ElixirTooltipContent = ({ elixir }: { elixir: Elixir }) => {
	return (
		<div
			className={cn("relative flex w-full flex-col rounded-md px-4 py-2", {
				"bg-gobblegum-time-based": elixir.rarity === "Classic",
				"bg-equipment": elixir.rarity === "Common",
				"bg-gobblegum-rare": elixir.rarity === "Rare",
				"bg-gobblegum-epic": elixir.rarity === "Legendary",
				"bg-gobblegum-legendary": elixir.rarity === "Epic",
			})}
		>
			<ElixirRarityBadge rarity={elixir.rarity} className="absolute top-4 left-4" />
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
				<IconImage
					featuredImage={elixir.image}
					alt={`${elixir.title} Image`}
					width={96}
					height={96}
					sizes="96px"
					className="relative z-10 h-24 w-auto p-2"
				/>
			</div>
			<div className="-mt-3 relative z-10">
				<div
					className={cn("px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200", {
						"text-green-600 dark:text-green-300": elixir.rarity === "Classic",
						"text-gray-600 dark:text-gray-300": elixir.rarity === "Common",
						"text-blue-600 dark:text-blue-300": elixir.rarity === "Rare",
						"text-purple-600 dark:text-purple-300": elixir.rarity === "Legendary",
						"text-orange-600 dark:text-orange-300": elixir.rarity === "Epic",
					})}
				>
					{elixir.title}
				</div>
				<div className="mt-6 pb-8">
					<div
						className={cn("text-center text-orange-800 text-sm dark:text-orange-200", {
							"text-green-600 dark:text-green-300": elixir.rarity === "Classic",
							"text-gray-600 dark:text-gray-300": elixir.rarity === "Common",
							"text-blue-600 dark:text-blue-300": elixir.rarity === "Rare",
							"text-purple-600 dark:text-purple-300": elixir.rarity === "Legendary",
							"text-orange-600 dark:text-orange-300": elixir.rarity === "Epic",
						})}
					>
						{elixir.description}
					</div>
				</div>
			</div>
		</div>
	)
}

const ElixirTrigger = ({ elixir }: { elixir: Elixir }) => (
	<span className="group relative inline-flex cursor-default items-baseline justify-center align-baseline">
		<IconImage
			featuredImage={elixir.image}
			alt={`${elixir.title} Image`}
			width={28}
			height={28}
			sizes="96px"
			className="my-auto h-7 w-auto"
		/>
		<span
			className={cn(
				"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
				getRarityTextClasses(elixir.rarity),
			)}
		>
			{elixir.title}
		</span>
	</span>
)

const getRarityTextClasses = (rarity: ElixirRarity) =>
	cn({
		"text-green-700 decoration-green-700 dark:text-green-300 dark:decoration-green-300":
			rarity === "Classic",
		"text-gray-700 decoration-gray-700 dark:text-gray-300 dark:decoration-gray-300":
			rarity === "Common",
		"text-blue-700 decoration-blue-700 dark:text-blue-300 dark:decoration-blue-300":
			rarity === "Rare",
		"text-purple-700 decoration-purple-700 dark:text-purple-300 dark:decoration-purple-300":
			rarity === "Legendary",
		"text-orange-700 decoration-orange-700 dark:text-orange-300 dark:decoration-orange-300":
			rarity === "Epic",
	})

const getRarityContentClasses = (rarity: ElixirRarity) =>
	cn(
		"w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200",
		{
			"border-green-600/25 shadow-green-600 dark:border-green-300/30 dark:shadow-green-300":
				rarity === "Classic",
			"border-gray-600/25 shadow-gray-600 dark:border-gray-300/30 dark:shadow-gray-300":
				rarity === "Common",
			"border-blue-600/30 shadow-blue-600 dark:border-blue-300/30 dark:shadow-blue-300":
				rarity === "Rare",
			"border-purple-600/25 shadow-purple-600 dark:border-purple-300/30 dark:shadow-purple-300":
				rarity === "Legendary",
			"border-orange-600/25 shadow-orange-600 dark:border-orange-300/30 dark:shadow-orange-300":
				rarity === "Epic",
		},
	)
