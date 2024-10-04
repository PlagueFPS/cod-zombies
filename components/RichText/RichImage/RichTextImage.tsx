"use client"
import type { Asset } from "contentful"
import { useRef, useState } from "react"
import { useImageState } from "@/hooks/useImageState"
import Image from "next/image"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import { cn } from "@/lib/utils"
import ImageLoader from "@/components/Loaders/ImageLoader"
import { contentfulImageLoader } from "@/utils/imageLoader"

interface RichTextImageProps {
  asset: Asset<undefined, string> | undefined
  avif: boolean
  webp: boolean
  quality?: number
  className?: string
}

export default function RichTextImage({ asset, avif, webp, quality, className }: RichTextImageProps) {
  const [imageError, setImageError] = useState(false)
  const [fallbackError, setFallbackError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const fallbackRef = useRef<HTMLImageElement>(null)
  const { imageLoaded, fallbackLoaded, setImageLoaded, setFallbackLoaded } = useImageState(imageRef, fallbackRef)
  const url = asset ? `https:${asset?.fields.file?.url}` : placeholderImage
  const description = asset?.fields.description

  return (
    <figure className="relative m-0 w-full h-auto">
      { (!imageLoaded && !fallbackLoaded) && <ImageLoader /> }
      <picture className="relative w-full h-auto">
        <Image 
          src={ url }
          alt={ description ?? '' }
          width={ asset?.fields.file?.details.image?.width }
          height={ asset?.fields.file?.details.image?.width }
          sizes="(max-width: 828px) calc(100vw - 16px), 776px"
          quality={ quality }
          ref={ imageRef }
          onLoad={ () => setImageLoaded(true) }
          onError={ () => setImageError(true) }
          className={cn('flex justify-center items-center w-full h-full aspect-video rounded-lg opacity-0', className, {
            'animate-fade-in opacity-100': imageLoaded
          })}
        />
        { imageError && ( // Fallback to contentful image optmization API if next's optimization fails
          <Image
            loader={({ src, width, quality }) => contentfulImageLoader({ src, width, quality, avif, webp })}
            src={ url }
            alt={ description ?? '' }
            width={ asset?.fields.file?.details.image?.width }
            height={ asset?.fields.file?.details.image?.width }
            sizes="(max-width: 828px) calc(100vw - 16px), 776px"
            quality={ quality }
            ref={ imageRef }
            onLoad={ () => setFallbackLoaded(true) }
            onError={ () => setFallbackError(true) }
            className={cn('flex justify-center items-center w-full h-full aspect-video rounded-lg opacity-0', className, {
              'animate-fade-in opacity-100': fallbackLoaded
            })}
          />
        )}
        { fallbackError && ( // Fallback to placeholder image if both optmizations fail
          <Image
            unoptimized
            src={ placeholderImage }
            alt="Placeholder Image"
            placeholder="blur"
            onLoad={ () => setFallbackLoaded(true) }
            className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
              'animate-fade-in opacity-100': fallbackLoaded
            })}
          />
        )}
      </picture>
      <figcaption className="flex font-medium justify-center items-center mt-2 mb-4 w-auto italic px-4 xl:px-8">
        <>
          { description }
        </>
      </figcaption>
    </figure>
  )
}
