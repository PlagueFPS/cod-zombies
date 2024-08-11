"use client"
import type { Asset } from "contentful"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import { cn } from "@/lib/utils"

interface FeaturedImageProps {
  featuredImage: Asset<undefined, string> | undefined
  alt?: string
  quality?: number
  className?: string
  priority?: boolean
  sizes?: string
}

export default function FeaturedImage({ featuredImage, alt = "", quality = 75, className, priority, sizes }: FeaturedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const featuredImageURL = featuredImage ? `https:${featuredImage.fields.file?.url}` : placeholderImage

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
      { !imageLoaded && (
        <div className="absolute top-0 bottom-0 right-0 left-0 h-full flex justify-center items-center">
          <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
        </div>
      )}
      <picture className={cn('flex justify-center items-center w-full h-auto')}>
        <Image 
          src={ featuredImageURL }
          alt={ alt }
          width={ featuredImage?.fields.file?.details.image?.width }
          height={ featuredImage?.fields.file?.details.image?.height }
          sizes={ sizes }
          ref={ imageRef }
          onLoad={ () => setImageLoaded(true) }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto opacity-100', className, {
            'animate-fade-in': imageLoaded
          })}
          priority={ priority }
        />
      </picture>
    </figure>
  )
}
