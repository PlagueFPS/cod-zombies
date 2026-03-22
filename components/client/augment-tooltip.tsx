"use client"
import type { Augment, AugmentKey } from "@/data/augments"
import type { GameKey } from "@/data/games"
import { Option } from "effect"
import IconImage from "@/components/client/icon-image"
import { TypeBadge } from "@/components/server/custom-badges"
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
	const augment = props.augmentKey
		? getAugmentByKey(props.augmentKey, props.game)
		: Option.some(props.augment)

	if (Option.isNone(augment)) {
		console.error(`Unable to render tooltip for augment: ${props.augmentKey ?? props.augment.id}`)
		return "[MISSING_AUGMENT]"
	}

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative cursor-default">
					<AugmentTrigger augment={augment.value} />
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-sm p-0">
					<AugmentTooltipContent augment={augment.value} />
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative cursor-default">
				<AugmentTrigger augment={augment.value} />
			</PopoverTrigger>
			<PopoverContent side="top" className="w-sm p-0">
				<AugmentTooltipContent augment={augment.value} />
			</PopoverContent>
		</Popover>
	)
}

const AugmentTrigger = ({ augment }: { augment: Augment }) => (
	<span className="inline-flex items-baseline justify-center gap-0.5">
		<IconImage
			featuredImage={augment.image}
			alt={`${augment.title} Image`}
			width={64}
			height={24}
			sizes="64px"
			className="my-auto h-6 w-auto"
		/>
		<span
			className={cn(
				"text-center underline decoration-dotted underline-offset-4 group-hover:no-underline",
				{
					"text-major-augment decoration-major-augment": augment.type === "Major",
					"text-tooltip-foreground decoration-tooltip-foreground": augment.type === "Minor",
				},
			)}
		>
			{augment.title}
		</span>
	</span>
)

const AugmentTooltipContent = ({ augment }: { augment: Augment }) => {
	return (
		<div
			className={cn("relative flex w-full flex-col rounded-lg p-2", {
				"bg-major-augment-radial": augment.type === "Major",
				"bg-minor-augment-radial": augment.type === "Minor",
			})}
		>
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full" />
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
			<div className="relative z-10 -mt-3">
				<div
					className={cn("px-4 text-center text-lg font-bold", {
						"text-major-augment": augment.type === "Major",
						"text-tooltip-foreground": augment.type === "Minor",
					})}
				>
					{augment.title}
				</div>
				<div className="mt-6 pb-8">
					<div
						className={cn("text-center text-sm", {
							"text-major-augment-foreground": augment.type === "Major",
							"text-tooltip-foreground": augment.type === "Minor",
						})}
					>
						{augment.description}
					</div>
				</div>
			</div>
		</div>
	)
}
