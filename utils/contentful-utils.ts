import type { Asset, EntriesQueries, Entry, EntrySkeletonType, UnresolvedLink } from "contentful";
import { client } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";

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