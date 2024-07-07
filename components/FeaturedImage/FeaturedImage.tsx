"use client"
import type { Asset } from "contentful"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FeaturedImageProps {
  featuredImage: Asset | undefined
  quality?: number
  className?: string
}

export default function FeaturedImage({ featuredImage, quality, className }: FeaturedImageProps) {
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
          <div className="relative h-16 w-16 border-4 border-solid border-border rounded-full rotate-0 animate-spin" />
        </div>
      )}
      <picture 
        className={cn(
          'flex justify-center items-center w-auto h-auto animate-fade-in',
          className, 
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}>
        <Image 
          src={ `${featuredImageURL}?fm=jpg` }
          alt=""
          width={ 1920 }
          height={ 1080 }
          ref={ imageRef }
          onLoad={ handleImageLoaded }
          quality={ quality }
          className={cn('flex justify-center items-center w-auto h-auto opacity-100 animate-in', className)}
        />
      </picture>
    </figure>
  )
}
