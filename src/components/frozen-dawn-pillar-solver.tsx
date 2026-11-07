import { cn } from "cn"
import { Array as Arr, Option } from "effect"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

	return (
		<Card className="mx-auto w-[19.5rem] max-w-full bg-transparent shadow-lg sm:w-[23.5rem] dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Pillar Solver</CardTitle>
				<CardDescription>
					Label the blocks A–D from left to right. Click each block to match its in-game facing.
					Down means front; up means back.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					Shooting a block turns it 180° and each touching block 90°. Setting a facing here only
					changes that block.
				</p>
				<div className="flex justify-center gap-2" role="group" aria-label="Pillar blocks">
					{Arr.map(PILLAR_IDS, id => (
						<button
							key={id}
							type="button"
							onClick={() => cyclePillar(id)}
							aria-label={`Block ${PILLAR_LABELS[id]}, facing ${DIRECTION_NAMES[directions[id]]}`}
							className={cn(
								"flex h-20 flex-1 flex-col items-center justify-center rounded-lg border border-border bg-background text-sm",
								directions[id] === 0 && "border-primary bg-primary/10",
							)}
						>
							<span className="text-2xl leading-none">{DIRECTION_SYMBOLS[directions[id]]}</span>
							<span className="font-medium">{PILLAR_LABELS[id]}</span>
							<span className="text-xs text-muted-foreground capitalize">
								{DIRECTION_NAMES[directions[id]]}
							</span>
						</button>
					))}
				</div>
				<div className="flex justify-center">
					<Button
						type="button"
						variant="destructive"
						size="lg"
						disabled={!hasInput}
						onClick={() => {
							setDirections(INITIAL_PILLARS)
							setHasInput(false)
						}}
					>
						Reset
					</Button>
				</div>
				<div className="rounded-sm bg-input p-2 text-center dark:bg-input/20" aria-live="polite">
					<p className="text-base font-medium">Solution</p>
					{!hasInput ? (
						<p className="mt-1 text-sm text-muted-foreground">
							Set the blocks to their in-game facings.
						</p>
					) : (
						Option.match(solution, {
							onNone: () => <p className="mt-1 text-sm">Check each block’s facing.</p>,
							onSome: counts =>
								Arr.every(counts, count => count === 0) ? (
									<p className="mt-1 text-sm">Already solved. Every block faces front.</p>
								) : (
									<ul className="mt-1 list-none pl-0">
										{Arr.map(PILLAR_IDS, id =>
											counts[id] > 0 ? (
												<li key={id} className="text-sm">
													Shoot {PILLAR_LABELS[id]} {counts[id]}×
												</li>
											) : null,
										)}
									</ul>
								),
						})
					)}
				</div>
			</CardContent>
		</Card>
	)
}
