"use client"
import { useEffect, useState, useRef } from "react";


export const useImageState = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const fallbackRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState({
    image: false,
    fallback: false,
  })
  const [errored, setErrored] = useState({
    image: false,
    fallback: false
  })

  useEffect(() => {
    const img = imageRef.current
    const fallback = fallbackRef.current

    if (img) {
      img.onload = () => setLoaded(prevLoaded => ({...prevLoaded, image: true }))
      if (img.complete) setLoaded(prevLoaded => ({...prevLoaded, image: true }))
      return () => {
        img.onload = null
      }
    }
    else if (fallback) {
      fallback.onload = () => setLoaded(prevLoaded => ({...prevLoaded, fallback: true }))
      if (fallback.complete) setLoaded(prevLoaded => ({...prevLoaded, fallback: true }))
      return () => {
        fallback.onload = null
      }
    }
  }, [imageRef, fallbackRef])

  return {
    imageRef,
    fallbackRef,
    loaded,
    errored,
    setLoaded,
    setErrored
  }
}

// export const useImageState = (imageRef: RefObject<HTMLImageElement | null>, fallbackRef: RefObject<HTMLImageElement | null>) => {
//   const [imageLoaded, setImageLoaded] = useState(false)
//   const [fallbackLoaded, setFallbackLoaded] = useState(false)

//   useEffect(() => {
//     const img = imageRef.current
//     const imgFallback = fallbackRef.current

//     if (img) {
//       img.onload = () => setImageLoaded(true)
//       if (img.complete) setImageLoaded(true)
//       return () => {
//         img.onload = null
//       }
//     } else if (imgFallback) {
//       imgFallback.onload = () => setFallbackLoaded(true)
//       if (imgFallback.complete) setFallbackLoaded(true)
//       return () => {
//         imgFallback.onload = null
//       }
//     }
//   }, [imageRef, fallbackRef])

//   return {
//     imageLoaded,
//     fallbackLoaded,
//     setImageLoaded,
//     setFallbackLoaded,
//   }
// }