import { Card, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import ImageLoader from "./image-loader";

export default function GridCardLoader() {
  return (
    <Card className="relative h-100 w-80">
      {/* Badge loader */}
      <div className="absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1">
        <Skeleton className="rounded-full w-24 h-6" />
        <Skeleton className="rounded-full w-24 h-6" />
      </div>
      {/* Content Loader */}
      <CardHeader className="flex flex-col gap-2">
        <div className="relative size-full rounded-md">
          <ImageLoader className="h-44 relative border" />
        </div>
        <Skeleton className="h-6 w-36 mb-4 -mt-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
    </Card>
  )
}
