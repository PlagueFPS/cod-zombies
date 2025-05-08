import { Skeleton } from "@/components/ui/skeleton";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import BreadcrumbLoader from "@/components/Loaders/BreadcrumbLoader";
import { Button } from "@/components/ui/button";
import { Clock, Menu, Share2 } from "lucide-react";
import ImageLoader from "@/components/Loaders/ImageLoader";
import QuestBreadcrumbsLoader from "./QuestBreadcrumbsLoader";
import TableOfContentsLoader from "./TableOfContentsLoader";

interface IQuestPageLoader {
  mainQuest: boolean
}

export default function QuestPageLoader({ mainQuest }: IQuestPageLoader) {
  return (
    // Container loaders
    <div className="flex justify-center w-full -mt-10 xl:mt-0">
      <div className="flex flex-col justify-start items-center max-w-[1920px] mx-auto xl:mx-4 w-full">
        <div className="flex flex-col-reverse xl:flex-row grow w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full mt-16 xl:mt-8">
            
            {/* Image and breadcrumb loaders */}
              <div className="relative z-20 max-w-7xl h-[calc(50vw)] w-full xl:h-180 mx-auto">
                <ImageLoader className="h-full w-full border" />
                <div className="absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex justify-center w-full">
                  { mainQuest ? <BreadcrumbLoader /> : <QuestBreadcrumbsLoader /> }
                </div>
              </div>

              {/* Map content loader */}
              <div className='relative z-20 flex flex-col justify-center gap-2 md:gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-6 max-w-7xl mx-auto border-b-2'>
                <div className="flex flex-col-reverse md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-0">
                  <Skeleton className="h-6 sm:h-7 md:h-9 lg:h-12 w-1/3 pb-2" />
                  <div className="flex items-center justify-center gap-4 w-fit">
                    <Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
                    <Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 xl:flex-row xl:pb-0">
                    <Skeleton className="h-5 w-52" />
                    <span className="hidden md:inline">&bull;</span>
                    <div className="flex gap-1 items-center text-muted-foreground">
                      <Clock className="size-4" />
                      <Skeleton className="h-5 w-4" />
                      min read
                    </div>
                  </div>
                  <Button 
                    variant={"ghost"} 
                    size={"icon"} 
                    disabled 
                    aria-disabled
                    className="ml-auto text-muted-foreground mb-2 md:mb-0 animate-pulse" 
                  >
                    <span className="sr-only">Share</span>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Skeleton className="h-[150dvh] w-full max-w-[80ch] mx-auto dark:bg-accent/50" />
            </div>
          </div>
          <TableOfContentsLoader />
        </div>
      </div>
    </div>
  )
}
