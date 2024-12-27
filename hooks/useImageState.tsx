"use client"
import { useRef, useState } from "react";

export const useImageState = () => {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const fallbackRef = useRef<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [fallbackLoaded, setFallbackLoaded] = useState(false)
  const [imageErrored, setImageErrored] = useState(false)
  const [fallbackErrored, setFallbackErrored] = useState(false)

  return {
    imageRef,
    fallbackRef,
    imageLoaded,
    fallbackLoaded,
    imageErrored,
    fallbackErrored,
    setImageLoaded,
    setFallbackLoaded,
    setImageErrored,
    setFallbackErrored,
  }
}