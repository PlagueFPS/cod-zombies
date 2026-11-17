import { Exit, Array as Arr, Record as Rec } from "effect"
import { useState } from "react"
import {
	CopyCodeButton,
	SolverCard,
	SolverHeader,
	SolverResetButton,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { decodeTerminusCode } from "@/utils/validation-schemas"

export default function TerminusCode() {
	const [values, setValues] = useState({ x: "", y: "", z: "" })

	const hasAnyValue = Arr.some(Rec.values(values), Boolean)
	const hasAllValues = Arr.every(Rec.values(values), Boolean)

	const decoded = hasAllValues ? decodeTerminusCode(values) : null

	const solvedItems =
		decoded && Exit.isSuccess(decoded)
			? ([
					{ key: "eq1", formula: "2X + 11", value: 2 * decoded.value.x + 11 },
					{
						key: "eq2",
						formula: "2Z + Y - 5",
						value: 2 * decoded.value.z + decoded.value.y - 5,
					},
					{
						key: "eq3",
						formula: "|Y + Z - X|",
						value: Math.abs(decoded.value.y + decoded.value.z - decoded.value.x),
					},
				] as const)
			: null

	const isInvalid = Boolean(decoded && Exit.isFailure(decoded))
	const formattedCode = solvedItems ? Arr.map(solvedItems, item => item.value).join(", ") : ""

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setValues(prev => ({ ...prev, [name]: value }))
	}

	return (
		<SolverCard className="max-w-md">
			<SolverHeader
				title="Terminus Terminal Code"
				description="Enter the X, Y, and Z values from the sticky notes and chalkboard."
			/>
			<CardContent className="space-y-4 px-5">
				<div className="grid grid-cols-3 gap-3">
					{Arr.map(["x", "y", "z"] as const, letter => (
						<div key={letter} className="flex flex-col items-center gap-1.5">
							<Label
								htmlFor={letter}
								className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
							>
								{letter}
							</Label>
							<Input
								type="text"
								inputMode="numeric"
								id={letter}
								name={letter}
								value={values[letter]}
								onChange={handleInputChange}
								placeholder="00"
								autoComplete="off"
								className="text-center font-mono text-xl font-semibold tabular-nums"
								size="lg"
								maxLength={2}
							/>
						</div>
					))}
				</div>

				<SolverResult
					tone={solvedItems ? "solved" : isInvalid ? "error" : "idle"}
					label="Your Code"
					action={
						hasAnyValue ? (
							<div className="flex items-center gap-1">
								{formattedCode ? <CopyCodeButton value={formattedCode} /> : null}
								<SolverResetButton
									onClick={() => setValues({ x: "", y: "", z: "" })}
									className="h-6 px-2 text-xs"
								/>
							</div>
						) : null
					}
				>
					{solvedItems ? (
						<div className="grid grid-cols-3 gap-2">
							{Arr.map(solvedItems, item => (
								<div
									key={item.key}
									className="flex flex-col items-center rounded-lg border border-border/60 bg-background/70 px-2 py-2 dark:bg-background/40"
								>
									<span className="font-mono text-[10px] text-muted-foreground">
										{item.formula}
									</span>
									<span className="font-mono text-2xl font-bold text-foreground tabular-nums">
										{item.value}
									</span>
								</div>
							))}
						</div>
					) : isInvalid ? (
						<p className="text-center text-sm text-destructive">
							Enter positive 1 or 2 digit whole numbers (0–99).
						</p>
					) : (
						<p className="text-center text-sm text-muted-foreground">
							Enter your X, Y, and Z values above.
						</p>
					)}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}
