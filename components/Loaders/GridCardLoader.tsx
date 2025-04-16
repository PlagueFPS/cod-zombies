import { Card, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import ImageLoader from "./ImageLoader";

export default function GridCardLoader() {
  return (
    <Card className="relative h-[400px] w-[322px]">
      {/* Badge loader */}
      <div className="absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1">
        <Skeleton className="rounded-full w-24 h-6" />
        <Skeleton className="rounded-full w-24 h-6" />
      </div>
      {/* Content Loader */}
      <CardHeader className="flex gap-2 flex-grow">
        <div className="relative h-full w-full rounded-md">
          <ImageLoader className="h-44 relative border" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>
    </Card>
  )
}
