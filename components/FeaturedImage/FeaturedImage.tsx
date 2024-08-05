"use client"
import type { Asset } from "contentful"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FeaturedImageProps {
  featuredImage: Asset<undefined, string> | undefined
  quality?: number
  className?: string
  priority?: boolean
}

export default function FeaturedImage({ featuredImage, quality, className, priority }: FeaturedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null!)
  const featuredImageURL = featuredImage ? `https:${featuredImage.fields.file?.url}` : '/article-img-placeholder.jpg'

  const handleImageLoaded = () => {
    setImageLoaded(true)
  }

  useEffect(() => {
    imageRef.current.onload = () => setImageLoaded(true)
    if (imageRef.current.complete) setImageLoaded(true)
  }, [imageRef])

  return (
    <figure className="relative m-0 w-full h-auto">
      { !imageLoaded && (
        <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
          <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
        </div>
      )}
      <picture 
        className={cn(
          'flex justify-center items-center w-full h-auto animate-fade-in',
          className, 
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}>
        <Image 
          src={ `${featuredImageURL}` }
          alt=""
          width={ featuredImage?.fields.file?.details.image?.width ?? 1920 }
          height={ featuredImage?.fields.file?.details.image?.height ?? 1080 }
          ref={ imageRef }
          onLoad={ handleImageLoaded }
          quality={ quality }
          className={cn('flex justify-center items-center w-full h-auto opacity-100 animate-fade-in', className)}
          priority={ priority }
        />
      </picture>
    </figure>
  )
}
