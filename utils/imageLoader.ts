import type { ImageLoaderProps } from "next/image"

export const customImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const url = new URL(src)
  url.searchParams.set('fm', 'webp')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}