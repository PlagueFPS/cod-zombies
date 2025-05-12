import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { ChangedBadge, ComingSoonBadge, DraftBadge, NewBadge, TypeBadge } from "@/components/CustomBadges/CustomBadges"
import { CustomLink } from "@/components/CustomLink/CustomLink"
import FeaturedImage from "@/components/FeaturedImage/FeaturedImage"
import ItemTooltip from "@/components/RichText/RichEmbeds/ItemTooltip"
import RichTextRenderer from "@/components/RichText/RichTextRenderer/RichTextRenderer"
import ShareButton from "@/components/ShareButton/ShareButton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getZombieBySlug, getZombies, getZombieSearchData } from "@/data/zombies"
import { env } from "@/env"
import { cn } from "@/lib/utils"
import { MinifiedZombie } from "@/types/Zombie"
import { GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { 
  AlertTriangle, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Footprints, 
  Gamepad2, 
  Info, 
  Map, 
  Swords, 
  Target, 
  Zap 
} from "lucide-react"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { cache } from "react"

interface IZombiePage {
  params: Promise<{ slug: string }>,
}

const getPageData = cache(async (draftMode: boolean, slug: string) => {
  const zombie = await getZombieBySlug(draftMode, slug)
  if (!zombie || zombie.isComingSoon) {
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
        url: `https:${zombie.image.url}?w=600&h=600&q=75&fm=jpg`,
        width: 600,
        height: 600
      }
    },
    twitter: {
      title: zombie.name,
      description: zombie.description,
      card: 'summary',
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
      <Card className="mb-6 border-2 overflow-hidden bg-background pt-0">
        <div className="bg-accent dark:bg-accent/50 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center justify-center gap-4 w-fit">
          { (isEnabled || IN_DEVELOPMENT) && zombie.isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && zombie.isChanged ? <ChangedBadge /> : null }
          {  zombie.isNew ? <NewBadge /> : null }
            <TypeBadge type={ zombie.type } />
          </div>
          <ShareButton title={ zombie.name } url={`${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`} />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-gradient dark:dark-text-gradient">{ zombie.name }</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image and Stats */}
            <div className="relative flex flex-col items-center">
              <div className="hidden dark:block absolute inset-0 mx-auto w-full opacity-35 blur-3xl">
                <FeaturedImage 
                  featuredImage={ zombie.image }
                  quality={ 1 }
                  sizes="32px"
                  priority
                  className="w-full aspect-square rounded-lg mb-4 object-cover object-top"
                />
              </div>
              <FeaturedImage 
                featuredImage={ zombie.image }
                alt={ `${zombie.name} image`}
                quality={ 100 }
                sizes="422px"
                priority
                className="w-full aspect-square rounded-lg shadow-lg dark:shadow-none overflow-hidden mb-4 object-cover object-top"
              />
              <div className="w-full space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="size-5 text-orange-500" />
                      <span className="text-foreground dark:text-foreground/80">First Appeared In</span>
                    </div>
                    <span className="text-foreground dark:text-foreground/80">{ zombie.maps[0].title }</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="size-5 text-yellow-500" />
                      <span className="text-foreground dark:text-foreground/80">Speed</span>
                    </div>
                    <span className="text-foreground dark:text-foreground/80">{ zombie.speed }</span>
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
                <p className="text-foreground dark:text-foreground/80">
                  { zombie.description }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Map className="size-5 text-blue-500" />
                  Map Appearances
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  { zombie.slug !== "zombie"
                    ? zombie.maps.map(map => <Badge key={ map.slug } className="mt-1 badge-changed-gradient dark:dark-badge-changed-gradient">{ map.title }</Badge>) 
                    : <Badge className="mt-1 badge-changed-gradient dark:dark-badge-changed-gradient">Appears in all maps</Badge> }
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Gamepad2 className="size-5 text-orange-500" />
                  Game Appearances
                </h3>
                <div className="flex flex-wrap items-center gap-2">                 
                  { zombie.games.map(game => 
                    <Badge key={ game.slug } className="mt-1 badge-primary-gradient dark:dark-badge-primary-gradient">
                      { game.title }
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Target className="size-5 text-red-500" />
                  Weak Points
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  { zombie.weakPoints.map((weakPoint, index) => (
                    <Badge key={ `${weakPoint}-${index}` } className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit">{ weakPoint }</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-5 text-orange-800 dark:text-orange-300" />
                  Elemental Weaknesses
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  { zombie.elementalWeakness?.map(weakness => <ItemTooltip key={ weakness.id } item={ weakness } />) ?? (
                    <span className="text-foreground dark:text-foreground/80">No elemental weaknesses</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attacks Section */}
        <Card className="bg-background pt-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Swords className="size-6 text-primary" />
              <h3 className="text-xl font-bold">Attacks</h3>
            </div>
            <div className="space-y-4">
              { zombie.attacks.map(attack => (
                <div key={ attack.id } className="p-3 border rounded-lg">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h4 className="font-semibold">{ attack.name }</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={"outline"}>Range: { attack.range }</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-foreground dark:text-foreground/80">{ attack.description }</CardDescription>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Spawn Behavior Section */}
        <Card className="bg-background pt-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Footprints className="size-6 text-purple-600 dark:text-purple-300" />
              <h3 className="text-xl font-bold">Spawn Behavior</h3>
            </div>
            <CardDescription className="text-foreground dark:text-foreground/80">{ zombie.spawnBehavior }</CardDescription>
          </CardContent>
        </Card>
        {/* Combat Strategy Section */}
        <Card className="bg-background pt-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Info className="size-6 text-green-600 dark:text-green-300" />
              <h3 className="text-xl font-bold">Combat Strategy</h3>
            </div>
            <RichTextRenderer 
              body={ zombie.combatStrategy } 
              slug={ zombie.slug }
              overrideStyles 
              className="text-sm text-foreground dark:text-foreground/80" 
            />
          </CardContent>
        </Card>
      </section>
      <section className='flex flex-row justify-center items-center w-full mt-8'>
        <div className='flex flex-col lg:flex-row justify-center items-center px-3 mx-auto xl:px-0 xl:ml-auto xl:mr-0 gap-8'>
          { prevZombie && <PrevOrNextZombie zombie={ prevZombie } isEnabled={ isEnabled } prev /> }
          { nextZombie && <PrevOrNextZombie zombie={ nextZombie } isEnabled={ isEnabled } /> }
        </div>
      </section>
    </article>
  )
}

const PrevOrNextZombie = ({ zombie, isEnabled, prev }: { zombie: MinifiedZombie, isEnabled: boolean, prev?: boolean }) => {
  const alt = `${zombie.name} image`
  const href = `/bestiary/${zombie.slug}`

  return (
    <CustomLink 
      href={ href }
      className='group hover:border-primary hover:-translate-y-2 border rounded-lg w-full max-w-sm xl:max-w-full shadow-sm dark:shadow-none overflow-hidden transition-all'
    >
      <article className={cn('relative h-full xl:h-48 flex flex-col xl:flex-row items-center p-2', { 'xl:flex-row-reverse': prev })}>
        <div className={cn('absolute top-2 right-2 z-50 w-fit flex items-center justify-center gap-1')}>
          { zombie.isNew ? <NewBadge /> : null } 
          { (isEnabled || IN_DEVELOPMENT) && zombie.isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && zombie.isChanged ? <ChangedBadge /> : null }
          <TypeBadge type={ zombie.type } />
          <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>
            { zombie.games[0].title }
          </Badge>
        </div>
        <div className='hidden dark:flex absolute inset-0 z-10 items-center w-full h-full opacity-35 blur-2xl'>
            <FeaturedImage 
              featuredImage={ zombie.image }
              sizes='32px'
              quality={ 1 }
              className='scale-110'
            />
        </div>
        <div className='relative flex items-center justify-center z-20 max-w-sm h-full w-full rounded-lg overflow-hidden'>
            <FeaturedImage
              featuredImage={ zombie.image }
              alt={ alt }
              sizes='(max-width: 1280px) 320px, 384px'
              className='object-cover object-top rounded-lg h-full'
            />
        </div>
        <div className='relative z-20 h-full flex flex-col justify-center w-full gap-2 px-4 pt-4 xl:pt-6'>
          <h3 className='text-xl font-semibold group-hover:text-primary-gradient'>
            { zombie.name }
          </h3>
          <p className='text-sm line-clamp-3 text-ellipsis'>{ zombie.description }</p>
          <div className={cn('flex items-center pb-4 transition-all group-hover:text-primary mt-auto', { 'xl:-ml-2': prev, 'xl:-mr-2': !prev })}>
            { prev ? (
              <>
                <ChevronLeft />
                <span>Previous Zombie</span>
              </>
            ) : (
              <>
                <span className='ml-auto'>Next Zombie</span>
                <ChevronRight />
              </>
            )}
          </div>
        </div>
      </article>
    </CustomLink>
  )
}