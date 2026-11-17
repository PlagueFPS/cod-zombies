import { Option, Match } from "effect"
import { useEffect, useState } from "react"
import {
	SolverCard,
	SolverHeader,
	SolverResetButton,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	decodeAotrtONumberInput,
	solveAotrtONumber,
	type AotrtTvColorRow,
} from "@/utils/aotrt-o-number"
import { writeAotrtONumber } from "@/utils/aotrt-o-number-storage"

export default function AotrtNumberTool() {
	const [values, setValues] = useState({ m: "", topTvNumber: "" })

	const solved = decodeAotrtONumberInput(values).pipe(
		Option.map(value => solveAotrtONumber(value.m, value.topTvNumber)),
	)

	const hasAnyValue = values.m !== "" || values.topTvNumber !== ""
	const hasBothValues = values.m !== "" && values.topTvNumber !== ""
	const isInvalid = hasBothValues && Option.isNone(solved)
	const oNumber = solved.pipe(Option.map(value => value.oNumber))

	useEffect(() => {
		if (Option.isNone(oNumber)) return
		writeAotrtONumber(oNumber.value)
	}, [oNumber])

	return (
		<SolverCard className="max-w-md">
			<SolverHeader
				title="Get your O Number and TV Color"
				description="Enter the M number from the lab and the top number on Elvira’s TV."
			/>
			<CardContent className="space-y-4 px-5">
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col items-center gap-1.5">
						<Label
							htmlFor="aotrt-m"
							className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>
							M number
						</Label>
						<Input
							type="text"
							inputMode="numeric"
							id="aotrt-m"
							name="m"
							value={values.m}
							onValueChange={m => setValues(current => ({ ...current, m }))}
							placeholder="7"
							autoComplete="off"
							size="lg"
							className="text-center font-mono text-xl font-semibold tabular-nums"
						/>
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<Label
							htmlFor="aotrt-top-tv-number"
							className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>
							Top TV number
						</Label>
						<Input
							type="text"
							inputMode="numeric"
							id="aotrt-top-tv-number"
							name="topTvNumber"
							value={values.topTvNumber}
							onValueChange={topTvNumber => setValues(current => ({ ...current, topTvNumber }))}
							placeholder="61"
							autoComplete="off"
							size="lg"
							className="text-center font-mono text-xl font-semibold tabular-nums"
						/>
					</div>
				</div>

				<SolverResult
					tone={Option.isSome(solved) ? "solved" : isInvalid ? "error" : "idle"}
					label="Result"
					action={
						hasAnyValue ? (
							<SolverResetButton
								onClick={() => setValues({ m: "", topTvNumber: "" })}
								className="h-6 px-2 text-xs"
							/>
						) : null
					}
				>
					{Option.match(solved, {
						onSome: result => (
							<div className="grid grid-cols-2 gap-2.5 text-center">
								<div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2.5 dark:bg-background/40">
									<p className="text-xs font-medium text-muted-foreground">
										O number<span className="sr-only"> = </span>
										<span className="mt-0.5 block font-mono text-2xl font-bold text-foreground tabular-nums">
											{result.oNumber}
										</span>
									</p>
								</div>
								<div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2.5 dark:bg-background/40">
									<p className="text-xs font-medium text-muted-foreground">
										TV Color<span className="sr-only"> = </span>
										<span className="mt-0.5 block text-2xl font-bold text-foreground">
											{tvColorLabel(result.tvColor.row)}
										</span>
									</p>
								</div>
							</div>
						),
						onNone: () => (
							<p className="text-center text-sm text-muted-foreground">
								{hasBothValues ? "Enter positive whole numbers" : "Enter your M and top TV numbers"}
							</p>
						),
					})}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}

const tvColorLabel = (row: AotrtTvColorRow) =>
	Match.value(row).pipe(
		Match.when("top", () => "Top"),
		Match.when("middle", () => "Middle"),
		Match.when("bottom", () => "Bottom"),
		Match.exhaustive,
	)
