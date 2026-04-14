import { useQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { Array as Arr, Option } from "effect"
import {
	AlertTriangle,
	BookOpen,
	ChevronLeft,
	ChevronRight,
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
import AmmoModTooltip from "@/components/ammo-mod-tooltip"
import { Breadcrumbs, type Link } from "@/components/breadcrumbs"
import { ComingSoonBadge, NewBadge, RangeBadge, TypeBadge } from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import ImageLoader from "@/components/image-loader"
import { LastUpdatedDisplay } from "@/components/last-updated-display"
import NotFoundContent from "@/components/not-found-content"
import PrevOrNextLoader from "@/components/prev-or-next-card-loader"
import { ShareButton } from "@/components/share-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { type GameKey, getGameByKey } from "@/data/games"
import { getMapByKey } from "@/data/maps"
import { contentQueryOptions } from "@/data/queries"
import { getOgImgUrl } from "@/data/server-functions/content"
import { getWeakPointByKey } from "@/data/weak-points"
import { getZombieAttackByKey } from "@/data/zombie-attacks"
import { getAdjacentZombies, getZombieByKey, type ZombieKey } from "@/data/zombies"
import { cn } from "@/lib/utils"
import { type EncodedZombie, encodeZombie } from "@/utils/rsc-wire"
import { capitalize, createSeoTitle } from "@/utils/shared-functions"
import richStyles from "@/rich-text.module.css"

export const Route = createFileRoute("/bestiary/$zombieId")({
	loader: async ({ params, context }) => {
		const zombie = getZombieByKey(params.zombieId as ZombieKey).pipe(
			Option.getOrThrowWith(() => notFound()),
		)
		if (zombie.state.valueOrUndefined === "Coming Soon") throw notFound()

		const [opengraphUrl] = await Promise.all([
			getOgImgUrl({ data: { kind: "zombies", id: zombie.id } }),
			context.queryClient.prefetchQuery(contentQueryOptions(zombie.id, zombie.combatStrategy)),
		])

		if (!opengraphUrl) throw notFound()

		const mostRecentGame = Arr.last(zombie.games).pipe(
			Option.flatMap(game => getGameByKey(game)),
			Option.getOrThrowWith(() => notFound()),
		)
		const firstAppearIn = Arr.head(zombie.maps).pipe(
			Option.flatMap(map => getMapByKey(map)),
			Option.getOrThrowWith(() => notFound()),
		)
		const { prev, next } = getAdjacentZombies(zombie.id as ZombieKey)

		const title = createSeoTitle(zombie.title)
		const description = `Learn elemental weaknesses, spawn behavior, attacks, and more about the "${zombie.title}" ${zombie.type} Zombie.`
		const shareUrl = `${context.serverUrl}/bestiary/${zombie.id}`

		return {
			title,
			description,
			serverUrl: context.serverUrl,
			opengraphUrl,
			shareUrl,
			zombie: { ...encodeZombie(zombie), combatStrategy: zombie.combatStrategy },
			mostRecentGame: { id: mostRecentGame.id, title: mostRecentGame.title },
			firstAppearIn: { id: firstAppearIn.id, title: firstAppearIn.title },
			prev: Option.match(prev, { onNone: () => null, onSome: encodeZombie }),
			next: Option.match(next, { onNone: () => null, onSome: encodeZombie }),
		}
	},
	head: ({ loaderData, params }) => ({
		meta: [
			{ title: loaderData?.title },
			{ name: "description", content: loaderData?.description },
			{ property: "og:title", content: loaderData?.title },
			{ property: "og:description", content: loaderData?.description },
			{
				property: "og:url",
				content: `${loaderData?.serverUrl}/bestiary/${params.zombieId}`,
			},
			{ property: "og:image", content: loaderData?.opengraphUrl },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/jpeg" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{ property: "twitter:card", content: "summary_large_image" },
			{ property: "twitter:image", content: loaderData?.opengraphUrl },
		],
	}),
	notFoundComponent: ZombieNotFound,
	pendingComponent: ZombiePending,
	component: ZombieInfo,
	staleTime: Infinity,
})

function ZombieInfo() {
	const { zombie, mostRecentGame, firstAppearIn, shareUrl, prev, next } = Route.useLoaderData()
	const { data } = useQuery(contentQueryOptions(zombie.id, zombie.combatStrategy))

	if (!data) throw notFound()

	const speedProgress = () => {
		switch (zombie.speed) {
			case "Slow":
				return 33
			case "Medium":
				return 66
			case "Fast":
				return 100
			default:
				return 0
		}
	}

	return (
		<article className="relative container mx-auto px-3 py-4 sm:px-4 sm:py-6">
			<div className="absolute -top-5 left-2 z-30 flex w-full justify-center pl-4 xl:left-5 xl:pl-0">
				<Breadcrumbs
					links={[
						{ title: "Bestiary", href: "/bestiary" },
						{
							title: zombie.title,
							href: "/bestiary/$zombieId",
							params: { zombieId: zombie.id },
						},
					]}
				/>
			</div>
			<Card className="mb-6 overflow-hidden border-2 bg-background pt-0">
				<div className="flex items-center justify-between bg-accent px-2 py-2 sm:px-4 dark:bg-accent/50">
					<div className="flex w-fit items-center justify-center gap-2">
						{zombie.state === "Coming Soon" ? (
							<ComingSoonBadge />
						) : zombie.state === "New" ? (
							<NewBadge />
						) : null}
						<TypeBadge type={zombie.type} />
					</div>
					<div className="flex items-center justify-center gap-2">
						<LastUpdatedDisplay
							lastModified={data.lastModified}
							lastModifiedFormatted={data.lastModifiedFormatted}
							className="text-xs text-foreground/60 sm:text-sm"
						/>
						<ShareButton url={shareUrl} className="text-foreground/60" />
					</div>
				</div>
				<CardHeader>
					<CardTitle className="text-gradient text-3xl font-extrabold md:text-4xl dark:dark-text-gradient">
						{zombie.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<section className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div className="relative flex flex-col items-center">
							<div className="pointer-events-none absolute inset-0 mx-auto hidden w-full opacity-35 blur-3xl dark:block">
								<FeaturedImage
									featuredImage={zombie.image}
									alt=""
									width={422}
									height={422}
									sizes="422px"
									loading="eager"
									className="mb-4 aspect-square w-full rounded-lg object-cover object-top"
								/>
							</div>
							<FeaturedImage
								featuredImage={zombie.image}
								alt={`${zombie.title} image`}
								width={422}
								height={422}
								sizes="422px"
								preload
								loading="eager"
								className="mb-4 aspect-square w-full overflow-hidden rounded-lg object-cover object-top shadow-lg dark:shadow-none"
							/>
							<div className="w-full space-y-3">
								<div>
									<div className="flex flex-wrap items-center justify-between">
										<div className="flex items-center gap-2">
											<Eye className="size-5 text-orange-500" />
											<span className="text-foreground dark:text-foreground/80">
												First Appeared In
											</span>
										</div>
										<span className="text-foreground dark:text-foreground/80">
											{firstAppearIn.title}
										</span>
									</div>
								</div>
								<div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Zap className="size-5 text-yellow-500" />
											<span className="text-foreground dark:text-foreground/80">Speed</span>
										</div>
										<span className="text-foreground dark:text-foreground/80">{zombie.speed}</span>
									</div>
									<Progress value={speedProgress()} className="mt-1 h-2" />
								</div>
							</div>
						</div>
						<div className="space-y-6 md:col-span-2">
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<BookOpen className="size-5 text-foreground" />
									Description
								</h3>
								<p className="text-foreground dark:text-foreground/80">{zombie.description}</p>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<MapIcon className="size-5 text-blue-500" />
									Map Appearances
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.maps.slice(0, 16).map(mapKey => {
										const map = getMapByKey(mapKey)
										if (Option.isNone(map)) return null

										return (
											<Badge
												key={mapKey}
												className="mt-1 badge-changed-gradient dark:dark-badge-changed-gradient"
											>
												{map.value.title}
											</Badge>
										)
									})}
									{zombie.maps.length > 16 && (
										<Badge className="mt-1 badge-changed-gradient dark:dark-badge-changed-gradient">
											{`+${zombie.maps.length - 16} more`}
										</Badge>
									)}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<Gamepad2 className="size-5 text-orange-500" />
									Game Appearances
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.games.map(gameKey => {
										const game = getGameByKey(gameKey)
										if (Option.isNone(game)) return null

										return (
											<Badge
												key={gameKey}
												className="mt-1 badge-primary-gradient dark:dark-badge-primary-gradient"
											>
												{game.value.title}
											</Badge>
										)
									})}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<Target className="size-5 text-red-500" />
									Weak Points
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{Arr.isArrayNonEmpty(zombie.weakPoints) ? (
										zombie.weakPoints.map(weakPointKey => {
											const weakPoint = getWeakPointByKey(weakPointKey)
											if (Option.isNone(weakPoint)) return null

											return (
												<Badge
													key={weakPointKey}
													className="w-fit badge-hard-gradient dark:dark-badge-hard-gradient"
												>
													{weakPoint.value.title}
												</Badge>
											)
										})
									) : (
										<Badge className="w-fit badge-hard-gradient dark:dark-badge-hard-gradient">
											None
										</Badge>
									)}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
									<AlertTriangle className="size-5 text-orange-800 dark:text-orange-200" />
									Elemental Weaknesses
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{Arr.isArrayNonEmpty(zombie.elementalWeakness) ? (
										zombie.elementalWeakness.map(weakness => (
											<AmmoModTooltip
												key={weakness}
												ammoModKey={weakness}
												game={mostRecentGame.id as GameKey}
											/>
										))
									) : (
										<span className="text-orange-800 dark:text-orange-200">
											No elemental weaknesses
										</span>
									)}
								</div>
							</div>
						</div>
					</section>
				</CardContent>
			</Card>
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Card className="bg-background pt-0">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Swords className="size-6 text-primary" />
							<h3 className="text-xl font-bold">Attacks</h3>
						</div>
						<div className="space-y-4">
							{zombie.attacks.map(attackKey => {
								const attack = getZombieAttackByKey(attackKey)
								if (Option.isNone(attack)) return null

								return (
									<div
										key={attackKey}
										className={cn("rounded-lg border-2 p-3", {
											"border-teal-600/30 shadow-teal-600 dark:border-teal-300/30 dark:shadow-teal-300":
												attack.value.range === "Short",
											"border-yellow-600/30 shadow-yellow-600 dark:border-yellow-300/30 dark:shadow-yellow-300":
												attack.value.range === "Medium",
											"border-red-600/30 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
												attack.value.range === "Long",
										})}
									>
										<div className="mb-2 flex flex-wrap items-start justify-between gap-2">
											<h4
												className={cn("font-semibold", {
													"text-teal-600 dark:text-teal-300": attack.value.range === "Short",
													"text-yellow-700 dark:text-yellow-200": attack.value.range === "Medium",
													"text-red-600 dark:text-red-300": attack.value.range === "Long",
												})}
											>
												{attack.value.title}
											</h4>
											<div className="flex flex-wrap gap-1">
												<RangeBadge range={attack.value.range} />
											</div>
										</div>
										<CardDescription className="text-foreground dark:text-foreground/80">
											{attack.value.description}
										</CardDescription>
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>
				<Card className="bg-background pt-0 lg:order-first lg:col-span-3">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Footprints className="size-6 text-purple-600 dark:text-purple-300" />
							<h3 className="text-xl font-bold">Spawn Behavior</h3>
						</div>
						<CardDescription className="text-foreground dark:text-foreground/80">
							{zombie.spawnBehavior}
						</CardDescription>
					</CardContent>
				</Card>
				<Card className="bg-background pt-0 lg:col-span-2">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Info className="size-6 text-green-600 dark:text-green-300" />
							<h3 className="text-xl font-bold">Combat Strategy</h3>
						</div>
						<div className={cn("text-sm text-foreground dark:text-foreground/80", richStyles.body)}>
							{data.Content}
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="mt-8 flex w-full flex-row items-center justify-center">
				<div className="mx-auto flex flex-col items-center justify-center gap-8 px-3 lg:flex-row xl:mr-0 xl:ml-auto xl:px-0">
					{prev ? <PrevOrNextZombieCard zombie={prev} prev /> : null}
					{next ? <PrevOrNextZombieCard zombie={next} /> : null}
				</div>
			</section>
		</article>
	)
}

interface PrevOrNextZombieCardProps {
	zombie: EncodedZombie
	prev?: boolean
}

function PrevOrNextZombieCard({ zombie, prev }: PrevOrNextZombieCardProps) {
	const alt = `${zombie.title} image`
	// SAFETY: If we have a zombie, we have at least one map that zombie appears in
	const firstAppearedIn = Arr.head(zombie.maps).pipe(
		Option.flatMap(map => getMapByKey(map)),
		Option.getOrThrow,
	)
	const isComingSoon = zombie.state === "Coming Soon"

	return (
		<CustomLink
			to="/bestiary/$zombieId"
			params={{ zombieId: zombie.id }}
			className={cn(
				"group w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform will-change-transform hover:-translate-y-2 hover:outline-2 hover:outline-primary focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-primary xl:max-w-full dark:shadow-none",
				{
					"pointer-events-none opacity-50": isComingSoon,
				},
			)}
			tabIndex={isComingSoon ? -1 : 0}
			aria-disabled={isComingSoon}
			disabled={isComingSoon}
		>
			<article
				className={cn("relative flex h-full flex-col items-center px-2 py-4 xl:h-48 xl:flex-row", {
					"xl:flex-row-reverse": prev,
				})}
			>
				<div
					className={cn("absolute top-2 right-2 z-50 flex w-fit items-center justify-center gap-1")}
				>
					{isComingSoon ? <ComingSoonBadge /> : zombie.state === "New" ? <NewBadge /> : null}
					<TypeBadge type={zombie.type} />
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{firstAppearedIn.title}
					</Badge>
				</div>
				<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex">
					<FeaturedImage
						featuredImage={zombie.image}
						alt=""
						width={384}
						height={176}
						sizes="(max-width: 1280px) 320px, 384px"
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={zombie.image}
						alt={alt}
						width={384}
						height={176}
						sizes="(max-width: 1280px) 320px, 384px"
						className="h-full rounded-lg object-cover object-top"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<h3
						className={cn(
							"text-xl font-semibold transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{
								truncate: zombie.title.length > 20,
							},
						)}
					>
						{zombie.title}
					</h3>
					<p className="line-clamp-3 text-sm text-ellipsis">{zombie.description}</p>
					<div
						className={cn(
							"mt-auto flex items-center pb-2 transition-colors group-hover:text-primary group-focus-visible:text-primary",
							{
								"xl:-ml-2": prev,
								"xl:-mr-2": !prev,
							},
						)}
					>
						{prev ? (
							<>
								<ChevronLeft />
								<span>Previous Zombie</span>
							</>
						) : (
							<>
								<span className="ml-auto">Next Zombie</span>
								<ChevronRight />
							</>
						)}
					</div>
				</div>
			</article>
		</CustomLink>
	)
}

function ZombiePending() {
	const params = Route.useParams()
	const links: Link[] = [
		{ href: "/bestiary", title: "Bestiary" },
		{ href: `/bestiary/$zombieId`, title: params.zombieId, params: { zombieId: params.zombieId } },
	]

	return (
		<article className="relative container mx-auto px-3 py-4 sm:px-4 sm:py-6">
			<div className="absolute -top-5 left-5 z-30 flex w-full justify-center pl-4 xl:pl-0">
				<Breadcrumbs links={links} />
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
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

function ZombieNotFound() {
	const params = Route.useParams()
	const items: Link[] = [
		{ href: "/bestiary", title: "Bestiary" },
		{
			href: "/bestiary/$zombieId",
			title: capitalize(params.zombieId),
			params: { zombieId: params.zombieId },
		},
	]

	return <NotFoundContent items={items} resource="Zombie" param={params.zombieId} />
}
