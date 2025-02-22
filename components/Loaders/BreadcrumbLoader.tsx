"use client"
import { useParams } from "next/navigation"
import { capatilize } from "@/utils/functions"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"

export default function BreadcrumbLoader() {
  const { game, slug } = useParams()

  return (
    <Breadcrumbs links={[
      { title: typeof game === "string" ? capatilize(game) : "", href: `/?game=${game}` },
      { title: typeof slug === "string" ? capatilize(slug) : "", href: `/${game}/${slug}` }
    ]} />
  )
}
