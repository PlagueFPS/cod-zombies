import type { Metadata } from "next"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { cache } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import {
	ChangedBadge,
	ComingSoonBadge,
	DifficultyBadge,
	DraftBadge,
	NewBadge,
} from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeaturedImage from "@/components/featured-image/featured-image"
import GuideFeedback from "@/components/guide-feedback/guide-feedback"
import RichTextRenderer from "@/components/rich-text/rich-text-renderer/rich-text-renderer"
import ShareButton from "@/components/share-button/share-button"
import TableOfContents from "@/components/table-of-contents/table-of-contents"
import { Badge } from "@/components/ui/badge"
import { getMapBySlug, getMapSearchData, getMaps, type MinifiedFeaturedMap } from "@/data/maps"
import { env } from "@/env"
import { cn } from "@/lib/utils"
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"

interface MapPageProps {
	params: Promise<{
		game: string | undefined
		slug: string
	}>
}

interface PrevOrNextMap {
	map: MinifiedFeaturedMap
	isEnabled: boolean
	prev?: boolean
}

const getPageData = cache(async (draftMode: boolean, slug: string) => {
	const map = await getMapBySlug(draftMode, slug)
	if (!map) {
		notFound()
	}
	const maps = await getMaps(draftMode)
	const mapIndex = maps.findIndex(m => m.slug === map.slug)

	return {
		map,
		prevMap: maps[mapIndex + 1],
		nextMap: maps[mapIndex - 1],
	}
})

export const generateStaticParams = async () => {
	const featuredMaps = await getMapSearchData(false)

	return featuredMaps.map(map => ({
		game: map.game.slug,
		slug: map.slug,
	}))
}

