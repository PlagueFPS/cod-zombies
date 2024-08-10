"use client"
import type { Asset } from "contentful"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import { cn } from "@/lib/utils"

interface RichImageProps {
  asset: Asset<undefined, string> | undefined
}

export default function RichImage({ asset }: RichImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null!)
  const url = asset ? `https:${asset?.fields.file?.url}` : placeholderImage
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
        <div className="aspect-video h-auto flex justify-center items-center border w-full rounded-lg">
          <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
        </div>
      )}
      <picture 
        className={cn('flex justify-center items-center w-full h-auto animate-fade-in transition-all opacity-100')}>
        <Image 
          src={ url }
          alt={ description ?? '' }
          width={ asset?.fields.file?.details.image?.width }
          height={ asset?.fields.file?.details.image?.width }
          sizes="(max-width: 828px) calc(100vw - 16px), 775.5"
          ref={ imageRef }
          onLoad={ handleImageLoaded }
          className={cn('flex justify-center items-center w-full h-full rounded-lg animate-fade-in')}
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
