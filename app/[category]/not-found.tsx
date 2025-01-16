"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function CategoryNotFound() {
  const { category } = useParams()
  const items: { href: string, title: string }[] = [
    { href: `/${category}`, title: capatilize(String(category)) }
  ]

  return (
    <>
      <NotFoundContent items={ items } resource="Game" param={ String(category) } />
    </>
  )
}
