"use client"
import { cn } from "@/lib/utils"
import type { LinkProps } from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props extends LinkProps {
  href: string
  children: string | React.ReactNode
  className?: string
  ariaLabel?: string
  target?: string
}

export default function NavLink({ href, children, className, ariaLabel, target }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={ href }
      aria-label={ ariaLabel }
      target={ target }
      rel={ target ? "noreferrer" : undefined }
      className={cn(className, { 'text-primary': isActive })}
    >
      { children }
    </Link>
  )
}
