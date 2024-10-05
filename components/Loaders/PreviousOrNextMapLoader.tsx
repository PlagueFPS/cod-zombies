import { ChevronLeft, ChevronRight } from "lucide-react"


export default function PreviousOrNextMapLoader() {
  return (
    <>
    {/* Previous Map Card */}
      <div className="border-2 rounded-lg w-[24rem] xl:w-[36rem] overflow-hidden">
      <div className='relative h-full flex flex-col xl:flex-row-reverse items-center p-2 overflow-hidden'>
        <div className="relative z-20 max-w-sm w-full overflow-hidden rounded-lg">
          <div className="relative m-0 w-full h-auto">
            <div className="flex justify-center items-center w-full h-40">
              <div className="absolute top-0 bottom-0 right-0 left-0 h-auto flex justify-center items-center border w-full rounded-lg">
                <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex flex-col justify-center w-full gap-2 px-4 pt-4 mb-auto">
          <div className="w-1/2 bg-accent rounded-lg animate-pulse h-6" />
          <div className="flex-shrink-0 bg-secondary w-full h-16 rounded-lg animate-pulse" />
          <div className='flex items-center mt-4 pb-4 transition-all xl:-ml-2'>
            <ChevronLeft />
            <span>Previous Map</span>
          </div>
        </div>
      </div>
    </div>

{/* Next Map Card */}
      <div className="border-2 rounded-lg w-[24rem] xl:w-[36rem] overflow-hidden">
        <div className='relative h-full flex flex-col xl:flex-row items-center p-2 overflow-hidden'>
          <div className="relative z-20 max-w-sm w-full overflow-hidden rounded-lg">
            <div className="relative m-0 w-full h-auto">
              <div className="flex justify-center items-center w-full h-40">
                <div className="absolute top-0 bottom-0 right-0 left-0 h-auto flex justify-center items-center border w-full rounded-lg">
                  <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-20 flex flex-col justify-center w-full gap-2 px-4 pt-4 mb-auto">
            <div className="w-1/2 bg-accent rounded-lg animate-pulse h-6" />
            <div className="flex-shrink-0 bg-secondary w-full h-16 rounded-lg animate-pulse" />
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
