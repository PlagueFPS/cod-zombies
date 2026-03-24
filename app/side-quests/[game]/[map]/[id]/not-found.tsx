"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"
import { decodeParams } from "@/utils/validation-schemas"

export default function SideQuestNotFound() {
	const params = useParams()
	const { game, map, id } = decodeParams(params)

	const items: Link<string>[] = [
		{
			href: `/side-quests`,
			title: "Side Quests",
		},
		{
			href: `/side-quests?game=${game.valueOrUndefined}`,
			title: Option.match(game, {
				onNone: () => "Game Not Found",
				onSome: game => capitalize(game),
			}),
		},
		{
			href: `/side-quests?game=${game.valueOrUndefined}&map=${map.valueOrUndefined}`,
			title: Option.match(map, {
				onNone: () => "Map Not Found",
				onSome: map => capitalize(map),
			}),
		},
		{
			href: `/side-quests/${game.valueOrUndefined}/${map.valueOrUndefined}/${id.valueOrUndefined}` as Route,
			title: Option.match(id, {
				onNone: () => "Side Quest Not Found",
				onSome: id => capitalize(id),
			}),
		},
	]

	return <NotFoundContent items={items} resource="Side Quest" param={id.valueOrUndefined} />
}
