import NotFoundBreadcrumbs from "@/components/NotFound/NotFoundBreadcrumbs"
import { capatilize } from "@/utils/functions"

interface INotFoundContent {
  param: string
  resource: string
  items: {
    href: string
    text: string
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
      </div>
    </div>
  )
}
