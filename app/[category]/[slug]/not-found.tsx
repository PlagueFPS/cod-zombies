"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function MapNotFound() {
  const { category, slug } = useParams()
  const items: { href: string, title: string }[] = [
    { href: `/${category}`, title: capatilize(String(category)) },
    { href: `/${category}/${slug}`, title: capatilize(String(slug)) }
  ]

  return (
    <>
      <NotFoundContent items={ items } resource="Map" param={ String(slug) } />
    </>
  )
}
