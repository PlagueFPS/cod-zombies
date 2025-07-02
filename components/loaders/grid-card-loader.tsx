import { Card, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import ImageLoader from "./image-loader"

export default function GridCardLoader() {
	return (
		<Card className="relative h-100 w-80">
			{/* Badge loader */}
			<div className="absolute top-2 right-2 z-20 flex w-fit items-center justify-center gap-1">
				<Skeleton className="h-6 w-24 rounded-full" />
				<Skeleton className="h-6 w-24 rounded-full" />
			</div>
			{/* Content Loader */}
			<CardHeader className="flex flex-col gap-2">
				<div className="relative size-full rounded-md">
					<ImageLoader className="relative h-44 border" />
				</div>
				<Skeleton className="-mt-4 mb-4 h-6 w-36" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
			</CardHeader>
		</Card>
	)
}
