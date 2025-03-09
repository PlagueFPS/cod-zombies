import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { TypeBadge } from "@/components/CustomBadges/CustomBadges"
import FeaturedImage from "@/components/FeaturedImage/FeaturedImage"
import ItemTooltip from "@/components/RichText/RichEmbeds/ItemTooltip"
import ShareButton from "@/components/ShareButton/ShareButton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getZombieBySlug, getZombies, getZombieSearchData } from "@/data/zombies"
import { env } from "@/env"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { AlertTriangle, BookOpen, Eye, Gamepad2, Map, Zap } from "lucide-react"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { cache } from "react"

interface IZombiePage {
  params: Promise<{ slug: string }>,
}

const getPageData = cache(async (draftMode: boolean, slug: string) => {
  const zombie = await getZombieBySlug(draftMode, slug)
  if (!zombie) {
    notFound()
  }
  const zombies = await getZombies(draftMode)
  const zombieIndex = zombies.findIndex(z => z.slug === zombie.slug)

  return {
    zombie,
    prevZombie: zombies[zombieIndex + 1],
    nextZombie: zombies[zombieIndex - 1]
  }
})

export const generateStaticParams = async () => {
  const zombies = await getZombieSearchData(false)
  return zombies.map(zombie => ({
    slug: zombie.slug
  }))
}

export const generateMetadata = async ({ params }: IZombiePage): Promise<Metadata> => {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const { zombie } = await getPageData(isEnabled, slug)

  return {
    title: zombie.name,
    description: zombie.description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title: zombie.name,
      description: zombie.description,
      url: `/${zombie.slug}`,
      images: {
        url: `https:${zombie.image.url}?w=1200&h=630&q=75&fm=jpg`,
        width: 1200,
        height: 630
      }
    },
    twitter: {
      title: zombie.name,
      description: zombie.description,
      card: 'summary_large_image',
    }
  }
}

export default async function ZombiePage({ params }: IZombiePage) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const { zombie, prevZombie, nextZombie } = await getPageData(isEnabled, slug)
  const speedProgress = () => {
    switch(zombie.speed) {
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
    <article className="relative container mx-auto py-4 sm:py-6 px-3 sm:px-4">
      <div className="absolute -top-5 left-5 z-30 pl-4 xl:pl-0 flex w-full justify-center">
        <Breadcrumbs links={[
          { title: "Bestiary", href: "/bestiary" },
          { title: zombie.name, href: `/bestiary/${zombie.slug}` }
        ]} />
      </div>
      <Card className="mb-6 border-2 overflow-hidden bg-background">
        <div className="bg-muted py-2 px-4 flex justify-between items-center">
          <TypeBadge type={ zombie.type } />
          <ShareButton title={ zombie.name } url={`${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`} />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-gradient">{ zombie.name }</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image and Stats */}
            <div className="flex flex-col items-center">
              <FeaturedImage 
                featuredImage={ zombie.image }
                alt={ `${zombie.name} image`}
                quality={ 100 }
                sizes="422px"
                priority
                className="relative w-full aspect-square rounded-lg shadow-lg overflow-hidden mb-4 object-cover"
              />
              <div className="w-full space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="size-5 text-orange-500" />
                      <span className="text-muted-foreground">First Appeared In</span>
                    </div>
                    <span className="text-muted-foreground">{ zombie.maps[0].title }</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="size-5 text-yellow-500" />
                      <span className="text-muted-foreground">Speed</span>
                    </div>
                    <span className="text-muted-foreground">{ zombie.speed }</span>
                  </div>
                  <Progress value={ speedProgress() } className="h-2 mt-1" />
                </div>
              </div>
            </div>
            {/* Description and Weaknesses */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <BookOpen className="size-5 text-foreground" />
                  Description
                </h3>
                <p className="text-muted-foreground">
                  { zombie.description }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Map className="size-5 text-foreground" />
                  Map Appearances
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  { zombie.slug !== "zombie"
                    ? zombie.maps.map(map => <Badge key={ map.slug } className="mt-1 badge-primary-gradient">{ map.title }</Badge>) 
                    : <span className="text-muted-foreground text-sm">Appears in all maps</span> }
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Gamepad2 className="size-5 text-foreground" />
                  Game Appearances
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  { zombie.slug !== "zombie"
                    ? zombie.games.map(game => <Badge key={ game.slug } className="mt-1 badge-primary-gradient">{ game.title }</Badge>) 
                    : <span className="text-muted-foreground text-sm">Appears in all maps</span> }
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-5 text-foreground" />
                  Elemental Weaknesses
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  { zombie.elementalWeakness?.map(weakness => <ItemTooltip key={ weakness.id } item={ weakness } />) ?? (
                    <span className="text-muted-foreground">No elemental weaknesses</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      {/* Main Content Grid */}

    </article>
  )
}