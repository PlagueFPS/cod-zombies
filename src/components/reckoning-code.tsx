import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { periodicTable } from "@/data/reckoning-elements"

const getLetters = () => {
	const letters = new Set<string>()
	periodicTable.forEach(element => {
		const initialLetters = element.initials.toLowerCase().split("")
		initialLetters.forEach(letter => {
			letters.add(letter)
		})
	})

	return [...letters].sort()
}

const LETTERS = getLetters()

const getElementCode = (letters: string[]): string | null => {
	if (letters.length === 0) return null

	if (letters.length === 1) {
		const element = periodicTable.find(el => el.initials.toLowerCase() === letters[0])

		return element ? element.number.toString().padStart(3, "0") : null
	}

	if (letters.length === 2) {
		const [first, second] = letters

		const element1 = periodicTable.find(el => el.initials.toLowerCase() === `${first}${second}`)

		const element2 = periodicTable.find(el => el.initials.toLowerCase() === `${second}${first}`)

		return element1
			? element1.number.toString().padStart(3, "0")
			: element2
				? element2.number.toString().padStart(3, "0")
				: null
	}

	return null
}

export default function ReckoningCode() {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([])
	const [code, setCode] = useState("")

	const getAvailableLetters = () => {
		if (selectedLetters.length === 0) {
			const firstLetters = new Set<string>()
			periodicTable.forEach(element => {
				if (element.initials[0]) firstLetters.add(element.initials[0].toLowerCase())

				if (element.initials[1]) firstLetters.add(element.initials[1].toLowerCase())
			})

			return firstLetters
		}

		if (selectedLetters.length === 1) {
			const selectedLetter = selectedLetters[0]
			const validLetters = new Set<string>()

			periodicTable.forEach(element => {
				const initials = element.initials.toLowerCase()

				if (selectedLetter && initials.includes(selectedLetter)) {
					const otherLetter = initials[0] === selectedLetter ? initials[1] : initials[0]

					if (otherLetter) validLetters.add(otherLetter)
				}
			})

			return validLetters
		}

		return new Set<string>()
	}

	const handleLetterClick = (letter: string) => {
		const letterIndex = selectedLetters.indexOf(letter)

		if (letterIndex !== -1) {
			const newSelection = [...selectedLetters]
			newSelection.splice(letterIndex, 1)
			setSelectedLetters(newSelection)
			setCode(getElementCode(newSelection) || "")

			return
		}

		if (selectedLetters.length >= 2) return

		const availableLetters = getAvailableLetters()

		if (availableLetters.has(letter)) {
			const newSelection = [...selectedLetters, letter]
			setSelectedLetters(newSelection)
			setCode(getElementCode(newSelection) || "")
		}
	}

	const isLetterDisabled = (letter: string) => {
		if (selectedLetters.length === 0) return false

		if (selectedLetters.includes(letter)) return false

		const availableLetters = getAvailableLetters()

		return !availableLetters.has(letter)
	}

	return (
		<Card className="mx-auto flex w-full flex-col items-center justify-center bg-transparent shadow-lg dark:shadow-none">
			<CardContent className="flex items-center justify-center">
				<div className="grid grid-cols-6 place-content-center gap-4 sm:grid-cols-8">
					{LETTERS.map(letter => (
						<Toggle
							key={letter}
							variant={"outline"}
							disabled={isLetterDisabled(letter)}
							onClick={() => handleLetterClick(letter)}
							aria-label={`Select ${letter}`}
							className={`text-lg uppercase`}
						>
							{letter}
						</Toggle>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex flex-col items-center justify-center text-center text-base">
					<span>
						Your Code: <span className="font-bold">{code}</span>
					</span>
				</div>
			</CardFooter>
		</Card>
	)
}
