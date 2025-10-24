import type { Metadata } from "next"
import { Effect } from "effect"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import { ComingSoonBadge, NewBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeaturedImage from "@/components/featured-image/featured-image"
import GuideFeedback from "@/components/guide-feedback/guide-feedback"
import richStyles from "@/components/rich-text/rich-text.module.css"
import ShareButton from "@/components/share-button/share-button"
import TableOfContents from "@/components/table-of-contents/table-of-contents"
import { Badge } from "@/components/ui/badge"
import {
  getAdjacentSideQuests,
  getSideQuestById,
  getSideQuests,
  type SideQuest,
} from "@/data/side-quests"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { PageNotFoundError } from "@/types/errors"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import {
  calculateTimeToRead,
  extractHeadingsFromMDX,
  getLastUpdated,
  getServerUrl,
} from "@/utils/functions"
import QuestNotFoundPage from "./not-found"
import { FileSystemLayer } from "@/lib/layers"

export const generateStaticParams = () => {
  const quests = getSideQuests()
  return quests.map(q => ({
    game: q.map.game.id,
    map: q.map.id,
    id: q.id,
  }))
}

export const generateMetadata = async ({
  params,
}: PageProps<"/side-quests/[game]/[map]/[id]">): Promise<Metadata> => {
  const { id } = await params
  const quest = getSideQuestById(id)
  if (!quest) notFound()

  const title = `${quest.title} Side Quest`
  const description = `Learn how to complete the ${quest.title} side quest/easter egg for ${quest.map.title} with our detailed step-by-step walkthrough!`

  return {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`,
      images: {
        url: `${getServerUrl()}/opengraph-images/side-quests/og-${quest.id}.jpg`,
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
      canonical: `${getServerUrl()}/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`,
    },
  }
}

export default async function SideQuestPage({
  params,
}: PageProps<"/side-quests/[game]/[map]/[id]">) {
  const mdxComponents = useMDXComponents()
  return await Effect.gen(function* () {
    const { id } = yield* Effect.promise(() => params)
    const quest = getSideQuestById(id)
    if (!quest)
      return yield* new PageNotFoundError({
        message: "Side Quest not found",
        cause: id,
      })

    const contentPath = `./content/side-quests/${quest.id}.mdx`
    const { prev, next } = getAdjacentSideQuests(quest.id)
    const { default: MDXContent } = yield* Effect.tryPromise(() => quest.content())
    const headings = quest.state === "Coming Soon" ? [] : yield* extractHeadingsFromMDX(contentPath)
    const timeToRead = yield* calculateTimeToRead(contentPath)
    const lastUpdated = getLastUpdated(`side-quests/${quest.id}.mdx`)

    return (
      <section className="-mt-10 flex w-full justify-center xl:mt-0">
        <div className="mx-auto flex w-svw flex-col items-center justify-start xl:mx-4">
          <div className="flex w-full flex-col xl:flex-row-reverse">
            <TableOfContents headings={headings} />
            <article className="flex w-full flex-col items-center justify-center">
              <div className="relative mt-16 w-full xl:mt-8">
                <div className="absolute top-4 right-0 left-0 z-10 mx-auto hidden w-full max-w-7xl opacity-35 blur-3xl sm:dark:block">
                  <FeaturedImage
                    featuredImage={quest.map.image}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    width={1280}
                    height={720}
                    quality={100}
                  />
                </div>
                <div className="relative z-20 mx-auto max-w-7xl">
                  <FeaturedImage
                    featuredImage={quest.map.image}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    width={1280}
                    height={720}
                    quality={100}
                    priority
                    className="overflow-hidden xl:rounded-lg"
                  />
                  <div className="-top-10 absolute left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
                    <Breadcrumbs
                      links={[
                        { title: "Side Quests", href: `/side-quests` },
                        {
                          title: quest.map.game.title,
                          href: `/side-quests?game=${quest.map.game.id}`,
                        },
                        {
                          title: quest.map.title,
                          href: `/side-quests?map=${quest.map.id}`,
                        },
                        {
                          title: quest.title,
                          href: `/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="relative z-20 mt-8 mb-4 flex w-full max-w-7xl flex-col justify-center gap-2 border-b-2 px-4 md:mt-16 md:gap-4 md:px-8 md:pb-6">
                <div className="flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
                  <h2 className="dark:dark-text-gradient pb-2 font-extrabold text-3xl text-gradient md:text-4xl lg:text-5xl">
                    {quest.title}
                  </h2>
                  <div className="flex w-fit items-center justify-center gap-4">
                    {quest.state === "Coming Soon" ? (
                      <ComingSoonBadge />
                    ) : quest.state === "New" ? (
                      <NewBadge />
                    ) : null}
                    <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
                      {quest.map.title}
                    </Badge>
                    <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
                      {quest.map.game.title}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 md:flex-row md:pb-0">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>Updated: {lastUpdated}</span>
                    </div>
                    <span className="hidden md:inline">&bull;</span>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{timeToRead} min read</span>
                    </div>
                  </div>
                  <ShareButton
                    title={quest.title}
                    url={`${getServerUrl()}/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`}
                    className="mb-2 ml-auto text-muted-foreground md:mb-0"
                  />
                </div>
              </div>
              {quest.state === "Coming Soon" ? (
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
                <div
                  id="body"
                  className={cn("relative mx-auto w-full max-w-[80ch] px-4", richStyles.body)}
                >
                  <MDXContent components={mdxComponents} />
                </div>
              )}
              <div className="flex w-full items-center justify-center">
                <GuideFeedback guideTitle={quest.title} type="Side Quest" map={quest.map.title} />
              </div>
              <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 xl:flex-row">
                {prev && <PrevOrNextQuestCard quest={prev} prev />}
                {next && <PrevOrNextQuestCard quest={next} />}
              </div>
            </article>
          </div>
        </div>
      </section>
    )
  }).pipe(
    Effect.withLogSpan("side_quest_page"),
    Effect.tapError(Effect.logError),
    Effect.catchTags({
      PageNotFoundError: _error => Effect.succeed(<QuestNotFoundPage />),
      UnknownException: _error => Effect.succeed(null),
    }),
    Effect.provide(FileSystemLayer),
    Effect.ensureErrorType<never>(),
    Effect.runPromise,
  )
}

interface PrevOrNextCard {
  quest: SideQuest
  prev?: boolean
}

const PrevOrNextQuestCard = ({ quest, prev }: PrevOrNextCard) => {
  const alt = `${quest.map.title} map image`

  return (
    <CustomLink
      href={
        quest.state === "Coming Soon"
          ? "#"
          : `/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`
      }
      className={cn(
        "group w-full max-w-sm overflow-hidden rounded-lg border-2 shadow-sm transition-transform hover:scale-105 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary lg:max-w-xl dark:shadow-none",
        {
          "pointer-events-none opacity-50": quest.state === "Coming Soon",
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
          {quest.state === "Coming Soon" ? (
            <ComingSoonBadge />
          ) : quest.state === "New" ? (
            <NewBadge />
          ) : null}
          <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
            {quest.map.title}
          </Badge>
          <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
            {quest.map.game.title}
          </Badge>
        </div>
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 left-0 z-10 hidden h-full w-full items-center opacity-35 blur-2xl dark:flex",
          )}
        >
          <FeaturedImage
            featuredImage={quest.map.image}
            sizes="(max-width: 1280px) 320px, 384px"
            width={384}
            height={176}
            className="scale-110"
          />
        </div>
        <div className="relative z-20 flex h-full w-full max-w-sm items-center justify-center overflow-hidden rounded-lg">
          <FeaturedImage
            featuredImage={quest.map.image}
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
