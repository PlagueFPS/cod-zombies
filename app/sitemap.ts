import { MetadataRoute } from "next";
import { getMaps } from "@/data/maps";
import { getGames } from "@/data/games";
import { env } from "@/env";
import { getQuests } from "@/data/sideQuests";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps(false)
  const gamesPromise = getGames(false)
  const questsProimse = getQuests(false)
  const [maps, games, quests] = await Promise.all([mapsPromise, gamesPromise, questsProimse])

  const generateGameDate = (slug: string, type: "maps" | "quests") => {
    let date: typeof maps[0]["updatedAt"] | undefined
    
    if (type === "maps") {
      date = maps.find(m => m.category.slug === slug)?.updatedAt
    } else if (type === "quests") {
      date = quests.find(q => q.game.slug === slug)?.updatedAt
    }

    if (date) return new Date(date)
    else return undefined
  }

  const generateMapDate = (slug: string) => {
    const date = quests.find(q => q.map.slug === slug)?.updatedAt
    if (date) return new Date(date)
    else return undefined
  }

  return [
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}`,
      lastModified: new Date(maps[0].updatedAt),
    },
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests`,
      lastModified: new Date(quests[0].updatedAt)
    },
    ...games.map(game => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${game.slug}`,
      lastModified: generateGameDate(game.slug, "maps")
    })),
    ...maps.map(map => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.category.slug}/${map.slug}`,
      lastModified: new Date(map.updatedAt)
    })),
    ...games.map(g => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${g.slug}`,
      lastModified: generateGameDate(g.slug, "quests")
    })),
    ...maps.map(m => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${m.category.slug}/${m.slug}`,
      lastModified: generateMapDate(m.slug)
    })),
    ...quests.map(q => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`,
      lastModified: new Date(q.updatedAt),
    })),
  ]
}