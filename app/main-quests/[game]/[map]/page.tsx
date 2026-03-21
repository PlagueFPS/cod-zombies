import type { MDXContent } from "mdx/types"
import type { Metadata, Route } from "next"

import { Effect, FileSystem, Option, Path } from "effect"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { CustomLink } from "@/components/client/custom-link"
import { FeaturedImage } from "@/components/client/featured-image"
import { LastUpdatedDisplay } from "@/components/client/last-updated-display"
import { ShareButton } from "@/components/client/share-button"
import { TableOfContents } from "@/components/client/table-of-contents"
import { CompletionTimeDisplay } from "@/components/server/completion-time-display"
import { ComingSoonBadge, DifficultyBadge, NewBadge } from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { getGameByKey } from "@/data/games"
import {
	getAdjacentMaps,
	getMapByKey,
	getMapsWithMainQuest,
	type MapEntry,
	type MapKey,
} from "@/data/maps"
import { PageRuntime } from "@/lib/layers"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import {
	calculateTimeToRead,
	extractHeadingsFromMDX,
	getLastModified,
	getServerUrl,
} from "@/utils/server-functions"

import richStyles from "@/app/rich-text.module.css"

export const generateStaticParams = () =>
	getMapsWithMainQuest().map(map => ({
		game: map.game,
		map: map.id,
	}))

export const generateMetadata = async ({
	params,
}: PageProps<"/main-quests/[game]/[map]">): Promise<Metadata> => {
	const { map } = await params
	const quest = getMapByKey(map as MapKey)
	if (Option.isNone(quest) || Option.isNone(quest.value.mainQuest)) return notFound()

	const title = `${quest.value.title} Main Quest`
	const description = `Learn how to complete the main quest/easter egg for the ${quest.value.title} zombies map with our detailed step-by-step walkthrough!`

	return {
		title,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description,
			url: `/main-quests/${quest.value.game}/${quest.value.id}`,
			images: {
				url: `${getServerUrl()}/opengraph-images/main-quests/og-${quest.value.id}.jpg`,
				width: 1200,
				height: 630,
			},
		},
		twitter: {
			title,
			description,
			card: "summary_large_image",
		},
		alternates: {
			canonical: `${getServerUrl()}/main-quests/${quest.value.game}/${quest.value.id}`,
		},
	}
}

export default async function MainQuestPage({ params }: PageProps<"/main-quests/[game]/[map]">) {
	return await mainQuestPageUI(params).pipe(
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			NoSuchElementError: () => Effect.sync(() => notFound()),
		}),
		Effect.orDie,
		PageRuntime.runPromise,
	)
}

