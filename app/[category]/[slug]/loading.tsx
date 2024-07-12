import { Button } from "@/components/ui/button";

export default function MapPageLoader() {
  return (
    <div className="container px-0 flex justify-center mx-auto">
      <div className="flex flex-col flex-grow justify-center items-center">
        <div className="mr-auto ml-4 h-5 w-64 bg-accent animate-pulse rounded-lg" />

        <div className="relative w-full">
          <div className="relative z-20 mt-8 mx-auto w-full h-96 max-w-screen-2xl">
            <div className="relative m-0 w-full h-full">
              <div className="absolute my-auto top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex flex-col justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 pb-12 w-full max-w-screen-xl border-b-2">
          <div className="h-8 sm:h-9 md:h-10 lg:h-12 w-1/2 sm:w-1/3 bg-accent rounded-lg animate-pulse" />
          <div className="flex items-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground">
            <div className="w-20 h-5 bg-accent rounded-lg animate-pulse" />
            <div>•</div>
            <div className="w-20 h-5 bg-accent rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <div className="hidden xl:block sticky top-4 pl-4 w-[156px] h-96">
        <div className="flex flex-col gap-4">
          <div className="font-bold">On this page</div>
          <div className="flex flex-col gap-3">
            {[...Array(12).keys()].map(i => (
              <div key={ i } className="w-3/4 h-5 bg-accent rounded-lg animate-pulse" />
            ))}
          </div>
          <Button size="sm" variant="outline" disabled>Back to Top</Button>
        </div>
      </div>
    </div>
  )
}
