import type { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import type { Asset, Entry } from "contentful"
import type { Document } from "@contentful/rich-text-types"

export interface FeaturedMap {
  id: string
  slug: string
  title: string
  description: string
  image: Asset<undefined, string> | undefined
  gameCategory: Entry<TypeGameCategorySkeleton, undefined, string> | undefined
  updatedAt: string
  body: Document
  isDraft: boolean
  isChanged: boolean
}