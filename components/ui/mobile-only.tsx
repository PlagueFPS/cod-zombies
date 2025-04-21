"use client"
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface IMobileOnly {
  children: React.ReactNode
}

export default function MobileOnly({ children }: IMobileOnly) {
  const isDesktop = useMediaQuery(640)
  return (
    <>
      { !isDesktop && children }
    </>
  )
}
