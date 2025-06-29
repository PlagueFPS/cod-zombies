"use client"
import NotFoundContent from '@/components/not-found/not-found-content'
import { usePathname } from 'next/navigation'

export default function RootNotFound() {
  const pathname = usePathname()

  return (
    <NotFoundContent resource='Page' pathname={ pathname } />
  )
}
