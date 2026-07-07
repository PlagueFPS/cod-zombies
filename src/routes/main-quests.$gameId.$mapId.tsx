import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { Option } from "effect"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Breadcrumbs, type Link } from "@/components/breadcrumbs"
import { CompletionTimeDisplay } from "@/components/completion-time-display"
import { ComingSoonBadge, DifficultyBadge, NewBadge } from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import { LastUpdatedDisplay } from "@/components/last-updated-display"
import { MdxContent } from "@/components/mdx-content"
import NotFoundContent from "@/components/not-found-content"
import { QuestPageLoader } from "@/components/quest-page-loader"
import { ShareButton } from "@/components/share-button"
import { TableOfContents } from "@/components/table-of-contents"
import { Badge } from "@/components/ui/badge"
import { getGameByKey } from "@/data/games"
import { getAdjacentMaps, getMapByKey, type MapKey } from "@/data/maps"
import { mdxComponentQueryOptions, mdxMetaQueryOptions } from "@/data/queries"
import { getOgImgUrl } from "@/data/server-functions/content"
import { cn } from "@/lib/utils"
import { type EncodedMapEntry, encodeMap } from "@/utils/rsc-wire"
import { capitalize, createSeoTitle } from "@/utils/shared-functions"
import richStyles from "@/rich-text.module.css"

export const Route = createFileRoute("/main-quests/$gameId/$mapId")({
	loader: async ({ params, context }) => {
		const map = getMapByKey(params.mapId as MapKey).pipe(Option.getOrThrowWith(() => notFound()))
		if (map.state.valueOrUndefined === "Coming Soon") throw notFound()
		if (Option.isNone(map.mainQuest)) throw notFound()

		const [opengraphUrl] = await Promise.all([
			getOgImgUrl({ data: { kind: "main-quests", id: map.id } }),
			context.queryClient.prefetchQuery(mdxMetaQueryOptions(map.id, map.mainQuest.value)),
			context.queryClient.prefetchQuery(mdxComponentQueryOptions(map.id, map.mainQuest.value)),
		])

		if (!opengraphUrl) throw notFound()

		const game = getGameByKey(map.game).pipe(Option.getOrThrowWith(() => notFound()))
		const { prev, next } = getAdjacentMaps(map.id as MapKey)

		const title = createSeoTitle(`${map.title} Main Quest`)
		const description = `Learn how to complete the main quest/easter egg for the ${map.title} zombies map with our detailed step-by-step walkthrough!`
		const shareUrl = `${context.serverUrl}/main-quests/${map.game}/${map.id}`

		return {
			title,
			description,
			serverUrl: context.serverUrl,
			opengraphUrl,
			map: { ...encodeMap(map), mainQuest: map.mainQuest.value },
			game: { id: game.id, title: game.title },
			prev: Option.match(prev, { onNone: () => null, onSome: encodeMap }),
			next: Option.match(next, { onNone: () => null, onSome: encodeMap }),
			shareUrl,
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
				content: `${loaderData?.serverUrl}/main-quests/${params.gameId}/${params.mapId}`,
			},
			{ property: "og:image", content: loaderData?.opengraphUrl },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/jpeg" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{ property: "twitter:image", content: loaderData?.opengraphUrl },
		],
	}),
	notFoundComponent: MainQuestNotFound,
	pendingComponent: MainQuestPending,
	component: MainQuestGuide,
	staleTime: Infinity,
})

