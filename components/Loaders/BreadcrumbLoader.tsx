"use client"
import { useParams } from "next/navigation"
import { capatilize } from "@/utils/functions"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"

export default function BreadcrumbLoader() {
  const { category, slug } = useParams()

  return (
    <Breadcrumbs links={[
      { title: typeof category === "string" ? capatilize(category) : "", href: `/${category}` },
      { title: typeof slug === "string" ? capatilize(slug) : "", href: `/${category}/${slug}` }
    ]} />
  )
}
