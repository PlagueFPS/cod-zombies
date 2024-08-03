import type { Asset, Entry, UnresolvedLink } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import type { Heading } from "@/types/Heading";
import type { Map } from "@/types/Map";
import type { EntryProps, KeyValueMap } from "contentful-management";

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if ('fields' in asset && asset.fields.file) return asset
}

export const resolveEntry = (entry: UnresolvedLink<"Entry"> | Entry<TypeGameCategorySkeleton, undefined, string>) => {
  if ('fields' in entry && entry.fields) return entry
}

export const resolveMap = (entry: Map | EntryProps<KeyValueMap>) => entry as Map

export const extractHeadings = (entry: Entry<TypeFeaturedMapsSkeleton, undefined, string>) => {
  const headings: Heading[] = []

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