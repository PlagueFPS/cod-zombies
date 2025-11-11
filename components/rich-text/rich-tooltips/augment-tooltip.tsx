"use client"
import type { Augment, AugmentKey } from "@/data/augments"
import type { GameKey } from "@/data/games"
import { TypeBadge } from "@/components/custom-badges/custom-badges"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAugmentByKey } from "@/data/augments"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface AugmentTooltipPropsWithKey {
	augmentKey: AugmentKey
	augment?: never
}

interface AugmentTooltipPropsWithAugment {
	augmentKey?: never
	augment: Augment
}

type AugmentTooltipProps = (AugmentTooltipPropsWithKey | AugmentTooltipPropsWithAugment) & {
	game?: GameKey
}

export default function AugmentTooltip(props: AugmentTooltipProps) {
	const isMobile = useIsMobile(640)
	const augment = props.augmentKey ? getAugmentByKey(props.augmentKey, props.game) : props.augment

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger className="group relative cursor-default">
					<AugmentTrigger augment={augment} />
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className={cn(
						"w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200",
						{
							"border-major-augment/50 dark:border-major-augment/50": augment.type === "Major",
							"border-primary/50 dark:border-primary/50": augment.type === "Minor",
						},
					)}
				>
					<AugmentTooltipContent augment={augment} />
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative cursor-default">
				<AugmentTrigger augment={augment} />
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn(
					"w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200",
					{
						"border-major-augment/50 dark:border-major-augment/50": augment.type === "Major",
						"border-primary/50 dark:border-primary/50": augment.type === "Minor",
					},
				)}
			>
				<AugmentTooltipContent augment={augment} />
			</PopoverContent>
		</Popover>
	)
}

const AugmentTrigger = ({ augment }: { augment: Augment }) => (
	<span className="inline-flex items-baseline justify-center gap-0.5">
		<IconImage
			featuredImage={augment.image}
			alt={`${augment.title} Image`}
			width={24}
			height={24}
			sizes="64px"
			className="my-auto h-6 w-auto"
		/>
		<span
			className={cn(
				"text-center underline decoration-dotted underline-offset-4 group-hover:no-underline",
				{
					"text-major-augment decoration-major-augment dark:text-major-augment dark:decoration-major-augment":
						augment.type === "Major",
					"text-orange-700 decoration-orange-700 dark:text-orange-300 dark:decoration-orange-300":
						augment.type === "Minor",
				},
			)}
		>
			{augment.title}
		</span>
	</span>
)

const AugmentTooltipContent = ({ augment }: { augment: Augment }) => {
	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
				<IconImage
					featuredImage={augment.image}
					alt={`${augment.title} Image`}
					width={80}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<TypeBadge type={augment.type} className="absolute top-4 left-4" />
			<div className="-mt-3 relative z-10">
				<div
					className={cn("px-4 text-center font-bold text-lg", {
						"text-major-augment": augment.type === "Major",
						"text-orange-700 dark:text-orange-300": augment.type === "Minor",
					})}
				>
					{augment.title}
				</div>
				<div className="mt-6 pb-8">
					<div
						className={cn("text-center text-sm", {
							"text-sky-800 dark:text-sky-200": augment.type === "Major",
							"text-orange-800 dark:text-orange-200": augment.type === "Minor",
						})}
					>
						{augment.description}
					</div>
				</div>
			</div>
		</div>
	)
}
