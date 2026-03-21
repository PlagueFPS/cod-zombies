"use client"
import type { GameKey } from "@/data/games"

import { Array as Arr, Option, Predicate, Result } from "effect"

import AugmentTooltip from "@/components/client/augment-tooltip"
import IconImage from "@/components/client/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { type AmmoMod, type AmmoModKey, getAmmoModByKey } from "@/data/ammo-mods"
import { type Augment, getAugmentByKey } from "@/data/augments"
import { useIsMobile } from "@/hooks/use-mobile"

interface AmmoModTooltipProps {
	ammoModKey: AmmoModKey
	game?: GameKey
}

export default function AmmoModTooltip({ ammoModKey, game }: AmmoModTooltipProps) {
	const isMobile = useIsMobile(640)
	const ammoMod = getAmmoModByKey(ammoModKey, game)
	if (Option.isNone(ammoMod)) {
		console.error(`Unable to render tooltip for ammo mod: ${ammoModKey}`)
		return "[MISSING_AMMO_MOD]"
	}

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative cursor-default">
					<AmmoModTrigger ammoMod={ammoMod.value} />
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-sm">
					<AmmoModTooltipContent ammoMod={ammoMod.value} game={game} />
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative cursor-default items-baseline justify-center align-baseline">
				<AmmoModTrigger ammoMod={ammoMod.value} />
			</PopoverTrigger>
			<PopoverContent side="top" className="w-sm border-2">
				<AmmoModTooltipContent ammoMod={ammoMod.value} game={game} />
			</PopoverContent>
		</Popover>
	)
}

const AmmoModTrigger = ({ ammoMod }: { ammoMod: AmmoMod }) => (
	<span className="inline-flex items-baseline justify-center gap-0.5">
		<IconImage
			featuredImage={ammoMod.image}
			alt={`${ammoMod.title} Image`}
			width={24}
			height={24}
			sizes="64px"
			className="my-auto h-6 w-auto"
		/>
		<span className="text-center text-tooltip-foreground underline decoration-tooltip-foreground decoration-dotted underline-offset-4 group-hover:no-underline">
			{ammoMod.title}
		</span>
	</span>
)

const AmmoModTooltipContent = ({ ammoMod, game }: { ammoMod: AmmoMod; game?: GameKey }) => {
	const ammoModAugments: Augment[] = Option.match(ammoMod.augments, {
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
					featuredImage={ammoMod.image}
					alt={`${ammoMod.title} Image`}
					width={80}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="relative z-10 -mt-3">
				<div className="px-4 text-center text-lg font-bold text-foreground">{ammoMod.title}</div>
				<div className="mt-2 pb-4">
					<p className="text-center text-sm text-foreground">{ammoMod.description}</p>
				</div>
				{Arr.isArrayNonEmpty(ammoModAugments) ? (
					<>
						<Separator />
						<div className="my-4 flex flex-col items-center justify-center">
							<div className="flex w-full flex-col gap-3">
								<h4 className="text-start text-sm font-semibold text-major-augment">
									MAJOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{Arr.filterMap(ammoModAugments, augment =>
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
									{Arr.filterMap(ammoModAugments, augment =>
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
