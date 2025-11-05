"use client"
import type { Route } from "next"
import type { Link } from "@/components/breadcrumbs/breadcrumbs"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"
import { decodeMainQuestParams } from "@/utils/validation-schemas"

export default function MapNotFound() {
	const params = useParams()
	const { game, map } = decodeMainQuestParams(params)
	const items: Link<string>[] = [
		{
			href: Option.isSome(game) ? `/?game=${game.value}` : "/",
			title: Option.getOrNull(game) ?? "Game Not Found",
		},
		{
			href: Option.isSome(game) && Option.isSome(map) ? (`/${game.value}/${map.value}` as Route) : "/",
			title: Option.isSome(map) ? capitalize(map.value) : "Map Not Found",
		},
	]
	let resource = "Map"

	if (Option.getOrNull(game) === "side-quests") resource = "Side Quest"

	return <NotFoundContent items={items} resource={resource} param={Option.getOrUndefined(map)} />
}
