import type { Metadata } from "next"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import { ComingSoonBadge, NewBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeaturedImage from "@/components/featured-image/featured-image"
import GuideFeedback from "@/components/guide-feedback/guide-feedback"
import { ManagementBadges } from "@/components/management-badges/management-badges"
import RichTextRenderer from "@/components/rich-text/rich-text-renderer/rich-text-renderer"
import ShareButton from "@/components/share-button/share-button"
import TableOfContents from "@/components/table-of-contents/table-of-contents"
import { Badge } from "@/components/ui/badge"
import { getCachedImageUrl } from "@/data/og-images"
import { getQuestBySlug, getQuests, type MinifiedSideQuest } from "@/data/side-quests"
import { env } from "@/env"
import { cn } from "@/lib/utils"
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"

const getPageData = cache(async (slug: string) => {
	const q = await getQuestBySlug(slug)
	if (!q) notFound()
	const quests = await getQuests()
	const questIndex = quests.findIndex(q => q.slug === slug)
	const prevQuest = quests[questIndex + 1]
	const nextQuest = quests[questIndex - 1]
	return {
		q,
		prevQuest,
		nextQuest,
	}
})

export const generateStaticParams = async () => {
	const quests = await getQuests()
	return quests.map(q => ({
		game: q.game.slug,
		map: q.map.slug,
		slug: q.slug,
	}))
}

export const generateMetadata = async ({
	params,
}: PageProps<"/side-quests/[game]/[map]/[slug]">): Promise<Metadata> => {
	const [{ slug, game, map }, { isEnabled }] = await Promise.all([params, draftMode()])
	const { q } = await getPageData(slug)
	const title = `${q.title} Side Quest`
	const description = `Learn how to complete the ${q.title} side quest/easter egg for ${q.map.title} with our detailed step-by-step walkthrough!`
	let imageUrl = null

	if (!isEnabled && !IN_DEVELOPMENT) {
		// Avoid potential og generations based on draft content
		imageUrl = await getCachedImageUrl("side-quests", {
			...q,
			game: q.game.title,
			map: q.map.title,
		})
	}

	return {
		title,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description,
			url: `/side-quests/${game}/${map}/${slug}`,
			images: [
				{
					url: imageUrl || "",
					alt: `${q.title} Side Quest`,
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			title,
			description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${game}/${map}/${slug}`,
		},
	}
}

export default async function SideQuestPage({
	params,
}: PageProps<"/side-quests/[game]/[map]/[slug]">) {
	const { slug } = await params
	const { q, prevQuest, nextQuest } = await getPageData(slug)
	if (!q) notFound()
	const headings = q.isComingSoon ? [] : extractHeadings(q.content)

	return (
		<section className="-mt-10 flex w-full justify-center xl:mt-0">
			<div className="mx-auto flex w-svw flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full flex-col xl:flex-row-reverse">
					<TableOfContents headings={headings} />
					<article className="flex w-full flex-col items-center justify-center">
						<div className="relative mt-16 w-full xl:mt-8">
							<div className="absolute top-4 right-0 left-0 z-10 mx-auto hidden w-full max-w-7xl opacity-35 blur-3xl sm:dark:block">
								<FeaturedImage
									featuredImage={q.image}
									sizes="(max-width: 1280px) 100vw, 1280px"
									quality={100}
								/>
							</div>
							<div className="relative z-20 mx-auto max-w-7xl">
								<FeaturedImage
									featuredImage={q.image}
									sizes="(max-width: 1280px) 100vw, 1280px"
									quality={100}
									priority
									className="overflow-hidden xl:rounded-lg"
								/>
								<div className="-top-10 absolute left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
									<Breadcrumbs
										links={[
											{ title: "Side Quests", href: `/side-quests` },
											{ title: q.game.title, href: `/side-quests?game=${q.game.slug}` },
											{ title: q.map.title, href: `/side-quests?map=${q.map.slug}` },
											{
												title: q.title,
												href: `/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`,
											},
										]}
									/>
								</div>
							</div>
						</div>
						<div className="relative z-20 mt-8 mb-4 flex w-full max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
							<div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
								<h2 className="dark:dark-text-gradient pb-2 font-extrabold text-3xl text-gradient md:text-4xl lg:text-5xl">
									{q.title}
								</h2>
								<div className="flex w-fit items-center justify-center gap-4">
									<Suspense>
										<ManagementBadges entry={q} />
									</Suspense>
									{q.isComingSoon ? <ComingSoonBadge /> : q.isNew ? <NewBadge /> : null}
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{q.game.title}
									</Badge>
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{q.map.title}
									</Badge>
								</div>
							</div>
							<div className="flex items-center justify-between text-muted-foreground text-sm">
								<div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 md:flex-row md:pb-0">
									<div className="flex items-center gap-1">
										<Calendar className="size-4" />
										<span>
											Updated: {new Date(q.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS)}
										</span>
									</div>
									<span className="hidden md:inline">&bull;</span>
									<div className="flex items-center gap-1">
										<Clock className="size-4" />
										<span>{q.timeToRead} min read</span>
									</div>
								</div>
								<ShareButton
									title={q.title}
									url={`${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${slug}`}
									className="mb-2 ml-auto text-muted-foreground md:mb-0"
								/>
							</div>
						</div>
						{q.isComingSoon ? (
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
							<RichTextRenderer body={q.content} slug={slug} />
						)}
						<div className="flex w-full items-center justify-center">
							<GuideFeedback guideTitle={q.title} type="Side Quest" map={q.map.title} />
						</div>
						<div className="mt-8 flex w-full flex-col items-center justify-center gap-4 xl:flex-row">
							{prevQuest && <PrevOrNextQuestCard quest={prevQuest} prev />}
							{nextQuest && <PrevOrNextQuestCard quest={nextQuest} />}
						</div>
					</article>
				</div>
			</div>
		</section>
	)
}

interface PrevOrNextQuest {
	quest: MinifiedSideQuest
	prev?: boolean
}

const PrevOrNextQuestCard = ({ quest, prev }: PrevOrNextQuest) => {
	const alt = `${quest.map.title} map image`
	const href = quest.isComingSoon
		? "#"
		: `/side-quests/${quest.game.slug}/${quest.map.slug}/${quest.slug}`

	return (
		<CustomLink
			href={href}
			className={cn(
				"group w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform hover:scale-105 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary lg:max-w-xl dark:shadow-none",
				{
					"pointer-events-none opacity-50": quest.isComingSoon,
				},
			)}
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
					<Suspense>
						<ManagementBadges entry={quest} />
					</Suspense>
					{quest.isComingSoon ? <ComingSoonBadge /> : quest.isNew ? <NewBadge /> : null}
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{quest.map.title}
					</Badge>
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{quest.game.title}
					</Badge>
				</div>
				<div
					className={cn(
						"absolute top-0 right-0 bottom-0 left-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex",
					)}
				>
					<FeaturedImage
						featuredImage={quest.image}
						sizes="(max-width: 1280px) 320px, 384px"
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={quest.image}
						alt={alt}
						sizes="(max-width: 1280px) 320px, 384px"
						className="h-full rounded-lg object-cover"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<h3
						className={cn(
							"font-semibold text-xl transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{ truncate: quest.title.length > 20 },
						)}
					>
						{quest.title}
					</h3>
					<p className="line-clamp-3 text-ellipsis text-sm">{quest.description}</p>
					<div
						className={cn(
							"mt-auto flex items-center pb-2 transition-all group-hover:text-primary",
							{
								"xl:-ml-2": prev,
								"xl:-mr-2": !prev,
							},
						)}
					>
						{prev ? (
							<>
								<ChevronLeft />
								<span>Previous Quest</span>
							</>
						) : (
							<>
								<span className="ml-auto">Next Quest</span>
								<ChevronRight />
							</>
						)}
					</div>
				</div>
			</article>
		</CustomLink>
	)
}
