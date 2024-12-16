"use client"
import { useParams } from "next/navigation"
import { capatilize, checkParams } from "@/utils/functions"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"

export default function BreadcrumbLoader() {
  const { category, slug } = useParams()

  return (
    <Breadcrumbs links={[
      { title: capatilize(checkParams(category)), href: `/${category}` },
      { title: capatilize(checkParams(slug)), href: `/${category}/${slug}`, active: true }
    ]} />
  )
}
