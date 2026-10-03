import { Exit, Match } from "effect"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	decodeAotrtONumberInput,
	solveAotrtONumber,
	type AotrtTvColorRow,
} from "@/utils/aotrt-o-number"

export default function AotrtNumberTool() {
	const [values, setValues] = useState({ m: "", topTvNumber: "" })
	const solved = decodeAotrtONumberInput(values).pipe(Exit.match({
		onSuccess: value => solveAotrtONumber(value.m, value.topTvNumber),
		onFailure: () => null,
	}))

	const hasBothValues = values.m !== "" && values.topTvNumber !== ""

	return (
		<Card className="mx-auto w-full max-w-md bg-transparent shadow-lg dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Get your O Number and TV Color</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col items-center gap-1">
						<Label htmlFor="aotrt-m">M number</Label>
						<Input
							type="text"
							inputMode="numeric"
							id="aotrt-m"
							name="m"
							value={values.m}
							onValueChange={m => setValues(current => ({ ...current, m }))}
							placeholder="7"
							autoComplete="off"
							className="text-center text-lg"
						/>
					</div>
					<div className="flex flex-col items-center gap-1">
						<Label htmlFor="aotrt-top-tv-number">Top TV number</Label>
						<Input
							type="text"
							inputMode="numeric"
							id="aotrt-top-tv-number"
							name="topTvNumber"
							value={values.topTvNumber}
							onValueChange={topTvNumber => setValues(current => ({ ...current, topTvNumber }))}
							placeholder="61"
							autoComplete="off"
							className="text-center text-lg"
						/>
					</div>
				</div>
				<div className="rounded-sm bg-input p-2 text-center dark:bg-input/20" aria-live="polite">
					{solved ? (
						<>
							<p className="text-base">
								O number = <span className="font-bold">{solved.oNumber}</span>
							</p>
							<p className="text-base">
								TV Color = <span className="font-bold">{tvColorLabel(solved.tvColor.row)}</span>
							</p>
						</>
					) : (
						<p className="text-sm text-muted-foreground">
							{hasBothValues ? "Enter positive whole numbers" : "Enter your M and top TV numbers"}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

const tvColorLabel = (row: AotrtTvColorRow) => Match.value(row).pipe(
	Match.when("top", () => "Top"),
	Match.when("middle", () => "Middle"),
	Match.when("bottom", () => "Bottom"),
	Match.exhaustive
)
