import { cn } from "cn"
import { Array as Arr, Predicate } from "effect"
import { useState } from "react"
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

	const handleGreenValueChange = (value: string | null) => {
		if (!(Predicate.isNotNullish(value) && Predicate.isTruthy(value))) return
		setValues(prevState => ({ ...prevState, firstValue: value }))
	}

	const handlePinkValueChange = (value: string | null) => {
		if (!(Predicate.isNotNullish(value) && Predicate.isTruthy(value))) return
		setValues(prevState => ({ ...prevState, secondValue: value }))
	}

	return (
		<section className="flex flex-col items-center justify-center gap-8">
			<div className="flex w-full items-center justify-center gap-8 md:gap-16">
				<Select value={values.firstValue} onValueChange={handleGreenValueChange}>
					<SelectTrigger className="w-full text-green-700 dark:text-green-500">
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
				<Select value={values.secondValue} onValueChange={handlePinkValueChange}>
					<SelectTrigger className="w-full text-pink-700 dark:text-pink-500">
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
			<ul
				className={cn("hidden w-full rounded bg-accent p-2 dark:bg-accent/20", {
					"block animate-fade-in": currentLocations.length > 0,
				})}
			>
				{Arr.map(currentLocations, location => (
					<li key={`valve-${slugify(location.name)}`} className="list-disc">
						{Predicate.isNotNullish(location.value) && Predicate.isTruthy(location.value) ? (
							<>
								Set{" "}
								<strong
									className={cn({
										"text-green-700 dark:text-green-400": location.name === values.firstValue,
									})}
								>
									{location.name}
								</strong>{" "}
								valve to <strong>{location.value}</strong>
							</>
						) : (
							<>
								<strong className="text-pink-700 dark:text-pink-400">{location.name}</strong> valve
								has your pink code cylinder
							</>
						)}
					</li>
				))}
			</ul>
		</section>
	)
}
