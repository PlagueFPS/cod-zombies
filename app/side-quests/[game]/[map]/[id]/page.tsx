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
import { ComingSoonBadge, NewBadge } from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { getGameByKey } from "@/data/games"
import { getMapByKey } from "@/data/maps"
import {
	getAdjacentSideQuests,
	getSideQuestByKey,
	getSideQuests,
	type SideQuest,
	type SideQuestKey,
} from "@/data/side-quests"
import { PageRuntime } from "@/lib/layers"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import {
	calculateTimeToRead,
	extractHeadingsFromMDX,
	getLastModified,
	getOpengraphImageUrl,
	getServerUrl,
} from "@/utils/server-functions"
import { capitalize } from "@/utils/shared-functions"
import richStyles from "@/app/rich-text.module.css"

export const generateStaticParams = () => {
	const quests = getSideQuests()
	return quests.map(q => {
		// This is run at build time so we can fail the build if the map doesn't exist
		const map = getMapByKey(q.map).pipe(Option.getOrThrow)
		return {
			game: map.game,
			map: q.map,
			id: q.id,
		}
	})
}

export const generateMetadata = async ({
	params,
}: PageProps<"/side-quests/[game]/[map]/[id]">): Promise<Metadata> => {
	return await Effect.gen(function* () {
		const { game, map, id } = yield* Effect.promise(() => params)
		const quest = yield* getSideQuestByKey(id as SideQuestKey)
		const opengraphImageUrl = yield* getOpengraphImageUrl("side-quests", quest.id)
		if (Option.isNone(opengraphImageUrl)) return yield* Effect.sync(() => notFound())

		const title = `${quest.title} Side Quest`
		const description = `Learn how to complete the ${quest.title} side quest/easter egg on ${capitalize(map)} with our detailed step-by-step walkthrough!`

		return {
			title,
			description,
			openGraph: {
				...GLOBAL_OG_PROPS.openGraph,
				title,
				description,
				url: `/side-quests/${game}/${map}/${id}`,
				images: {
					url: opengraphImageUrl.value,
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
				canonical: `${getServerUrl()}/side-quests/${game}/${map}/${id}`,
			},
		}
	}).pipe(
		Effect.withLogSpan("SideQuestPage.generateMetadata"),
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			NoSuchElementError: () => Effect.sync(() => notFound()),
		}),
		Effect.orDie,
		PageRuntime.runPromise,
	)
}

export default async function SideQuestPage({
	params,
}: PageProps<"/side-quests/[game]/[map]/[id]">) {
	return await sideQuestPageUI(params).pipe(
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			NoSuchElementError: () => Effect.sync(() => notFound()),
		}),
		Effect.orDie,
		PageRuntime.runPromise,
	)
}

