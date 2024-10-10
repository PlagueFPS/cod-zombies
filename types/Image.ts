export interface ImageProps {
  featuredImage: {
    url: string | undefined,
    width: number | undefined,
    height: number | undefined
  }
  alt?: string
  quality?: number
  className?: string
  priority?: boolean
  sizes?: string
}