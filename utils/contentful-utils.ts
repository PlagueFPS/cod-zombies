import type { Asset, EntriesQueries, EntrySkeletonType, UnresolvedLink } from "contentful";
import { client } from "@/contentful/contentful"

export const getPosts = async <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) => {
  const response = await client.getEntries<T>(searchParams)
  return response
}

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if ('fields' in asset && asset.fields.file) return asset
}