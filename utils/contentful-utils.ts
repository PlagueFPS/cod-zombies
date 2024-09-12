import type { Asset, Entry, UnresolvedLink } from "contentful";
import type { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import type { Heading } from "@/types/Heading";
import type { Map } from "@/types/Map";
import { slugify } from "./functions";

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if ('fields' in asset && asset.fields.file) return asset
}

export const resolveEntry = (entry: UnresolvedLink<"Entry"> | Entry<TypeGameCategorySkeleton, undefined, string>) => {
  if ('fields' in entry && entry.fields) return entry
}

export const extractHeadings = (entry: Map) => {
  const headings: Heading[] = []

  entry.fields.body.content.forEach(node => {
    if (node.nodeType.includes('heading-')) {
      if (node.content[0].nodeType === 'text') {
        headings.push({
          type: node.nodeType,
          text: node.content[0].value,
          id: slugify(node.content[0].value)
        })
      }
    }
  })

  return headings
}