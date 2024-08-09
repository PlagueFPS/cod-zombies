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
        <div className="h-[210px] xl:h-[480px] flex justify-center items-center border w-full rounded-lg">
          <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
        </div>
      )}
      <picture 
        className={cn(
          'flex justify-center items-center w-full h-auto animate-fade-in', 
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}>
        <Image 
          src={ url }
          alt={ description ?? '' }
          width={ asset?.fields.file?.details.image?.width ?? 1920 }
          height={ asset?.fields.file?.details.image?.width ?? 1080 }
          sizes="(max-width: 400px) 100vw, (max-width: 768px) 50vw, 33vw"
          ref={ imageRef }
          onLoad={ handleImageLoaded }
          className={cn('flex justify-center items-center w-full h-full rounded-lg opacity-100 animate-fade-in')}
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
