"use client"
import type { ImageProps } from "@/types/Image"
import { useImageState } from "@/hooks/useImageState"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import ImageLoader from "../Loaders/ImageLoader"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FeaturedImageProps extends ImageProps {
  children: React.ReactNode
  description?: string
}

export default function FeaturedImage({ children, featuredImage, description, alt = "", quality = 75, className, priority, sizes }: FeaturedImageProps) {
  const { imageRef, imageLoaded, imageErrored, setImageLoaded, setImageErrored } = useImageState()
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : placeholderImage

  return (
    <figure className="relative m-0 w-full h-auto">
      <picture className='relative flex justify-center items-center w-full h-auto'>
        { (!imageLoaded && !imageErrored) ? <ImageLoader className="border" /> : null }
        { !imageErrored ? 
          <Image 
            src={ featuredImageURL }
            alt={ alt }
            width={ featuredImage.width }
            height={ featuredImage.height }
            sizes={ sizes }
            ref={ imageRef }
            onLoad={ () => setImageLoaded(true) }
            onError={ () => setImageErrored(true) }
            quality={ quality }
            className={cn('flex justify-center items-center w-full h-auto aspect-video opacity-0', className, {
              'animate-fade-in opacity-100': imageLoaded
            })}
            priority={ priority }
          /> : null}
        {/* children here represents a dynamic server component which serves a backup image
            based on the users browsers
        */}
        { imageErrored ? children : null }
      </picture>
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