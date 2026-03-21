"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"

import { Option } from "effect"
import { useParams } from "next/navigation"

import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"
import { decodeZombieParams } from "@/utils/validation-schemas"

export default function ZombieNotFound() {
	const params = useParams()
	const { id } = decodeZombieParams(params)
	const items: Link<string>[] = [
		{ href: `/bestiary`, title: "Bestiary" },
		{
			href: Option.isSome(id) ? (`/bestiary/${id.value}` as Route) : "/bestiary",
			title: Option.isSome(id) ? capitalize(id.value) : "Zombie Not Found",
		},
	]

	return <NotFoundContent items={items} resource="Zombie" param={Option.getOrUndefined(id)} />
}
