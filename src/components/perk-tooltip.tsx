"use client"
import type { GameKey } from "@/data/games"
import { Array as Arr, Option, Predicate, Result } from "effect"
import AugmentTooltip from "@/components/augment-tooltip"
import IconImage from "@/components/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { type Augment, getAugmentByKey } from "@/data/augments"
import { getPerkByKey, type Perk, type PerkKey } from "@/data/perks"
import { useIsMobile } from "@/hooks/use-mobile"

interface PerkTooltipProps {
	perkKey: PerkKey
	game?: GameKey
}

export default function PerkTooltip({ perkKey, game }: PerkTooltipProps) {
	const isMobile = useIsMobile(640)
	const perk = getPerkByKey(perkKey, game)
	if (Option.isNone(perk)) {
		console.error(`Unable to render tooltip for perk: ${perkKey}`)
		return "[MISSING_PERK]"
	}

	return !isMobile ? (
		<HoverCard>
			<HoverCardTrigger className="group relative cursor-default">
				<PerkTrigger perk={perk.value} />
			</HoverCardTrigger>
			<HoverCardContent side="top" className="w-sm">
				<PerkTooltipContent perk={perk.value} game={game} />
			</HoverCardContent>
		</HoverCard>
	) : (
		<Popover>
			<PopoverTrigger className="group relative cursor-default">
				<PerkTrigger perk={perk.value} />
			</PopoverTrigger>
			<PopoverContent side="top" className="w-sm">
				<PerkTooltipContent perk={perk.value} game={game} />
			</PopoverContent>
		</Popover>
	)
}

const PerkTrigger = ({ perk }: { perk: Perk }) => (
	<span className="inline-flex items-baseline justify-center gap-1">
		<IconImage
			featuredImage={perk.image}
			alt={`${perk.title} Image`}
			width={64}
			height={24}
			sizes="64px"
			className="my-auto h-6 w-auto"
		/>
		<span className="text-center text-tooltip-foreground underline decoration-tooltip-foreground decoration-dotted underline-offset-4 group-hover:no-underline">
			{perk.title}
		</span>
	</span>
)

const PerkTooltipContent = ({ perk, game }: { perk: Perk; game?: GameKey }) => {
	const perkAugments: Augment[] = Option.match(perk.augments, {
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
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full" />
				<IconImage
					featuredImage={perk.image}
					alt={`${perk.title} Image`}
					width={64}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="relative z-10 -mt-3">
				<div className="px-4 text-center text-lg font-bold text-foreground">{perk.title}</div>
				<div className="my-2">
					<div className="text-center text-sm text-foreground">{perk.description}</div>
				</div>
				{Option.isSome(perk.modifier) ? (
					<blockquote className="mt-6 rounded-lg border border-orange-200 bg-orange-100/20 p-4 shadow-lg dark:border-orange-800 dark:bg-orange-900/20">
						<div className="flex items-start text-orange-700 dark:text-orange-300">
							<p className="text-sm text-orange-800 dark:text-orange-200">
								<span className="mr-1 font-bold text-orange-800 dark:text-orange-400">
									MODIFIER:
								</span>
								{perk.modifier.value}
							</p>
						</div>
					</blockquote>
				) : Arr.isArrayNonEmpty(perkAugments) ? (
					<>
						<Separator />
						<div className="my-4 flex flex-col items-center justify-center">
							<div className="flex flex-col gap-3">
								<h4 className="text-start text-sm font-semibold tracking-wide text-major-augment">
									MAJOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{Arr.filterMap(perkAugments, augment =>
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
								<h4 className="text-start text-sm font-semibold tracking-wide text-orange-700 dark:text-orange-300">
									MINOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{Arr.filterMap(perkAugments, augment =>
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
