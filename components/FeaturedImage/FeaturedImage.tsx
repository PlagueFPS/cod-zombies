import { headers } from "next/headers"
import NextImage from "./NextImage"
interface FeaturedImageProps {
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

export default async function FeaturedImage({ ...props }: FeaturedImageProps) {
  const headerList = await headers()
  const accept = headerList.get('Accept') || ''
  const avif = accept.includes('image/avif')
  const webp = accept.includes('image/webp')

  return (
    <NextImage 
      {...props}
      avif={ avif }
      webp={ webp }
    />
  )
}
