"use client"
import { useParams } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb"
import NavLink from "../NavLink/NavLink"
import { checkParams } from "@/utils/functions"

export default function BreadcrumbLoader() {
  const { category, slug } = useParams()

  return (
    <Breadcrumb className='mr-auto'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink exact href='/'>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink exact href={ `/${category}` }>{ checkParams(category) }</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink exact active href={ `/${category}/${slug}` } className='font-medium'>{ checkParams(slug) }</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
