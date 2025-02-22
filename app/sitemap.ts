import { MetadataRoute } from "next";
import { getMaps } from "@/data/maps";
import { env } from "@/env";
import { getQuests } from "@/data/sideQuests";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps(false)
  const questsProimse = getQuests(false)
  const [maps, quests] = await Promise.all([mapsPromise, questsProimse])
  const searchMaps = maps.filter(map => !map.isComingSoon)

  return [
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}`,
      lastModified: new Date(maps[0].updatedAt),
    },
    ...searchMaps.map(map => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game.slug}/${map.slug}`,
      lastModified: new Date(map.updatedAt)
    })),
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests`,
      lastModified: new Date(quests[0].updatedAt)
    },
    ...quests.map(q => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`,
      lastModified: new Date(q.updatedAt),
    })),
  ]
}