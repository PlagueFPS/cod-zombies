import { NotFoundBreadcrumbs, NotFoundButtons, NotFoundDescription } from "@/components/ui/notFound"

export default function QuestNotFound() {
  return (
    <div className="container flex flex-col h-full">
      <NotFoundBreadcrumbs questPage />
      <div className="flex flex-col flex-grow justify-center items-center gap-8 h-[75vh]">
        <h1 className="font-extrabold text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl
        text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">
          Side Quest could not be found
        </h1>
        <NotFoundDescription questPage />
        <NotFoundButtons questPage />
      </div>
    </div>
  )
}
