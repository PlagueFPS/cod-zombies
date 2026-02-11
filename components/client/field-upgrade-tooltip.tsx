"use client"
import type { GameKey } from "@/data/games"
import IconImage from "@/components/client/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { getAugmentByKey } from "@/data/augments"
import {
	type FieldUpgrade,
	type FieldUpgradeKey,
	getFieldUpgradeByKey,
} from "@/data/field-upgrades"
import { useIsMobile } from "@/hooks/use-mobile"
import AugmentTooltip from "./augment-tooltip"

interface FieldUpgradeTooltipProps {
	fieldUpgradeKey: FieldUpgradeKey
	game?: GameKey
}

export default function FieldUpgradeTooltip({ fieldUpgradeKey, game }: FieldUpgradeTooltipProps) {
	const isMobile = useIsMobile(640)
	const fieldUpgrade = getFieldUpgradeByKey(fieldUpgradeKey, game)

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline">
					<IconImage
						featuredImage={fieldUpgrade.image}
						alt={`${fieldUpgrade.title} Image`}
						width={64}
						height={24}
						sizes="64px"
						className="my-auto h-6 w-auto"
					/>
					<span className="text-center text-tooltip-foreground underline decoration-tooltip-foreground decoration-dotted underline-offset-4 group-hover:no-underline">
						{fieldUpgrade.title}
					</span>
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-sm">
					{<FieldUpgradeTooltipContent fieldUpgrade={fieldUpgrade} game={game} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline">
				<IconImage
					featuredImage={fieldUpgrade.image}
					alt={`${fieldUpgrade.title} Image`}
					width={64}
					height={24}
					sizes="64px"
					className="my-auto h-6 w-auto"
				/>
				<span className="text-center text-tooltip-foreground underline decoration-tooltip-foreground decoration-dotted underline-offset-4 group-hover:no-underline">
					{fieldUpgrade.title}
				</span>
			</PopoverTrigger>
			<PopoverContent side="top" className="w-sm">
				{<FieldUpgradeTooltipContent fieldUpgrade={fieldUpgrade} game={game} />}
			</PopoverContent>
		</Popover>
	)
}

const FieldUpgradeTooltipContent = ({
	fieldUpgrade,
	game,
}: {
	fieldUpgrade: FieldUpgrade
	game: GameKey | undefined
}) => {
	const fieldUpgradeAugments =
		fieldUpgrade.augments
			?.map(augment => (augment ? getAugmentByKey(augment, game) : null))
			?.filter(augment => augment !== null) || []

	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
				<IconImage
					featuredImage={fieldUpgrade.image}
					alt={`${fieldUpgrade.title} Image`}
					width={64}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="-mt-3 relative z-10">
				<h3 className="px-4 text-center font-bold text-foreground text-lg">{fieldUpgrade.title}</h3>
				<div className="mt-2 pb-4">
					<p className="text-center text-foreground text-sm">{fieldUpgrade.description}</p>
				</div>
				{fieldUpgradeAugments.length > 0 ? (
					<>
						<Separator />
						<div className="my-4 flex flex-col items-center justify-center">
							<div className="flex flex-col gap-3">
								<h4 className="text-start font-semibold text-major-augment text-sm">
									MAJOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{fieldUpgradeAugments
										.filter(augment => augment.type === "Major")
										.map(augment => (
											<div key={augment.id} className="shrink-0">
												<AugmentTooltip augment={augment} />
											</div>
										))}
								</div>
							</div>
							<Separator className="my-4" />
							<div className="flex w-full flex-col gap-3">
								<h4 className="text-start font-semibold text-sm text-tooltip-foreground tracking-wide">
									MINOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{fieldUpgradeAugments
										.filter(augment => augment.type === "Minor")
										.map(augment => (
											<div key={augment.id} className="shrink-0">
												<AugmentTooltip augment={augment} />
											</div>
										))}
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	)
}
