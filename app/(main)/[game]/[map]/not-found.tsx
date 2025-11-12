"use client"
import type { Route } from "next"
import type { Link } from "@/components/breadcrumbs/breadcrumbs"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"
import { decodeParams } from "@/utils/validation-schemas"

export default function MapNotFound() {
	const params = useParams()
	const { game, map } = decodeParams(params)
	const gameItem: Link<string> = Option.match(game, {
		onNone: () => ({
			href: "#",
			title: "Game Not Found",
		}),
		onSome: game => ({
			href: `/?game=${game}`,
			title: capitalize(game),
		}),
	})
	const mapItem: Link<string> = Option.match(map, {
		onNone: () => ({
			href: "#",
			title: "Map Not Found",
		}),
		onSome: map => ({
			href: Option.isSome(game) ? (`/${game.value}/${map}` as Route) : "#",
			title: capitalize(map),
		}),
	})

	let resource = "Map"
	if (Option.getOrNull(game) === "side-quests") resource = "Side Quest"

	return (
		<NotFoundContent
			items={[gameItem, mapItem]}
			resource={resource}
			param={Option.getOrUndefined(map)}
		/>
	)
}
