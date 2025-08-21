"use client"
import type { Route } from "next"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"

export default function QuestNotFound() {
	const { game, map, slug } = useParams()
	const items: { href: Route; title: string }[] = [
		{ href: `/side-quests`, title: "Side Quests" },
		{ href: `/side-quests?game=${game}`, title: capitalize(String(game)) },
		{ href: `/side-quests?game=${game}&map=${map}`, title: capitalize(String(map)) },
		{ href: `/side-quests/${game}/${map}/${slug}` as Route, title: capitalize(String(slug)) },
	]

	return <NotFoundContent items={items} resource="Side Quest" param={String(slug)} />
}