function MainQuestGuide() {
	const { map, game, next, prev, shareUrl } = Route.useLoaderData()
	const { data: meta } = useSuspenseQuery(mdxMetaQueryOptions(map.id, map.mainQuest))
	const { data: component } = useSuspenseQuery(mdxComponentQueryOptions(map.id, map.mainQuest))

	return (
		<section className="-mt-10 flex w-full justify-center xl:mt-0">
			<div className="mx-auto flex w-svw flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full flex-col xl:flex-row-reverse">
					<TableOfContents headings={meta.headings} />
					<article className="flex w-full flex-col items-center justify-center">
						<div className="relative mt-16 w-full xl:mt-8">
							<div className="absolute top-4 right-0 left-0 mx-auto hidden w-full max-w-7xl opacity-35 blur-3xl sm:dark:block">
								<FeaturedImage
									featuredImage={map.image}
									alt=""
									width={1280}
									height={720}
									loading="eager"
									sizes="(max-width: 1280px) 100vw, 1280px"
								/>
							</div>
							<div className="relative mx-auto max-w-7xl">
								<FeaturedImage
									featuredImage={map.image}
									alt={map.title}
									width={1280}
									height={720}
									sizes="(max-width: 1280px) 100vw, 1280px"
									preload
									className="overflow-hidden xl:rounded-lg"
								/>
								<div className="absolute -top-10 left-0 flex w-full justify-center pl-4 xl:pl-0">
									<Breadcrumbs
										links={[
											{ title: "Main Quests", href: "/main-quests" },
											{
												title: game.title,
												href: "/main-quests",
												search: { game: [game.id] },
											},
											{
												title: map.title,
												href: "/main-quests/$gameId/$mapId",
												params: { gameId: game.id, mapId: map.id },
											},
										]}
									/>
								</div>
							</div>
						</div>
						<div className="relative mt-8 mb-4 flex w-full max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
							<div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
								<h2 className="text-gradient pb-2 text-3xl font-extrabold md:text-4xl lg:text-5xl dark:dark-text-gradient">
									{map.title}
								</h2>
								<div className="flex w-fit items-center justify-center gap-4">
									{map.state === "New" ? <NewBadge /> : null}
									{map.difficulty ? <DifficultyBadge difficulty={map.difficulty} /> : null}
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{game.title}
									</Badge>
								</div>
							</div>
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<div className="flex w-full flex-col-reverse items-start justify-center gap-2 pb-6 md:flex-row md:items-center md:pb-0">
									<div className="flex items-center gap-1">
										<Calendar className="size-4" />
										<LastUpdatedDisplay
											lastModified={meta.lastModified}
											lastModifiedFormatted={meta.lastModifiedFormatted}
										/>
									</div>
									<span className="hidden md:inline">&bull;</span>
									<div className="flex items-center gap-1">
										<Clock className="size-4" />
										<span>{meta.timeToRead} min read</span>
									</div>
									<span className="hidden md:inline">&bull;</span>
									{map.estimatedTimeMins ? (
										<CompletionTimeDisplay timeRange={map.estimatedTimeMins} />
									) : null}
									<ShareButton
										url={shareUrl}
										className="w-fit text-muted-foreground md:mb-0 md:ml-auto"
									/>
								</div>
							</div>
						</div>
						<div
							id="body"
							className={cn("relative mx-auto w-full max-w-[80ch] px-4", richStyles.body)}
						>
							<MdxContent Component={component.Component} />
						</div>
						<div className="mt-8 flex w-full flex-col items-center justify-center gap-4 xl:flex-row">
							{prev ? <PrevOrNextMapCard map={prev} prev /> : null}
							{next ? <PrevOrNextMapCard map={next} /> : null}
						</div>
					</article>
				</div>
			</div>
		</section>
	)
}

interface PrevOrNextCard {
	map: EncodedMapEntry
	prev?: boolean
}

function PrevOrNextMapCard({ map, prev }: PrevOrNextCard) {
	const alt = `${map.title} map image`
	// SAFETY: We know the game key is valid because the map is valid
	const game = getGameByKey(map.game).pipe(Option.getOrThrow)
	const isComingSoon = map.state === "Coming Soon"

	return (
		<CustomLink
			to="/main-quests/$gameId/$mapId"
			params={{ gameId: map.game, mapId: map.id }}
			className={cn(
				"group w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform will-change-transform hover:-translate-y-2 hover:outline-2 hover:outline-primary focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-primary lg:max-w-xl dark:shadow-none",
				{
					"pointer-events-none opacity-50": isComingSoon,
				},
			)}
			tabIndex={isComingSoon ? -1 : 0}
			aria-disabled={isComingSoon}
			disabled={isComingSoon}
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
					{isComingSoon ? <ComingSoonBadge /> : map.state === "New" ? <NewBadge /> : null}
					{map.difficulty ? <DifficultyBadge difficulty={map.difficulty} /> : null}
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{game.title}
					</Badge>
				</div>
				<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex">
					<FeaturedImage
						featuredImage={map.image}
						alt={alt}
						width={384}
						height={176}
						sizes="(max-width: 1280px) 320px, 384px"
						className="scale-110"
					/>
				</div>
				<div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
					<FeaturedImage
						featuredImage={map.image}
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
								truncate: map.title.length > 20,
							},
						)}
					>
						{map.title}
					</h3>
					<p className="line-clamp-3 text-sm text-ellipsis">{map.description}</p>
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

function MainQuestPending() {
	const params = Route.useParams()
	const links: Link[] = [
		{ href: "/main-quests", title: "Main Quests" },
		{ href: "/main-quests", title: capitalize(params.gameId), search: { game: params.gameId } },
		{
			href: "/main-quests/$gameId/$mapId",
			title: capitalize(params.mapId),
			params: { gameId: params.gameId, mapId: params.mapId },
		},
	]

	return <QuestPageLoader mainQuest links={links} />
}

function MainQuestNotFound() {
	const params = Route.useParams()
	const items: Link[] = [
		{ href: "/main-quests", title: "Main Quests" },
		{ href: "/main-quests", title: capitalize(params.gameId), search: { game: params.gameId } },
		{
			href: "/main-quests/$gameId/$mapId",
			title: capitalize(params.mapId),
			params: { gameId: params.gameId, mapId: params.mapId },
		},
	]

	return <NotFoundContent items={items} resource="Main Quest" param={params.mapId} />
}
