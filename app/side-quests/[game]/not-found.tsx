"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function SideQuestsGameNotFound() {
  const { game } = useParams()
  const items: { href: string, text: string }[] = [
    { href: `/side-quests`, text: 'Side Quests' },
    { href: `/side-quests/${game}`, text: capatilize(String(game)) }
  ]

  return <NotFoundContent items={ items } resource="Game" param={ String(game) } />
}
