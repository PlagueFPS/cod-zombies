import { cn } from "@/lib/utils"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb"
import NavLink from "../NavLink/NavLink"
import { Slash } from "lucide-react"
import { Fragment } from "react"
interface Link {
  href: string
  title: string
}

interface BreadcrumbsProps {
  links: Link[]
  className?: string
}

export default function Breadcrumbs({ links, className }: BreadcrumbsProps) {
  return (
    <Breadcrumb className={cn('mr-auto', className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink href='/'>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        { links.map(link => (
          <Fragment key={ `${link.title}_${link.href}` }>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ link.href }>{ link.title }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
