"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function QuestNotFound() {
  const { game, map, slug } = useParams()
  const items: { href: string, title: string }[] = [
    { href: `/side-quests`, title: 'Side Quests' },
    { href: `/side-quests/${game}`, title: capatilize(String(game)) },
    { href: `/side-quests/${game}/${map}`, title: capatilize(String(map)) },
    { href: `/side-quests/${game}/${map}/${slug}`, title: capatilize(String(slug))}
  ]

  return <NotFoundContent items={ items } resource="Quest" param={ String(slug) } />
}
