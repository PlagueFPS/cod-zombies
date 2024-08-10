import { NotFoundBreadcrumbs, NotFoundButtons, NotFoundDescription } from "@/components/NotFound/ui"

export default function MapNotFound() {
  return (
    <div className="container flex flex-col h-full">
      <NotFoundBreadcrumbs mapPage />
      <div className="flex flex-col flex-grow justify-center items-center gap-8 my-20">
        <h1 className="font-extrabold text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl
        text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">
          Map could not be found
        </h1>
        <NotFoundDescription mapPage />
        <NotFoundButtons mapPage />
      </div>
    </div>
  )
}
