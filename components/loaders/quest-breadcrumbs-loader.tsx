"use client"
import { useParams } from "next/navigation"
import { capatilize } from "@/utils/functions"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function QuestBreadcrumbsLoader() {
	const { game, map, slug } = useParams()
	return (
		<Breadcrumbs
			links={[
				{ title: `Side Quests`, href: `/side-quests` },
				{ title: capatilize(String(game)), href: `/side-quests?game=${game}` },
				{ title: capatilize(String(map)), href: `/side-quests?game=${game}&map=${map}` },
				{ title: capatilize(String(slug)), href: `/side-quests/${game}/${map}/${slug}` },
			]}
		/>
	)
}
