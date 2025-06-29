"use client"
import type { ImageProps } from "@/types/images"
import { useImageState } from "@/hooks/useImageState"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { customImageLoader } from "@/utils/image-loader"

export default function IconImage({ featuredImage, alt = "", quality = 75, className, priority, sizes }: ImageProps) {
  const { 
    imageLoaded, 
    imageErrored,
    fallbackLoaded,
    fallbackErrored,
    setImageLoaded, 
    setImageErrored,
    setFallbackLoaded,
    setFallbackErrored,
  } = useImageState()
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : null

  if (!featuredImageURL) return null

  return (
    <>
      { !imageErrored ?
        <Image 
          src={ featuredImageURL }
          alt={ alt }
          width={ featuredImage?.width }
          height={ featuredImage?.height }
          sizes={ sizes }
          onLoad={ () => setImageLoaded(true) }
          onError={ () => setImageErrored(true) }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
            'animate-fade-in opacity-100': imageLoaded
          })}
          priority={ priority }
        /> : null}
      { imageErrored && !fallbackErrored ? (
        <Image 
          src={ featuredImageURL }
          loader={({ src, width, quality }) => customImageLoader({ src, width, quality })}
          alt={ alt }
          width={ featuredImage?.width }
          height={ featuredImage?.height }
          sizes={ sizes }
          onLoad={ () => setFallbackLoaded(true) }
          onError={ () => setFallbackErrored(true) }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
            'animate-fade-in opacity-100': fallbackLoaded
          })}
          priority={ priority }
          placeholder={ !featuredImage ? "blur" : undefined }
        />
      ) : null}
    </>
  )
}