"use client"
import type { Route } from "next"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"

export default function MapNotFound() {
	const { game, slug } = useParams()
	const items: { href: Route; title: string }[] = [
		{ href: `/?${game}`, title: capitalize(String(game)) },
		{ href: `/${game}/${slug}` as Route, title: capitalize(String(slug)) },
	]
	let resource = "Map"

	if (game === "side-quests") resource = "Side Quest"

	return <NotFoundContent items={items} resource={resource} param={String(slug)} />
}
