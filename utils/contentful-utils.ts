import type { Asset, EntriesQueries, Entry, EntrySkeletonType, UnresolvedLink } from "contentful";
import { client } from "@/contentful/contentful"
import { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import { unstable_cache as cache } from "next/cache";
import { GameCategory } from "@/types/GameCategory";
import { Headings } from "@/types/Headings";

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

export const extractHeadings = (entry: Entry<TypeFeaturedMapsSkeleton, undefined, string>) => {
  const headings: Headings[] = []
  entry.fields.body.content.forEach(node => {
    if (node.nodeType === 'heading-2' || node.nodeType === 'heading-3') {
      if (node.content[0].nodeType === 'text') {
        headings.push({
          type: node.nodeType,
          text: node.content[0].value,
          id: node.content[0].value.toLowerCase().replace(/ /g, '-')
        })
      }
    }
  })

  return headings
}

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