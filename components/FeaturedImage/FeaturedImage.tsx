"use client"
import type { ImageProps } from "@/types/Image"
import { useImageState } from "@/hooks/useImageState"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import ImageLoader from "../Loaders/ImageLoader"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { customImageLoader } from "@/utils/imageLoader"

interface FeaturedImageProps extends ImageProps {
  description?: string
}

export default function FeaturedImage({ featuredImage, description, alt = "", quality = 75, className, priority, sizes }: FeaturedImageProps) {
  const { 
    imageRef, 
    imageLoaded, 
    imageErrored,
    fallbackRef,
    fallbackLoaded,
    fallbackErrored,
    setImageLoaded, 
    setImageErrored,
    setFallbackLoaded,
    setFallbackErrored
  } = useImageState()
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : placeholderImage

  return (
    <figure className="relative m-0 flex flex-col justify-center items-center w-full h-auto">
      { (!imageLoaded && !fallbackLoaded) ? <ImageLoader className="border" /> : null }
      { !imageErrored ? 
        <Image 
          src={ featuredImageURL }
          alt={ alt }
          width={ featuredImage?.width }
          height={ featuredImage?.height }
          sizes={ sizes }
          ref={ imageRef }
          onLoad={ () => setImageLoaded(true) }
          onError={ () => setImageErrored(true) }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto aspect-video opacity-0', className, {
            'animate-fade-in opacity-100': imageLoaded
          })}
          priority={ priority }
          placeholder={ !featuredImage ? "blur" : undefined }
        /> : null}
        {/* If the image optimization fails, we fall back to contentful's image optimization */}
        { imageErrored && !fallbackErrored ? (
          <Image 
            src={ featuredImageURL }
            loader={({ src, width, quality }) => customImageLoader({ src, width, quality })}
            alt={ alt }
            width={ featuredImage?.width }
            height={ featuredImage?.height }
            sizes={ sizes }
            ref={ fallbackRef }
            onLoad={ () => setFallbackLoaded(true) }
            onError={ () => setFallbackErrored(true) }
            quality={ quality }
            className={cn('flex justify-center items-center w-full h-auto aspect-video opacity-0', className, {
              'animate-fade-in opacity-100': fallbackLoaded
            })}
            priority={ priority }
            placeholder={ !featuredImage ? "blur" : undefined }
          />
        ) : null}
        {/* If both image optimization fails, serve static non-optimized fallback */}
        { fallbackErrored ? (
          <Image 
            unoptimized
            src={ placeholderImage }
            alt=""
            placeholder="blur"
            priority={ priority }
            className={cn('flex justify-center items-center w-full h-auto aspect-video', className)}
          />
        ) : null}
      { description ? (
        <figcaption className="flex font-medium justify-center items-center mt-2 mb-4 w-auto italic px-4 xl:px-8">
          <>
          { description }
          </>
        </figcaption>
      ) : null }
    </figure>
  )
}