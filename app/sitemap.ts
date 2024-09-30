import { MetadataRoute } from "next";
import { env } from "@/env";
import { getFeaturedMaps } from "@/data/featuredMaps";
import { IN_DEVELOPMENT } from "@/utils/constants";
import { getGameCategories } from "@/data/gameCategory";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ featuredMaps }, categories] = await Promise.all([getFeaturedMaps(IN_DEVELOPMENT), getGameCategories(IN_DEVELOPMENT)])

  return [
    {
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}`
    },
    ...categories.map(category => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${category.slug}`,
    })),
    ...featuredMaps.map(map => ({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.gameCategory.slug}/${map.slug}`,
      lastModified: new Date(map.updatedAt)
    }))
  ]
}