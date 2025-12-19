import type { Route } from "next"
import { FileSystem, Path } from "@effect/platform"
import { Effect, Option } from "effect"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeaturedImage from "@/components/featured-image/featured-image"
import richStyles from "@/components/rich-text/rich-text.module.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAdjacentRelics, getRelicById, getRelics, type Relic } from "@/data/relics"
import { FileSystemPage } from "@/lib/layers"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { calculateTimeToRead, getLastUpdated } from "@/utils/functions"

export const generateStaticParams = () => {
	const relics = getRelics()
	return relics.map(relic => ({
		game: relic.map.game.id,
		id: relic.id,
	}))
}

const RelicPage = Effect.fn("RelicPage")(
	function* ({ params }: PageProps<"/relics/[game]/[id]">) {
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const mdxComponents = yield* Effect.sync(() => useMDXComponents())
		const { id } = yield* Effect.promise(() => params)
		const relic = getRelicById(id)
		if (!relic) return yield* Effect.sync(() => notFound())

		const contentPath = path.join(process.cwd(), `./content/relics/${relic.id}.mdx`)
		const fileContent = yield* fs.readFileString(contentPath)
		const { prev, next } = getAdjacentRelics(id)
		const { lastModifiedFormatted } = getLastUpdated(contentPath)
		const { content, stateBadge, timeToRead } = yield* Option.match(
			Option.fromNullable(relic.state),
			{
				onNone: () =>
					Effect.gen(function* () {
						return {
							content: yield* relic.content,
							stateBadge: null,
							timeToRead: calculateTimeToRead(fileContent),
						}
					}),
				onSome: state =>
					Effect.gen(function* () {
						const isComingSoon = state === "Coming Soon"
						return {
							content: isComingSoon ? null : yield* relic.content,
							stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
							timeToRead: isComingSoon ? 1 : calculateTimeToRead(fileContent),
						}
					}),
			},
		)

		const MDXContent = content?.default

		return (
			<section className="-mt-10 container mx-auto max-w-4xl px-4 md:py-12">
				<Breadcrumbs
					links={[
						{ title: "Relics", href: "/relics" },
						{ title: relic.map.game.title, href: `/relics` },
						{
							title: relic.title,
							href: `/relics/${relic.map.game.id}/${relic.id}`,
						},
					]}
					className="mb-14"
				/>
				<article className="space-y-8">
					<header className="space-y-6 border-b pb-8 text-center">
						<div className="relative mx-auto size-64 overflow-hidden rounded-lg bg-muted dark:bg-accent/30">
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

						<div className="space-y-4">
							<h2 className="text-balance font-bold text-4xl tracking-tight md:text-5xl">
								{relic.title}
							</h2>
							<div className="flex flex-wrap items-center justify-center gap-3">
								{stateBadge}
								<TypeBadge type={relic.type} />
								<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
									{relic.map.title}
								</Badge>
							</div>

							<div className="flex items-center justify-center gap-2 pt-2 text-muted-foreground text-sm">
								<span className="flex items-center gap-1">
									<Calendar className="size-4" />
									<p>Updated: {lastModifiedFormatted}</p>
								</span>
								<span className="inline">&bull;</span>
								<span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
									<Clock className="size-4" />
									<p>{timeToRead} min read</p>
								</span>
							</div>
						</div>
					</header>

					{!MDXContent ? (
						<div className="relative mx-auto my-20 max-w-[80ch] space-y-2 px-4 text-center">
							<p className="font-bold text-xl">
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
							<MDXContent components={mdxComponents} />
						</div>
					)}
					<div className="mt-8 flex w-full items-center justify-evenly gap-4">
						{Option.isSome(prev) && <PrevOrNextRelicCard relic={prev.value} prev />}
						{Option.isSome(next) && <PrevOrNextRelicCard relic={next.value} />}
					</div>
				</article>
			</section>
		)
	},
	page =>
		page.pipe(
			Effect.withLogSpan("relic_page"),
			Effect.tapError(Effect.logError),
			Effect.catchTags({
				BadArgument: error => Effect.dieMessage(error.message),
				SystemError: error => Effect.dieMessage(error.message),
			}),
			Effect.ensureErrorType<never>(),
		),
)

export default FileSystemPage.build(RelicPage)

interface PrevOrNextRelicCard {
	relic: Relic
	prev?: boolean
}

const PrevOrNextRelicCard = ({ relic, prev }: PrevOrNextRelicCard) => {
	const { shouldRender, tabIndex } = Option.match(Option.fromNullable(relic.state), {
		onNone: () => ({
			tabIndex: 0,
			shouldRender: true,
		}),
		onSome: () => {
			return {
				tabIndex: 0,
				shouldRender: false,
			}
		},
	})

	if (!shouldRender) return null

	return (
		<Button asChild variant="outline">
			<CustomLink
				href={`/relics/${relic.map.game.id}/${relic.id}`}
				tabIndex={tabIndex}
				className="group w-fit hover:text-primary"
			>
				<article className="flex h-full items-center">
					<div className="mt-auto flex items-center justify-between pb-2 transition-colors group-focus-visible:text-primary">
						{prev ? (
							<span className="inline-flex items-center justify-center gap-1">
								<ChevronLeft className="group-hover:-translate-x-1 group-focus-visible:-translate-x-1 transition-all" />
								<span>{relic.title}</span>
							</span>
						) : (
							<span className="inline-flex items-center justify-center gap-1">
								<span className="ml-auto">{relic.title}</span>
								<ChevronRight className="transition-all group-hover:translate-x-1 group-focus-visible:translate-x-1" />
							</span>
						)}
					</div>
				</article>
			</CustomLink>
		</Button>
	)
}
