"use client"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function QuestNotFound() {
  const { slug } = useParams()
  const items: { href: string, title: string }[] = [
    { href: `/bestiary`, title: 'Bestiary' },
    { href: `/bestiary/${slug}`, title: capatilize(String(slug)) },
  ]

  return <NotFoundContent items={ items } resource="Zombie" param={ String(slug) } />
}
