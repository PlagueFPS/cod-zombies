"use client"
import { RefObject, useEffect, useState } from "react";

export const useImageState = (imageRef: RefObject<HTMLImageElement | null>, fallbackRef: RefObject<HTMLImageElement | null>) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [fallbackLoaded, setFallbackLoaded] = useState(false)

  useEffect(() => {
    const img = imageRef.current
    const imgFallback = fallbackRef.current

    if (img) {
      img.onload = () => setImageLoaded(true)
      if (img.complete) setImageLoaded(true)
      return () => {
        img.onload = null
      }
    } else if (imgFallback) {
      imgFallback.onload = () => setFallbackLoaded(true)
      if (imgFallback.complete) setFallbackLoaded(true)
      return () => {
        imgFallback.onload = null
      }
    }
  }, [imageRef, fallbackRef])

  return {
    imageLoaded,
    fallbackLoaded,
    setImageLoaded,
    setFallbackLoaded,
  }
}