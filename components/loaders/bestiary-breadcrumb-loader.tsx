"use client"
import { useParams } from "next/navigation"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"
import { capatilize, TypeGuards } from "@/utils/functions"

export default function BestiaryBreadcrumbsLoader() {
  const { slug } = useParams()
  return (
    <Breadcrumbs 
      links={[
        { title: `Bestiary`, href: `/bestiary` },
        { title: TypeGuards.isString(slug) ? capatilize(slug) : "", href: `/bestiary/${slug}` }
      ]}
    />
  )
}
