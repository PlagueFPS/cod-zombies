"use client"
import { Cause, Exit } from "effect"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { decodeTerminusCode, type TTerminusCode } from "@/utils/validation-schemas"

export default function TerminusCode() {
	const [values, setValues] = useState({ x: "", y: "", z: "" })

	const solveEquations = (values: TTerminusCode) => {
		const validValues = decodeTerminusCode(values)
		return Exit.match(validValues, {
			onFailure: cause => {
				console.error(Cause.pretty(cause))
				toast.error(
					"Invalid Values. Only positive, single digit, or double digit numbers are allowed.",
				)
				return null
			},
			onSuccess: ({ x, y, z }) => {
				const firstEquation = 2 * x + 11
				const secondEquation = 2 * z + y - 5
				const thirdEquation = Math.abs(y + z - x)

				return `${firstEquation}, ${secondEquation}, ${thirdEquation}`
			},
		})
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setValues(prev => ({ ...prev, [name]: value }))
	}

	return (
		<Card className="mx-auto flex w-full max-w-90 flex-col items-center justify-center bg-transparent pt-4 shadow-lg dark:shadow-none">
			<CardContent>
				<div className="grid grid-cols-3 gap-4">
					{["x", "y", "z"].map(letter => (
						<div key={letter} className="flex flex-col items-center">
							<Label htmlFor={letter} className="mb-1 text-sm capitalize">
								{letter}
							</Label>
							<Input
								type="text"
								id={letter}
								name={letter}
								value={values[letter as keyof typeof values]}
								onChange={handleInputChange}
								placeholder="00"
								className="h-12 w-16 text-center text-lg"
								maxLength={2}
							/>
						</div>
					))}
				</div>
				<div className="mt-4 text-center text-base">
					{Object.values(values).every(Boolean) ? (
						<>
							<span>Your Code:</span>
							<span className="ml-1 font-bold">{solveEquations(values)}</span>
						</>
					) : (
						"Enter your values"
					)}
				</div>
			</CardContent>
		</Card>
	)
}
