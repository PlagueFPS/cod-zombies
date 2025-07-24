"use client"
import { useState } from "react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import ValveRoutes from "@/data/gk-valves.json"
import { cn } from "@/lib/utils"
import { slugify } from "@/utils/functions.client"

const LOCATIONS = [
	"Armory",
	"Infirmary",
	"Department Store",
	"Supply Depot",
	"Dragon Command",
	"Tank Factory",
] as const

type valveRoutes = typeof ValveRoutes
interface Location {
	name: string
	value: number | null
}

const getCurrentLocations = (firstValue: string, secondValue: string) => {
	if (firstValue && secondValue) {
		const searchString = `${firstValue} to ${secondValue}`
		const locations: Location[] = []

		for (const key in ValveRoutes) {
			if (searchString === key) {
				const route = ValveRoutes[key as keyof valveRoutes]
				Object.entries(route).forEach(([location, value]) => {
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
}

export default function GKValve() {
	const [values, setValues] = useState({
		firstValue: "",
		secondValue: "",
	})
	const currentLocations = getCurrentLocations(values.firstValue, values.secondValue)

	return (
		<section className="flex flex-col items-center justify-center gap-8">
			<div className="flex w-full items-center justify-center gap-8 md:gap-16">
				<Select
					onValueChange={value => setValues(prevState => ({ ...prevState, firstValue: value }))}
				>
					<SelectTrigger className="w-full text-green-700 dark:text-green-500">
						<SelectValue placeholder="Select Green Light Location" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{LOCATIONS.map(location => {
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
				<Select
					onValueChange={value => setValues(prevState => ({ ...prevState, secondValue: value }))}
				>
					<SelectTrigger className="w-full text-pink-700 dark:text-pink-500">
						<SelectValue placeholder="Select Pink Cylinder Location" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{LOCATIONS.map(location => {
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
