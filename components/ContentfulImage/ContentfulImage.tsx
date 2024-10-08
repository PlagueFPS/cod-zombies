"use client"
import { useRef, useState } from "react"
import { useImageState } from "@/hooks/useImageState"
import PlaceholderImage from "@/public/article-img-placeholder.jpg"

interface ContentfulImageProps {
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

export default function ContentfulImage({ featuredImage, alt = "", quality = 75, className, priority, sizes }: ContentfulImageProps) {
  const [imageError, setImageError] = useState(false)
  const [fallbackError, setFallbackError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const fallbackRef = useRef<HTMLImageElement>(null)
  const { imageLoaded, fallbackLoaded, setImageLoaded, setFallbackLoaded } = useImageState(imageRef, fallbackRef)
  const featuredImageURL = featuredImage ? `https:${featuredImage.url}` : PlaceholderImage


  return (
    <div>ContentfulImage</div>
  )
}
