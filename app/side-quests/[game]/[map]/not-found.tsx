"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function SideQuestsMapNotFound() {
  const { game, map } = useParams()
  const items: { href: string, text: string }[] = [
    { href: `/side-quests`, text: 'Side Quests' },
    { href: `/side-quests/${game}`, text: capatilize(String(game)) },
    { href: `/side-quests/${game}/${map}`, text: capatilize(String(map)) },
  ]

  return <NotFoundContent items={ items } resource="Map" param={ String(map) } />
}
