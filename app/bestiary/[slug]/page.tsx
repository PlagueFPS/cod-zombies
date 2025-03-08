import { getZombieBySlug, getZombies, getZombieSearchData } from "@/data/zombies"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
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

  return <div></div>
}