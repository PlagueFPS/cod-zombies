"use client"
import { useImageState } from "@/hooks/useImageState"
import Image from "next/image"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import { cn } from "@/lib/utils"
import ImageLoader from "../Loaders/ImageLoader"
import { contentfulImageLoader } from "@/utils/imageLoader"

interface NextImageProps {
  featuredImage: {
    url: string | undefined,
    width: number | undefined,
    height: number | undefined
  }
  avif: boolean
  webp: boolean
  alt?: string
  quality?: number
  className?: string
  priority?: boolean
  sizes?: string
}

export default function NextImage({ featuredImage, avif, webp, alt = "", quality = 75, className, priority, sizes }: NextImageProps) {
  const { imageRef, fallbackRef, loaded, errored, setLoaded, setErrored } = useImageState()
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : placeholderImage

  return (
    <figure className="relative m-0 w-full h-auto">
      { (!loaded.image && !loaded.fallback) && <ImageLoader className="border" /> }
      <picture className={cn('flex justify-center items-center w-full h-auto')}>
        <Image 
          src={ featuredImageURL }
          alt={ alt }
          width={ featuredImage.width }
          height={ featuredImage.height }
          sizes={ sizes }
          ref={ imageRef }
          onLoad={ () => setLoaded(prevLoaded => ({...prevLoaded, image: true })) }
          onError={ () => setErrored(prevErrored => ({...prevErrored, image: true })) }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
            'animate-fade-in opacity-100': loaded.image
          })}
          priority={ priority }
        />
        { errored.image && ( // Fallback to contentful image optmization API if next's optimization fails
          <Image 
            loader={({ src, width, quality }) => contentfulImageLoader({ src, width, quality, avif, webp })}
            src={ featuredImageURL }
            alt={ alt }
            width={ featuredImage.width }
            height={ featuredImage.height }
            sizes={ sizes }
            ref={ fallbackRef }
            onLoad={ () => setLoaded(prevLoaded => ({...prevLoaded, fallback: true })) }
            onError={ () => setErrored(prevErrored => ({...prevErrored, fallback: true })) }
            quality={ quality }
            className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
              'animate-fade-in opacity-100': loaded.fallback
            })}
            priority={ priority }
          />
        )}
        { errored.fallback && ( // Fallback to placeholder image if both optmizations fail
          <Image
            unoptimized
            src={ placeholderImage }
            alt="Placeholder Image"
            placeholder="blur"
            ref={ fallbackRef }
            onLoad={ () => setLoaded(prevLoaded => ({...prevLoaded, fallback: true })) }
            className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
              'animate-fade-in opacity-100': loaded.fallback
            })}
          />
        )}
      </picture>
    </figure>
  )
}
