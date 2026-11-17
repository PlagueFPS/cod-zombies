import { cn } from "cn"
import { Array as Arr, Predicate } from "effect"
import { useState } from "react"
import {
	CopyCodeButton,
	SolverCard,
	SolverHeader,
	SolverResetButton,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { type Location, locations, valveRoutes } from "@/data/gk-values"
import { slugify } from "@/utils/shared-functions"

interface ValveLocation {
	name: Location
	value: number | null
}

const getCurrentLocations = (firstValue: string, secondValue: string) => {
	if (
		Predicate.isNotNullish(firstValue) &&
		Predicate.isTruthy(firstValue) &&
		Predicate.isNotNullish(secondValue) &&
		Predicate.isTruthy(secondValue)
	) {
		const searchString = `${firstValue} to ${secondValue}`
		const currentLocations: ValveLocation[] = []

		for (const key in valveRoutes) {
			if (searchString === key) {
				const route = valveRoutes[key]

				if (!(Predicate.isNotNullish(route) && Predicate.isTruthy(route))) continue

				for (const location of locations) {
					currentLocations.push({
						name: location,
						value: route[location],
					})
				}
			}
		}

		return currentLocations
	}

	return []
}

export default function GKValve() {
	const [values, setValues] = useState({
		firstValue: "",
		secondValue: "",
	})

	const currentLocations = getCurrentLocations(values.firstValue, values.secondValue)
	const hasSelection = Boolean(values.firstValue || values.secondValue)

	const handleGreenValueChange = (value: string | null) => {
		if (!(Predicate.isNotNullish(value) && Predicate.isTruthy(value))) return
		setValues(prevState => ({ ...prevState, firstValue: value }))
	}

	const handlePinkValueChange = (value: string | null) => {
		if (!(Predicate.isNotNullish(value) && Predicate.isTruthy(value))) return
		setValues(prevState => ({ ...prevState, secondValue: value }))
	}

	const copyText =
		currentLocations.length > 0
			? Arr.join(
					Arr.map(currentLocations, loc =>
						Predicate.isNotNullish(loc.value) && Predicate.isTruthy(loc.value)
							? `${loc.name}: ${loc.value}`
							: `${loc.name}: Pink Cylinder`,
					),
					", ",
				)
			: ""

	return (
		<SolverCard className="max-w-xl">
			<SolverHeader
				title="Valve Pressure Solver"
				description="Select the Green Light start location and Pink Cylinder end location."
			/>
			<CardContent className="space-y-4 px-5">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div className="space-y-1.5">
						<Label
							htmlFor="gk-green-valve"
							className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
						>
							<span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
							Green Light (Start)
						</Label>
						<Select value={values.firstValue} onValueChange={handleGreenValueChange}>
							<SelectTrigger id="gk-green-valve" className="h-9 w-full">
								<SelectValue placeholder="Select Green Light Location" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{Arr.map(locations, location => {
										if (location === values.secondValue) return null

										return (
											<SelectItem key={`green-valve-${slugify(location)}`} value={location}>
												{location}
											</SelectItem>
										)
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<Label
							htmlFor="gk-pink-valve"
							className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
						>
							<span className="size-2 rounded-full bg-pink-500" aria-hidden="true" />
							Pink Cylinder (End)
						</Label>
						<Select value={values.secondValue} onValueChange={handlePinkValueChange}>
							<SelectTrigger id="gk-pink-valve" className="h-9 w-full">
								<SelectValue placeholder="Select Pink Cylinder Location" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{Arr.map(locations, location => {
										if (location === values.firstValue) return null

										return (
											<SelectItem key={`pink-valve-${slugify(location)}`} value={location}>
												{location}
											</SelectItem>
										)
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<SolverResult
					tone={currentLocations.length > 0 ? "solved" : "idle"}
					label="Valve Settings"
					action={
						hasSelection ? (
							<div className="flex items-center gap-1">
								{copyText ? <CopyCodeButton value={copyText} label="Copy valve settings" /> : null}
								<SolverResetButton
									onClick={() => setValues({ firstValue: "", secondValue: "" })}
									className="h-6 px-2 text-xs"
								/>
							</div>
						) : null
					}
				>
					{currentLocations.length > 0 ? (
						<ul className="grid list-none grid-cols-1 gap-2 pl-0 sm:grid-cols-2">
							{Arr.map(currentLocations, location => {
								const isGreen = location.name === values.firstValue

								const hasNumber =
									Predicate.isNotNullish(location.value) && Predicate.isTruthy(location.value)

								return (
									<li
										key={`valve-${slugify(location.name)}`}
										className={cn(
											"flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
											hasNumber
												? "border-border/70 bg-background/70 dark:bg-background/40"
												: "border-pink-500/35 bg-pink-500/10",
										)}
									>
										<span className="flex items-center gap-2 font-medium text-foreground">
											{isGreen ? (
												<span
													className="size-2 shrink-0 rounded-full bg-emerald-500"
													aria-hidden="true"
												/>
											) : !hasNumber ? (
												<span
													className="size-2 shrink-0 rounded-full bg-pink-500"
													aria-hidden="true"
												/>
											) : null}
											<span
												className={cn(
													isGreen && "text-emerald-700 dark:text-emerald-400",
													!hasNumber && "text-pink-700 dark:text-pink-400",
												)}
											>
												{location.name}
											</span>
										</span>
										{hasNumber ? (
											<span className="inline-flex min-w-7 items-center justify-center rounded-md bg-primary/15 px-2 py-0.5 font-mono text-sm font-bold text-primary tabular-nums">
												{location.value}
											</span>
										) : (
											<span className="inline-flex items-center rounded-md bg-pink-500/15 px-2 py-0.5 text-xs font-semibold text-pink-700 dark:text-pink-300">
												Cylinder
											</span>
										)}
									</li>
								)
							})}
						</ul>
					) : (
						<p className="text-center text-sm text-muted-foreground">
							Pick both valve locations to calculate the pressure settings.
						</p>
					)}
				</SolverResult>
			</CardContent>
		</SolverCard>
	)
}
