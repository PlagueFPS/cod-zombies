"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { SCROLL_COUNT, SCROLL_POSITIONS, solveScrollPuzzle } from "@/utils/scroll-puzzle"

const INITIAL_STATE = Array.from({ length: SCROLL_COUNT }, () => false)

export default function KowakujoPuzzleSolver() {
	const [scrolls, setScrolls] = useState(INITIAL_STATE)

	const solution = solveScrollPuzzle(scrolls)
	const hasAnyScrollIn = scrolls.some(Boolean)
	const isSolved = scrolls.every(Boolean)

	const toggleScroll = (index: number, pressed: boolean) => {
		setScrolls(current =>
			current.map((isIn, scrollIndex) => (scrollIndex === index ? pressed : isIn)),
		)
	}

	const resetScrolls = () => {
		setScrolls(INITIAL_STATE)
	}

	return (
		<Card className="mx-auto w-fit max-w-full bg-transparent shadow-lg dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Scroll Puzzle Solver</CardTitle>
				<CardDescription>Select which scrolls are pushed in</CardDescription>
			</CardHeader>
			<CardContent className="w-fit">
				<div className="flex items-start gap-4 sm:gap-6">
					<div className="space-y-3">
						<div className="grid w-fit grid-cols-3 gap-2">
							{scrolls.map((isIn, index) => (
								<Toggle
									key={SCROLL_POSITIONS[index]}
									variant="outline"
									pressed={isIn}
									onPressedChange={pressed => toggleScroll(index, pressed)}
									aria-label={`${SCROLL_POSITIONS[index]} scroll ${isIn ? "in" : "out"}`}
									className={cn(
										"h-16 w-[6.25rem] flex-col gap-0.5 px-1.5 py-2 text-center text-xs leading-tight sm:w-[6.875rem] sm:text-sm",
										isIn &&
											"border-primary bg-primary/10 aria-pressed:border-primary aria-pressed:bg-primary/10 data-[state=on]:bg-primary/10",
									)}
								>
									<span className="font-medium text-primary">{isIn ? "In" : "Out"}</span>
									<span className="whitespace-nowrap text-muted-foreground">
										{SCROLL_POSITIONS[index]}
									</span>
								</Toggle>
							))}
						</div>

						<div className="flex justify-center">
							<Button
								type="button"
								variant="destructive"
								size="lg"
								className="w-fit"
								onClick={resetScrolls}
								disabled={!hasAnyScrollIn}
							>
								Reset
							</Button>
						</div>
					</div>

					<div className="min-w-[9rem] rounded-sm bg-input p-2 sm:min-w-[10rem] dark:bg-input/20">
						<p className="text-center text-base font-medium">Solution</p>
						{hasAnyScrollIn ? (
							isSolved ? (
								<p className="mt-1 text-sm">
									All scrolls are already pushed in. No presses needed.
								</p>
							) : solution !== null ? (
								<ul className="mt-1 list-none pl-0">
									{solution.map(index => (
										<li key={index} className="text-center">
											{SCROLL_POSITIONS[index]}
										</li>
									))}
								</ul>
							) : null
						) : null}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
