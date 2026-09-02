import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { cn } from "cn"
import { Option } from "effect"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Breadcrumbs, type Link } from "@/components/breadcrumbs"
import { CompletionTimeDisplay } from "@/components/completion-time-display"
import { NewBadge, TypeBadge } from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import ImageLoader from "@/components/image-loader"
import { LastUpdatedDisplay } from "@/components/last-updated-display"
import { MdxContent } from "@/components/mdx-content"
import NotFoundContent from "@/components/not-found-content"
import { RichBlockquote } from "@/components/rich-blockquote"
import { ShareButton } from "@/components/share-button"
import { TableOfContents } from "@/components/table-of-contents"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getGameByKey } from "@/data/games"
import { getMapByKey } from "@/data/maps"
import { mdxComponentQueryOptions, mdxMetaQueryOptions } from "@/data/queries"
import { getAdjacentRelics, getRelicByKey, type RelicKey } from "@/data/relics"
import { getOgImgUrl } from "@/data/server-functions/content"
import { type EncodedRelic, encodeRelic } from "@/utils/rsc-wire"
import { capitalize, createSeoTitle } from "@/utils/shared-functions"
import richStyles from "@/rich-text.module.css"

export const Route = createFileRoute("/relics/$gameId/$relicId")({
	loader: async ({ params, context }) => {
		const relic = getRelicByKey(params.relicId as RelicKey).pipe(
			Option.getOrThrowWith(() => notFound()),
		)
		if (relic.state.valueOrUndefined === "Coming Soon") throw notFound()

		const [opengraphUrl] = await Promise.all([
			getOgImgUrl({ data: { kind: "relics", id: relic.id } }),
			context.queryClient.prefetchQuery(mdxMetaQueryOptions(relic.id, relic.content)),
			context.queryClient.prefetchQuery(mdxComponentQueryOptions(relic.id, relic.content)),
		])

		if (!opengraphUrl) throw notFound()

		const map = getMapByKey(relic.map).pipe(Option.getOrThrowWith(() => notFound()))
		const game = getGameByKey(map.game).pipe(Option.getOrThrowWith(() => notFound()))
		const { prev, next } = getAdjacentRelics(relic.id as RelicKey)

		const title = createSeoTitle(`${relic.title} Relic Guide`)
		const description = `Learn how to unlock the ${relic.type} ${relic.title} relic with the effect: ${relic.description}`
		const shareUrl = `${context.serverUrl}/relics/${game.id}/${relic.id}`

		return {
			title,
			description,
			serverUrl: context.serverUrl,
			opengraphUrl,
			relic: { ...encodeRelic(relic), content: relic.content },
			map: { id: map.id, title: map.title },
			game: { id: game.id, title: game.title },
			prev: Option.match(prev, { onNone: () => null, onSome: encodeRelic }),
			next: Option.match(next, { onNone: () => null, onSome: encodeRelic }),
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
				content: `${loaderData?.serverUrl}/relics/${params.gameId}/${params.relicId}`,
			},
			{ property: "og:image", content: loaderData?.opengraphUrl },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/jpeg" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{ property: "twitter:image", content: loaderData?.opengraphUrl },
			{
				property: "twitter:url",
				content: `${loaderData?.serverUrl}/relics/${params.gameId}/${params.relicId}`,
			},
			{ property: "twitter:card", content: "summary_large_image" },
		],
	}),
	notFoundComponent: RelicNotFound,
	pendingComponent: RelicPending,
	component: RelicGuide,
	staleTime: Infinity,
})

