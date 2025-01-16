"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function CategoryNotFound() {
  const { category } = useParams()
  const items: { href: string, text: string }[] = [
    { href: `/${category}`, text: capatilize(String(category)) }
  ]

  return <NotFoundContent items={ items } resource="Game" param={ String(category) } />
}
