"use client"
import NotFoundContent from '@/components/NotFound/NotFoundContent'
import { usePathname } from 'next/navigation'

export default function RootNotFound() {
  const pathname = usePathname()

  return (
    <NotFoundContent resource='Page' pathname={ pathname } />
  )
}
