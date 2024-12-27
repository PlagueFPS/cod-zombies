import type { Document } from "@contentful/rich-text-types"
type Date = `${number}-${number}-${number}T${number}:${number}:${number}Z`
export interface FeaturedMap {
  id: string
  slug: string
  title: string
  description: string
  image: {
    url: string | undefined
    width: number | undefined
    height: number | undefined
  }
  category: {
    title: string
    slug: string
  }
  body: Document
  updatedAt: Date
  isDraft: boolean
  isChanged: boolean
  isNew: boolean
}