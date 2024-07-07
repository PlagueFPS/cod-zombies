"use client"
import type { Asset } from "contentful"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RichImageProps {
  asset: Asset | undefined
}

export default function RichImage({ asset }: RichImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null!)
  const url = `https:${asset?.fields.file?.url}`

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
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}>
        <Image 
          src={ `${url}?fm=jpg` }
          alt=""
          width={ 1920 }
          height={ 1080 }
          ref={ imageRef }
          onLoad={ handleImageLoaded }
          className={cn('flex justify-center items-center w-auto h-auto opacity-100 animate-in')}
        />
      </picture>
    </figure>
  )
}
