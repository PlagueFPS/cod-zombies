"use client"
import { useParams } from "next/navigation"
import { capitalize } from "@/utils/functions.client"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function QuestBreadcrumbsLoader() {
	const { game, map, slug } = useParams()
	return (
		<Breadcrumbs
			links={[
				{ title: `Side Quests`, href: `/side-quests` },
				{ title: capitalize(String(game)), href: `/side-quests?game=${game}` },
				{ title: capitalize(String(map)), href: `/side-quests?game=${game}&map=${map}` },
				{ title: capitalize(String(slug)), href: `/side-quests/${game}/${map}/${slug}` },
			]}
		/>
	)
}
