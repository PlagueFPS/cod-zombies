import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import ImageLoader from "./image-loader"

export default function PreviousOrNextMapLoader() {
	return (
		<>
			{/* Previous Map Card */}
			<div className="w-full max-w-sm overflow-hidden rounded-lg border-2 xl:max-w-full">
				<div className="relative flex h-full flex-col items-center overflow-hidden p-2 xl:flex-row-reverse">
					<div className="relative z-20 w-full max-w-sm overflow-hidden rounded-lg">
						<div className="relative m-0 h-auto w-full">
							<div className="flex h-40 w-full items-center justify-center">
								<ImageLoader className="h-full" />
							</div>
						</div>
					</div>

					<div className="relative z-20 mb-auto flex w-full flex-col justify-center gap-2 px-4 pt-4">
						<Skeleton className="h-6 w-1/2" />
						<Skeleton className="h-4 w-full shrink-0" />
						<Skeleton className="h-4 w-full shrink-0" />
						<Skeleton className="h-4 w-full shrink-0" />
						<div className="xl:-ml-2 mt-4 flex items-center pb-4 transition-all">
							<ChevronLeft />
							<span>Previous Map</span>
						</div>
					</div>
				</div>
			</div>

			{/* Next Map Card */}
			<div className="w-full max-w-sm overflow-hidden rounded-lg border-2 xl:max-w-full">
				<div className="relative flex h-full flex-col items-center overflow-hidden p-2 xl:flex-row">
					<div className="relative z-20 w-full max-w-sm overflow-hidden rounded-lg">
						<div className="relative m-0 h-auto w-full">
							<div className="flex h-40 w-full items-center justify-center">
								<ImageLoader className="h-full" />
							</div>
						</div>
					</div>
					<div className="relative z-20 mb-auto flex w-full flex-col justify-center gap-2 px-4 pt-4">
						<Skeleton className="h-6 w-1/2" />
						<Skeleton className="h-4 w-full shrink-0" />
						<Skeleton className="h-4 w-full shrink-0" />
						<Skeleton className="h-4 w-full shrink-0" />
						<div className="xl:-mr-2 mt-4 flex items-center pb-4 transition-all">
							<span className="ml-auto">Next Map</span>
							<ChevronRight />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
