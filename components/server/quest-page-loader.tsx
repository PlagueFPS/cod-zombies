import { Calendar, Clock, Hourglass, Share2 } from "lucide-react"

import { BreadcrumbsLoader } from "@/components/client/breadcrumbs-loader"
import ImageLoader from "@/components/server/image-loader"
import { TableOfContentsLoader } from "@/components/server/table-of-contents-loader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface IQuestPageLoader {
	mainQuest: boolean
}

export function QuestPageLoader({ mainQuest }: IQuestPageLoader) {
	return (
		// Container loaders
		<div className="-mt-10 flex w-full justify-center xl:mt-0">
			<div className="mx-auto flex w-svw flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full flex-col-reverse xl:flex-row">
					<div className="flex w-full flex-col items-center justify-center">
						<div className="relative mt-16 w-full xl:mt-8">
							{/* Image and breadcrumb loaders */}
							<div className="relative z-20 mx-auto h-[calc(50vw)] w-full max-w-7xl xl:h-180">
								<ImageLoader className="h-full w-full border" />
								<div className="absolute -top-10 left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
									{mainQuest ? (
										<BreadcrumbsLoader type="main" />
									) : (
										<BreadcrumbsLoader type="side" />
									)}
								</div>
							</div>

							{/* Map content loader */}
							<div className="relative z-20 mx-auto mt-8 mb-4 flex max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
								<div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
									<Skeleton className="h-6 w-1/3 pb-2 sm:h-7 md:h-9 lg:h-12" />
									<div className="flex w-fit items-center justify-center gap-4">
										<Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
										<Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 md:flex-row md:pb-0">
										<div className="flex items-center gap-1 text-muted-foreground">
											<Calendar className="size-4" />
											<span>Updated:</span>
											<Skeleton className="h-5 w-32" />
										</div>
										<span className="hidden md:inline">&bull;</span>
										<div className="flex items-center gap-1 text-muted-foreground">
											<Clock className="size-4" />
											<Skeleton className="h-5 w-4" />
											min read
										</div>
										{mainQuest && (
											<div className="flex items-center gap-1 text-muted-foreground">
												<Hourglass className="size-4" />
												<span>Est. completion:</span>
												<Skeleton className="h-5 w-32" />
											</div>
										)}
									</div>
									<Button
										variant={"ghost"}
										size={"icon"}
										disabled
										aria-disabled
										className="mb-2 ml-auto animate-pulse text-muted-foreground md:mb-0"
									>
										<span className="sr-only">Share</span>
										<Share2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<Skeleton className="mx-auto h-[150svh] w-full max-w-[80ch] dark:bg-accent/50" />
						</div>
					</div>
					<TableOfContentsLoader />
				</div>
			</div>
		</div>
	)
}
