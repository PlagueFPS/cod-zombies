"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function MapNotFound() {
  const { game, slug } = useParams()
  const items: { href: string, title: string }[] = [
    { href: `/${game}`, title: capatilize(String(game)) },
    { href: `/${game}/${slug}`, title: capatilize(String(slug)) }
  ]
  let resource = "Map"

  if (game === 'side-quests') resource = 'Side Quest'

  return (
    <>
      <NotFoundContent items={ items } resource={ resource } param={ String(slug) } />
    </>
  )
}
