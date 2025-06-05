"use client"
import dynamic from 'next/dynamic'

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle/ThemeToggle'), {
  ssr: false,
})

export default function ThemeToggleWrapper({ className }: { className?: string }) {
  return <ThemeToggle className={ className } />
}
