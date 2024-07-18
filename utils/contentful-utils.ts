import type { Asset, EntriesQueries, Entry, EntrySkeletonType, UnresolvedLink } from "contentful";
import { client } from "@/contentful/contentful"
import { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
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