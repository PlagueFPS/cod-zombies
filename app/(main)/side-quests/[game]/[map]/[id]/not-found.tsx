"use client"
import type { Route } from "next"
import type { Link } from "@/components/breadcrumbs/breadcrumbs"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"
import { decodeParams } from "@/utils/validation-schemas"

export default function QuestNotFound() {
	const params = useParams()
	const { game, map, id } = decodeParams(params)
	const paramItems = Option.gen(function* () {
		const gameParam = yield* game
		const mapParam = yield* map
		const idParam = yield* id

		const items: Link<string>[] = [
			{ href: `/side-quests?game=${gameParam}`, title: capitalize(gameParam) },
			{ href: `/side-quests?game=${gameParam}&map=${mapParam}`, title: capitalize(mapParam) },
			{
				href: `/side-quests/${gameParam}/${mapParam}/${idParam}` as Route,
				title: capitalize(idParam),
			},
		]

		return items
	})

	const items: Link<string>[] = [
		{ href: `/side-quests`, title: "Side Quests" },
		...Option.match(paramItems, {
			onNone: () => [],
			onSome: items => items,
		}),
	]

	return <NotFoundContent items={items} resource="Side Quest" param={Option.getOrUndefined(id)} />
}
