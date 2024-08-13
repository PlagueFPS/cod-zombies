import { NotFoundBreadcrumbs, NotFoundButtons, NotFoundDescription } from '@/components/ui/notFound'

export default function CategoryNotFound() {
  return (
    <div className="container flex flex-col h-full">
    <NotFoundBreadcrumbs categoryPage />
    <div className="flex flex-col flex-grow justify-center items-center gap-12 h-[75vh]">
      <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className="font-extrabold text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl 
        text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2">
          Category could not be found
        </h1>
        <NotFoundDescription categoryPage />
      </div>
      <NotFoundButtons categoryPage />
    </div>
  </div>
  )
}
