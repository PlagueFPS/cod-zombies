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
  gameCategory: {
    title: string | undefined
    slug: string | undefined
  }
  updatedAt: string
  isDraft: boolean
  isChanged: boolean
  isNew: boolean
}