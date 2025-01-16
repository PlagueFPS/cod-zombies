import { Skeleton } from "@/components/ui/skeleton";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Menu, Share2 } from "lucide-react";
import ImageLoader from "@/components/Loaders/ImageLoader";
import QuestBreadcrumbsLoader from "./QuestBreadcrumbsLoader";

export default function QuestPageLoader() {
  return (
    // Container loaders
    <div className="flex justify-center w-full -mt-10 xl:mt-0">
      <div className="flex flex-col justify-start items-center max-w-[1920px] mx-auto xl:mx-4 w-full">
        <div className="flex flex-col-reverse xl:flex-row flex-grow w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full mt-16 xl:mt-8">
            
            {/* Image and breadcrumb loaders */}
              <div className="relative z-20 max-w-screen-xl h-[calc(50vw)] w-full xl:h-[720px] mx-auto">
                <ImageLoader className="h-full w-full border" />
                <div className="absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex justify-center w-full">
                  <QuestBreadcrumbsLoader />
                </div>
              </div>

              {/* Map content loader */}
              <div className='relative z-20 flex flex-col mx-auto justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-12 w-full max-w-screen-xl border-b-2'>
                <div className="flex w-full justify-between items-center">
                  <Skeleton className="h-6 sm:h-7 md:h-9 lg:h-12 w-1/3" />
                  <div className="flex items-center justify-center gap-4 w-fit">
                    <Skeleton className="h-6 w-24 bg-orange-700 border-primary border" />
                    <Skeleton className="h-6 w-24 bg-orange-700 border-primary border" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-4 md:gap-0 md:pb-0 md:justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-52" />
                  </div>
                  <div className="flex items-center justify-center">
                    <Button variant={"outline"} className="gap-2 animate-pulse" disabled aria-disabled>
                      <span>Share</span>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-screen" />
            </div>
          </div>

          {/* Table of Contents loader */}
          <div className="hidden xl:block sticky top-4 ml-4 flex-shrink-0 w-[340px] h-fit border rounded-lg px-6">
            <div className="flex flex-col gap-4 border-b pb-3">
              <div className="font-bold mx-auto mt-4">On this page</div>
              <div className="flex flex-col gap-3 h-[70vh]">
                { Array.from({ length: 16 }, (_, i) => (
                  <Skeleton key={ `table-of-contents-item-${i}` } className="w-3/4 h-5" />
                ))}
              </div>
            </div>
            <BackToTopButton type="button" size={"sm"} variant={"outline"} className="my-4" />
          </div>

          {/* Mobile table of contents loader */}
          <div className="sticky xl:hidden top-20 z-30 p-3 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
            <div className="flex gap-2 items-center">
                <Menu className="h-5 w-5 animate-pulse" />
                <div className="font-bold">On this page</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
