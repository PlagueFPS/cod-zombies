import type { Document } from "@contentful/rich-text-types"
export type Date = `${number}-${number}-${number}T${number}:${number}:${number}Z`

export interface FeaturedMapWithoutBody {
  id: string
  slug: string
  title: string
  description: string
  image: {
    url: string | undefined
    width: number | undefined
    height: number | undefined
  }
  game: {
    title: string
    slug: string
  }
  updatedAt: Date
  isDraft: boolean
  isChanged: boolean
  isNew: boolean
  isComingSoon: boolean
  difficulty: Difficulty
}
export interface FeaturedMapWithBody extends FeaturedMapWithoutBody {
  body: Document
  timeToRead: number
}

export type Difficulty = "Easy" | "Medium" | "Hard"