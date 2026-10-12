import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

	return (
		<div className="flex items-center justify-center bg-background p-4">
			<Card className="w-full bg-transparent">
				<CardHeader>
					<CardTitle>Keypad Code Generator</CardTitle>
					<CardDescription>Select one option from each group to generate your code</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-foreground/90">Code Words</h3>
						<div className="grid grid-cols-2 gap-2">
							{allCodeWords.map(word => (
								<Button
									key={word}
									variant={codeWord === word ? "default" : "outline"}
									onClick={() => setCodeWord(word)}
									className="w-full"
								>
									{word}
								</Button>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-foreground/90">Letter Groups</h3>
						<div className="grid grid-cols-2 gap-2">
							{allLetterGroups.map(group => (
								<Button
									key={group}
									variant={letterGroup === group ? "default" : "outline"}
									onClick={() => setLetterGroup(group)}
									className="w-full"
								>
									{group}
								</Button>
							))}
						</div>
					</div>

					{letterGroup && codeWord && (
						<div className="border-t pt-4">
							<p className="mb-2 text-sm text-foreground/90">Your Code:</p>
							<div className="rounded-lg bg-muted p-4 dark:bg-input/30">
								<code className="text-lg font-semibold text-foreground">
									{chalkboardCodes[letterGroup][codeWord]}
								</code>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
