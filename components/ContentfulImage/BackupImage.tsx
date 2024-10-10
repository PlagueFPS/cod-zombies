"use client"
import type { ImageProps } from "@/types/Image"
import { useImageState } from "@/hooks/useImageState"
import ImageLoader from "../Loaders/ImageLoader"
import PlaceholderImage from "@/public/article-img-placeholder.jpg"
import Image from "next/image"
import { contentfulImageLoader } from "@/utils/imageLoader"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface BackupImageProps extends ImageProps {
  acceptHeader: string
}

export default function BackupImage({ featuredImage, acceptHeader, alt = "", quality = 75, className, priority, sizes }: BackupImageProps) {
  const { 
    imageRef, 
    fallbackRef, 
    imageLoaded, 
    fallbackLoaded, 
    imageErrored, 
    setImageLoaded, 
    setFallbackLoaded, 
    setImageErrored
  } = useImageState()
  const [accept, setAccept] = useState(acceptHeader)
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : PlaceholderImage
  const avif = accept.includes('image/avif')
  const webp = accept.includes('image/webp')

  useEffect(() => {
    setAccept(acceptHeader)
  }, [acceptHeader])

  return (
    <>
     { (!imageLoaded && !imageErrored) ? <ImageLoader className="border" /> : null }
     { !fallbackLoaded && (
        <Image 
          loader={({ src, width, quality }) => contentfulImageLoader({ src, width, quality, avif, webp })}
          src={ featuredImageURL }
          width={ featuredImage.width }
          height={ featuredImage.height }
          alt={ alt }
          sizes={ sizes }
          ref={ imageRef }
          onLoad={ () => setImageLoaded(true) }
          onError={ () => setImageErrored(true) }
          quality={ quality }
          priority={ priority }
          className={cn('flex justify-center items-center w-full h-auto aspect-video opacity-0', className, {
            'animate-fade-in opacity-100': imageLoaded
          })}
        />
     )}
     { imageErrored && (
        <Image
          unoptimized
          src={ PlaceholderImage }
          alt="Placeholder Image"
          placeholder="blur"
          ref={ fallbackRef }
          onLoad={ () => setFallbackLoaded(true) }
          className={cn('flex justify-center items-center w-full h-auto aspect-video opacity-0', className, {
            'animate-fade-in opacity-100': fallbackLoaded
          })}
        />
     )}
    </>
  )
}
