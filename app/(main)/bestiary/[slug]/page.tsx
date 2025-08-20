import type { Metadata } from "next"
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
import { cache } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeaturedImage from "@/components/featured-image/featured-image"
import { ManagementBadges } from "@/components/management-badges/management-badges"
import ItemTooltip from "@/components/rich-text/rich-embeds/item-tooltip"
import RichTextRenderer from "@/components/rich-text/rich-text-renderer/rich-text-renderer"
import ShareButton from "@/components/share-button/share-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCachedImageUrl } from "@/data/og-images"
import {
	getZombieBySlug,
	getZombieSearchData,
	getZombies,
	type MinifiedZombie,
} from "@/data/zombies"
import { env } from "@/env"
import { cn } from "@/lib/utils"
import { GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"

const getPageData = cache(async (slug: string) => {
	const zombie = await getZombieBySlug(slug)
	if (!zombie || zombie.isComingSoon) {
		notFound()
	}
	const zombies = await getZombies()
	const zombieIndex = zombies.findIndex(z => z.slug === zombie.slug)

	return {
		zombie,
		prevZombie: zombies[zombieIndex + 1],
		nextZombie: zombies[zombieIndex - 1],
	}
})

export const generateStaticParams = async () => {
	const zombies = await getZombieSearchData()
	return zombies.map(zombie => ({
		slug: zombie.slug,
	}))
}

export const generateMetadata = async ({
	params,
}: PageProps<"/bestiary/[slug]">): Promise<Metadata> => {
	const { slug } = await params
	const { zombie } = await getPageData(slug)
	let imageUrl = null

	if (!IN_DEVELOPMENT) {
		// Avoid potential og generations based on draft content
		imageUrl = await getCachedImageUrl("zombies", {
			...zombie,
			title: zombie.name,
			game: zombie.games[0]?.title ?? "",
			map: zombie.maps[0]?.title ?? "",
		})
	}
	const description = `Learn elemental weaknesses, spawn behavior, attacks, and more about the "${zombie.name}" ${zombie.type} Zombie.`

	return {
		title: zombie.name,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title: zombie.name,
			description,
			url: `/${zombie.slug}`,
			images: [
				{
					url: imageUrl || "",
					alt: `${zombie.name} Main Quest`,
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			title: zombie.name,
			description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`,
		},
	}
}

export default async function ZombiePage({ params }: PageProps<"/bestiary/[slug]">) {
	const { slug } = await params
	const { zombie, prevZombie, nextZombie } = await getPageData(slug)
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
			<div className="-top-5 absolute left-5 z-30 flex w-full justify-center pl-4 xl:pl-0">
				<Breadcrumbs
					links={[
						{ title: "Bestiary", href: "/bestiary" },
						{ title: zombie.name, href: `/bestiary/${zombie.slug}` },
					]}
				/>
			</div>
			<Card className="mb-6 overflow-hidden border-2 bg-background pt-0">
				<div className="flex items-center justify-between bg-accent px-4 py-2 dark:bg-accent/50">
					<div className="flex w-fit items-center justify-center gap-4">
						<ManagementBadges entry={zombie} />
						{zombie.isComingSoon ? <ComingSoonBadge /> : null}
						{zombie.isNew ? <NewBadge /> : null}
						<TypeBadge type={zombie.type} />
					</div>
					<ShareButton
						title={zombie.name}
						url={`${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`}
					/>
				</div>
				<CardHeader>
					<CardTitle className="dark:dark-text-gradient font-extrabold text-3xl text-gradient md:text-4xl">
						{zombie.name}
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
									sizes="422px"
									priority
									className="mb-4 aspect-square w-full rounded-lg object-cover object-top"
								/>
							</div>
							<FeaturedImage
								featuredImage={zombie.image}
								alt={`${zombie.name} image`}
								quality={100}
								sizes="422px"
								priority
								className="mb-4 aspect-square w-full overflow-hidden rounded-lg object-cover object-top shadow-lg dark:shadow-none"
							/>
							<div className="w-full space-y-3">
								<div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Eye className="size-5 text-orange-500" />
											<span className="text-foreground dark:text-foreground/80">
												First Appeared In
											</span>
										</div>
										{zombie.maps[0] ? (
											<span className="text-foreground dark:text-foreground/80">
												{zombie.maps[0].title}
											</span>
										) : null}
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
									{zombie.slug !== "zombie" ? (
										zombie.maps.map(map => (
											<Badge
												key={map.slug}
												className="badge-changed-gradient dark:dark-badge-changed-gradient mt-1"
											>
												{map.title}
											</Badge>
										))
									) : (
										<Badge className="badge-changed-gradient dark:dark-badge-changed-gradient mt-1">
											Appears in all maps
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
											key={game.slug}
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
									{zombie.weakPoints.map((weakPoint, index) => (
										<Badge
											key={`${weakPoint}-${index + 1}`}
											className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit"
										>
											{weakPoint}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
									<AlertTriangle className="size-5 text-orange-800 dark:text-orange-300" />
									Elemental Weaknesses
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									{zombie.elementalWeakness?.map(weakness => (
										<ItemTooltip key={weakness.id} item={weakness} />
									)) ?? (
										<span className="text-foreground dark:text-foreground/80">
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
								<div key={attack.id} className="rounded-lg border p-3">
									<div className="mb-2 flex flex-wrap items-start justify-between gap-2">
										<h4 className="font-semibold">{attack.name}</h4>
										<div className="flex flex-wrap gap-1">
											<Badge variant={"outline"}>Range: {attack.range}</Badge>
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
				<Card className="bg-background pt-0">
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
				<Card className="bg-background pt-0">
					<CardContent className="pt-6">
						<div className="mb-3 flex items-center gap-2 border-b pb-2">
							<Info className="size-6 text-green-600 dark:text-green-300" />
							<h3 className="font-bold text-xl">Combat Strategy</h3>
						</div>
						<RichTextRenderer
							body={zombie.combatStrategy}
							slug={zombie.slug}
							overrideStyles
							className="text-foreground text-sm dark:text-foreground/80"
						/>
					</CardContent>
				</Card>
			</section>
			<section className="mt-8 flex w-full flex-row items-center justify-center">
				<div className="mx-auto flex flex-col items-center justify-center gap-8 px-3 lg:flex-row xl:mr-0 xl:ml-auto xl:px-0">
					{prevZombie && <PrevOrNextZombie zombie={prevZombie} prev />}
					{nextZombie && <PrevOrNextZombie zombie={nextZombie} />}
				</div>
			</section>
		</article>
	)
}

interface PrevOrNextZombie {
	zombie: MinifiedZombie
	prev?: boolean
}

const PrevOrNextZombie = ({ zombie, prev }: PrevOrNextZombie) => {
	const alt = `${zombie.name} image`

	return (
		<CustomLink
			href={`/bestiary/${zombie.slug}`}
			className={cn(
				"group hover:-translate-y-2 focus-visible:-translate-y-2 w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform will-change-transform hover:outline-2 hover:outline-primary focus-visible:outline-2 focus-visible:outline-primary xl:max-w-full dark:shadow-none",
				{
					"pointer-events-none opacity-50": zombie.isComingSoon,
				},
			)}
			tabIndex={zombie.isComingSoon ? -1 : 0}
		>
			<article
				className={cn("relative flex h-full flex-col items-center px-2 py-4 xl:h-48 xl:flex-row", {
					"xl:flex-row-reverse": prev,
				})}
			>
				<div
					className={cn("absolute top-2 right-2 z-50 flex w-fit items-center justify-center gap-1")}
				>
					<ManagementBadges entry={zombie} />
					{zombie.isComingSoon ? <ComingSoonBadge /> : null}
					{zombie.isNew ? <NewBadge /> : null}
					<TypeBadge type={zombie.type} />
					{zombie.games[0] ? (
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{zombie.games[0].title}
						</Badge>
					) : null}
				</div>
				<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex">
					<FeaturedImage
						featuredImage={zombie.image}
						sizes="(max-width: 1280px) 320px, 384px"
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={zombie.image}
						alt={alt}
						sizes="(max-width: 1280px) 320px, 384px"
						className="h-full rounded-lg object-cover object-top"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<h3
						className={cn(
							"font-semibold text-xl transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{
								truncate: zombie.name.length > 20,
							},
						)}
					>
						{zombie.name}
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
