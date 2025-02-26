"use client"
import { useParams } from "next/navigation"
import { capatilize, TypeGuards } from "@/utils/functions"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"

export default function BreadcrumbLoader() {
  const { game, slug } = useParams()

  return (
    <Breadcrumbs links={[
      { title: TypeGuards.isString(game) ? capatilize(game) : "", href: `/?game=${game}` },
      { title: TypeGuards.isString(slug) ? capatilize(slug) : "", href: `/${game}/${slug}` }
    ]} />
  )
}
