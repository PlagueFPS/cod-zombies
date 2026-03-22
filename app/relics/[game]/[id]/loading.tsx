import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { BreadcrumbsLoader } from "@/components/client/breadcrumbs-loader"
import ImageLoader from "@/components/server/image-loader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function RelicPageLoading() {
	return (
		<section className="container mx-auto -mt-10 max-w-4xl px-4 md:py-12">
			<BreadcrumbsLoader type="relic" className="mb-14" />
			<article className="space-y-8">
				<header className="space-y-6 border-b pb-8 text-center">
					<div className="relative mx-auto size-64 overflow-hidden rounded-lg bg-muted dark:bg-accent/30">
						<ImageLoader className="object-cover" />
					</div>

					<div className="space-y-4">
						<Skeleton className="mx-auto h-12 w-3/4 md:h-14" />
						<div className="flex flex-wrap items-center justify-center gap-3">
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-6 w-28 rounded-full badge-primary-gradient dark:dark-badge-primary-gradient" />
						</div>

						<div className="flex items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
							<span className="flex items-center gap-1 text-muted-foreground">
								<Calendar className="size-4" />
								<span>Updated:</span>
								<Skeleton className="h-5 w-32" />
							</span>
							<span className="inline">&bull;</span>
							<span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
								<Clock className="size-4" />
								<Skeleton className="h-5 w-20" />
							</span>
						</div>
					</div>
				</header>

				<div className="relative mx-auto w-full max-w-[80ch] space-y-4 px-4">
					<Skeleton className="h-[50svh] w-full" />
				</div>

				<div className="mt-8 flex w-full items-center justify-evenly gap-4">
					<Button variant="outline" disabled aria-disabled>
						<div className="group w-fit">
							<article className="flex h-full items-center">
								<div className="mt-auto flex items-center justify-between">
									<span className="inline-flex items-center justify-center gap-1">
										<ChevronLeft className="size-4" />
										<Skeleton className="h-5 w-24" />
									</span>
								</div>
							</article>
						</div>
					</Button>
					<Button variant="outline" disabled aria-disabled>
						<div className="group w-fit">
							<article className="flex h-full items-center">
								<div className="mt-auto flex items-center justify-between">
									<span className="inline-flex items-center justify-center gap-1">
										<Skeleton className="h-5 w-24" />
										<ChevronRight className="size-4" />
									</span>
								</div>
							</article>
						</div>
					</Button>
				</div>
			</article>
		</section>
	)
}
