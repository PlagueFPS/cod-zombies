"use client"
import dynamic from 'next/dynamic'
import ThemeToggleLoader from '../Loaders/ThemeToggleLoader'

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle/ThemeToggle'), {
  ssr: false,
  loading: () => <ThemeToggleLoader />
})

export default function ThemeToggleWrapper() {
  return <ThemeToggle />
}
