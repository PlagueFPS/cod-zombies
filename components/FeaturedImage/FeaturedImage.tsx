"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import { cn } from "@/lib/utils"
import ImageLoader from "../Loaders/ImageLoader"

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

export default function FeaturedImage({ featuredImage, alt = "", quality = 75, className, priority, sizes }: FeaturedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : placeholderImage

  useEffect(() => {
    const img = imageRef.current
    if (img) {
      img.onload = () => setImageLoaded(true)
      if (img.complete) setImageLoaded(true)
      return () => {
        img.onload = null
      }
    }
  }, [imageRef])

  return (
    <figure className="relative m-0 w-full h-auto">
      { !imageLoaded && <ImageLoader /> }
      <picture className={cn('flex justify-center items-center w-full h-auto')}>
        <Image 
          src={ featuredImageURL }
          alt={ alt }
          width={ featuredImage.width }
          height={ featuredImage.height }
          sizes={ sizes }
          ref={ imageRef }
          onLoad={ () => setImageLoaded(true) }
          onError={ () => setImageError(true) }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
            'animate-fade-in opacity-100': imageLoaded
          })}
          priority={ priority }
        />
        { imageError && (
          <Image 
            src={ placeholderImage }
            alt="Placeholder Image"
            placeholder="blur"
            onLoad={ () => setImageLoaded(true) }
            className={cn('flex justify-center items-center w-full h-auto opacity-0', className, {
              'animate-fade-in opacity-100': imageLoaded
            })}
          />
        )}
      </picture>
    </figure>
  )
}
