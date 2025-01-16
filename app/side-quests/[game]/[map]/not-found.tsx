"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function SideQuestsMapNotFound() {
  const { game, map } = useParams()
  const items: { href: string, title: string }[] = [
    { href: `/side-quests`, title: 'Side Quests' },
    { href: `/side-quests/${game}`, title: capatilize(String(game)) },
    { href: `/side-quests/${game}/${map}`, title: capatilize(String(map)) },
  ]

  return (
    <>
      <NotFoundContent items={ items } resource="Map" param={ String(map) } />
    </>
  )
}
