import { getGameCategories, getMaps } from "@/data/data";
import { resolveEntry } from "@/utils/contentful-utils";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { maps } = await getMaps()
  const categories = await getGameCategories()

  return [
    {
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`
    },
    ...categories.map(category => ({
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${category.slug}`,
    })),
    ...maps.map(map => ({
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${resolveEntry(map.fields.gameCategory)?.fields.slug}/${map.fields.slug}`,
      lastModified: new Date(map.sys.updatedAt)
    }))
  ]
}