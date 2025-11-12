"use client"
import type { Route } from "next"
import type { Link } from "@/components/breadcrumbs/breadcrumbs"
import { Option } from "effect"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"
import { decodeParams } from "@/utils/validation-schemas"

export default function ZombieNotFound() {
	const params = useParams()
	const { id } = decodeParams(params)
	const zombieItem: Link<string> = Option.match(id, {
		onNone: () => ({
			href: "/bestiary",
			title: "Zombie Not Found",
		}),
		onSome: id => ({
			href: `/bestiary/${id}` as Route,
			title: capitalize(id),
		}),
	})

	const items: Link<string>[] = [{ href: `/bestiary`, title: "Bestiary" }, zombieItem]
	return <NotFoundContent items={items} resource="Zombie" param={Option.getOrUndefined(id)} />
}
