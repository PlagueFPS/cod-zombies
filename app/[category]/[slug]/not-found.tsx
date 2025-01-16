"use client"
import NotFoundContent from "@/components/NotFound/NotFoundContent"
import { capatilize } from "@/utils/functions"
import { useParams } from "next/navigation"

export default function MapNotFound() {
  const { category, slug } = useParams()
  const items: { href: string, text: string }[] = [
    { href: `/${category}`, text: capatilize(String(category)) },
    { href: `/${category}/${slug}`, text: capatilize(String(slug)) }
  ]

  return <NotFoundContent items={ items } resource="Map" param={ String(slug) } />
}
