import 'server-only'
import type { EntriesQueries, EntrySkeletonType } from 'contentful';
import { client } from '@/contentful/contentful';
import { unstable_cache as cache } from "next/cache";
import { GameCategory } from "@/types/GameCategory";
import { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import { MAP_LIMIT } from '@/utils/constants';
import { resolveAsset } from '@/utils/contentful-utils';

const getPosts = async <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) => {
  const response = await client.getEntries<T>(searchParams)
  return response
}

const fetchMaps = cache(async (category?: GameCategory, skip?: number, limit?: number) => {
  const maps = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': category ?? null,
    skip,
    limit
  })
 
  return {
    totalMaps: maps.total,
    maps: maps.items
  }
}, ['all-maps'], {
  tags: ['maps']
})

export const getMaps = async (draftMode?: boolean, category?: GameCategory, skip?: number, limit?: number) => {
  if (!draftMode) {
    console.log('fetching cached maps')
    return await fetchMaps(category, skip, limit)
  }
  else {
    console.log('fetching uncached maps')
    const maps = await getPosts<TypeFeaturedMapsSkeleton>({
      content_type: 'featuredMaps',
      order: ['-sys.createdAt'],
      'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
      'fields.gameCategory.fields.slug[match]': category ?? null,
      skip,
      limit
    })
   
    return {
      totalMaps: maps.total,
      maps: maps.items
    }
  }
}

export const getMapBySlug = async (slug: string) => {
  const { maps } = await getMaps()
  const map = maps.find(map => map.fields.slug === slug)
  return map
}

export const getGameCategories = cache(async () => {
  const games = await getPosts<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  })

  return games.items.map(game => ({
    slug: game.fields.slug as GameCategory,
    title: game.fields.title,
    image: resolveAsset(game.fields.image)
  }))
}, ['game-categories'], {
  tags: ['categories']
})

export const getSkipAndPage = async (unvalidatedPage: string | string[] | undefined) => {
  const { totalMaps } = await getMaps()
  const totalPages = Math.ceil(totalMaps / MAP_LIMIT)
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