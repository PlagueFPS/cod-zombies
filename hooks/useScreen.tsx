"use client"
import { useState, useEffect } from 'react'

export const useScreen = () => {
  const [isDesktop, setDesktop] = useState(false)

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth > 1280) setDesktop(true)
      else setDesktop(false)
    }

    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return { isDesktop }
}
