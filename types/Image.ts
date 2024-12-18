export interface ImageProps {
  featuredImage: {
    url: string | undefined,
    width: number | undefined,
    height: number | undefined
  } | null
  alt?: string
  quality?: number
  className?: string
  priority?: boolean
  sizes?: string
}