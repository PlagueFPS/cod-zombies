"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"

import { Option } from "effect"
import { useParams } from "next/navigation"

import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"
import { decodeRelicParams } from "@/utils/validation-schemas"

export default function RelicNotFound() {
	const params = useParams()
	const { id, game } = decodeRelicParams(params)
	const items: Link<string>[] = [
		{ href: `/relics`, title: "Relics" },
		{
			href: "/relics",
			title: Option.isSome(game) ? capitalize(game.value) : "Game Not Found",
		},
		{
			href:
				Option.isSome(id) && Option.isSome(game)
					? (`/relics/${game.value}/${id.value}` as Route)
					: "/relics",
			title: Option.isSome(id) ? capitalize(id.value) : "Relic Not Found",
		},
	]

	return <NotFoundContent items={items} resource="Relic" param={Option.getOrUndefined(id)} />
}
