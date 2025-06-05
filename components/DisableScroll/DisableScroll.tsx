"use client"
import { useEffect } from 'react'

export default function DisableScroll() {
  // disable verticle scrolling on a given page
  useEffect(() => {
    document.body.classList.add("no-scroll")
    return () => document.body.classList.remove("no-scroll")
  }, [])

  return null
}
