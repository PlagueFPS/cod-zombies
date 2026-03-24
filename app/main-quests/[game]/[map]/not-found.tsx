"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"
import { decodeParams } from "@/utils/validation-schemas"

export default function MainQuestNotFound() {
	const params = useParams()
	const { game, map } = decodeParams(params)
	const items: Link<string>[] = [
		{
			href: `/main-quests`,
			title: "Main Quests",
		},
		{
			href: `/main-quests?game=${game.valueOrUndefined}`,
			title: Option.match(game, {
				onNone: () => "Game Not Found",
				onSome: game => capitalize(game),
			}),
		},
		{
			href: `/main-quests/${game.valueOrUndefined}/${map.valueOrUndefined}` as Route,
			title: Option.match(map, {
				onNone: () => "Map Not Found",
				onSome: map => capitalize(map),
			}),
		},
	]

	return <NotFoundContent items={items} resource="Main Quest" param={map.valueOrUndefined} />
}
