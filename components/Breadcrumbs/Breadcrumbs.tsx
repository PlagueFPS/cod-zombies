"use client"
import NavLink from "../NavLink/NavLink"
import { Slash } from "lucide-react"
import { Fragment } from "react"
import { cn } from "@/lib/utils"
import { 
  Breadcrumb, 
  BreadcrumbEllipsis, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "../ui/breadcrumb"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/useMediaQuery"
interface Link {
  href: string
  title: string
}

interface BreadcrumbsProps {
  links: Link[]
  className?: string
}

export default function Breadcrumbs({ links, className }: BreadcrumbsProps) {
  const isDesktop = useMediaQuery(640)
  const showEllipsis = links.length >= 4 && !isDesktop
  const menuLinks = showEllipsis ? links.slice(0, -1) : []

  return (
    <Breadcrumb className={cn('mr-auto', className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink href='/'>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        { links.map((link, index) => {
          // For the links cut-off by the ellipsis
          if (showEllipsis && index === 1) {
            return (
              <Fragment key="links-ellipsis">
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <CustomEllipsis menuLinks={ menuLinks } />
                </BreadcrumbItem>
              </Fragment>
            )
          }

          // skip rendering links cut-off by the ellipsis
          if (showEllipsis && index < links.length - 1) return null

          // For the last item in the array, does not matter if showEllipsis is true/false here
          if (index === links.length - 1) {
            return (
              <Fragment key={ `${link.title}-${link.href}` }>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink href={ link.href }>
                      { link.title }
                    </NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            )
          }
          
          // For all items when showEllipsis is false
          return (
            <Fragment key={`${link.title}-${link.href}`}>
              <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink href={ link.href }>
                      { link.title }
                    </NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const CustomEllipsis = ({ menuLinks }: { menuLinks: Link[] }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <BreadcrumbEllipsis className="size-4" />
        <span className="sr-only">Toggle menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        { menuLinks.map(link => (
          <DropdownMenuItem key={ `${link.href}-${link.title}` } asChild>
            <NavLink href={ link.href }>
              { link.title }
            </NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
