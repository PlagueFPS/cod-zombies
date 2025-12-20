import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import ImageLoader from "@/components/loaders/image-loader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function RelicPageLoading() {
	return (
		<section className="-mt-10 container mx-auto max-w-4xl px-4 md:py-12">
			<Breadcrumbs
				links={[
					{ title: "Relics", href: "/relics" },
					{ title: "Loading...", href: "/relics" },
					{ title: "Loading...", href: "/relics" },
				]}
				className="mb-14"
			/>
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
							<Skeleton className="badge-primary-gradient dark:dark-badge-primary-gradient h-6 w-28 rounded-full" />
						</div>

						<div className="flex items-center justify-center gap-2 pt-2 text-muted-foreground text-sm">
							<span className="flex items-center gap-1">
								<Calendar className="size-4" />
								<Skeleton className="h-5 w-32" />
							</span>
							<span className="inline">&bull;</span>
							<span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
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
