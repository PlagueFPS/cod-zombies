"use client"
import type { LinkProps } from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props extends LinkProps {
  href: string
  children: string | JSX.Element | React.ReactNode
  className?: string
  exact?: boolean
  ariaLabel?: string
  target?: string
}

export default function NavLink({ href, children, className, exact, ariaLabel, target }: Props) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link 
      href={ href }
      aria-label={ ariaLabel }
      target={ target }
      rel={ target ? "noreferrer" : undefined }
      className={ isActive ? `${className} border-b border-secondary` : className }
    >
      { children }
    </Link>
  )
}
