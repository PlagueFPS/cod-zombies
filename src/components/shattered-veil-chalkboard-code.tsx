"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChalkboardLetters, type Code, chalkboardCodes } from "@/data/shattered-veil-codes"

const getAllCodes = () => {
	const codeWords: Code[] = []

	// We can use any property for this loop since they all have the same four possible code words
	for (const code in chalkboardCodes.E) {
		codeWords.push(code as Code)
	}

	return codeWords
}

export default function ShatteredVeilCode() {
	const [letterGroup, setLetterGroup] = useState<ChalkboardLetters>()
	const [codeWord, setCodeWord] = useState<Code>()
	const allLetterGroups = Object.keys(chalkboardCodes) as ChalkboardLetters[]
	const allCodeWords = getAllCodes()

	return (
		<div className="flex items-center justify-center bg-background p-4">
			<Card className="w-full bg-transparent">
				<CardHeader>
					<CardTitle>Keypad Code Generator</CardTitle>
					<CardDescription>Select one option from each group to generate your code</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Code Words Group */}
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

					{/* Letter Groups */}
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

					{/* Generated Code Display */}
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

	// return (
	// 	<Card className="my-8 bg-transparent shadow-lg dark:shadow-none">
	// 		<CardContent className="flex flex-col items-center justify-center gap-4">
	// 			<div className="flex items-center justify-center gap-4">
	// 				<span>Select Code Word:</span>
	// 				<div className="flex items-center justify-center gap-2">
	// 					{allCodeWords.map(code => (
	// 						<Toggle
	// 							key={code}
	// 							variant={"outline"}
	// 							onClick={() => handleCodeWordClick(code)}
	// 							disabled={isCodeDisabled(code)}
	// 							aria-label={`Select ${code}`}
	// 						>
	// 							{code}
	// 						</Toggle>
	// 					))}
	// 				</div>
	// 			</div>
	// 			<div className="flex items-center justify-center gap-4">
	// 				<span>Select First Letter Group:</span>
	// 				<div className="flex items-center justify-center gap-2">
	// 					{allLetterGroups.map(group => (
	// 						<Toggle
	// 							key={group}
	// 							variant={"outline"}
	// 							disabled={isGroupDisabled(group)}
	// 							aria-label={`Select ${group}`}
	// 							onClick={() => handleLetterGroupClick(group)}
	// 						>
	// 							{group}
	// 						</Toggle>
	// 					))}
	// 				</div>
	// 			</div>
	// 		</CardContent>
	// 		<CardFooter className="flex items-center justify-center">
	// 			<div className="flex items-center justify-center text-center text-base">
	// 				<span>
	// 					Keypad Code:
	// 					{letterGroup && codeWord && (
	// 						<span className="ml-1 font-bold">{chalkboardCodes[letterGroup][codeWord]}</span>
	// 					)}
	// 				</span>
	// 			</div>
	// 		</CardFooter>
	// 	</Card>
	// )
}
