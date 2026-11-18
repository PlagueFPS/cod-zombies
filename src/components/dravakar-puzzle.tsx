import { cn } from "cn"
import { Array as Arr, Option, Predicate } from "effect"
import { CheckIcon } from "lucide-react"
import { useState } from "react"
import {
	CopyCodeButton,
	SolverCard,
	SolverHeader,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import {
	DRAVAKAR_PUZZLE_QUOTES,
	formatDravakarSwitchSolution,
	type DravakarPuzzleQuoteId,
} from "@/data/dravakar-puzzle"

export default function DravakarPuzzle() {
	const [selectedId, setSelectedId] = useState<DravakarPuzzleQuoteId | null>(null)

	const selectedQuote = Option.getOrUndefined(
		Arr.findFirst(DRAVAKAR_PUZZLE_QUOTES, quote => quote.id === selectedId),
	)

	const solution =
		Predicate.isNotNullish(selectedQuote) && Predicate.isTruthy(selectedQuote)
			? formatDravakarSwitchSolution(selectedQuote.presses)
			: null

	const hasSolution = Predicate.isNotNullish(solution) && Predicate.isTruthy(solution)

	return (
		<SolverCard className="max-w-2xl">
			<SolverHeader
				title="Dravakar Phrase Solver"
				description="Select the phrase you heard to reveal how many times to interact with each switch."
			/>
			<CardContent className="space-y-4 px-5">
				<div className="grid gap-2" role="group" aria-label="Phrases you can hear">
					{Arr.map(DRAVAKAR_PUZZLE_QUOTES, quote => {
						const isSelected = selectedId === quote.id

						return (
							<Toggle
								key={quote.id}
								variant="outline"
								pressed={isSelected}
								onPressedChange={pressed => setSelectedId(pressed ? quote.id : null)}
								className={cn(
									"h-auto w-full items-center justify-between gap-3 rounded-xl border-border/80 bg-background/60 px-3.5 py-3 text-left text-sm leading-snug font-normal whitespace-normal active:scale-[0.99]",
									"hover:border-foreground/25 hover:bg-muted/60",
									isSelected &&
										"border-primary/70 bg-primary/12 text-foreground shadow-xs ring-1 ring-primary/30 hover:bg-primary/15 aria-pressed:border-primary/70 aria-pressed:bg-primary/12 data-[state=on]:bg-primary/12",
								)}
							>
								<span className="flex-1 text-pretty">“{quote.quote}”</span>
								<span
									aria-hidden="true"
									className={cn(
										"flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
										isSelected
											? "border-primary bg-primary text-primary-foreground"
											: "border-border/80 bg-transparent",
									)}
								>
									{isSelected ? <CheckIcon className="size-3" /> : null}
								</span>
							</Toggle>
						)
					})}
				</div>

				{hasSolution ? (
					<SolverResult
						tone="solved"
						label="Switch Interactions"
						action={<CopyCodeButton value={solution} label="Copy switch order" />}
					>
						<p className="text-center text-base font-medium text-foreground tabular-nums">
							<span className="text-muted-foreground">Solution:</span>{" "}
							<span className="font-semibold">{solution}</span>
						</p>
					</SolverResult>
				) : (
					<SolverResult tone="idle">
						<p className="text-center text-sm text-muted-foreground">
							Choose a phrase above to see how many times to flip each switch.
						</p>
					</SolverResult>
				)}
			</CardContent>
		</SolverCard>
	)
}
