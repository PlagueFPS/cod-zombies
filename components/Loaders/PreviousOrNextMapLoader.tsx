import { ChevronLeft, ChevronRight } from "lucide-react"
import ImageLoader from "./ImageLoader"
import { Skeleton } from "../ui/skeleton"


export default function PreviousOrNextMapLoader() {
  return (
    <>
    {/* Previous Map Card */}
      <div className="border-2 rounded-lg w-[39rem] max-w-sm xl:max-w-full overflow-hidden">
      <div className='relative h-full flex flex-col xl:flex-row-reverse items-center p-2 overflow-hidden'>
        <div className="relative z-20 max-w-sm w-full overflow-hidden rounded-lg">
          <div className="relative m-0 w-full h-auto">
            <div className="flex justify-center items-center w-full h-40">
              <ImageLoader className="h-full" />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex flex-col justify-center w-full gap-2 px-4 pt-4 mb-auto">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="flex-shrink-0 w-full h-4" />
          <Skeleton className="flex-shrink-0 w-full h-4" />
          <Skeleton className="flex-shrink-0 w-full h-4" />
          <div className='flex items-center mt-4 pb-4 transition-all xl:-ml-2'>
            <ChevronLeft />
            <span>Previous Map</span>
          </div>
        </div>
      </div>
    </div>

{/* Next Map Card */}
      <div className="border-2 rounded-lg w-[39rem] max-w-sm xl:max-w-full overflow-hidden">
        <div className='relative h-full flex flex-col xl:flex-row items-center p-2 overflow-hidden'>
          <div className="relative z-20 max-w-sm w-full overflow-hidden rounded-lg">
            <div className="relative m-0 w-full h-auto">
              <div className="flex justify-center items-center w-full h-40">
                <ImageLoader className="h-full" />
              </div>
            </div>
          </div>
          <div className="relative z-20 flex flex-col justify-center w-full gap-2 px-4 pt-4 mb-auto">
            <Skeleton className="w-1/2 h-6" />
            <Skeleton className="flex-shrink-0 w-full h-4" />
            <Skeleton className="flex-shrink-0 w-full h-4" />
            <Skeleton className="flex-shrink-0 w-full h-4" />
            <div className='flex items-center mt-4 pb-4 transition-all xl:-mr-2'>
              <span className='ml-auto'>Next Map</span>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