function RelicGuide() {
	const { relic, map, game, prev, next, serverUrl } = Route.useLoaderData()
	const { data: meta } = useSuspenseQuery(mdxMetaQueryOptions(relic.id, relic.content))
	const { data: component } = useSuspenseQuery(mdxComponentQueryOptions(relic.id, relic.content))

	return (
		<section className="mx-auto -mt-10 md:py-12 xl:mt-0">
			<div className="flex w-full flex-col xl:flex-row-reverse">
				<TableOfContents headings={meta.headings} className="m-0 -mt-10" />
				<article className="mx-auto max-w-4xl space-y-8">
					<header className="relative mt-16 space-y-6 border-b pb-8 text-center xl:mt-0">
						<div className="mx-auto size-64 rounded-lg bg-muted dark:bg-accent/30">
							<FeaturedImage
								featuredImage={relic.image}
								alt={relic.title}
								width={256}
								height={256}
								sizes="256px"
								className="object-cover"
								preload
							/>
						</div>
						<div className="absolute -top-10 left-0 flex w-full justify-center pl-4 xl:pl-0">
							<Breadcrumbs
								links={[
									{ title: "Relics", href: "/relics" },
									{
										title: relic.title,
										href: "/relics/$gameId/$relicId",
										params: { gameId: game.id, relicId: relic.id },
									},
								]}
							/>
						</div>
						<div className="space-y-4">
							<h2 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
								{relic.title}
							</h2>
							<div className="flex flex-wrap items-center justify-center gap-3">
								{relic.state === "New" ? <NewBadge /> : null}
								<TypeBadge type={relic.type} />
								<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
									{map.title}
								</Badge>
							</div>

							<div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
								<span className="flex items-center gap-1">
									<Calendar className="size-4" />
									<LastUpdatedDisplay
										lastModified={meta.lastModified}
										lastModifiedFormatted={meta.lastModifiedFormatted}
									/>
								</span>
								<span className="inline">&bull;</span>
								<span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
									<Clock className="size-4" />
									<span>{meta.timeToRead} min read</span>
								</span>
								<span className="hidden md:inline">&bull;</span>
								<CompletionTimeDisplay timeRange={relic.estimatedTimeMins} />
								<span className="inline">&bull;</span>
								<ShareButton url={`${serverUrl}/relics/${game.id}/${relic.id}`} className="w-fit" />
							</div>
						</div>
					</header>

					<div
						id="body"
						className={cn("relative mx-auto w-full max-w-[80ch] px-4", richStyles.body)}
					>
						<RichBlockquote>
							<b>Effect:</b> {relic.description}
						</RichBlockquote>
						<MdxContent Component={component.Component} />
					</div>
					<div className="mt-8 flex w-full items-center justify-evenly gap-4">
						{prev ? <PrevOrNextRelicCard relic={prev} prev /> : null}
						{next ? <PrevOrNextRelicCard relic={next} /> : null}
					</div>
				</article>
			</div>
		</section>
	)
}

interface PrevOrNextRelicCardProps {
	relic: EncodedRelic
	prev?: boolean
}

function PrevOrNextRelicCard({ relic, prev }: PrevOrNextRelicCardProps) {
	// SAFETY: If we have a relic, we have a map for that relic
	// similarily, if we have a map, we have a game for that map
	const map = getMapByKey(relic.map).pipe(Option.getOrThrow)
	const game = getGameByKey(map.game).pipe(Option.getOrThrow)

	return (
		<Button
			nativeButton={false}
			variant="outline"
			render={
				<CustomLink to="/relics/$gameId/$relicId" params={{ gameId: game.id, relicId: relic.id }} />
			}
			className="group w-fit hover:text-primary"
		>
			<article className="flex items-center justify-between transition-colors group-focus-visible:text-primary">
				{prev ? (
					<span className="inline-flex items-center justify-center gap-1">
						<ChevronLeft className="transition-all group-hover:-translate-x-1 group-focus-visible:-translate-x-1" />
						<span>{relic.title}</span>
					</span>
				) : (
					<span className="inline-flex items-center justify-center gap-1">
						<span className="ml-auto">{relic.title}</span>
						<ChevronRight className="transition-all group-hover:translate-x-1 group-focus-visible:translate-x-1" />
					</span>
				)}
			</article>
		</Button>
	)
}

function RelicPending() {
	const params = Route.useParams()
	const links: Link[] = [
		{ href: "/relics", title: "Relics" },
		{
			href: `/relics/$gameId/$relicId`,
			title: params.relicId,
			params: { gameId: params.gameId, relicId: params.relicId },
		},
	]

	return (
		<section className="container mx-auto -mt-10 max-w-4xl px-4 md:py-12">
			<Breadcrumbs links={links} className="mb-14" />
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
							<Skeleton className="h-6 w-28 rounded-full badge-primary-gradient dark:dark-badge-primary-gradient" />
						</div>

						<div className="flex items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
							<span className="flex items-center gap-1 text-muted-foreground">
								<Calendar className="size-4" />
								<span>Updated:</span>
								<Skeleton className="h-5 w-32" />
							</span>
							<span className="inline">&bull;</span>
							<span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
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

function RelicNotFound() {
	const params = Route.useParams()
	const items: Link[] = [
		{ href: "/relics", title: "Relics" },
		{
			href: "/relics",
			title: capitalize(params.gameId),
			search: { game: params.gameId },
		},
		{
			href: "/relics/$gameId/$relicId",
			title: capitalize(params.relicId),
			params: { gameId: params.gameId, relicId: params.relicId },
		},
	]

	return <NotFoundContent items={items} resource="Relic" param={params.relicId} />
}
