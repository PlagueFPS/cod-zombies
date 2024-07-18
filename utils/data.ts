import 'server-only'
import { unstable_cache as cache } from "next/cache";
import { GameCategory } from "@/types/GameCategory";
import { getPosts } from "./contentful-utils";
import { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";

export const getMaps = cache(async (category?: GameCategory, skip?: number, limit?: number) => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': category ?? null,
    skip,
    limit
  })
 
  return posts
}, ['all-maps'], {
  tags: ['maps']
})

export const getGameCategories = cache(async () => {
  const games = await getPosts<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  })

  return games.items.map(game => ({
    slug: game.fields.slug as GameCategory,
    title: game.fields.title
  }))
}, ['game-categories'], {
  tags: ['categories']
})