import { MetadataRoute } from "next";
import { getMaps } from "@/data/maps";
import { env } from "@/env";
import { getQuests } from "@/data/side-quests";
import { getZombies } from "@/data/zombies";
import { getLegalDocuments } from "@/data/legal";
import { getAvailableMaps } from "@/data/interactive-map";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps(false)
  const questsProimse = getQuests(false)
  const zombiesPromise = getZombies(false)
  const legalPromise = getLegalDocuments(false)
  const interactiveMaps = getAvailableMaps()
  const [maps, quests, zombies, legalDocs] = await Promise.all([
    mapsPromise, 
    questsProimse, 
    zombiesPromise, 
    legalPromise
  ])

  return [
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}`,
      lastModified: new Date(maps[0].updatedAt),
    },
    ...maps.filter(map => !map.isComingSoon).map((map): MetadataRoute.Sitemap[number] => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game.slug}/${map.slug}`,
      lastModified: new Date(map.updatedAt),
    })),
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests`,
      lastModified: new Date(quests[0].updatedAt),
    },
    ...quests.map((q): MetadataRoute.Sitemap[number] => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`,
      lastModified: new Date(q.updatedAt),
    })),
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary`,
      lastModified: new Date(zombies[0].updatedAt),
    },
    ...zombies.filter(z => !z.isComingSoon).map((z): MetadataRoute.Sitemap[number] => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${z.slug}`,
      lastModified: new Date(z.updatedAt),
    })),
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/maps`,
    },
    ...interactiveMaps.map((map): MetadataRoute.Sitemap[number] => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/maps/${map}`,
    })),
    ...legalDocs.map((doc): MetadataRoute.Sitemap[number] => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${doc.slug}`,
      lastModified: new Date(doc.updatedAt),
    }))
  ]
}