import type { MDXContent } from "mdx/types"
import type { Metadata } from "next"
import { Effect, FileSystem, Option, Path } from "effect"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { CustomLink } from "@/components/client/custom-link"
import { FeaturedImage } from "@/components/client/featured-image"
import { LastUpdatedDisplay } from "@/components/client/last-updated-display"
import { TableOfContents } from "@/components/client/table-of-contents"
import { CompletionTimeDisplay } from "@/components/server/completion-time-display"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/server/custom-badges"
import { RichBlockquote } from "@/components/server/rich-blockquote"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getGameByKey } from "@/data/games"
import { getMapByKey } from "@/data/maps"
import {
	getAdjacentRelics,
	getRelicByKey,
	getRelics,
	type Relic,
	type RelicKey,
} from "@/data/relics"
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

export const generateStaticParams = () => {
	const relics = getRelics()
	return relics.map(r => {
		const map = getMapByKey(r.map).pipe(Option.getOrThrow)
		const game = getGameByKey(map.game).pipe(Option.getOrThrow)

		return {
			game: game.id,
			id: r.id,
		}
	})
}

export const generateMetadata = async ({
	params,
}: PageProps<"/relics/[game]/[id]">): Promise<Metadata> => {
	const { game, id } = await params
	const relic = getRelicByKey(id as RelicKey)
	if (Option.isNone(relic)) return notFound()

	const title = `${relic.value.title} Relic Guide`
	const description = `Learn how to unlock the ${relic.value.type} ${relic.value.title} relic with the effect: ${relic.value.description}`

	return {
		title,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS,
			title,
			description,
			url: `/relics/${game}/${id}`,
			images: {
				url: `${getServerUrl()}/relics/${id}-relic.webp`,
				width: 256,
				height: 256,
			},
		},
		twitter: {
			title,
			description,
			card: "summary",
		},
		alternates: {
			canonical: `${getServerUrl()}/relics/${game}/${id}`,
		},
	}
}

export default async function RelicPage({ params }: PageProps<"/relics/[game]/[id]">) {
	return await buildRelicPage(params).pipe(
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			NoSuchElementError: () => Effect.sync(() => notFound()),
		}),
		Effect.orDie,
		PageRuntime.runPromise,
	)
}

const buildRelicPage = Effect.fn("buildRelicPage")(function* (
	params: PageProps<"/relics/[game]/[id]">["params"],
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const mdxComponents = yield* Effect.sync(() => useMDXComponents())
	const { game, id } = yield* Effect.promise(() => params)
	const relic = yield* getRelicByKey(id as RelicKey)
	const map = yield* getMapByKey(relic.map)

	const contentPath = path.join(process.cwd(), `${relic.content}.mdx`)
	const fileContent = yield* fs.readFileString(contentPath)
	const { prev, next } = getAdjacentRelics(relic.id as RelicKey)
	const { lastModified, lastModifiedFormatted } = yield* getLastModified(contentPath)

	const { content, stateBadge, headings, timeToRead } = yield* Option.match(relic.state, {
		onNone: () =>
			Effect.gen(function* () {
				return {
					content: yield* Effect.promise(() => import(`@/${relic.content}.mdx`)),
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
						: yield* Effect.promise(() => import(`@/${relic.content}.mdx`)),
					stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
					headings: extractHeadingsFromMDX(fileContent),
					timeToRead: isComingSoon ? 1 : calculateTimeToRead(fileContent),
				}
			}),
	})

	const MDXContent: MDXContent | null = content?.default ?? null

	return (
		<section className="mx-auto -mt-10 md:py-12 xl:mt-0">
			<div className="flex flex-col xl:flex-row-reverse">
				<TableOfContents headings={headings} className="m-0" />
				<article className="mx-auto max-w-4xl space-y-8">
					<header className="relative mt-16 space-y-6 border-b pb-8 text-center xl:mt-8">
						<div className="mx-auto size-64 rounded-lg bg-muted dark:bg-accent/30">
							<FeaturedImage
								featuredImage={relic.image}
								alt={relic.title}
								width={256}
								height={256}
								sizes="256px"
								className="object-cover"
								priority
							/>
						</div>
						<div className="absolute -top-10 left-0 flex w-full justify-center pl-4 xl:pl-0">
							<Breadcrumbs
								links={[
									{ title: "Relics", href: "/relics" },
									{
										title: relic.title,
										href: `/relics/${game}/${relic.id}`,
									},
								]}
							/>
						</div>
						<div className="space-y-4">
							<h2 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
								{relic.title}
							</h2>
							<div className="flex flex-wrap items-center justify-center gap-3">
								{stateBadge}
								<TypeBadge type={relic.type} />
								<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
									{map.title}
								</Badge>
							</div>

							<div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
								<span className="flex items-center gap-1">
									<Calendar className="size-4" />
									<LastUpdatedDisplay
										lastModified={lastModified}
										lastModifiedFormatted={lastModifiedFormatted}
									/>
								</span>
								<span className="inline">&bull;</span>
								<span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
									<Clock className="size-4" />
									<span>{timeToRead} min read</span>
								</span>
								<span className="hidden md:inline">&bull;</span>
								<CompletionTimeDisplay timeRange={relic.estimatedTimeMins} />
							</div>
						</div>
					</header>

					{!MDXContent ? (
						<div className="relative mx-auto my-20 max-w-[80ch] space-y-2 px-4 text-center">
							<p className="text-xl font-bold">
								This guide is currently being written and will take some time before being ready.
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
							<RichBlockquote>
								<b>Effect:</b> {relic.description}
							</RichBlockquote>
							<MDXContent components={mdxComponents} />
						</div>
					)}
					<div className="mt-8 flex w-full items-center justify-evenly gap-4">
						{Option.isSome(prev) && <PrevOrNextRelicCard relic={prev.value} prev />}
						{Option.isSome(next) && <PrevOrNextRelicCard relic={next.value} />}
					</div>
				</article>
			</div>
		</section>
	)
})

interface PrevOrNextRelicCardProps {
	relic: Relic
	prev?: boolean
}

const PrevOrNextRelicCard = ({ relic, prev }: PrevOrNextRelicCardProps) => {
	const map = getMapByKey(relic.map)
	if (Option.isNone(map)) {
		console.error(`Map not found for key ${relic.map}`)
		return null
	}

	const game = getGameByKey(map.value.game)
	if (Option.isNone(game)) {
		console.error(`Game not found for key ${map.value.game}`)
		return null
	}

	return (
		<Button
			nativeButton={false}
			variant="outline"
			render={<CustomLink href={`/relics/${game.value.id}/${relic.id}`} />}
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
