"use client"
import type { Asset } from "contentful"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RichImageProps {
  asset: Asset<undefined, string> | undefined
}

export default function RichImage({ asset }: RichImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null!)
  const url = asset ? `https:${asset?.fields.file?.url}` : '/article-img-placeholder.jpg'
  const description = asset?.fields.description

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
          'flex justify-center items-center w-auto h-auto animate-fade-in', 
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}>
        <Image 
          src={ url }
          alt=""
          width={ asset?.fields.file?.details.image?.width ?? 1920 }
          height={ asset?.fields.file?.details.image?.height ?? 1080 }
          ref={ imageRef }
          onLoad={ handleImageLoaded }
          className={cn('flex justify-center items-center w-auto h-auto rounded-lg opacity-100 animate-fade-in')}
        />
      </picture>
      <figcaption className="flex justify-center items-center mt-2 mb-4 w-auto italic px-4 xl:px-8">
        <>
          { description }
        </>
      </figcaption>
    </figure>
  )
}
