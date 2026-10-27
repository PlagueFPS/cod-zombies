import { cn } from "cn"
import { Predicate, Array as Arr } from "effect"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

	return (
		<Card className="mx-auto w-[19.5rem] max-w-full bg-transparent shadow-lg sm:w-[23.5rem] dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Statue Solver</CardTitle>
				<CardDescription>
					Pick the wall, then click each statue until its facing matches the game. Front points at
					Barbarossa.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Tabs
					value={wallId}
					onValueChange={value => {
						if (!isWallId(value)) {
							return
						}

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

				<div className="flex justify-center gap-2" role="group" aria-label="Statues">
					{Arr.map(visibleDirections, (direction, index) => {
						const label = STATUE_LABELS[index]
						const name = DIRECTION_NAMES[direction]

						return (
							<button
								key={label}
								type="button"
								onClick={() => cycleStatue(index)}
								aria-label={`Statue ${label}, facing ${name}`}
								className={cn(
									"flex h-20 w-[calc((100%-1.5rem)/4)] max-w-16 flex-col items-center justify-center rounded-lg border border-border bg-background text-sm sm:max-w-20",
									direction === TARGET_DIRECTION && "border-primary bg-primary/10",
								)}
							>
								<span className="text-2xl leading-none">{DIRECTION_SYMBOLS[direction]}</span>
								<span className="font-medium">{label}</span>
								<span className="text-xs text-muted-foreground capitalize">{name}</span>
							</button>
						)
					})}
				</div>

				<div className="flex justify-center">
					<Button
						type="button"
						variant="destructive"
						size="lg"
						onClick={reset}
						disabled={!hasInput && facingFront}
					>
						Reset
					</Button>
				</div>

				<div className="rounded-sm bg-input p-2 dark:bg-input/20" aria-live="polite">
					<p className="text-center text-base font-medium">Solution</p>
					{Predicate.isNull(result) ? (
						<p className="mt-1 text-center text-sm text-muted-foreground">
							Set the statues to their in-game facings.
						</p>
					) : Predicate.isNotNull(summary) ? (
						<p className="mt-1 text-center text-sm">{summary}</p>
					) : result.status === "solved" ? (
						<ul className="mt-1 list-none pl-0">
							{Arr.map(result.turns, turn => (
								<li key={turn.statue} className="text-center text-sm">
									Turn statue {turn.statue} {turn.times}×
								</li>
							))}
						</ul>
					) : null}
				</div>
			</CardContent>
		</Card>
	)
}
