"use client"

import { useIsMobile } from "@/hooks/use-mobile"

interface IDesktopOnly {
  children: React.ReactNode
}

export default function DesktopOnly({ children }: IDesktopOnly) {
  const isMobile = useIsMobile()

  return !isMobile && children
}
