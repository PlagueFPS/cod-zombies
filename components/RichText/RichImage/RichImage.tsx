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
  const imageRef = useRef<HTMLImageElement>(null)
  const url = asset ? `https:${asset?.fields.file?.url}` : placeholderImage
  const description = asset?.fields.description

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
      <picture className="relative w-full h-auto">
        { !imageLoaded && (
          <div className="absolute top-0 bottom-0 right-0 left-0 aspect-video h-auto flex justify-center items-center border w-full rounded-lg">
            <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
          </div>
        )}
        <Image 
          src={ url }
          alt={ description ?? '' }
          width={ asset?.fields.file?.details.image?.width }
          height={ asset?.fields.file?.details.image?.width }
          sizes="(max-width: 828px) calc(100vw - 16px), 775.5"
          ref={ imageRef }
          onLoad={ () => setImageLoaded(true) }
          className={cn('flex justify-center items-center w-full h-full aspect-video rounded-lg', {
            'animate-fade-in': imageLoaded
          })}
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
