"use client"
import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { useState, AnchorHTMLAttributes, useEffect } from "react"

interface ICustomLink extends LinkProps {
  children: React.ReactNode
  className?: string
}

export function CustomLink({ children, href, ...props }: ICustomLink & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter()
  const [isPrefetching, setIsPrefetching] = useState(false)

  const startPrefetch = () => {
    if (!isPrefetching) {
      setIsPrefetching(true)
      router.prefetch(String(href))
    }
  }

  const handleMouseEnter = () => {
    startPrefetch()
  }

  const handleFocus = () => {
    startPrefetch()
  }

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement> | 
    React.TouchEvent<HTMLAnchorElement> | 
    React.KeyboardEvent<HTMLAnchorElement>
  ) => {
    const url = new URL(String(href), window.location.href)
    if (
      url.origin === window.location.origin &&
      !e.altKey &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      ('button' in e && e.button === 0 || 'key' in e && e.key === 'Enter')
    ) {
      e.preventDefault()
      router.push(String(href))
    }
  }

  return (
    <Link
      href={ href }
      prefetch={ false }
      onMouseEnter={ handleMouseEnter }
      onFocus={ handleFocus }
      onMouseDown={ handleNavigation }
      onKeyDown={ handleNavigation }
      {...props}
    >
      { children }
    </Link>
  )
}

export const HashLinkHandler = () => {
  const [attemptCount, setAttemptCount] = useState(0)

  useEffect(() => {
    if (!window.location.hash || attemptCount >= 5) return
    const hash = window.location.hash.substring(1)
    const element = document.getElementById(hash)

    if (element) {
      element.scrollIntoView({ behavior: 'instant' })
    } else if (attemptCount < 5) {
      const timer = setTimeout(() => {
        setAttemptCount(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
    
  }, [attemptCount])

  return null
}
