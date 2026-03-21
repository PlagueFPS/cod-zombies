import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import { Skeleton } from "../ui/skeleton"
import ImageLoader from "./image-loader"

interface IPrevOrNextLoader {
	type: "Quest" | "Zombie"
}

export default function PrevOrNextLoader({ type }: IPrevOrNextLoader) {
	return (
		<>
			<PrevOrNextCardLoader type={type} prev />
			<PrevOrNextCardLoader type={type} />
		</>
	)
}

interface IPrevOrNextCardLoader {
	prev?: boolean
	type: "Quest" | "Zombie"
}

function PrevOrNextCardLoader({ prev, type }: IPrevOrNextCardLoader) {
	return (
		<div className="group w-full max-w-sm overflow-hidden rounded-lg border transition-all hover:-translate-y-2 hover:border-primary xl:max-w-full">
			<article
				className={cn(
					"relative flex h-full flex-col items-center overflow-hidden p-2 xl:h-48 xl:flex-row dark:shadow-none",
					{ "xl:flex-row-reverse": prev },
				)}
			>
				<div
					className={cn("absolute top-2 right-2 z-50 flex w-fit items-center justify-center gap-1")}
				>
					<Skeleton className="h-6 w-24 badge-medium-gradient dark:dark-badge-medium-gradient" />
					<Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<ImageLoader className="h-full w-full border" />
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<Skeleton className="h-6 w-1/3" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<div
						className={cn(
							"mt-auto flex items-center pb-4 transition-all group-hover:text-primary",
							{
								"xl:-ml-2": prev,
								"xl:-mr-2": !prev,
							},
						)}
					>
						{prev ? (
							<>
								<ChevronLeft />
								<span>Previous {type}</span>
							</>
						) : (
							<>
								<span className="ml-auto">Next {type}</span>
								<ChevronRight />
							</>
						)}
					</div>
				</div>
			</article>
		</div>
	)
}
