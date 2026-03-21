import {
	AlertTriangle,
	BookOpen,
	Eye,
	Footprints,
	Gamepad2,
	Info,
	MapIcon,
	Share2,
	Swords,
	Target,
	Zap,
} from "lucide-react"

import { BreadcrumbsLoader } from "@/components/client/breadcrumbs-loader"
import ImageLoader from "@/components/server/image-loader"
import PrevOrNextLoader from "@/components/server/prev-or-next-card-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function ZombiePageLoader() {
	return (
		<article className="relative container mx-auto px-3 py-4 sm:px-4 sm:py-6">
			<div className="absolute -top-5 left-5 z-30 flex w-full justify-center pl-4 xl:pl-0">
				<BreadcrumbsLoader type="zombie" />
			</div>
			<Card className="mb-6 overflow-hidden border-2 bg-background pt-0">
				<div className="flex items-center justify-between bg-accent px-4 py-2 dark:bg-accent/50">
					<Skeleton className="h-5.5 w-16 badge-medium-gradient dark:dark-badge-medium-gradient" />
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
				<CardHeader>
					<Skeleton className="h-9 w-1/4 md:h-10" />
				</CardHeader>
				<CardContent>
					<section className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{/* Image and Stats */}
						<div className="flex flex-col items-center">
							<ImageLoader className="static mb-4 aspect-square h-full w-full border" />
							<div className="w-full space-y-3">
								<div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Eye className="size-5 text-orange-500" />
											<span className="text-muted-foreground">First Appeared In</span>
										</div>
										<Skeleton className="h-5 w-28" />
									</div>
								</div>
								<div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Zap className="size-5 text-yellow-500" />
											<span className="text-muted-foreground">Speed</span>
										</div>
										<Skeleton className="h-5 w-20" />
									</div>
									<Progress value={50} className="mt-1 h-2 animate-pulse" />
								</div>
							</div>
						</div>
						{/* Description and Weaknesses */}
						<div className="space-y-6 md:col-span-2">
							<div className="space-y-2">
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<BookOpen className="size-5 text-foreground" />
									Description
								</h3>
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-1/2" />
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<MapIcon className="size-5 text-blue-500" />
									Map Appearances
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									<Skeleton className="h-6 w-24 badge-changed-gradient dark:dark-badge-changed-gradient" />
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<Gamepad2 className="size-5 text-orange-500" />
									Game Appearances
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									<Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<Target className="size-5 text-red-500" />
									Weak Points
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									<Skeleton className="h-6 w-24 badge-hard-gradient dark:dark-badge-hard-gradient" />
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<AlertTriangle className="size-5 text-orange-800 dark:text-orange-300" />
									Elemental Weaknesses
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									<Skeleton className="h-6 w-24" />
								</div>
							</div>
						</div>
					</section>
				</CardContent>
			</Card>
			{/* Main Content Grid */}
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Attacks Section */}
				<Card className="bg-background">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Swords className="size-6 text-primary" />
							<h3 className="text-xl font-bold">Attacks</h3>
						</div>
						<div className="space-y-4">
							{Array.from({ length: 3 }, (_, num) => (
								<div key={`attack-${num + 1}`} className="rounded-lg border p-3">
									<div className="mb-2 flex flex-wrap items-start justify-between gap-2">
										<Skeleton className="h-6 w-36" />
										<div className="flex flex-wrap gap-1">
											<Skeleton className="h-6 w-24" />
										</div>
									</div>
									<CardDescription className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-1/2" />
									</CardDescription>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				{/* Spawn Behavior Section */}
				<Card className="bg-background lg:order-first lg:col-span-3">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Footprints className="size-6 text-purple-600 dark:text-purple-300" />
							<h3 className="text-xl font-bold">Spawn Behavior</h3>
						</div>
						<CardDescription className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-1/2" />
						</CardDescription>
					</CardContent>
				</Card>
				{/* Combat Strategy Section */}
				<Card className="bg-background lg:col-span-2">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Info className="size-6 text-green-600 dark:text-green-300" />
							<h3 className="text-xl font-bold">Combat Strategy</h3>
						</div>
						<div className="space-y-2 text-sm text-muted-foreground">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="mt-8 flex w-full flex-row items-center justify-center">
				<div className="mx-auto flex w-full flex-col items-center justify-center gap-8 px-3 lg:flex-row xl:mr-0 xl:ml-auto xl:px-0">
					<PrevOrNextLoader type="Zombie" />
				</div>
			</section>
		</article>
	)
}
