import { MetadataRoute } from "next";
import { IN_DEVELOPMENT } from "@/utils/constants";
import { getMaps } from "@/data/maps";
import { getGames } from "@/data/games";
import { env } from "@/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps(IN_DEVELOPMENT)
  const gamesPromise = getGames(IN_DEVELOPMENT)
  const [maps, games] = await Promise.all([mapsPromise, gamesPromise])

  return [
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}`
    },
    ...games.map(game => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${game.slug}`,
    })),
    ...maps.map(map => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.category.slug}/${map.slug}`,
      lastModified: new Date(map.updatedAt)
    }))
  ]
}