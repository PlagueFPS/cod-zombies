"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"
import { decodeParams } from "@/utils/validation-schemas"

export default function ZombieNotFound() {
	const params = useParams()
	const { id } = decodeParams(params)
	const items: Link<string>[] = [
		{ href: `/bestiary`, title: "Bestiary" },
		{
			href: `/bestiary/${id.valueOrUndefined}` as Route,
			title: Option.match(id, {
				onNone: () => "Zombie Not Found",
				onSome: id => capitalize(id),
			}),
		},
	]

	return <NotFoundContent items={items} resource="Zombie" param={id.valueOrUndefined} />
}
