import { MetadataRoute } from "next";
import { getGameCategories, getMaps } from "@/data/data";
import { env } from "@/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps()
  const categoriesPromise = getGameCategories()
  const [{ maps }, categories] = await Promise.all([mapsPromise, categoriesPromise])

  return [
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}`
    },
    ...categories.map(category => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${category.slug}`,
    })),
    ...maps.map(map => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.fields.gameCategory?.fields.slug}/${map.fields.slug}`,
      lastModified: new Date(map.sys.updatedAt)
    }))
  ]
}