const mainQuestPageUI = Effect.fn("MainQuestPage")(function* (
	params: PageProps<"/main-quests/[game]/[map]">["params"],
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const mdxComponents = yield* Effect.sync(() => useMDXComponents())
	const { map } = yield* Effect.promise(() => params)
	const quest = yield* getMapByKey(map as MapKey)
	const mainQuestPath = yield* quest.mainQuest
	const game = yield* getGameByKey(quest.game)

	const contentPath = path.join(process.cwd(), `${mainQuestPath}.mdx`)
	const fileContent = yield* fs.readFileString(contentPath)
	const { prev, next } = getAdjacentMaps(quest.id as MapKey)
	const { lastModified, lastModifiedFormatted } = yield* getLastModified(contentPath)
	const { content, stateBadge, headings, timeToRead } = yield* Option.match(quest.state, {
		onNone: () =>
			Effect.gen(function* () {
				return {
					content: yield* Effect.promise(() => import(`@/${mainQuestPath}.mdx`)),
					stateBadge: null,
					headings: extractHeadingsFromMDX(fileContent),
					timeToRead: calculateTimeToRead(fileContent),
				}
			}),
		onSome: state =>
			Effect.gen(function* () {
				const isComingSoon = state === "Coming Soon"
				return {
					content: isComingSoon
						? null
						: yield* Effect.promise(() => import(`@/${mainQuestPath}.mdx`)),
					stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
					headings: isComingSoon ? [] : extractHeadingsFromMDX(fileContent),
					timeToRead: isComingSoon ? 1 : calculateTimeToRead(fileContent),
				}
			}),
	})

	const MDXContent: MDXContent | null = content?.default ?? null

	return (
		<section className="-mt-10 flex w-full justify-center xl:mt-0">
			<div className="mx-auto flex w-svw flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full flex-col xl:flex-row-reverse">
					<TableOfContents headings={headings} />
					<article className="flex w-full flex-col items-center justify-center">
						<div className="relative mt-16 w-full xl:mt-8">
							<div className="absolute top-4 right-0 left-0 mx-auto hidden w-full max-w-7xl opacity-35 blur-3xl sm:dark:block">
								<FeaturedImage
									featuredImage={quest.image}
									width={1280}
									height={720}
									sizes="(max-width: 1280px) 100vw, 1280px"
								/>
							</div>
							<div className="relative mx-auto max-w-7xl">
								<FeaturedImage
									featuredImage={quest.image}
									width={1280}
									height={720}
									sizes="(max-width: 1280px) 100vw, 1280px"
									priority
									className="overflow-hidden xl:rounded-lg"
								/>
								<div className="absolute -top-10 left-0 flex w-full justify-center pl-4 xl:pl-0">
									<Breadcrumbs
										links={[
											{
												title: "Main Quests",
												href: "/main-quests",
											},
											{
												title: game.title,
												href: `/main-quests?game=${quest.game}`,
											},
											{
												title: quest.title,
												href: `/main-quests/${quest.game}/${quest.id}` as Route,
											},
										]}
									/>
								</div>
							</div>
						</div>
						<div className="relative mt-8 mb-4 flex w-full max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
							<div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
								<h2 className="text-gradient pb-2 text-3xl font-extrabold md:text-4xl lg:text-5xl dark:dark-text-gradient">
									{quest.title}
								</h2>
								<div className="flex w-fit items-center justify-center gap-4">
									{stateBadge}
									{Option.match(quest.difficulty, {
										onNone: () => null,
										onSome: difficulty => <DifficultyBadge difficulty={difficulty} />,
									})}
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{game.title}
									</Badge>
								</div>
							</div>
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 md:flex-row md:pb-0">
									<div className="flex items-center gap-1">
										<Calendar className="size-4" />
										<LastUpdatedDisplay
											lastModified={lastModified}
											lastModifiedFormatted={lastModifiedFormatted}
										/>
									</div>
									<span className="hidden md:inline">&bull;</span>
									<div className="flex items-center gap-1">
										<Clock className="size-4" />
										<span>{timeToRead} min read</span>
									</div>
									<span className="hidden md:inline">&bull;</span>
									{Option.match(quest.estimatedTimeMins, {
										onNone: () => null,
										onSome: estimatedTimeMins => (
											<CompletionTimeDisplay timeRange={estimatedTimeMins} />
										),
									})}
								</div>
								<ShareButton
									title={quest.title}
									url={`${getServerUrl()}/main-quests/${quest.game}/${quest.id}`}
									className="mb-2 ml-auto text-muted-foreground md:mb-0"
								/>
							</div>
						</div>
						{!MDXContent ? (
							<div className="relative mx-auto my-20 max-w-[80ch] space-y-2 px-4 text-center">
								<p className="text-xl font-bold">
									This article is currently being written and will take some time before being
									ready.
								</p>
								<p className="text-foreground/90">
									Check back soon or subscribe to our newsletter at the bottom of this page to be
									notified when this guide is ready!
								</p>
							</div>
						) : (
							<div
								id="body"
								className={cn("relative mx-auto w-full max-w-[80ch] px-4", richStyles.body)}
							>
								<MDXContent components={mdxComponents} />
							</div>
						)}
						<div className="mt-8 flex w-full flex-col items-center justify-center gap-4 xl:flex-row">
							{Option.match(prev, {
								onNone: () => null,
								onSome: prev => <PrevOrNextMapCard quest={prev} prev />,
							})}
							{Option.match(next, {
								onNone: () => null,
								onSome: next => <PrevOrNextMapCard quest={next} />,
							})}
						</div>
					</article>
				</div>
			</div>
		</section>
	)
})

interface PrevOrNextCard {
	quest: MapEntry
	prev?: boolean
}

const PrevOrNextMapCard = ({ quest, prev }: PrevOrNextCard) => {
	const alt = `${quest.title} map image`
	const questState = Option.getOrNull(quest.state)
	const game = getGameByKey(quest.game)

	return (
		<CustomLink
			href={questState === "Coming Soon" ? "#" : `/main-quests/${quest.game}/${quest.id}`}
			className={cn(
				"group w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform will-change-transform hover:-translate-y-2 hover:outline-2 hover:outline-primary focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-primary lg:max-w-xl dark:shadow-none",
				{
					"pointer-events-none opacity-50": questState === "Coming Soon",
				},
			)}
			tabIndex={questState === "Coming Soon" ? -1 : 0}
			aria-disabled={questState === "Coming Soon"}
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
					{questState === "Coming Soon" ? (
						<ComingSoonBadge />
					) : questState === "New" ? (
						<NewBadge />
					) : null}
					{Option.match(quest.difficulty, {
						onNone: () => null,
						onSome: difficulty => <DifficultyBadge difficulty={difficulty} />,
					})}
					{Option.match(game, {
						onNone: () => null,
						onSome: game => (
							<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
								{game.title}
							</Badge>
						),
					})}
				</div>
				<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex">
					<FeaturedImage
						featuredImage={quest.image}
						alt={alt}
						width={384}
						height={176}
						sizes="(max-width: 1280px) 320px, 384px"
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={quest.image}
						alt={alt}
						width={384}
						height={176}
						sizes="(max-width: 1280px) 320px, 384px"
						className="h-full rounded-lg object-cover"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<h3
						className={cn(
							"text-xl font-semibold transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{
								truncate: quest.title.length > 20,
							},
						)}
					>
						{quest.title}
					</h3>
					<p className="line-clamp-3 text-sm text-ellipsis">{quest.description}</p>
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
