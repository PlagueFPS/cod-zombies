import 'server-only'
import { unstable_cache as cache } from "next/cache";
import { GameCategory } from "@/types/GameCategory";
import { getPosts } from "@/utils/contentful-utils";
import { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import { MAP_LIMIT } from '@/utils/constants';

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

export const getSkipAndPage = async (unvalidatedPage: string | string[] | undefined) => {
  const maps = await getMaps()
  const totalPages = Math.ceil(maps.total / MAP_LIMIT)
  let page = unvalidatedPage ? +unvalidatedPage : 1
  if (page > totalPages) page = totalPages
  else if (page <= 1 || isNaN(page)) page = 1
  const skip = page <= 1 ? 0 : (MAP_LIMIT * page) - MAP_LIMIT

  return {
    currentPage: page,
    skip,
    totalPages
  }
}