import { Exit } from "effect"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAotrtONumber } from "@/hooks/use-aotrt-o-number"
import {
	AotrtChemicalSolution,
	decodeAotrtDiamondInput,
	solveAotrtChemical,
	type AotrtChemical,
} from "@/utils/aotrt-chemical"
import { decodeAotrtONumberString, type ONumber } from "@/utils/aotrt-o-number"
import { writeAotrtONumber } from "@/utils/aotrt-o-number-storage"
import { slugify } from "@/utils/shared-functions"

interface AotrtChemicalToolProps {
	chemical: AotrtChemical
}

export default function AotrtChemicalTool({ chemical }: AotrtChemicalToolProps) {
	const [values, setValues] = useState({ top: "", left: "", oNumber: "" })
	const storedONumber = useAotrtONumber()

	const typedONumber = decodeAotrtONumberString(values.oNumber).pipe(
		Exit.match({
			onSuccess: value => value,
			onFailure: () => null,
		}),
	)

	const oNumber = storedONumber ?? typedONumber
	const hasBothValues = values.top !== "" && values.left !== ""

	useEffect(() => {
		if (storedONumber !== null || typedONumber === null) return
		writeAotrtONumber(typedONumber)
	}, [storedONumber, typedONumber])

	const solution = decodeAotrtDiamondInput({ top: values.top, left: values.left }).pipe(
		Exit.match({
			onSuccess: value => solveAotrtChemical(chemical, value.top, value.left, oNumber),
			onFailure: () => null,
		}),
	)

	const idPrefix = `aotrt-${slugify(chemical)}`

	return (
		<Card className="mx-auto w-full max-w-md bg-transparent shadow-lg dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Chemical station numbers</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className={storedONumber === null ? "grid grid-cols-3 gap-4" : "grid grid-cols-2 gap-4"}
				>
					{storedONumber === null ? (
						<div className="flex flex-col items-center gap-1">
							<Label htmlFor={`${idPrefix}-o`}>O number</Label>
							<Input
								type="text"
								inputMode="numeric"
								id={`${idPrefix}-o`}
								name="oNumber"
								value={values.oNumber}
								onValueChange={oNumberInput =>
									setValues(current => ({ ...current, oNumber: oNumberInput }))
								}
								placeholder="4"
								autoComplete="off"
								className="text-center text-lg"
							/>
						</div>
					) : null}
					<div className="flex flex-col items-center gap-1">
						<Label htmlFor={`${idPrefix}-top`}>Top</Label>
						<Input
							type="text"
							inputMode="numeric"
							id={`${idPrefix}-top`}
							name="top"
							value={values.top}
							onValueChange={top => setValues(current => ({ ...current, top }))}
							placeholder="8"
							autoComplete="off"
							className="text-center text-lg"
						/>
					</div>
					<div className="flex flex-col items-center gap-1">
						<Label htmlFor={`${idPrefix}-left`}>Left</Label>
						<Input
							type="text"
							inputMode="numeric"
							id={`${idPrefix}-left`}
							name="left"
							value={values.left}
							onValueChange={left => setValues(current => ({ ...current, left }))}
							placeholder="1"
							autoComplete="off"
							className="text-center text-lg"
						/>
					</div>
				</div>
				<div className="rounded-sm bg-input p-2 text-center dark:bg-input/20" aria-live="polite">
					{chemicalToolStatus(hasBothValues, oNumber, values.oNumber, solution)}
				</div>
			</CardContent>
		</Card>
	)
}

function chemicalToolStatus(
	hasBothValues: boolean,
	oNumber: ONumber | null,
	oInput: string,
	solution: AotrtChemicalSolution | null,
) {
	if (!hasBothValues) {
		return (
			<p className="text-sm text-muted-foreground">
				{oNumber === null
					? "Enter your O number and the Top and Left diamond numbers"
					: "Enter the Top and Left numbers from the Acetaldehyde diamond"}
			</p>
		)
	}

	if (solution === null) {
		return <p className="text-sm text-muted-foreground">Enter positive whole numbers</p>
	}

	return AotrtChemicalSolution.$match(solution, {
		WrongTvColor: () => (
			<p className="text-sm text-muted-foreground">
				Those numbers are not on the Acetaldehyde diamond. View the board in your TV color.
			</p>
		),
		MissingONumber: () => (
			<p className="text-sm text-muted-foreground">
				{oInput === "" ? "Enter your O number." : "O number must be 2, 4, 5, 6, 8, 9, 11, or 15."}
			</p>
		),
		Solved: ({ steps }) => (
			<>
				{steps.map((step, index) => (
					<p key={`step-${index + 1}`} className="text-base">
						Step {index + 1} = <span className="font-bold">{step}</span>
					</p>
				))}
			</>
		),
	})
}
