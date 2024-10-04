import type { ImageLoaderProps } from "next/image"

interface ContentfulLoader extends ImageLoaderProps {
  avif: boolean
  webp: boolean
}

export const contentfulImageLoader = ({ src, width, quality, avif, webp }: ContentfulLoader) => {
  const url = new URL(src)

  if (!avif && webp) {
    url.searchParams.set('fm', 'webp')
  } else if (!avif && !webp) {
    url.searchParams.set('fm', 'jpg')
  }

  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}