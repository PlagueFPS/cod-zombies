import type { Metadata, Route } from "next"
import { Array as Arr, Effect, Option } from "effect"
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
	Swords,
	Target,
	Zap,
} from "lucide-react"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import {
	ComingSoonBadge,
	NewBadge,
	RangeBadge,
	TypeBadge,
} from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeaturedImage from "@/components/featured-image/featured-image"
import AmmoModTooltip from "@/components/rich-text/rich-tooltips/ammo-mod-tooltip"
import ShareButton from "@/components/share-button/share-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
	getAdjacentZombies,
	getLatestZombieGameKey,
	getZombieById,
	getZombies,
	type Zombie,
} from "@/data/zombies"
import { FileSystemPage } from "@/lib/layers"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getLastUpdated, getServerUrl } from "@/utils/functions"

export const generateStaticParams = () => {
	const zombies = getZombies()
	return zombies.map(zombie => ({
		id: zombie.id,
	}))
}

export const generateMetadata = async ({
	params,
}: PageProps<"/bestiary/[id]">): Promise<Metadata> => {
	const { id } = await params
	const zombie = getZombieById(id)
	if (!zombie || Option.getOrNull(zombie.state) === "Coming Soon") {
		notFound()
	}
	const description = `Learn elemental weaknesses, spawn behavior, attacks, and more about the "${zombie.title}" ${zombie.type} Zombie.`

	return {
		title: zombie.title,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title: zombie.title,
			description,
			url: `/bestiary/${zombie.id}`,
			images: {
				url: `${getServerUrl()}/opengraph-images/zombies/og-${zombie.id}.jpg`,
				width: 1200,
				height: 630,
			},
		},
		twitter: {
			title: zombie.title,
			description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${getServerUrl()}/bestiary/${zombie.id}`,
		},
	}
}

const ZombiePage = Effect.fn("ZombiePage")(function* ({ params }: PageProps<"/bestiary/[id]">) {
	const mdxComponents = yield* Effect.sync(() => useMDXComponents())
	const { id } = yield* Effect.promise(() => params)
	const zombie = getZombieById(id)
	if (!zombie || Option.getOrNull(zombie.state) === "Coming Soon")
		return yield* Effect.sync(() => notFound())

	const { prev, next } = getAdjacentZombies(zombie.id)
	const { default: MDXContent } = yield* zombie.combatStrategy
	const { lastModifiedFormatted } = getLastUpdated(`zombies/${zombie.id}.mdx`)
	const mostRecentGame = getLatestZombieGameKey(zombie.games)
	const firstAppearIn = Arr.get(zombie.maps, 0)

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
		<article className="container relative mx-auto px-3 py-4 sm:px-4 sm:py-6">
			<div className="-top-5 absolute left-2 z-30 flex w-full justify-center pl-4 xl:left-5 xl:pl-0">
				<Breadcrumbs
					links={[
						{ title: "Bestiary", href: "/bestiary" },
						{ title: zombie.title, href: `/bestiary/${zombie.id}` },
					]}
				/>
			</div>
			<Card className="mb-6 overflow-hidden border-2 bg-background pt-0">
				<div className="flex items-center justify-between bg-accent px-2 py-2 sm:px-4 dark:bg-accent/50">
					<div className="flex w-fit items-center justify-center gap-2">
						{Option.match(zombie.state, {
							onNone: () => null,
							onSome: state => (state === "Coming Soon" ? <ComingSoonBadge /> : <NewBadge />),
						})}
						<TypeBadge type={zombie.type} />
					</div>
					<div className="flex items-center justify-center gap-2">
						<span className="text-foreground/60 text-xs sm:text-sm">
							Updated: {lastModifiedFormatted}
						</span>
						<ShareButton title={zombie.title} url={`${getServerUrl()}/bestiary/${zombie.id}`} />
					</div>
				</div>
				<CardHeader>
					<CardTitle className="dark:dark-text-gradient font-extrabold text-3xl text-gradient md:text-4xl">
						{zombie.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<section className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{/* Image and Stats */}
						<div className="relative flex flex-col items-center">
							<div className="absolute inset-0 mx-auto hidden w-full opacity-35 blur-3xl dark:block">
								<FeaturedImage
									featuredImage={zombie.image}
									quality={100}
									width={422}
									height={422}
									sizes="422px"
									priority
									className="mb-4 aspect-square w-full rounded-lg object-cover object-top"
								/>
							</div>
							<FeaturedImage
								featuredImage={zombie.image}
								alt={`${zombie.title} image`}
								quality={100}
								width={422}
								height={422}
								sizes="422px"
								priority
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
										{Option.isSome(firstAppearIn) && (
											<span className="text-foreground dark:text-foreground/80">
												{firstAppearIn.value.title}
											</span>
										)}
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
						{/* Description and Weaknesses */}
						<div className="space-y-6 md:col-span-2">
							<div>
								<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
									<BookOpen className="size-5 text-foreground" />
									Description
								</h3>
								<p className="text-foreground dark:text-foreground/80">{zombie.description}</p>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
									<MapIcon className="size-5 text-blue-500" />
									Map Appearances
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.maps.slice(0, 16).map(map => (
										<Badge
											key={map.id}
											className="badge-changed-gradient dark:dark-badge-changed-gradient mt-1"
										>
											{map.title}
										</Badge>
									))}
									{zombie.maps.length > 16 && (
										<Badge className="badge-changed-gradient dark:dark-badge-changed-gradient mt-1">
											{`+${zombie.maps.length - 16} more`}
										</Badge>
									)}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
									<Gamepad2 className="size-5 text-orange-500" />
									Game Appearances
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.games.map(game => (
										<Badge
											key={game.id}
											className="badge-primary-gradient dark:dark-badge-primary-gradient mt-1"
										>
											{game.title}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
									<Target className="size-5 text-red-500" />
									Weak Points
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.weakPoints.length > 0 ? (
										zombie.weakPoints.map(weakPoint => (
											<Badge
												key={weakPoint.id}
												className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit"
											>
												{weakPoint.title}
											</Badge>
										))
									) : (
										<Badge className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit">
											None
										</Badge>
									)}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
									<AlertTriangle className="size-5 text-orange-800 dark:text-orange-200" />
									Elemental Weaknesses
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.elementalWeakness.length > 0 ? (
										zombie.elementalWeakness.map(weakness => (
											<AmmoModTooltip key={weakness} ammoModKey={weakness} game={mostRecentGame} />
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
			{/* Main Content Grid */}
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Attacks Section */}
				<Card className="bg-background pt-0">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Swords className="size-6 text-primary" />
							<h3 className="font-bold text-xl">Attacks</h3>
						</div>
						<div className="space-y-4">
							{zombie.attacks.map(attack => (
								<div
									key={attack.id}
									className={cn("rounded-lg border-2 p-3", {
										"border-teal-600/30 shadow-teal-600 dark:border-teal-300/30 dark:shadow-teal-300":
											attack.range === "Short",
										"border-yellow-600/30 shadow-yellow-600 dark:border-yellow-300/30 dark:shadow-yellow-300":
											attack.range === "Medium",
										"border-red-600/30 shadow-red-600 dark:border-red-300/30 dark:shadow-red-300":
											attack.range === "Long",
									})}
								>
									<div className="mb-2 flex flex-wrap items-start justify-between gap-2">
										<h4
											className={cn("font-semibold", {
												"text-teal-600 dark:text-teal-300": attack.range === "Short",
												"text-yellow-700 dark:text-yellow-200": attack.range === "Medium",
												"text-red-600 dark:text-red-300": attack.range === "Long",
											})}
										>
											{attack.title}
										</h4>
										<div className="flex flex-wrap gap-1">
											<RangeBadge range={attack.range} />
										</div>
									</div>
									<CardDescription className="text-foreground dark:text-foreground/80">
										{attack.description}
									</CardDescription>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				{/* Spawn Behavior Section */}
				<Card className="bg-background pt-0 lg:order-first lg:col-span-3">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Footprints className="size-6 text-purple-600 dark:text-purple-300" />
							<h3 className="font-bold text-xl">Spawn Behavior</h3>
						</div>
						<CardDescription className="text-foreground dark:text-foreground/80">
							{zombie.spawnBehavior}
						</CardDescription>
					</CardContent>
				</Card>
				{/* Combat Strategy Section */}
				<Card className="bg-background pt-0 lg:col-span-2">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Info className="size-6 text-green-600 dark:text-green-300" />
							<h3 className="font-bold text-xl">Combat Strategy</h3>
						</div>
						<div className="text-foreground text-sm dark:text-foreground/80">
							<MDXContent components={mdxComponents} />
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="mt-8 flex w-full flex-row items-center justify-center">
				<div className="mx-auto flex flex-col items-center justify-center gap-8 px-3 lg:flex-row xl:mr-0 xl:ml-auto xl:px-0">
					{Option.isSome(prev) && <PrevOrNextZombieCard zombie={prev.value} prev />}
					{Option.isSome(next) && <PrevOrNextZombieCard zombie={next.value} />}
				</div>
			</section>
		</article>
	)
})

export default FileSystemPage.build(ZombiePage)

interface PrevOrNextZombieCard {
	zombie: Zombie
	prev?: boolean
}

const PrevOrNextZombieCard = ({ zombie, prev }: PrevOrNextZombieCard) => {
	const alt = `${zombie.title} image`
	const { href, disabled, stateBadge, tabIndex } = Option.match(zombie.state, {
		onNone: () => ({
			href: `/bestiary/${zombie.id}`,
			disabled: false,
			tabIndex: 0,
			stateBadge: null,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				href: isComingSoon ? "#" : `/bestiary/${zombie.id}`,
				disabled: isComingSoon,
				tabIndex: isComingSoon ? -1 : 0,
				stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
			}
		},
	})

	return (
		<CustomLink
			href={href as Route}
			className={cn(
				"group hover:-translate-y-2 focus-visible:-translate-y-2 w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform will-change-transform hover:outline-2 hover:outline-primary focus-visible:outline-2 focus-visible:outline-primary xl:max-w-full dark:shadow-none",
				{
					"pointer-events-none opacity-50": disabled,
				},
			)}
			tabIndex={tabIndex}
			aria-disabled={disabled}
		>
			<article
				className={cn("relative flex h-full flex-col items-center px-2 py-4 xl:h-48 xl:flex-row", {
					"xl:flex-row-reverse": prev,
				})}
			>
				<div
					className={cn("absolute top-2 right-2 z-50 flex w-fit items-center justify-center gap-1")}
				>
					{stateBadge}
					<TypeBadge type={zombie.type} />
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{zombie.maps[0]?.title}
					</Badge>
				</div>
				<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex">
					<FeaturedImage
						featuredImage={zombie.image}
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
							"font-semibold text-xl transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{
								truncate: zombie.title.length > 20,
							},
						)}
					>
						{zombie.title}
					</h3>
					<p className="line-clamp-3 text-ellipsis text-sm">{zombie.description}</p>
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
