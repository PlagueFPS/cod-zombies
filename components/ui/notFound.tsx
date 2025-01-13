"use client"
import { useParams, usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb"
import NavLink from "../NavLink/NavLink"
import { capatilize, checkParams } from "@/utils/functions"
import { Button } from "../ui/button"
import Link from "next/link"

type NotFoundBreadcrumbsProps = 
  | { categoryPage: true; mapPage?: never }
  | { mapPage: true; categoryPage?: never }

export function NotFoundBreadcrumbs({ categoryPage, mapPage }: NotFoundBreadcrumbsProps) {
  const { category, slug } = useParams()

  return (
    <Breadcrumb className='mr-auto ml-4'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink href='/'>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        { categoryPage ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink href={ `/${category}` }>Category Not Found</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/${category}` }>{ checkParams(category) }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        }
        { mapPage &&
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/${category}/${slug}` } className='font-medium'>Map Not Found</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        }
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function NotFoundButtons({ categoryPage, mapPage }: NotFoundBreadcrumbsProps) {
  const { category } = useParams()
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-fit gap-8">
      { mapPage ? (
        <>
          <Button asChild variant="outline">
            <Link href={`/${category}`}>
              View { checkParams(category) } Maps
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              View all Featured Maps
            </Link>
          </Button>
        </>
      ) : categoryPage ? (
        <>
          <Button asChild variant="outline">
            <Link href="/">
              View all Categories
            </Link>
          </Button>
        </>
      ) : null}
    </div>
  )
}

export function NotFoundDescription({ categoryPage, mapPage }: NotFoundBreadcrumbsProps) {
  const { category, slug } = useParams()
  const pathname = usePathname()

  return (
    <p className="text-sm md:text-base lg:text-lg">
      The requested { categoryPage ? "category" : mapPage ? "map" : "content" }
      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-primary mx-1">
        { categoryPage ? checkParams(category) : mapPage ? checkParams(slug) : capatilize(pathname) }
      </span>
      does not exist or could not be found
    </p>
  )
}