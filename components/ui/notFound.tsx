"use client"
import { useParams, usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb"
import NavLink from "../NavLink/NavLink"
import { capatilize } from "@/utils/functions"
import { Button } from "../ui/button"
import Link from "next/link"

type NotFoundBreadcrumbsProps = 
  | { categoryPage: true; mapPage?: never; questPage?: never }
  | { mapPage: true; categoryPage?: never; questPage?: never }
  | { questPage: true; categoryPage?: never; mapPage?: never }

export function NotFoundBreadcrumbs({ categoryPage, mapPage, questPage }: NotFoundBreadcrumbsProps) {
  const params = useParams()
  
  return (
    <Breadcrumb className='mr-auto ml-4'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink href='/'>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        { categoryPage && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink href={ `/${params.category}` }>Category Not Found</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
        }
        { mapPage &&
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/${params.category}` }>{ params.category }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/${params.category}/${params.slug}` } className='font-medium'>Map Not Found</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        }
        { questPage && 
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/side-quests/${params.game}` }>{ params.game }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/side-quests/${params.game}/${params.map}` }>{ params.map }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink href={ `/side-quests/${params.game}/${params.map}/${params.slug}` } className='font-medium'>Side Quest Not Found</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        }
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function NotFoundButtons({ categoryPage, mapPage, questPage }: NotFoundBreadcrumbsProps) {
  const params = useParams()
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-fit gap-8">
      { mapPage ? (
        <>
          <Button asChild variant="outline">
            <Link href={`/${params.category}`}>
              View { params.category } Maps
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
      ) : questPage ? (
        <>
          <Button asChild variant="outline">
            <Link href={`/side-quests/${params.game}/${params.map}`}>
              View { params.map } Side Quests
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/side-quests/${params.game}`}>
              View { params.game } Side Quests
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/side-quests">
              View all Side Quests
            </Link>
          </Button>
        </>
      ) : null}
    </div>
  )
}

export function NotFoundDescription({ categoryPage, mapPage, questPage }: NotFoundBreadcrumbsProps) {
  const params = useParams()
  const pathname = usePathname()

  return (
    <p className="text-sm md:text-base lg:text-lg">
      The requested { categoryPage ? "category" : mapPage ? "map" : questPage ? "side quest" : "content" }
      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-primary mx-1">
        { categoryPage ? params.category : mapPage ? params.slug : pathname }
      </span>
      does not exist or could not be found
    </p>
  )
}