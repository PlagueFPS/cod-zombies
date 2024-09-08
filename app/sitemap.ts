import { MetadataRoute } from "next";
import { getGameCategories, getMaps } from "@/data/data";
import { WEBSITE_URL } from "@/utils/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapsPromise = getMaps()
  const categoriesPromise = getGameCategories()
  const [{ maps }, categories] = await Promise.all([mapsPromise, categoriesPromise])

  return [
    {
      url: `${WEBSITE_URL}`
    },
    ...categories.map(category => ({
      url: `${WEBSITE_URL}/${category.slug}`,
    })),
    ...maps.map(map => ({
      url: `${WEBSITE_URL}/${map.fields.gameCategory?.fields.slug}/${map.fields.slug}`,
      lastModified: new Date(map.sys.updatedAt)
    }))
  ]
}