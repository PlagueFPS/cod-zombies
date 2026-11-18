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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	cycleFacing,
	DIRECTION_NAMES,
	DIRECTION_SYMBOLS,
	solveStatueWall,
	STATUE_LABELS,
	TARGET_DIRECTION,
	WALL_IDS,
	WALL_OFFSETS,
	type StatueDirection,
	type StatueSolveResult,
	type WallId,
} from "@/utils/shadowed-throne-statue"

const INITIAL_DIRECTIONS: StatueDirection[] = [2, 2, 2, 2]

function isWallId(value: unknown): value is WallId {
	return Arr.some(WALL_IDS, id => id === value)
}

function solutionCopy(result: StatueSolveResult) {
	if (result.status === "invalid") {
		return `Check statue ${result.statue}. That facing cannot reach the center on this wall.`
	}

	if (result.status === "unsolved") {
		return "These facings do not solve. Check the wall and each statue."
	}

	if (result.turns.length === 0) {
		return "Already solved. Every statue faces the center."
	}

	return null
}

export default function ShadowedThroneStatueSolver() {
	const [wallId, setWallId] = useState<WallId>(1)
	const [directions, setDirections] = useState<StatueDirection[]>(INITIAL_DIRECTIONS)
	const [hasInput, setHasInput] = useState(false)

	const statueCount = WALL_OFFSETS[wallId].length
	const visibleDirections = directions.slice(0, statueCount)
	const result = hasInput ? solveStatueWall(visibleDirections, wallId) : null
	const summary = Predicate.isNull(result) ? null : solutionCopy(result)
	const facingFront = Arr.every(visibleDirections, direction => direction === TARGET_DIRECTION)

	const selectWall = (nextWall: WallId) => {
		setWallId(nextWall)
		setHasInput(true)
	}

	const cycleStatue = (index: number) => {
		setDirections(current =>
			Arr.map(current, (direction, statueIndex) =>
				statueIndex === index ? cycleFacing(direction) : direction,
			),
		)
		setHasInput(true)
	}

	const reset = () => {
		setDirections(INITIAL_DIRECTIONS)
		setHasInput(false)
	}

	const isSolvedTurns = result?.status === "solved" && result.turns.length > 0
	const isAlreadySolved = result?.status === "solved" && result.turns.length === 0
	const isWarning = result?.status === "invalid" || result?.status === "unsolved"

	const copyText = isSolvedTurns
		? Arr.join(
				Arr.map(result.turns, turn => `${turn.statue} ${turn.times}x`),
				", ",
			)
		: ""

	return (
		<SolverCard className="max-w-md">
			<SolverHeader
				title="Statue Solver"
				description="Pick the wall, then click each statue until its facing matches the game. Front points at Barbarossa."
			/>
			<CardContent className="space-y-4 px-5">
				<Tabs
					value={wallId}
					onValueChange={value => {
						if (!isWallId(value)) return
						selectWall(value)
					}}
					className="w-full"
				>
					<TabsList aria-label="Wall" className="grid w-full grid-cols-4">
						{Arr.map(WALL_IDS, id => (
							<TabsTrigger key={id} value={id}>
								Wall {id}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				<div className="grid grid-cols-4 gap-2" role="group" aria-label="Statues">
					{Arr.map(visibleDirections, (direction, index) => {
						const label = STATUE_LABELS[index]
						const name = DIRECTION_NAMES[direction]
						const isFront = direction === TARGET_DIRECTION

						return (
							<button
								key={label}
								type="button"
								onClick={() => cycleStatue(index)}
								aria-label={`Statue ${label}, facing ${name}`}
								className={cn(
									"flex h-22 flex-col items-center justify-center gap-0.5 rounded-xl border border-border/80 bg-background/60 text-sm transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
									statueCount === 3 && index === 0 && "col-start-1",
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
									{DIRECTION_SYMBOLS[direction]}
								</span>
								<span className="text-xs font-semibold text-foreground">{label}</span>
								<span
									className={cn(
										"text-[11px] capitalize",
										isFront ? "font-medium text-primary" : "text-muted-foreground",
									)}
								>
									{name}
								</span>
							</button>
						)
					})}
				</div>

				<SolverResult
					tone={isSolvedTurns || isAlreadySolved ? "solved" : isWarning ? "warning" : "idle"}
					label="Solution"
					action={
						hasInput || !facingFront ? (
							<div className="flex items-center gap-1">
								{copyText ? <CopyCodeButton value={copyText} label="Copy turn order" /> : null}
								<SolverResetButton onClick={reset} className="h-6 px-2 text-xs" />
							</div>
						) : null
					}
				>
					{Predicate.isNull(result) ? (
						<p className="text-center text-sm text-muted-foreground">
							Set the statues to their in-game facings.
						</p>
					) : isAlreadySolved ? (
						<div className="flex items-center justify-center gap-2 text-center text-sm text-foreground">
							<CheckCircle2Icon className="size-4 shrink-0 text-primary" />
							<span>{summary}</span>
						</div>
					) : Predicate.isNotNull(summary) ? (
						<p className="text-center text-sm text-amber-800 dark:text-amber-200">{summary}</p>
					) : result.status === "solved" ? (
						<ol className="list-none space-y-1.5 pl-0">
							{Arr.map(result.turns, (turn, stepIndex) => (
								<li
									key={turn.statue}
									className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-1.5 text-sm dark:bg-background/40"
								>
									<span className="flex items-center gap-2 font-medium text-foreground">
										<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary tabular-nums">
											{stepIndex + 1}
										</span>
										<span>Turn statue {turn.statue}</span>
									</span>
									<span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary tabular-nums">
										{turn.times}×
									</span>
								</li>
							))}
						</ol>
					) : null}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}
