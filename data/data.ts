import 'server-only'
import type { Map } from '@/types/Map';
import type { EntriesQueries, EntrySkeletonType } from 'contentful';
import type { GameCategory } from "@/types/GameCategory";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import type { Game } from '@/types/Game';
import { initializeContentfulClient } from '@/contentful/contentful';
import { managementClient } from '@/contentful/contentful-managment'
import { cache } from 'react';
import { IN_DEVELOPMENT, MAP_LIMIT } from '@/utils/constants';
import { resolveAsset } from '@/utils/contentful-utils';
import { sortMaps } from '@/utils/functions';

const getPosts = async <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>, draftMode?: boolean,) => {
  const client = initializeContentfulClient(draftMode)
  const response = await client.getEntries<T>(searchParams)
  return response
}

const getDraftOrChangedPosts = cache(async (category?: GameCategory, skip?: number, limit?: number) => {
  const maps = await managementClient.entry.getMany({
    query: {
      content_type: 'featuredMaps',
      'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
      'fields.gameCategory.fields.slug[match]': category ?? null,
      skip,
      limit
    }
  })

  const draftMaps = maps.items.filter(map => !map.sys.publishedVersion)
  const changedMaps = maps.items.filter(map => !!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2)
  return {
    changedMaps,
    draftMaps
  }
})

const getPublishedPosts = async (draftMode?: boolean, category?: GameCategory, skip?: number, limit?: number) => {
  const maps = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': category ?? null,
    skip,
    limit
  }, draftMode)
 
  return {
    totalMaps: maps.total,
    maps: maps.items
  }
}

const fetchMaps = async (draftMode?: boolean, category?: GameCategory, skip?: number, limit?: number) => {
  const maps = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': category ?? null,
    skip,
    limit
  }, draftMode)
 
  return {
    totalMaps: maps.total,
    maps: maps.items.sort(sortMaps)
  }
}

export const getMaps = cache(async (draftMode?: boolean, category?: GameCategory, skip?: number, limit?: number): Promise<{ totalMaps: number, maps: Map[], }> => {
  if (!draftMode && !IN_DEVELOPMENT) {
    return await fetchMaps(draftMode, category, skip, limit)
  }
  else {
    const publishedPostsPromise = getPublishedPosts(draftMode, category, skip, limit)
    const draftOrChangedPostsPromise = getDraftOrChangedPosts(category, skip, limit)
    const [{ maps, totalMaps }, { draftMaps, changedMaps }] = await Promise.all([publishedPostsPromise, draftOrChangedPostsPromise])

    return {
      totalMaps,
      maps: maps.map(map => {
        const isChanged = changedMaps.find(post => post.sys.id === map.sys.id)
        const isUnpublished = draftMaps.find(post => post.sys.id === map.sys.id)

        return {
          ...map,
          hasChanged: isChanged ? true : false,
          isUnpublished: isUnpublished ? true : false
        }
      })
    }
  }
})

export const getMapBySlug = async (slug: string, draftMode?: boolean) => {
  const { maps } = await getMaps(draftMode)
  const map = maps.find(map => map.fields.slug === slug)
  return map
}

export const getGameCategories = cache(async (): Promise<Game[]> => {
  const games = await getPosts<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  })

  return games.items.map(game => ({
    slug: game.fields.slug as GameCategory,
    title: game.fields.title,
    image: resolveAsset(game.fields.image)
  }))
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