export const generateMetadata = async ({ params }: MapPageProps): Promise<Metadata> => {
	const [{ slug, game }, { isEnabled }] = await Promise.all([params, draftMode()])
	const { map } = await getPageData(isEnabled, slug)
	const { title: mapTitle, game: mapGame } = map
	const title = `${mapTitle} Main Quest`
	const description = `Learn how to complete the main quest/easter egg for the ${mapGame.title} zombies map ${mapTitle} with our detailed step-by-step walkthrough!`
	return {
		title,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description,
			url: `/${game}/${slug}`,
		},
		twitter: {
			title,
			description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}/${game}/${slug}`,
		},
	}
}

export default async function MapPage({ params }: MapPageProps) {
	const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
	const { map, nextMap, prevMap } = await getPageData(isEnabled, slug)
	const headings = map.isComingSoon ? [] : extractHeadings(map.body)

	return (
		<section className="-mt-10 flex w-full justify-center xl:mt-0">
			<div className="mx-auto flex w-svw flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full flex-col xl:flex-row-reverse">
					<TableOfContents headings={headings} />
					<article className="flex w-full flex-col items-center justify-center">
						<div className="relative mt-16 w-full xl:mt-8">
							<div className="absolute top-4 right-0 left-0 z-10 mx-auto hidden w-full max-w-7xl opacity-35 blur-3xl sm:dark:block">
								<FeaturedImage
									featuredImage={map.image}
									sizes="(max-width: 1280px) 100vw, 1280px"
									quality={100}
								/>
							</div>
							<div className="relative z-20 mx-auto max-w-7xl">
								<FeaturedImage
									featuredImage={map.image}
									sizes="(max-width: 1280px) 100vw, 1280px"
									quality={100}
									priority
									className="overflow-hidden xl:rounded-lg"
								/>
								<div className="-top-10 absolute left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
									<Breadcrumbs
										links={[
											{ title: map.game.title, href: `/?game=${map.game.slug}` },
											{ title: map.title, href: `/${map.game.slug}/${slug}` },
										]}
									/>
								</div>
							</div>
						</div>
						<div className="relative z-20 mt-8 mb-4 flex w-full max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
							<div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
								<h2 className="dark:dark-text-gradient pb-2 font-extrabold text-3xl text-gradient md:text-4xl lg:text-5xl">
									{map.title}
								</h2>
								<div className="flex w-fit items-center justify-center gap-4">
									{(isEnabled || IN_DEVELOPMENT) && map.isDraft ? <DraftBadge /> : null}
									{(isEnabled || IN_DEVELOPMENT) && map.isChanged ? <ChangedBadge /> : null}
									{map.isComingSoon ? <ComingSoonBadge /> : map.isNew ? <NewBadge /> : null}
									{map.difficulty && <DifficultyBadge difficulty={map.difficulty} />}
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{map.game.title}
									</Badge>
								</div>
							</div>
							<div className="flex items-center justify-between text-muted-foreground text-sm">
								<div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 md:flex-row md:pb-0">
									<div className="flex items-center gap-1">
										<Calendar className="size-4" />
										<span>
											Updated: {new Date(map.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS)}
										</span>
									</div>
									<span className="hidden md:inline">&bull;</span>
									<div className="flex items-center gap-1">
										<Clock className="size-4" />
										<span>{map.timeToRead} min read</span>
									</div>
								</div>
								<ShareButton
									title={map.title}
									url={`${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game.slug}/${slug}`}
									className="mb-2 ml-auto text-muted-foreground md:mb-0"
								/>
							</div>
						</div>
						{map.isComingSoon && !IN_DEVELOPMENT ? (
							<div className="relative mx-auto my-20 max-w-[80ch] space-y-2 px-4 text-center">
								<p className="font-bold text-xl">
									This article is currently being written and will take some time before being
									ready.
								</p>
								<p className="text-foreground/90">
									Check back soon or subscribe to our newsletter at the bottom of this page to be
									notified when this guide is ready!
								</p>
							</div>
						) : (
							<RichTextRenderer body={map.body} slug={slug} />
						)}
						<div className="flex w-full items-center justify-center">
							<GuideFeedback guideTitle={map.title} type="Main Quest" />
						</div>
						<div className="mt-8 flex w-full flex-col items-center justify-center gap-4 xl:flex-row">
							{prevMap && <PrevOrNextMapCard map={prevMap} isEnabled={isEnabled} prev />}
							{nextMap && <PrevOrNextMapCard map={nextMap} isEnabled={isEnabled} />}
						</div>
					</article>
				</div>
			</div>
		</section>
	)
}

const PrevOrNextMapCard = ({ map, isEnabled, prev }: PrevOrNextMap) => {
	const alt = `${map.title} map image`
	const href = map.isComingSoon ? "#" : `/${map.game.slug}/${map.slug}`

	return (
		<CustomLink
			href={href}
			className={cn(
				"group hover:-translate-y-2 focus-visible:-translate-y-2 w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform will-change-transform hover:outline-2 hover:outline-primary focus-visible:outline-2 focus-visible:outline-primary lg:max-w-xl dark:shadow-none",
				{
					"pointer-events-none opacity-50": map.isComingSoon,
				},
			)}
			tabIndex={map.isComingSoon ? -1 : 0}
		>
			<article
				className={cn(
					"relative flex h-full flex-col items-center overflow-hidden px-2 py-4 xl:h-48 xl:flex-row",
					{
						"xl:flex-row-reverse": prev,
					},
				)}
			>
				<div
					className={cn("absolute top-2 right-2 z-50 flex w-fit items-center justify-center gap-1")}
				>
					{map.isComingSoon ? <ComingSoonBadge /> : map.isNew ? <NewBadge /> : null}
					{(isEnabled || IN_DEVELOPMENT) && map.isDraft ? <DraftBadge /> : null}
					{(isEnabled || IN_DEVELOPMENT) && map.isChanged ? <ChangedBadge /> : null}
					{map.difficulty && <DifficultyBadge difficulty={map.difficulty} />}
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{map.game.title}
					</Badge>
				</div>
				<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex">
					<FeaturedImage
						featuredImage={map.image}
						alt={alt}
						sizes="(max-width: 1280px) 320px, 384px"
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={map.image}
						alt={alt}
						sizes="(max-width: 1280px) 320px, 384px"
						className="h-full rounded-lg object-cover"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<h3
						className={cn(
							"font-semibold text-xl transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{
								truncate: map.title.length > 20,
							},
						)}
					>
						{map.title}
					</h3>
					<p className="line-clamp-3 text-ellipsis text-sm">{map.description}</p>
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
								<span>Previous Map</span>
							</>
						) : (
							<>
								<span className="ml-auto">Next Map</span>
								<ChevronRight />
							</>
						)}
					</div>
				</div>
			</article>
		</CustomLink>
	)
}
