"use client"
import { useMemo, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ValveRoutes from "@/data/gk-valves.json"
import { cn } from "@/lib/utils"
import { slugify } from "@/utils/functions"

const locations = ["Armory", "Infirmary", "Department Store", "Supply Depot", "Dragon Command", "Tank Factory"]

type valveRoutes = typeof ValveRoutes
interface Location {
	name: string
	value: number | null
}

export default function GKValve() {
	const [values, setValues] = useState({
		firstValue: "",
		secondValue: "",
	})
	const currentLocations = useMemo(() => {
		if (values.firstValue && values.secondValue) {
			const searchString = `${values.firstValue} to ${values.secondValue}`
			const locations: Location[] = []

			for (const key in ValveRoutes) {
				if (searchString === key) {
					const route = ValveRoutes[key as keyof valveRoutes]
					const entries = Object.entries(route)

					entries.forEach(entry => {
						const [location, value] = entry
						locations.push({
							name: location,
							value: value,
						})
					})
				}
			}

			return locations
		}

		return []
	}, [values])

	return (
		<section className="flex flex-col items-center justify-center gap-8">
			<div className="flex w-full items-center justify-center gap-8 md:gap-16">
				<Select onValueChange={value => setValues(prevState => ({ ...prevState, firstValue: value }))}>
					<SelectTrigger className="w-full text-green-700 dark:text-green-500">
						<SelectValue placeholder="Select Green Light Location" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{locations.map(location => {
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
				<Select onValueChange={value => setValues(prevState => ({ ...prevState, secondValue: value }))}>
					<SelectTrigger className="w-full text-pink-700 dark:text-pink-500">
						<SelectValue placeholder="Select Pink Cylinder Location" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{locations.map(location => {
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
				{currentLocations.map(location => (
					<li key={`valve-${slugify(location.name)}`} className="list-disc">
						{location.value ? (
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
								<strong className="text-pink-700 dark:text-pink-400">{location.name}</strong> valve has your pink code
								cylinder
							</>
						)}
					</li>
				))}
			</ul>
		</section>
	)
}
