import { cn } from "cn"
import { Option, Array as Arr } from "effect"
import { useEffect, useState } from "react"
import {
	CopyCodeButton,
	SolverCard,
	SolverHeader,
	SolverNumberInput,
	SolverResetButton,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
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

	const typedONumber = decodeAotrtONumberString(values.oNumber)

	const oNumber = Option.orElse(storedONumber, () => typedONumber)
	const hasAnyValue = values.top !== "" || values.left !== "" || values.oNumber !== ""
	const hasBothValues = values.top !== "" && values.left !== ""

	useEffect(() => {
		if (Option.isSome(storedONumber) || Option.isNone(typedONumber)) return
		writeAotrtONumber(typedONumber.value)
	}, [storedONumber, typedONumber])

	const solution = decodeAotrtDiamondInput({ top: values.top, left: values.left }).pipe(
		Option.map(value => solveAotrtChemical(chemical, value.top, value.left, oNumber)),
	)

	const idPrefix = `aotrt-${slugify(chemical)}`

	const isSolved =
		hasBothValues && Option.isSome(solution) && AotrtChemicalSolution.$is("Solved")(solution.value)

	const isError =
		hasBothValues &&
		(Option.isNone(solution) ||
			(Option.isSome(solution) && AotrtChemicalSolution.$is("WrongTvColor")(solution.value)))

	const solvedStepsCopy =
		isSolved && Option.isSome(solution) && AotrtChemicalSolution.$is("Solved")(solution.value)
			? solution.value.steps.join(", ")
			: ""

	return (
		<SolverCard className="max-w-md">
			<SolverHeader title="Chemical station numbers" badge={chemical} />
			<CardContent className="space-y-4 px-5">
				<div
					className={Option.match(storedONumber, {
						onNone: () => "grid grid-cols-3 gap-3",
						onSome: () => "grid grid-cols-2 gap-3",
					})}
				>
					{Option.match(storedONumber, {
						onNone: () => (
							<div className="flex flex-col items-center gap-1.5">
								<Label
									htmlFor={`${idPrefix}-o`}
									className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
								>
									O number
								</Label>
								<SolverNumberInput
									id={`${idPrefix}-o`}
									name="oNumber"
									label="O number"
									value={values.oNumber}
									onValueChange={oNumberInput =>
										setValues(current => ({ ...current, oNumber: oNumberInput }))
									}
									placeholder="4"
									min={1}
									step={1}
								/>
							</div>
						),
						onSome: () => null,
					})}
					<div className="flex flex-col items-center gap-1.5">
						<Label
							htmlFor={`${idPrefix}-top`}
							className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>
							Top
						</Label>
						<SolverNumberInput
							id={`${idPrefix}-top`}
							name="top"
							label="Top"
							value={values.top}
							onValueChange={top => setValues(current => ({ ...current, top }))}
							placeholder="8"
							min={1}
							step={1}
						/>
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<Label
							htmlFor={`${idPrefix}-left`}
							className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>
							Left
						</Label>
						<SolverNumberInput
							id={`${idPrefix}-left`}
							name="left"
							label="Left"
							value={values.left}
							onValueChange={left => setValues(current => ({ ...current, left }))}
							placeholder="1"
							min={1}
							step={1}
						/>
					</div>
				</div>

				<SolverResult
					tone={isSolved ? "solved" : isError ? "warning" : "idle"}
					label="Steps"
					action={
						hasAnyValue ? (
							<div className="flex items-center gap-1">
								{solvedStepsCopy ? (
									<CopyCodeButton value={solvedStepsCopy} label="Copy chemical steps" />
								) : null}
								<SolverResetButton
									onClick={() => setValues({ top: "", left: "", oNumber: "" })}
									className="h-6 px-2 text-xs"
								/>
							</div>
						) : null
					}
				>
					{chemicalToolStatus(hasBothValues, oNumber, values.oNumber, solution)}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}

function chemicalToolStatus(
	hasBothValues: boolean,
	oNumber: Option.Option<ONumber>,
	oInput: string,
	solution: Option.Option<AotrtChemicalSolution>,
) {
	if (!hasBothValues) {
		return (
			<p className="text-center text-sm text-muted-foreground">
				{Option.match(oNumber, {
					onNone: () => "Enter your O number and the Top and Left diamond numbers",
					onSome: () => "Enter the Top and Left numbers from the Acetaldehyde diamond",
				})}
			</p>
		)
	}

	if (Option.isNone(solution)) {
		return <p className="text-center text-sm text-muted-foreground">Enter positive whole numbers</p>
	}

	return AotrtChemicalSolution.$match(solution.value, {
		WrongTvColor: () => (
			<p className="text-center text-sm text-amber-800 dark:text-amber-200">
				Those numbers are not on the Acetaldehyde diamond. View the board in your TV color.
			</p>
		),
		MissingONumber: () => (
			<p className="text-center text-sm text-muted-foreground">
				{oInput === "" ? "Enter your O number." : "O number must be 2, 4, 5, 6, 8, 9, 11, or 15."}
			</p>
		),
		Solved: ({ steps }) => (
			<div
				className={cn(
					"grid gap-2 text-center",
					steps.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3",
				)}
			>
				{Arr.map(steps, (step, index) => (
					<div
						key={`step-${index + 1}`}
						className="rounded-lg border border-border/60 bg-background/70 px-2 py-2 dark:bg-background/40"
					>
						<p className="text-xs font-medium text-muted-foreground">
							Step {index + 1}
							<span className="sr-only"> = </span>
							<span className="mt-0.5 block font-mono text-2xl font-bold text-foreground tabular-nums">
								{step}
							</span>
						</p>
					</div>
				))}
			</div>
		),
	})
}
