"use client"
import type { Link } from "@/components/client/breadcrumbs"
import type { Route } from "next"

import { useParams } from "next/navigation"

import NotFoundContent from "@/components/server/not-found-content"
import { capitalize } from "@/utils/shared-functions"

export default function QuestNotFound() {
	const { game, map, id } = useParams()
	const items: Link<string>[] = [
		{ href: `/side-quests`, title: "Side Quests" },
		{ href: `/side-quests?game=${game}`, title: capitalize(String(game)) },
		{ href: `/side-quests?game=${game}&map=${map}`, title: capitalize(String(map)) },
		{ href: `/side-quests/${game}/${map}/${id}` as Route, title: capitalize(String(id)) },
	]

	return <NotFoundContent items={items} resource="Side Quest" param={String(id)} />
}
