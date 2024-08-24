"use client"
import { cn } from "@/lib/utils"
import type { LinkProps } from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props extends LinkProps {
  href: string
  children: string | React.ReactNode
  className?: string
  exact?: boolean
  ariaLabel?: string
  target?: string
  active?: boolean
}

export default function NavLink({ href, children, className, exact, ariaLabel, target, active }: Props) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link 
      href={ href }
      aria-label={ ariaLabel }
      target={ target }
      rel={ target ? "noreferrer" : undefined }
      className={cn(className, { 'text-primary': isActive ||  active })}
    >
      { children }
    </Link>
  )
}
