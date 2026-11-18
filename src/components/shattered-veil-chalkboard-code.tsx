import { cn } from "cn"
import { Array as Arr } from "effect"
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
import {
	type ChalkboardLetters,
	type Code,
	chalkboardCodes,
	codeWords,
} from "@/data/shattered-veil-codes"

const getAllCodes = (): Code[] => [...codeWords]

export default function ShatteredVeilCode() {
	const [letterGroup, setLetterGroup] = useState<ChalkboardLetters>()
	const [codeWord, setCodeWord] = useState<Code>()
	const allLetterGroups: ChalkboardLetters[] = ["E", "BCDEF", "OSTUHJLD", "AIOUY"]
	const allCodeWords = getAllCodes()

	const code = letterGroup && codeWord ? String(chalkboardCodes[letterGroup][codeWord]) : null
	const hasSelection = Boolean(letterGroup || codeWord)

	return (
		<SolverCard className="max-w-lg">
			<SolverHeader
				title="Keypad Code Generator"
				description="Select your code word and top-left chalkboard letter group."
			/>
			<CardContent className="space-y-5 px-5">
				<div className="space-y-2">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Code Words
					</h3>
					<div className="grid grid-cols-2 gap-2">
						{Arr.map(allCodeWords, word => {
							const isSelected = codeWord === word

							return (
								<Toggle
									key={word}
									variant="outline"
									pressed={isSelected}
									onPressedChange={pressed => setCodeWord(pressed ? word : undefined)}
									className={cn(
										"h-10 w-full rounded-xl border-border/80 bg-background/60 font-mono text-sm font-semibold tracking-wider",
										"hover:border-foreground/25 hover:bg-muted/60",
										isSelected &&
											"border-primary/70 bg-primary/12 text-primary shadow-xs ring-1 ring-primary/30 hover:bg-primary/15 aria-pressed:border-primary/70 aria-pressed:bg-primary/12 aria-pressed:text-primary data-[state=on]:bg-primary/12",
									)}
								>
									{word}
								</Toggle>
							)
						})}
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Letter Groups
					</h3>
					<div className="grid grid-cols-2 gap-2">
						{Arr.map(allLetterGroups, group => {
							const isSelected = letterGroup === group

							return (
								<Toggle
									key={group}
									variant="outline"
									pressed={isSelected}
									onPressedChange={pressed => setLetterGroup(pressed ? group : undefined)}
									className={cn(
										"h-10 w-full rounded-xl border-border/80 bg-background/60 font-mono text-sm font-semibold tracking-wider",
										"hover:border-foreground/25 hover:bg-muted/60",
										isSelected &&
											"border-primary/70 bg-primary/12 text-primary shadow-xs ring-1 ring-primary/30 hover:bg-primary/15 aria-pressed:border-primary/70 aria-pressed:bg-primary/12 aria-pressed:text-primary data-[state=on]:bg-primary/12",
									)}
								>
									{group}
								</Toggle>
							)
						})}
					</div>
				</div>

				<SolverResult
					tone={code ? "solved" : "idle"}
					label="Your Code"
					action={
						code ? (
							<div className="flex items-center gap-1">
								<CopyCodeButton value={code} />
								<SolverResetButton
									onClick={() => {
										setLetterGroup(undefined)
										setCodeWord(undefined)
									}}
									className="h-6 px-2 text-xs"
								/>
							</div>
						) : hasSelection ? (
							<SolverResetButton
								onClick={() => {
									setLetterGroup(undefined)
									setCodeWord(undefined)
								}}
								className="h-6 px-2 text-xs"
							/>
						) : null
					}
				>
					{code ? (
						<div className="flex items-center justify-center py-1">
							<code className="font-mono text-3xl font-bold tracking-[0.22em] text-foreground tabular-nums">
								{code}
							</code>
						</div>
					) : (
						<p className="text-center text-sm text-muted-foreground">
							{codeWord && !letterGroup
								? "Now select your chalkboard letter group."
								: !codeWord && letterGroup
									? "Now select your code word."
									: "Select one option from each group."}
						</p>
					)}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}
