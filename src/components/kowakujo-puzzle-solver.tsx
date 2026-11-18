import { cn } from "cn"
import { Predicate, Array as Arr } from "effect"
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
import { Toggle } from "@/components/ui/toggle"
import { SCROLL_COUNT, SCROLL_POSITIONS, solveScrollPuzzle } from "@/utils/scroll-puzzle"

const INITIAL_STATE = Array.from({ length: SCROLL_COUNT }, () => false)

export default function KowakujoPuzzleSolver() {
	const [scrolls, setScrolls] = useState(INITIAL_STATE)

	const solution = solveScrollPuzzle(scrolls)
	const hasAnyScrollIn = Arr.some(scrolls, Boolean)
	const isSolved = Arr.every(scrolls, Boolean)
	const isUnsolvable = hasAnyScrollIn && !isSolved && Predicate.isNull(solution)

	const toggleScroll = (index: number, pressed: boolean) => {
		setScrolls(current =>
			Arr.map(current, (isIn, scrollIndex) => (scrollIndex === index ? pressed : isIn)),
		)
	}

	const resetScrolls = () => {
		setScrolls(INITIAL_STATE)
	}

	const solutionCopyText =
		Predicate.isNotNull(solution) && solution.length > 0
			? Arr.join(
					Arr.flatMap(solution, index => {
						const position = SCROLL_POSITIONS[index]

						return position ? [position] : []
					}),
					", ",
				)
			: ""

	return (
		<SolverCard className="max-w-2xl">
			<SolverHeader
				title="Scroll Puzzle Solver"
				description="Select which scrolls are pushed in to find the fewest presses needed."
			/>
			<CardContent className="px-5">
				<div className="flex flex-col items-stretch gap-5 sm:flex-row">
					<div className="flex flex-col items-center gap-3">
						<div className="grid w-full grid-cols-3 gap-2 sm:w-fit">
							{Arr.map(scrolls, (isIn, index) => (
								<Toggle
									key={SCROLL_POSITIONS[index]}
									variant="outline"
									pressed={isIn}
									onPressedChange={pressed => toggleScroll(index, pressed)}
									aria-label={`${SCROLL_POSITIONS[index]} scroll ${isIn ? "in" : "out"}`}
									className={cn(
										"h-16 w-full flex-col gap-1 rounded-xl border-border/80 bg-background/60 px-2 py-2 text-center text-xs leading-tight sm:w-[6.75rem]",
										"hover:border-foreground/25 hover:bg-muted/60",
										isIn &&
											"border-primary/70 bg-primary/12 text-foreground shadow-xs ring-1 ring-primary/30 hover:bg-primary/15 aria-pressed:border-primary/70 aria-pressed:bg-primary/12 data-[state=on]:bg-primary/12",
									)}
								>
									<span
										className={cn(
											"inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase",
											isIn ? "text-primary" : "text-muted-foreground",
										)}
									>
										<span
											className={cn(
												"size-1.5 rounded-full transition-colors duration-150",
												isIn ? "bg-primary" : "bg-muted-foreground/40",
											)}
										/>
										{isIn ? "In" : "Out"}
									</span>
									<span className="text-xs font-medium whitespace-nowrap text-foreground/90">
										{SCROLL_POSITIONS[index]}
									</span>
								</Toggle>
							))}
						</div>

						<SolverResetButton onClick={resetScrolls} disabled={!hasAnyScrollIn} />
					</div>

					<SolverResult
						tone={
							isSolved
								? "solved"
								: isUnsolvable
									? "warning"
									: Predicate.isNotNull(solution) && hasAnyScrollIn
										? "solved"
										: "idle"
						}
						label="Solution"
						action={
							solutionCopyText ? (
								<CopyCodeButton value={solutionCopyText} label="Copy scroll order" />
							) : null
						}
						className="flex flex-1 flex-col justify-between sm:min-w-[13rem]"
					>
						{!hasAnyScrollIn ? (
							<div className="my-auto py-3 text-center text-sm text-muted-foreground">
								Toggle the scrolls currently pushed in.
							</div>
						) : isSolved ? (
							<div className="my-auto flex flex-col items-center gap-1.5 py-2 text-center text-sm text-foreground">
								<CheckCircle2Icon className="size-5 text-primary" />
								<span>All scrolls are already pushed in. No presses needed.</span>
							</div>
						) : Predicate.isNotNull(solution) ? (
							<ol className="my-auto list-none space-y-1.5 pl-0">
								{Arr.map(solution, (scrollIndex, stepIndex) => (
									<li
										key={scrollIndex}
										className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/70 px-3 py-1.5 text-sm font-medium text-foreground dark:bg-background/40"
									>
										<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary tabular-nums">
											{stepIndex + 1}
										</span>
										<span>{SCROLL_POSITIONS[scrollIndex]}</span>
									</li>
								))}
							</ol>
						) : (
							<div className="my-auto py-2 text-center text-sm text-amber-800 dark:text-amber-200">
								This layout cannot be solved. Double-check which scrolls are pushed in.
							</div>
						)}
					</SolverResult>
				</div>
			</CardContent>
		</SolverCard>
	)
}
