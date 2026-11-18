import { cn } from "cn"
import { Array as Arr, String as Str, Option, Predicate } from "effect"
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
import { periodicTable, type Element } from "@/data/reckoning-elements"

const getLetters = () => {
	const letters = new Set<string>()
	Arr.forEach(periodicTable, element => {
		const initialLetters = Str.split(Str.toLowerCase(element.initials), "")
		Arr.forEach(initialLetters, letter => {
			letters.add(letter)
		})
	})

	return [...letters].sort()
}

const LETTERS = getLetters()

const findMatchingElement = (letters: string[]): Element | null => {
	if (letters.length === 0) return null

	if (letters.length === 1) {
		return (
			Option.getOrUndefined(
				Arr.findFirst(periodicTable, el => Str.toLowerCase(el.initials) === letters[0]),
			) ?? null
		)
	}

	if (letters.length === 2) {
		const [first, second] = letters

		return (
			Option.getOrUndefined(
				Arr.findFirst(periodicTable, el => Str.toLowerCase(el.initials) === `${first}${second}`),
			) ??
			Option.getOrUndefined(
				Arr.findFirst(periodicTable, el => Str.toLowerCase(el.initials) === `${second}${first}`),
			) ??
			null
		)
	}

	return null
}

const formatElementCode = (element: Element | null): string =>
	Predicate.isNotNullish(element) ? Str.padStart(3, "0")(element.number.toString()) : ""

export default function ReckoningCode() {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([])

	const matchedElement = findMatchingElement(selectedLetters)
	const code = formatElementCode(matchedElement)

	const getAvailableLetters = () => {
		if (selectedLetters.length === 0) {
			const firstLetters = new Set<string>()
			Arr.forEach(periodicTable, element => {
				if (Predicate.isNotNullish(element.initials[0]) && Predicate.isTruthy(element.initials[0]))
					firstLetters.add(Str.toLowerCase(element.initials[0]))

				if (Predicate.isNotNullish(element.initials[1]) && Predicate.isTruthy(element.initials[1]))
					firstLetters.add(Str.toLowerCase(element.initials[1]))
			})

			return firstLetters
		}

		if (selectedLetters.length === 1) {
			const selectedLetter = selectedLetters[0]
			const validLetters = new Set<string>()

			Arr.forEach(periodicTable, element => {
				const initials = Str.toLowerCase(element.initials)

				if (
					Predicate.isNotNullish(selectedLetter) &&
					Predicate.isTruthy(selectedLetter) &&
					Str.includes(selectedLetter)(initials)
				) {
					const otherLetter = initials[0] === selectedLetter ? initials[1] : initials[0]

					if (Predicate.isNotNullish(otherLetter) && Predicate.isTruthy(otherLetter))
						validLetters.add(otherLetter)
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

			return
		}

		if (selectedLetters.length >= 2) return

		const availableLetters = getAvailableLetters()

		if (availableLetters.has(letter)) {
			setSelectedLetters([...selectedLetters, letter])
		}
	}

	const isLetterDisabled = (letter: string) => {
		if (selectedLetters.length === 0) return false

		if (selectedLetters.includes(letter)) return false

		return !getAvailableLetters().has(letter)
	}

	return (
		<SolverCard className="max-w-xl">
			<SolverHeader
				title="Element Keypad Code"
				description="Select 1 or 2 element initials from your game to reveal the 3-digit atomic code."
			/>
			<CardContent className="space-y-5 px-5">
				<div
					className="mx-auto grid w-fit grid-cols-6 gap-2 sm:grid-cols-8"
					role="group"
					aria-label="Element initials"
				>
					{Arr.map(LETTERS, letter => {
						const isSelected = selectedLetters.includes(letter)
						const disabled = isLetterDisabled(letter)

						return (
							<Toggle
								key={letter}
								variant="outline"
								pressed={isSelected}
								disabled={disabled}
								onClick={() => handleLetterClick(letter)}
								aria-label={`Select ${letter}`}
								className={cn(
									"size-10 rounded-xl border-border/80 bg-background/60 font-mono text-base font-semibold uppercase sm:size-11",
									"hover:border-foreground/25 hover:bg-muted/60",
									isSelected &&
										"border-primary/70 bg-primary/12 text-primary shadow-xs ring-1 ring-primary/30 hover:bg-primary/15 aria-pressed:border-primary/70 aria-pressed:bg-primary/12 aria-pressed:text-primary data-[state=on]:bg-primary/12",
									disabled && "opacity-30",
								)}
							>
								{letter}
							</Toggle>
						)
					})}
				</div>

				<SolverResult
					tone={code ? "solved" : "idle"}
					label="Your Code"
					action={
						selectedLetters.length > 0 ? (
							<div className="flex items-center gap-1">
								{code ? <CopyCodeButton value={code} /> : null}
								<SolverResetButton
									onClick={() => setSelectedLetters([])}
									className="h-6 px-2 text-xs"
								/>
							</div>
						) : null
					}
				>
					{code && matchedElement ? (
						<div className="flex flex-col items-center gap-1 py-0.5 text-center">
							<span className="text-xs font-medium tracking-wide text-muted-foreground capitalize">
								{matchedElement.initials} &middot; {matchedElement.id}
							</span>
							<span className="font-mono text-3xl font-bold tracking-[0.22em] text-foreground tabular-nums">
								{code}
							</span>
						</div>
					) : (
						<p className="text-center text-sm text-muted-foreground">
							{selectedLetters[0]
								? `Selected ${selectedLetters[0].toUpperCase()}. Pick the second letter if your element has two.`
								: "Pick the letter(s) of the periodic element."}
						</p>
					)}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}
