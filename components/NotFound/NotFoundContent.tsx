import NotFoundBreadcrumbs from "@/components/NotFound/NotFoundBreadcrumbs"
import { capatilize } from "@/utils/functions"
import { Button } from "../ui/button"
import { CustomLink } from "../CustomLink/CustomLink"

interface INotFoundContent {
  param?: string
  pathname?: string
  resource: string
  items?: {
    href: string
    title: string
  }[]
}

export default function NotFoundContent({ resource, items, pathname, param }: INotFoundContent) {
  return (
    <div className="container flex flex-col h-full">
      { items && <NotFoundBreadcrumbs items={ items } /> }
      <div className="flex flex-col grow justify-center items-center gap-12 h-3/4">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-gradient dark:dark-text-gradient font-extrabold text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            { resource } could not be found
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            The requested { resource }
            <span className="font-bold text-primary-gradient mx-1">
              { param ? capatilize(param) : pathname ? pathname : null }
            </span>
            does not exist or could not be found
          </p>
        </div>
        <NotFoundButtons items={ items } />
      </div>
    </div>
  )
}

const NotFoundButtons = ({ items }: Omit<INotFoundContent, "param" | "resource">) => {
  const newItems = items ? items.slice(0, -1) : []
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-fit gap-8">
      { newItems.length > 0 ? newItems.map(item => (
        <Button key={ `${item.title}-${item.href}` } variant={"outline"} asChild>
          <CustomLink href={ item.href }>
            View { item.title }
          </CustomLink>
        </Button>
      )) : (
        <>
          <Button variant={"outline"} asChild>
            <CustomLink href='/'>
              View all Main Quests
            </CustomLink>
          </Button>
          <Button variant={"outline"} asChild>
            <CustomLink href='/side-quests'>
              View all Side Quests
            </CustomLink>
          </Button>
        </>
      )}
    </div>
  )
}
