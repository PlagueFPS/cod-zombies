"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import {
	DRAVAKAR_PUZZLE_QUOTES,
	formatDravakarSwitchSolution,
	type DravakarPuzzleQuoteId,
} from "@/data/dravakar-puzzle"
import { cn } from "@/lib/utils"

export default function DravakarPuzzle() {
	const [selectedId, setSelectedId] = useState<DravakarPuzzleQuoteId | null>(null)
	const selectedQuote = DRAVAKAR_PUZZLE_QUOTES.find(quote => quote.id === selectedId)
	const solution = selectedQuote ? formatDravakarSwitchSolution(selectedQuote.presses) : null

	return (
		<Card className="mx-auto w-full max-w-2xl bg-transparent shadow-lg dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Dravakar Phrase Solver</CardTitle>
				<CardDescription>
					Select the phrase you heard to reveal how many times to interact with each switch
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-2" role="group" aria-label="Phrases you can hear">
					{DRAVAKAR_PUZZLE_QUOTES.map(quote => {
						const isSelected = selectedId === quote.id

						return (
							<Toggle
								key={quote.id}
								variant="outline"
								pressed={isSelected}
								onPressedChange={pressed => setSelectedId(pressed ? quote.id : null)}
								className={cn(
									"h-auto w-full items-start justify-start px-3 py-3 text-left text-sm leading-snug font-normal whitespace-normal",
									isSelected &&
										"border-primary bg-primary/10 aria-pressed:border-primary aria-pressed:bg-primary/10 data-[state=on]:bg-primary/10",
								)}
							>
								“{quote.quote}”
							</Toggle>
						)
					})}
				</div>

				{solution ? (
					<p className="rounded-sm bg-input p-2 text-center text-base dark:bg-input/20">
						<span className="font-medium">Solution:</span> {solution}
					</p>
				) : null}
			</CardContent>
		</Card>
	)
}
