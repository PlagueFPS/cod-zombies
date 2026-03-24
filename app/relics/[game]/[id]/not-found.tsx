"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"
import { decodeParams } from "@/utils/validation-schemas"

export default function RelicNotFound() {
	const params = useParams()
	const { id, game } = decodeParams(params)
	const items: Link<string>[] = [
		{ href: `/relics`, title: "Relics" },
		{
			href: `/relics`,
			title: Option.match(game, {
				onNone: () => "Game Not Found",
				onSome: game => capitalize(game),
			}),
		},
		{
			href: `/relics/${game.valueOrUndefined}/${id.valueOrUndefined}` as Route,
			title: Option.match(id, {
				onNone: () => "Relic Not Found",
				onSome: id => capitalize(id),
			}),
		},
	]

	return <NotFoundContent items={items} resource="Relic" param={id.valueOrUndefined} />
}
