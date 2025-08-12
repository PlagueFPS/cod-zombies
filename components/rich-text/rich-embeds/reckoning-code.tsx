"use client"

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

export default function ReckoningCode() {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([])
	const [code, setCode] = useState("")

	const getAvailableLetters = () => {
		if (selectedLetters.length === 0) {
			// First letter can be any initial letter from the periodic table
			const firstLetters = new Set<string>()
			periodicTable.forEach(element => {
				if (element.initials[0]) firstLetters.add(element.initials[0].toLowerCase())
			})
			return firstLetters
		}

		if (selectedLetters.length === 1) {
			const firstLetter = selectedLetters[0]
			const validSecondLetters = new Set<string>()

			// Check for single-letter elements first (like H, K, Y, etc.)
			if (periodicTable.some(el => el.initials.toLowerCase() === firstLetter)) {
				validSecondLetters.add("") // Empty string represents no second letter
			}

			// Check for two-letter elements
			periodicTable
				.filter(
					el =>
						el.initials[0] &&
						el.initials[0].toLowerCase() === firstLetter &&
						el.initials.length === 2,
				)
				.forEach(el => {
					if (el.initials[1]) validSecondLetters.add(el.initials[1].toLowerCase())
				})

			return validSecondLetters
		}

		return new Set<string>()
	}

	const handleLetterClick = (letter: string) => {
		// If clicking an already selected letter, remove it
		const letterIndex = selectedLetters.indexOf(letter)
		if (letterIndex !== -1) {
			const newSelection = [...selectedLetters]
			newSelection.splice(letterIndex, 1)
			setSelectedLetters(newSelection)
			setCode("")
			return
		}

		// Don't allow more than 2 letters
		if (selectedLetters.length >= 2) return

		const availableLetters = getAvailableLetters()
		const isFirstLetter = selectedLetters.length === 0
		const isSecondLetter = selectedLetters.length === 1

		if (
			(isFirstLetter && availableLetters.has(letter)) ||
			(isSecondLetter && availableLetters.has(letter))
		) {
			const newSelection = [...selectedLetters, letter]
			setSelectedLetters(newSelection)

			// Check if we have a complete element (1 or 2 letters)
			const elementCode = newSelection.join("")
			const element = periodicTable.find(element => element.initials.toLowerCase() === elementCode)
			setCode(element ? element.number.toString().padStart(3, "0") : "")
		}
	}

	const isLetterActive = (letter: string) => {
		return selectedLetters.includes(letter)
	}

	const isLetterDisabled = (letter: string) => {
		if (selectedLetters.length === 0) return false
		if (selectedLetters.includes(letter)) return false // Allow clicking selected letters to unselect them

		const availableLetters = getAvailableLetters()
		return !availableLetters.has(letter)
	}

	return (
		<Card className="mx-auto flex w-full flex-col items-center justify-center bg-transparent shadow-lg dark:shadow-none">
			<CardContent className="flex items-center justify-center">
				<div className="grid grid-cols-8 place-content-center gap-4">
					{LETTERS.map(letter => (
						<Toggle
							key={letter}
							variant={"outline"}
							pressed={isLetterActive(letter)}
							disabled={isLetterDisabled(letter)}
							onClick={() => handleLetterClick(letter)}
							aria-label={`Select ${letter}`}
							className={`text-lg uppercase ${isLetterActive(letter) ? "bg-primary text-primary-foreground" : ""} ${isLetterDisabled(letter) ? "cursor-not-allowed opacity-50" : ""}`}
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
