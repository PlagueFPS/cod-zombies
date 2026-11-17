import { cn } from "cn"
import { Array as Arr, Option } from "effect"
import { CheckCircle2Icon } from "lucide-react"
import { useState } from "react"
import {
	CopyCodeButton,
	SolverCard,
	SolverHeader,
	SolverResetButton,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
import {
	DIRECTION_NAMES,
	DIRECTION_SYMBOLS,
	INITIAL_PILLARS,
	PILLAR_IDS,
	PILLAR_LABELS,
	rotatePillar,
	solvePillars,
	type PillarState,
	type PillarDirection,
} from "@/utils/frozen-dawn-pillar"

export default function FrozenDawnPillarSolver() {
	const [directions, setDirections] = useState<PillarState>(INITIAL_PILLARS)
	const [hasInput, setHasInput] = useState(false)
	const solution = solvePillars(directions)

	const cyclePillar = (id: (typeof PILLAR_IDS)[number]) => {
		setDirections(current => {
			const next: [PillarDirection, PillarDirection, PillarDirection, PillarDirection] = [
				...current,
			]

			next[id] = rotatePillar(current[id] + 1)

			return next
		})
		setHasInput(true)
	}

	const isSolved = hasInput && Option.isSome(solution)

	const isAlreadySolved =
		isSolved && Option.isSome(solution) && Arr.every(solution.value, count => count === 0)

	const isUnsolvable = hasInput && Option.isNone(solution)

	const copyText =
		isSolved && !isAlreadySolved && Option.isSome(solution)
			? Arr.join(
					Arr.flatMap(PILLAR_IDS, id =>
						solution.value[id] > 0 ? [`${PILLAR_LABELS[id]} ${solution.value[id]}x`] : [],
					),
					", ",
				)
			: ""

	return (
		<SolverCard className="max-w-md">
			<SolverHeader
				title="Pillar Solver"
				description="Label the blocks A–D from left to right. Click each block to match its in-game facing (down = front, up = back)."
			/>
			<CardContent className="space-y-4 px-5">
				<div className="rounded-lg border border-border/60 bg-muted/35 px-3 py-2 text-center text-xs text-muted-foreground dark:bg-muted/20">
					Shooting a block turns it 180° and touching blocks 90°. Setting a facing here only changes
					that block.
				</div>

				<div className="grid grid-cols-4 gap-2" role="group" aria-label="Pillar blocks">
					{Arr.map(PILLAR_IDS, id => {
						const isFront = directions[id] === 0
						const facingName = DIRECTION_NAMES[directions[id]]

						return (
							<button
								key={id}
								type="button"
								onClick={() => cyclePillar(id)}
								aria-label={`Block ${PILLAR_LABELS[id]}, facing ${facingName}`}
								className={cn(
									"flex h-22 flex-col items-center justify-center gap-0.5 rounded-xl border border-border/80 bg-background/60 text-sm transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
									"hover:border-foreground/25 hover:bg-muted/60",
									isFront &&
										"border-primary/70 bg-primary/12 shadow-xs ring-1 ring-primary/30 hover:bg-primary/15",
								)}
							>
								<span
									className={cn(
										"text-2xl leading-none",
										isFront ? "text-primary" : "text-foreground",
									)}
								>
									{DIRECTION_SYMBOLS[directions[id]]}
								</span>
								<span className="text-xs font-semibold text-foreground">{PILLAR_LABELS[id]}</span>
								<span
									className={cn(
										"text-[11px] capitalize",
										isFront ? "font-medium text-primary" : "text-muted-foreground",
									)}
								>
									{facingName}
								</span>
							</button>
						)
					})}
				</div>

				<SolverResult
					tone={isSolved ? "solved" : isUnsolvable ? "warning" : "idle"}
					label="Solution"
					action={
						hasInput ? (
							<div className="flex items-center gap-1">
								{copyText ? <CopyCodeButton value={copyText} label="Copy shot counts" /> : null}
								<SolverResetButton
									onClick={() => {
										setDirections(INITIAL_PILLARS)
										setHasInput(false)
									}}
									className="h-6 px-2 text-xs"
								/>
							</div>
						) : null
					}
				>
					{!hasInput ? (
						<p className="text-center text-sm text-muted-foreground">
							Set the blocks to their in-game facings.
						</p>
					) : (
						Option.match(solution, {
							onNone: () => (
								<p className="text-center text-sm text-amber-800 dark:text-amber-200">
									Check each block’s facing.
								</p>
							),
							onSome: counts =>
								Arr.every(counts, count => count === 0) ? (
									<div className="flex items-center justify-center gap-2 text-center text-sm text-foreground">
										<CheckCircle2Icon className="size-4 shrink-0 text-primary" />
										<span>Already solved. Every block faces front.</span>
									</div>
								) : (
									<ul className="list-none space-y-1.5 pl-0">
										{Arr.map(PILLAR_IDS, id =>
											counts[id] > 0 ? (
												<li
													key={id}
													className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-1.5 text-sm dark:bg-background/40"
												>
													<span className="font-medium text-foreground">
														Shoot {PILLAR_LABELS[id]}
													</span>
													<span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary tabular-nums">
														{counts[id]}×
													</span>
												</li>
											) : null,
										)}
									</ul>
								),
						})
					)}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}