const sideQuestPageUI = Effect.fn("SideQuestPage")(function* (
	params: PageProps<"/side-quests/[game]/[map]/[id]">["params"],
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const mdxComponents = yield* Effect.sync(() => useMDXComponents())
	const { id } = yield* Effect.promise(() => params)
	const quest = yield* getSideQuestByKey(id as SideQuestKey)
	const map = yield* getMapByKey(quest.map)
	const game = yield* getGameByKey(map.game)

	const { prev, next } = getAdjacentSideQuests(quest.id as SideQuestKey)
	const contentPath = path.join(process.cwd(), `${quest.content}.mdx`)
	const fileContent = yield* fs.readFileString(contentPath)
	const { lastModified, lastModifiedFormatted } = yield* getLastModified(contentPath)
	const { content, stateBadge, headings, timeToRead } = yield* Option.match(quest.state, {
		onNone: () =>
			Effect.gen(function* () {
				return {
					content: yield* Effect.promise(() => import(`@/${quest.content}.mdx`)),
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
						: yield* Effect.promise(() => import(`@/${quest.content}.mdx`)),
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
							<div className="absolute top-4 right-0 left-0 z-10 mx-auto hidden w-full max-w-7xl opacity-35 blur-3xl sm:dark:block">
								<FeaturedImage
									featuredImage={map.image}
									sizes="(max-width: 1280px) 100vw, 1280px"
									width={1280}
									height={720}
								/>
							</div>
							<div className="relative z-20 mx-auto max-w-7xl">
								<FeaturedImage
									featuredImage={map.image}
									sizes="(max-width: 1280px) 100vw, 1280px"
									width={1280}
									height={720}
									priority
									className="overflow-hidden xl:rounded-lg"
								/>
								<div className="absolute -top-10 left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
									<Breadcrumbs
										links={[
											{ title: "Side Quests", href: `/side-quests` },
											{
												title: game.title,
												href: `/side-quests?game=${game.id}`,
											},
											{
												title: map.title,
												href: `/side-quests?map=${map.id}`,
											},
											{
												title: quest.title,
												href: `/side-quests/${game.id}/${map.id}/${quest.id}`,
											},
										]}
									/>
								</div>
							</div>
						</div>
						<div className="relative z-20 mt-8 mb-4 flex w-full max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
							<div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
								<h2 className="text-gradient pb-2 text-3xl font-extrabold md:text-4xl lg:text-5xl dark:dark-text-gradient">
									{quest.title}
								</h2>
								<div className="flex w-fit items-center justify-center gap-4">
									{stateBadge}
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{map.title}
									</Badge>
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
								</div>
								<ShareButton
									title={quest.title}
									url={`${getServerUrl()}/side-quests/${game.id}/${map.id}/${quest.id}`}
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
							{Option.isSome(prev) && <PrevOrNextQuestCard quest={prev.value} prev />}
							{Option.isSome(next) && <PrevOrNextQuestCard quest={next.value} />}
						</div>
					</article>
				</div>
			</div>
		</section>
	)
})

interface PrevOrNextCard {
	quest: SideQuest
	prev?: boolean
}

const PrevOrNextQuestCard = ({ quest, prev }: PrevOrNextCard) => {
	const map = getMapByKey(quest.map)
	if (Option.isNone(map)) {
		console.error(`Map not found for key ${quest.map}`)
		return null
	}
	const game = getGameByKey(map.value.game)
	if (Option.isNone(game)) {
		console.error(`Game not found for key ${map.value.game}`)
		return null
	}

	const alt = `${map.value.title} map image`
	const { href, badge, disabled, tabIndex } = Option.match(quest.state, {
		onNone: () => ({
			href: `/side-quests/${game.value.id}/${map.value.id}/${quest.id}`,
			disabled: false,
			tabIndex: 0,
			badge: null,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				href: isComingSoon ? "#" : `/side-quests/${game.value.id}/${map.value.id}/${quest.id}`,
				disabled: isComingSoon,
				tabIndex: isComingSoon ? -1 : 0,
				badge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
			}
		},
	})

	return (
		<CustomLink
			href={href as Route}
			className={cn(
				"group w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform hover:scale-105 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary lg:max-w-xl dark:shadow-none",
				{
					"pointer-events-none opacity-50": disabled,
				},
			)}
			tabIndex={tabIndex}
			aria-disabled={disabled}
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
					{badge}
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{map.value.title}
					</Badge>
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{game.value.title}
					</Badge>
				</div>
				<div
					className={cn(
						"absolute top-0 right-0 bottom-0 left-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex",
					)}
				>
					<FeaturedImage
						featuredImage={map.value.image}
						sizes="(max-width: 1280px) 320px, 384px"
						width={384}
						height={176}
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={map.value.image}
						alt={alt}
						sizes="(max-width: 1280px) 320px, 384px"
						width={384}
						height={176}
						className="h-full rounded-lg object-cover"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full flex-col justify-center gap-2 px-4 pt-4 xl:pt-6">
					<h3
						className={cn(
							"text-xl font-semibold transition-colors will-change-transform group-hover:text-primary group-focus-visible:text-primary",
							{ truncate: quest.title.length > 20 },
						)}
					>
						{quest.title}
					</h3>
					<p className="line-clamp-3 text-sm text-ellipsis">{quest.description}</p>
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
