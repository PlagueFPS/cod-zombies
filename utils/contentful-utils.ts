import type { Asset, EntriesQueries, Entry, EntrySkeletonType, UnresolvedLink } from "contentful";
import { client } from "@/contentful/contentful"
import { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import { unstable_cache as cache } from "next/cache";

export const getPosts = async <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) => {
  const response = await client.getEntries<T>(searchParams)
  return response
}

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if ('fields' in asset && asset.fields.file) return asset
}

export const resolveEntry = (entry: UnresolvedLink<"Entry"> | Entry<TypeGameCategorySkeleton, undefined, string>) => {
  if ('fields' in entry && entry.fields) return entry
}

export const getAllMaps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt']
  })

  return posts
}, ['all-maps'], {
  tags: ['featuredMaps']
})

export const getBO1Maps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': 'black-ops-1'
  })

  return posts
}, ['black-ops-1-maps'], {
  tags: ['bo1-Maps']
})

export const getBO2Maps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': 'black-ops-2'
  })

  return posts
}, ['black-ops-2-maps'], {
  tags: ['bo2-Maps']
})

export const getBO3Maps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': 'black-ops-3'
  })

  return posts
}, ['black-ops-3-maps'], {
  tags: ['bo3-Maps']
})

export const getBO4Maps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': 'black-ops-4'
  })

  return posts
}, ['black-ops-4-maps'], {
  tags: ['bo4-Maps']
})

export const getColdWarMaps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': 'black-ops-cold-war'
  })

  return posts
}, ['black-ops-cold-war-maps'], {
  tags: ['cw-Maps']
})

export const getBO6Maps = cache(async () => {
  const posts = await getPosts<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': 'black-ops-6'
  })

  return posts
}, ['black-ops-6-maps'], {
  tags: ['bo6-Maps']
})