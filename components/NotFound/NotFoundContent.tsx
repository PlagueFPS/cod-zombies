import NotFoundBreadcrumbs from "@/components/NotFound/NotFoundBreadcrumbs"
import { capatilize } from "@/utils/functions"
import { Button } from "../ui/button"
import Link from "next/link"

interface INotFoundContent {
  param: string
  resource: string
  items: {
    href: string
    title: string
  }[]
}

export default function NotFoundContent({ resource, items, param }: INotFoundContent) {
  return (
    <div className="container flex flex-col h-full">
      <NotFoundBreadcrumbs items={ items } />
      <div className="flex flex-col flex-grow justify-center items-center gap-12 h-[75vh]">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-gradient font-extrabold text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            { resource } could not be found
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            The requested { resource }
            <span className="font-bold text-primary-gradient mx-1">
              { capatilize(param) }
            </span>
            does not exist or could not be found
          </p>
        </div>
        <NotFoundButtons items={ items } resource={ resource } />
      </div>
    </div>
  )
}

const NotFoundButtons = ({ items, resource }: Omit<INotFoundContent, "param">) => {
  const text = resource === 'Quest' ? "Side Quests" : "Main Quests"
  const newItems = items.slice(0, -1)
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-fit gap-8">
      { newItems.length > 0 ? newItems.map(item => (
        <Button variant={"outline"} asChild>
          <Link href={ item.href }>
            View all { item.title } { item.title === "Side Quests" ? null : text }
          </Link>
        </Button>
      )) : (
        <Button variant={"outline"} asChild>
          <Link href='/'>
            View all Main Quests
          </Link>
        </Button>
      )}
    </div>
  )
}
