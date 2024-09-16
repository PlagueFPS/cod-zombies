import { MetadataRoute } from "next";
import { getGameCategories, getMaps } from "@/data/data";
import { clientEnv } from "@/env/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps()
  const categoriesPromise = getGameCategories()
  const [{ maps }, categories] = await Promise.all([mapsPromise, categoriesPromise])

  return [
    {
      url: `${clientEnv.NEXT_PUBLIC_WEBSITE_URL}`
    },
    ...categories.map(category => ({
      url: `${clientEnv.NEXT_PUBLIC_WEBSITE_URL}/${category.slug}`,
    })),
    ...maps.map(map => ({
      url: `${clientEnv.NEXT_PUBLIC_WEBSITE_URL}/${map.fields.gameCategory?.fields.slug}/${map.fields.slug}`,
      lastModified: new Date(map.sys.updatedAt)
    }))
  ]
}