"use client"
import type { ImageProps } from "@/types/Image"
import { useImageState } from "@/hooks/useImageState"
import { cn } from "@/lib/utils"
import PlaceholderImage from "@/public/article-img-placeholder.jpg"
import Image from "next/image"

interface IconImageProps extends ImageProps {
  children: React.ReactNode
}

export default function IconImage({ children, featuredImage, alt = "", quality = 75, className, priority, sizes }: IconImageProps) {
  const { imageRef, imageLoaded, imageErrored, setImageLoaded, setImageErrored } = useImageState()
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : PlaceholderImage

  return (
    <>
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
        /> : null }
      {/* children here represents a dynamic server component which serves a backup image
          based on the users browsers
      */}
      { imageErrored ? children : null }
    </>
  )
}
