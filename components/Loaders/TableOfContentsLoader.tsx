import React from 'react'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { ChevronDown, Menu } from 'lucide-react'

export default function TableOfContentsLoader() {
  return (
    <>
      <aside className='hidden xl:block sticky top-24 ml-4 z-40 shrink-0 w-85 h-fit border rounded-lg px-6 shadow-md dark:shadow-none'>
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">CURRENT SECTION</h3>
            <Button 
              variant={"ghost"} 
              size={"sm"} 
              disabled
              aria-disabled
              >
              <ChevronDown className="size-4" />
            </Button>
          </div>
          <div>
            <Button
              variant={"ghost"}
              className="w-full justify-start font-medium rounded-sm bg-accent dark:bg-accent/50"
              disabled
              aria-disabled
              >
                { "Introduction" }
            </Button>
          </div>
        </div>
        <div className="mt-4 py-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Guide progress</span>
            <span className="text-xs font-medium">{ 0 }%</span>
          </div>
          <Progress value={ 0 } className="h-1" />
        </div>
      </aside>
      <MobileTableOfContentsLoader />
    </>
  )
}

const MobileTableOfContentsLoader = () => {
  return (
    <div className="sticky xl:hidden top-16 z-30 p-3 border-b bg-background/90 backdrop-blur-sm supports-backdrop-filter:bg-background/60 w-full">
      <div className="flex gap-2 items-center">
          <Menu className="h-5 w-5 animate-pulse" />
          <h3 className="font-bold">Introduction</h3>
      </div>
    </div>
  )
}
