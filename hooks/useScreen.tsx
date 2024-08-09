"use client"
import { useState, useEffect } from 'react'

export const useScreen = (breakpoint?: number) => {
  const [isDesktop, setDesktop] = useState(false)

  useEffect(() => {
    const handleWindowResize = () => {
      if (breakpoint) {
        if (window.innerWidth > breakpoint) setDesktop(true)
        else setDesktop(false)
      } else {
        if (window.innerWidth > 1280) setDesktop(true)
        else setDesktop(false)
      }
    }

    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return { isDesktop }
}
