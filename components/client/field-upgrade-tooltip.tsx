"use client"
import type { GameKey } from "@/data/games"

import { Array as Arr, Option, Predicate, Result } from "effect"

import AugmentTooltip from "@/components/client/augment-tooltip"
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

interface FieldUpgradeTooltipProps {
	fieldUpgradeKey: FieldUpgradeKey
	game?: GameKey
}

export default function FieldUpgradeTooltip({ fieldUpgradeKey, game }: FieldUpgradeTooltipProps) {
	const isMobile = useIsMobile(640)
	const fieldUpgrade = getFieldUpgradeByKey(fieldUpgradeKey, game)
	if (Option.isNone(fieldUpgrade)) {
		console.error(`Unable to render tooltip for field upgrade: ${fieldUpgradeKey}`)
		return "[MISSING_FIELD_UPGRADE]"
	}

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline">
					<IconImage
						featuredImage={fieldUpgrade.value.image}
						alt={`${fieldUpgrade.value.title} Image`}
						width={64}
						height={24}
						sizes="64px"
						className="my-auto h-6 w-auto"
					/>
					<span className="text-center text-tooltip-foreground underline decoration-tooltip-foreground decoration-dotted underline-offset-4 group-hover:no-underline">
						{fieldUpgrade.value.title}
					</span>
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-sm">
					{<FieldUpgradeTooltipContent fieldUpgrade={fieldUpgrade.value} game={game} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline">
				<IconImage
					featuredImage={fieldUpgrade.value.image}
					alt={`${fieldUpgrade.value.title} Image`}
					width={64}
					height={24}
					sizes="64px"
					className="my-auto h-6 w-auto"
				/>
				<span className="text-center text-tooltip-foreground underline decoration-tooltip-foreground decoration-dotted underline-offset-4 group-hover:no-underline">
					{fieldUpgrade.value.title}
				</span>
			</PopoverTrigger>
			<PopoverContent side="top" className="w-sm">
				{<FieldUpgradeTooltipContent fieldUpgrade={fieldUpgrade.value} game={game} />}
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
	const fieldUpgradeAugments = Option.match(fieldUpgrade.augments, {
		onNone: () => [],
		onSome: tuple =>
			Arr.filterMap(tuple, augmentKey =>
				Predicate.isNotUndefined(augmentKey)
					? Result.succeed(getAugmentByKey(augmentKey, game).valueOrUndefined)
					: Result.failVoid,
			).filter(Predicate.isNotUndefined),
	})

	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			<div className="relative flex items-center justify-center">
				<div className="bg-opacity-25 absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full" />
				<IconImage
					featuredImage={fieldUpgrade.image}
					alt={`${fieldUpgrade.title} Image`}
					width={64}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="relative z-10 -mt-3">
				<h3 className="px-4 text-center text-lg font-bold text-foreground">{fieldUpgrade.title}</h3>
				<div className="mt-2 pb-4">
					<p className="text-center text-sm text-foreground">{fieldUpgrade.description}</p>
				</div>
				{Arr.isArrayNonEmpty(fieldUpgradeAugments) ? (
					<>
						<Separator />
						<div className="my-4 flex flex-col items-center justify-center">
							<div className="flex flex-col gap-3">
								<h4 className="text-start text-sm font-semibold text-major-augment">
									MAJOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{Arr.filterMap(fieldUpgradeAugments, augment =>
										augment.type === "Major"
											? Result.succeed(
													<div key={augment.id} className="shrink-0">
														<AugmentTooltip augment={augment} />
													</div>,
												)
											: Result.failVoid,
									)}
								</div>
							</div>
							<Separator className="my-4" />
							<div className="flex w-full flex-col gap-3">
								<h4 className="text-start text-sm font-semibold tracking-wide text-tooltip-foreground">
									MINOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{Arr.filterMap(fieldUpgradeAugments, augment =>
										augment.type === "Minor"
											? Result.succeed(
													<div key={augment.id} className="shrink-0">
														<AugmentTooltip augment={augment} />
													</div>,
												)
											: Result.failVoid,
									)}
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	)
}
